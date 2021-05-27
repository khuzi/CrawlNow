import React, { useState, useEffect } from "react";
import Router from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { database } from "../../firebase/firebase";

import { databas, admin } from "../../firebase/firebase";

// depending on the envirnement; we ruturn the right url
export const rightUrl = (extention) => {
  const url = {
    local: "http://localhost:3000/api/admin/",
    remote: `https://admin-beta-1.vercel.app/api/admin/`,
  };

  return process.env.NEXT_PUBLIC_VERCEL_URL
    ? `${url.remote}${extention}`
    : `${url.local}${extention} `;
};

export const handleSuccessful = async (id) => {
  const response = database.collection("userFiles");
  response.doc(id).update({
    isPaid: true,
  });
};

// depending on the envirnement; we ruturn the right url for sftp
export const rightUrlSftp = (extention) => {
  const url = {
    local: "http://localhost:3000/api/admin-sftp/",
    remote: `https://admin-beta-1.vercel.app/api/admin-sftp/`,
  };

  return process.env.NEXT_PUBLIC_VERCEL_URL
    ? `${url.remote}${extention}`
    : `${url.local}${extention} `;
};

export const handleSend = (
  data,
  setMessage,
  setSelectedFile,
  setSelectedUser,
  setRefresh,
  setFile
) => {
  if (
    !data.email ||
    !data.filename ||
    data.fileDetail?.name !== data.filename ||
    !data.fileDetail?.price
  ) {
    toast(
      <h5 style={{ color: "red" }}>
        Enter Price, Select User and Select File
      </h5>,
      {
        autoClose: false,
      }
    );
    setTimeout(() => toast(null), 3000);
    return;
  }

  const filterObj = {
    email: data.email,
    filename: data.filename,
    price: data.fileDetail.price,
    isPaid: false,
  };
  axios
    .post(rightUrl("WriteUserFile"), filterObj)
    .then((res) => {
      toast(<h5 style={{ color: "green" }}>{res.data}</h5>, {
        autoClose: false,
      });
      setTimeout(() => {
        // setMessage(null);
        setRefresh(new Date().getTime());
      }, 1200);
      setSelectedFile(null);
      setSelectedUser(null);
      setFile(null);
      localStorage.setItem("file", data.filename);
    })
    .catch((e) => {
      toast(<h5 style={{ color: "red" }}>Duplicate Failed</h5>, {
        autoClose: false,
      });
    });
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsText(file);
  });

export const handleUpload = async (
  file,
  setMessage,
  setRefresh,
  previewRowCount,
  setFile1
) => {
  if (!process.browser) {
    return;
  }

  // check if the user has selected a file
  if (!file.name) {
    toast(<h5 style={{ color: "red" }}>Select a file and try again !</h5>, {
      autoClose: false,
    });
    setTimeout(() => toast(null), 3000);
    return;
  }

  // check if user has uploaded other file than .cvs
  var ext = await file.name.match(/\.([^\.]+)$/)[1];
  if (ext !== "csv") {
    toast(<h5 style={{ color: "red" }}>only .CSV file allowed !</h5>, {
      autoClose: false,
    });
    setTimeout(() => toast(null), 3000);
    return;
  }
  toast(<h5 style={{ color: "green" }}>Uploading...</h5>, { autoClose: false });

  const formData = new FormData();

  formData.append("csv", file);
  formData.append("previewRowCount", previewRowCount);

  const res = await axios.post(
    "https://sftp-api.herokuapp.com/upload",
    formData
  );
  console.log(res.data);

  const res2 = await axios.post(rightUrl("files/upload/upload"), {
    filename: file.name,
    size: file.size / 1000,
    previewRowCount: previewRowCount,
    uploadTime: new Date(),
    uploader: localStorage.getItem("username"),
  });
  toast(<h5 style={{ color: "green" }}>Successfully Uploaded!!</h5>, {
    autoClose: false,
  });
  setFile1(null);
  setTimeout(() => {
    setRefresh(new Date().getTime());
  }, 1200);
};

// get alll users who have a cerain file

export const handleLoadUsers_File = (filename, setLoadedUsers_File) => {
  axios
    .get(rightUrl(`userFiles/filenames/${filename} `))
    .then((res) => setLoadedUsers_File(res.data))
    .catch((e) => console.error(e));
};

// get all the file that a user has
export const handleLoadFiles = (email, setLoadedFiles) => {
  axios
    .get(rightUrl(`userFiles/${email} `))
    .then((res) => setLoadedFiles(res.data))
    .catch((e) => console.error(e));
};

export const handleDeleteFile = (filename, setMessage, setRefresh) => {
  if (process.browser) {
    toast(<h5 style={{ color: "green" }}>deleting...</h5>, {
      autoClose: false,
    });
    // setMessage("deleting ... ");

    axios
      .post(rightUrlSftp("delete"), { filename: filename })
      .then((res) => {
        console.log(res.data);
        axios
          .post(rightUrlSftp("delete"), { filename: filename + ".preview" })
          .then((res) => {
            console.log(res.data);
          });
      })

      .then((a) => {
        axios
          .get(rightUrl(`files/delete/${filename}`))
          .then((res) => {
            toast(<h5 style={{ color: "green" }}>Successfully Deleted!</h5>, {
              autoClose: false,
            });
            setTimeout(() => {
              // setMessage(null);
              setRefresh(new Date().getTime());
            }, 1200);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.log(e));
  }
};

export const handleDeleteUser = (email, setMessage, setRefresh) => {
  axios
    .get(rightUrl(`users/delete/${email}`))
    .then((res) => {
      toast(<h5 style={{ color: "green" }}>Successfully Deleted!</h5>, {
        autoClose: false,
      });
      setTimeout(() => {
        // setMessage(null);
        setRefresh(new Date().getTime());
      }, 1200);
    })
    .then((e) => console.error(e));
};

// post  req to delete from UserFiles
export const deleteDocFromUserFiles = (data, setMessage, setRefresh) => {
  axios
    .post(rightUrl(`userFiles/delete/deleteRecord`), data)
    .then((res) => {
      toast(<h5 style={{ color: "green" }}>Successfully Deleted!</h5>, {
        autoClose: false,
      });
      setTimeout(() => {
        // setMessage(null);
        setRefresh(new Date().getTime());
      }, 1200);
    })
    .then((e) => console.error(e));
};
