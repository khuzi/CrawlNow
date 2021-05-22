import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import Head from "next/head";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Styles from "../styles/dashboardAdmin.module.css";
import GetAppIcon from "@material-ui/icons/GetApp";
import StorageIcon from "@material-ui/icons/Storage";
import { useFetchUser } from "../utils/user";
import { ResponsiveDrawer, Spinner, CustomizedTables } from "../components";
import { useStyles, getModalStyle } from "../utils/dashboardAdmin/utils";
import {
  deleteDocFromUserFiles,
  rightUrl,
  rightUrlSftp,
} from "../utils/methods/functions";
import TablePop from "../components/dashboard/TablePopup/TablePop";
import { Tooltip } from "@material-ui/core";

export default function Dashboard() {
  const { user, loading } = useFetchUser();
  const router = useRouter();

  // custom hooks to handle  files
  const [files, setFiles] = useState([
    { title: "...", url: "...", size: "..." },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [anotherRef, setAnotherRef] = useState(1);

  // material-ui hook
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [url, setUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/project1-73848.appspot.com/o/files%2Fusername.csv?alt=media&token=c48af239-5d69-460e-ba51-3682ed8f5166"
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.removeItem("paidFile");
    setFiles([]);
    if (!user) setAnotherRef(anotherRef + 1);
    else {
      axios
        .get(rightUrl(`userFiles/filesAndDetails/${user.name}`))
        .then((res) => {
          console.log(res.data);
          setFiles([...new Set(res.data)]);
        });
    }
  }, [refresh, anotherRef]);

  if (loading) {
    useEffect(() => {
      console.log(":: loading just for hooks equality seek hh");
    }, []);
    return <Spinner />;
  }

  if (!user) {
    useEffect(() => {
      console.log("::noUser just for hooks equality seek hh");
    }, []);
    Router.push("/");
    return null;
  }

  if (user) {
    useEffect(() => {
      console.log(":user just for the seek of hooks equality");
    }, [refresh]);

    // palced here so we don't have unbalance rerendering hook count
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>

        {open && <TablePop setOpen={setOpen} url={url} />}

        <ResponsiveDrawer user={user}>
          <div style={{ paddingBlock: "20px" }}>
            <p
              style={{
                backgroundColor: "#7545FF",
                color: "white",
                padding: "7px",
                display: "flex",
                alignItems: "center ",
                fontSize: "22px",
                borderRadius: "8px",
              }}
            >
              <StorageIcon style={{ marginRight: "15" }} />
              Your Datasets Ready for Download
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px ",
                color: "gray",
                marginBottom: "16px",
                borderBottom: "0.8px #7F00FD solid",
              }}
            >
              <p
                style={{
                  color: "black",
                  fontSize: "15x",
                  fontWeight: "bold",
                  width: "150px",
                }}
              >
                Dataset
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15x",
                  fontWeight: "bold",
                  width: "120px",
                  textAlign: "center",
                }}
              >
                Amount
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                Size (KB)
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  width: "200px",
                  textAlign: "center",
                }}
              >
                Upload Time{" "}
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  width: "180px",
                  textAlign: "center",
                }}
              >
                Actions
              </p>
            </div>
            {files.map((file) => (
              <div
                key={file.uploadTime}
                style={{
                  display: "flex",
                  alignItems: "left",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  borderBottom: "0.5px #F3F4F6 solid",
                  paddingLeft: "0.5rem",
                }}
              >
                <Tooltip
                  title={<span className="tooltip_txt">{file.title}</span>}
                  arrow
                >
                  <p
                    style={{ fontSize: "15px", color: "black", width: "150px" }}
                  >
                    {file.title.length > 20
                      ? file.title.slice(0, 20) + "..."
                      : file.title}
                  </p>
                </Tooltip>
                <p
                  style={{
                    fontSize: "15px",
                    color: "black",
                    width: "120px",
                    textAlign: "center",
                    color: file.isPaid ? "green" : "red",
                  }}
                >
                  {file.isPaid ? "Paid " + file.price : "Unpaid " + file.price}
                </p>
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      color: "black",
                    }}
                  >
                    {parseInt(file.size).toLocaleString()}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    color: "black",
                    width: "200px",
                    textAlign: "center",
                  }}
                >
                  {new Date(file.uploadTime).toLocaleString()}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "180px",
                  }}
                >
                  <Button
                    className={Styles.previewIcon}
                    onClick={() => {
                      setUrl(
                        `https://sftp-api.herokuapp.com/download/${file.title}.preview`
                      ),
                        setOpen(true);
                    }}
                  >
                    Preview
                  </Button>
                  <div
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    {file.isPaid ? (
                      <Button className={Styles.downloadIcon}>
                        <a
                          href={`https://sftp-api.herokuapp.com/download/${file.title}`}
                        >
                          Download
                        </a>
                      </Button>
                    ) : (
                      <Button
                        style={{
                          background: "var( --secondary-color)",
                          borderRadius: "5px",
                          textTransform: "capitalize",
                          width: "20px",
                          color: "#fff",
                        }}
                        onClick={() =>
                          router.push(
                            `/${file.title}-${user.name}-${file.price}`
                          )
                        }
                      >
                        Pay
                      </Button>
                    )}
                  </div>
                </div>
                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title">Are You sure to delete :</h2>
                    <p
                      id="simple-modal-description"
                      style={{ padding: "20px" }}
                    >
                      {modalTitle}?
                    </p>

                    <div>
                      <Button
                        varient="outlined"
                        style={{ color: "red" }}
                        onClick={() => {
                          setOpenModal(false);
                          deleteDocFromUserFiles(
                            { filename: modalTitle, email: user.name },
                            setMessage,
                            setRefresh
                          );
                        }}
                      >
                        Yes{" "}
                      </Button>
                      <Button
                        varient="contained"
                        color="secondary"
                        onClick={() => setOpenModal(false)}
                      >
                        No{" "}
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            ))}
          </div>
        </ResponsiveDrawer>
      </>
    );
  }
}
