import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import AttachmentIcon from "@material-ui/icons/Attachment";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { toast } from 'react-toastify';

import { handleUpload, rightUrl } from "../../utils/methods/functions";

export function UploadFile({ dataSet, setRefresh }) {
  const [file1, setFile1] = useState("");
  const [previewRowCount, setPreviewRowCount] = useState(100);
  const [message2, setMessage2] = useState(null);

  const onUploadFile = async () => {
    let isfnSame = false;
    if (file1) {
      dataSet.forEach((ds) => {
        if (ds.filename === file1.name) {
          isfnSame = true;
        }
      });
    } else {
      toast(<h5 style={{color: 'red'}}>Upload Failed</h5>,{autoClose: false,
      });
      setTimeout(() => setMessage2(null), 3000);
    }

    if (!isfnSame) {
      handleUpload(file1, setMessage2, setRefresh, previewRowCount, setFile1);
    } else {
      toast(<h5 style={{color: 'red'}}>Duplicate Failed</h5>,{autoClose: false,
      });
    }
  };

  return (
    <>
      {/* <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <p
          style={{
            margin: "0 1rem",
            fontSize: "12px",
            fontWeight: "800",
            color:
              message2 === "Upload Failed"
                ? "red"
                : message2?.includes("Successfully")
                ? "green"
                : "gray",
          }}
        >
          {message2}
        </p>
      </div> */}

      <div style={{ marginTop: "0.7rem" }}>
        <Button
          variant="outlined"
          color="default"
          id="file1"
          component="label"
          startIcon={<AttachmentIcon />}
          style={{ marginRight: 20 }}
        >
          <input
            type="file"
            id="file1"
            accept=".csv"
            hidden
            onChange={(evt) => {
              setFile1(evt.target.files[0]);
              evt.target.value = "";
              evt.target.files = null;
            }}
          />

          {file1 ? file1.name : `select a file`}
        </Button>

        <TextField
          required
          id="standard-required"
          label="Preview line count"
          type="number"
          value={previewRowCount}
          onChange={(e) => setPreviewRowCount(e.target.value)}
        />

        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
          style={{ marginLeft: "20px" }}
          onClick={onUploadFile}
        >
          upload
        </Button>
      </div>

      <div style={{ width: "120px" }}>
        <p
          style={{
            margin: "0 1rem",
            fontSize: "12px",
            fontWeight: "800",
            color:
              message2 === "Upload Failed" || message2 === "Duplicate File"
                ? "red"
                : message2?.includes("Successfully")
                ? "green"
                : "gray",
          }}
        >
          {message2}
        </p>
      </div>
    </>
  );
}
