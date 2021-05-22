import React, { useState, useEffect } from "react";
import Styles from "../styles/dashboardAdmin.module.css";
import Link from "next/link";
import Head from "next/head";
import { ResponsiveDrawer, UploadFile } from "../components";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import GetAppIcon from "@material-ui/icons/GetApp";
import StorageIcon from "@material-ui/icons/Storage";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Select from "@material-ui/core/Select";
import { Tooltip } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStyles, getModalStyle } from "../utils/dashboardAdmin/utils";
import {
  handleDeleteUser,
  handleDeleteFile,
  handleLoadFiles,
  handleLoadUsers_File,
  handleSend,
  rightUrl,
} from "../utils/methods/functions";

export default function Dashboard_Admin() {
  var user = { name: "Admin Hamid" };
  if (process.browser && localStorage.getItem("username"))
    user = { name: localStorage.getItem("username") };

  const [dataset, setDataset] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [messageTop, setMessageTop] = useState(" ");
  const [refresh, setRefresh] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTitleUser, setModalTitleUser] = useState("");
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [loadedUsers_File, setLoadedUsers_File] = useState([]);
  const [file, setFile] = useState(null);

  // material-ui hook
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    localStorage.removeItem("paidFile");
    // get all clients
    fetch(rightUrl("users"))
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((e) => console.error(e));

    // get all datasets

    fetch(rightUrl("getDataset"))
      .then((res) => res.json())
      .then((data) => {
        setDataset(data);
      })
      .catch((e) => console.error(e));
  }, [refresh]);

  // if the user is not authenticated , redirect
  if (process.browser && !localStorage.getItem("username"))
    return (
      <div style={{ margin: "50px" }}>
        Not allowed ! <br />
        <Link href="/login_admin">
          <a style={{ color: "blue", cursor: "pointer" }}>
            click here to go to log in page
          </a>
        </Link>
      </div>
    );

  const onSaveFilePrice = (e, name) => {
    const file = {
      name: name,
      price: e.target.value,
    };
    if (file.price.length > 0) {
      setFile(file);
    } else {
      setFile(null);
    }
  };

  return (
    <p>
      <Head>
        <title> Admin Dashboard</title>
      </Head>
      <ResponsiveDrawer user={user}>
        <ToastContainer
          position="top-center"
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div>{messageTop}</div>
        <div
          style={{
            display: "flex",
            margin: "8px",
            alignItems: "center ",
            justifyContent: "center",
          }}
        >
          <UploadFile dataSet={dataset} setRefresh={setRefresh} />
          <Button
            variant="outlined"
            color="default"
            startIcon={<SendIcon />}
            onClick={() =>
              handleSend(
                {
                  email: selectedUser,
                  filename: selectedFile,
                  fileDetail: file,
                  user: selectedUser,
                },
                setMessage,
                setSelectedFile,
                setSelectedUser,
                setRefresh,
                setFile
              )
            }
          >
            send
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            style={{ marginLeft: "70px" }}
            onClick={() => setRefresh(refresh + 1)}
          >
            Refresh
          </Button>
          <p style={{ color: "gray", margin: "10px" }}>
            {message} {message2}
          </p>
        </div>

        <div style={{ padding: "20px" }}>
          <p
            style={{
              backgroundColor: "#7545FF",
              color: "white",
              padding: "7px",
              margin: "10px",
              display: "flex",
              alignItems: "center ",
              fontSize: "22px",
              borderRadius: "8px",
              // fontFamily: "Space Grotesk",
            }}
          >
            <StorageIcon />
            <span style={{ marginLeft: "1rem" }}>List of Datasets</span>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center ",
              justifyContent: "space-between",
              padding: "10px ",
              color: "gray",
              marginBottom: "16px",
              borderBottom: "0.8px #7F00FD solid",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center ",
                justifyContent: "space-between",
                width: "70%",
              }}
            >
              <p
                style={{
                  width: "20%",
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  // fontFamily: "Space Grotesk",
                }}
              >
                Datasets
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginRight: "1rem",
                }}
              >
                Owners
              </p>
              <p
                style={{
                  width: "80px",
                  wordBreak: "break-word",
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Size KB
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginRight: "1.5rem",
                }}
              >
                Upload Time
              </p>
              <p
                style={{
                  marginRight: "-15px",
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  // fontFamily: "Space Grotesk",
                }}
              >
                Uploader
              </p>
            </div>
            <div style={{ paddingLeft: "2rem" }}>
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                Amount
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center ",
                justifyContent: "space-between",
                width: "10%",
              }}
            >
              <p
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Operations
              </p>
            </div>
          </div>
          {dataset.map((ds) => (
            <div
              style={{
                display: "flex",
                alignItems: "center ",
                justifyContent: "space-between",
                marginBottom: "8px",
                borderBottom: "0.5px #F3F4F6 solid",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center ",
                  justifyContent: "space-between",
                  width: "70%",
                }}
              >
                <Tooltip title={ds.filename} arrow style={{ fontSize: "20px" }}>
                  <p
                    style={{
                      padding: "10px",
                      fontSize: "15px",
                      color: "#374151",
                      width: "20%",
                    }}
                  >
                    {ds.filename.length > 30
                      ? ds.filename.slice(0, 20) + "..."
                      : ds.filename}
                  </p>
                </Tooltip>
                <div
                  style={{
                    width: "60px",
                  }}
                >
                  <Select
                    value=""
                    style={{
                      fontSize: "0px",
                      width: "20px",
                      color: "lightgray",
                      marginLeft: "2.2rem",
                    }}
                    onMouseDown={() => {
                      setLoadedUsers_File(["..."]);
                      handleLoadUsers_File(ds.filename, setLoadedUsers_File);
                    }}
                    component="label"
                  >
                    {loadedUsers_File.map((loadedFile) => (
                      <p style={{ padding: "5px", margin: "5px" }}>
                        {loadedFile}
                      </p>
                    ))}
                  </Select>
                </div>
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      textAlign: "center",
                      textJustify: "inter-word",
                    }}
                  >
                    {ds.size}
                  </p>
                </div>

                <p
                  style={{
                    width: "150px",
                    wordBreak: "break-word",
                    fontSize: "15px",
                    textAlign: "center",
                  }}
                >
                  {new Date(ds.uploadTime).toLocaleString("en-GB")}
                </p>

                <div style={{ width: "40px" }}>
                  <p style={{ fontSize: "15px" }}>{ds.uploader}</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  placeholder="Enter Amount"
                  style={{
                    outline: "none",
                    width: "120px",
                    padding: "0.4rem",
                    borderRadius: "5px",
                    border: "1px solid #bbb",
                    marginLeft: "1rem",
                  }}
                  type="number"
                  onChange={(e) => onSaveFilePrice(e, ds.id)}
                  value={file?.name === ds.id && file?.price}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center ",
                  justifyContent: "center",
                  width: "10%",
                }}
              >
                <a
                  href={`https://sftp-api.herokuapp.com/download/${ds.filename}`}
                  style={{ marginTop: "10px" }}
                >
                  <GetAppIcon style={{ color: "var(--secondary-color)" }} />
                </a>

                <DeleteOutlineIcon
                  className={Styles.deleteIcon}
                  onClick={() => {
                    setModalTitle(ds.filename);
                    setOpenModal(true);
                  }}
                />

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
                          handleDeleteFile(modalTitle, setMessage, setRefresh);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        varient="contained"
                        color="secondary"
                        onClick={() => setOpenModal(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </Modal>

                <input
                  type="radio"
                  value={ds.filename}
                  checked={selectedFile === ds.filename}
                  onChange={(evt) => {
                    setSelectedFile(evt.target.value);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px" }}>
          <p
            style={{
              backgroundColor: "#7545FF",
              color: "white",
              padding: "7px",
              margin: "10px",
              display: "flex",
              alignItems: "center ",
              fontSize: "22px",
              borderRadius: "8px",
            }}
          >
            <PeopleAltIcon />
            <span style={{ marginLeft: "1rem" }}>List of all Clients</span>
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center ",
              justifyContent: "space-between",
              padding: "10px ",
              color: "gray",
              marginBottom: "16px",
              borderBottom: "0.8px #7F00FD solid",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center ",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <p
                style={{
                  marginRight: "30px",
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  // fontFamily: "Space Grotesk",
                }}
              >
                Emails
              </p>
              <p
                style={{
                  marginRight: "-50px",
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "bold",
                  // fontFamily: "Space Grotesk",
                }}
              >
                List of Datasets
              </p>
            </div>

            <p
              id="hamid"
              style={{
                marginRight: "-50px",
                color: "black",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Delete
            </p>
            <p
              style={{
                color: "black",
                fontSize: "15px",
                fontWeight: "bold",
                // fontFamily: "Space Grotesk",
              }}
            >
              User choosen
            </p>
          </div>

          {clients.map((client) => (
            <div
              key={client.email}
              style={{
                display: "flex",
                alignItems: "center ",
                justifyContent: "space-between",
                marginBottom: "8px",
                borderBottom: "0.5px #F3F4F6 solid",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center ",
                  justifyContent: "space-between",
                  width: "40%",
                }}
              >
                <p
                  style={{
                    padding: "10px ",
                    marginRight: "30px",
                    fontSize: "15px",
                    color: "#374151",
                  }}
                >
                  {client.email}
                </p>
                <div onClick={() => console.log("hh")}>
                  <Select
                    value=""
                    id={`slct${client.email} `}
                    style={{
                      fontSize: "0px",
                      width: "25px",
                      color: "lightgray",
                    }}
                    onMouseDown={() => {
                      setLoadedFiles(["...."]);
                      handleLoadFiles(client.email, setLoadedFiles);
                    }}
                  >
                    {loadedFiles.map((loadedFile) => (
                      <p style={{ padding: "5px", margin: "5px" }}>
                        {loadedFile}
                      </p>
                    ))}
                  </Select>
                </div>
              </div>
              <DeleteOutlineIcon
                className={Styles.deleteIcon}
                onClick={() => {
                  setModalTitleUser(client.email);
                  setOpenModalUser(true);
                }}
              />

              <Modal
                open={openModalUser}
                onClose={() => setOpenModalUser(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div style={modalStyle} className={classes.paper}>
                  <h2 id="simple-modal-title">Are You sure to delete :</h2>
                  <p id="simple-modal-description" style={{ padding: "20px" }}>
                    {modalTitleUser}?
                  </p>
                  <div>
                    <Button
                      varient="outlined"
                      style={{ color: "red" }}
                      onClick={() => {
                        setOpenModalUser(false);
                        handleDeleteUser(
                          modalTitleUser,
                          setMessage,
                          setRefresh
                        );
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      varient="contained"
                      color="secondary"
                      onClick={() => setOpenModalUser(false)}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </Modal>
              <div style={{ marginRight: "2.5rem" }}>
                <input
                  type="radio"
                  value={client.email}
                  checked={selectedUser === client.email}
                  onChange={(evt) => {
                    setSelectedUser(evt.target.value);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ResponsiveDrawer>
    </p>
  );
}
