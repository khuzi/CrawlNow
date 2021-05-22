import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { readRemoteFile } from "react-papaparse";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import LinearProgress from "@material-ui/core/LinearProgress";

function getData(data1) {
  var id = -1;

  const data = data1
    .filter((item) => item != "")
    .map((item) => {
      id = id + 1;
      return {
        id,
        ...item,
      };
    });
  data.splice(0, 1); // Remove header row

  return data;
}

function getColumns(data) {
  const columns = [];
  columns.push({ field: "id", headerName: `#`, width: 60 });
  const sample = data[0];

  Object.keys(sample).forEach((key) => {
    if (true) {
      columns.push({
        renderCell: (params) => (
          <Tooltip
            title={<span className="tooltip_txt">{params.value}</span>}
            arrow
          >
            <span>{params.value}</span>
          </Tooltip>
        ),
        field: key,
        headerName: (
          <>
            <h4 style={{ fontWeight: "bolder" }}>
              {sample[key].toUpperCase()}
            </h4>
          </>
        ),
        width: 200,
      });
    }
  });

  return columns;
}

const handleLoad = async (url, setRows, setColumns) => {
  readRemoteFile(url, {
    complete: async (results) => {
      setRows(await getData(results.data));
      setColumns(getColumns(await results.data));
    },
  });
};

export default function TablePop(props) {
  const [url, setUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/project1-73848.appspot.com/o/files%2Fusername.csv?alt=media&token=c48af239-5d69-460e-ba51-3682ed8f5166"
  );
  const [rows1, setRows] = useState([]);
  const [columns1, setColumns] = useState([]);

  const [progress, setProgress] = React.useState(0);

  useEffect(async () => {
    setUrl(props.url);
    await handleLoad(url, setRows, setColumns);

    console.log(await rows1);
    console.log(await columns1);

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [url]);

  return (
    <div style={{ height: 400, width: "100%", zIndex: "99999" }}>
      <div
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "10",
          opacity: "90%",
          backgroundColor: "black",
        }}
      >
        {" "}
      </div>

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "60%",
          color: "lightgray",
          cursor: "pointer",
          zIndex: "9999999",
        }}
        onClick={() => props.setOpen(false)}
      >
        <Tooltip title={<span className="tooltip_txt">Close</span>}>
          <CloseIcon />
        </Tooltip>
      </div>
      <div
        style={{
          position: "absolute",
          top: "16%",
          bottom: "14%",
          left: "20%",
          right: "2%",
          zIndex: "30",
          backgroundColor: "white",
        }}
      >
        {columns1.length > 0 ? (
          <DataGrid
            onCellHover={(params) => console.log(params)}
            rows={rows1}
            columns={columns1}
            rowsPerPageOptions={[50, 100, 250]}
            pageSize={50}
            pagination="true"
          />
        ) : (
          <div style={{ paddingTop: "20% ", paddingInline: "40px" }}>
            <span style={{ marginBottom: "20px" }}>Loading Data ... </span>
            <LinearProgress variant="determinate" value={progress} />
          </div>
        )}
      </div>
    </div>
  );
}

// const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'firstName', headerName: 'First name', width: 130 },
//     { field: 'lastName', headerName: 'Last name', width: 130 },

// ];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];
