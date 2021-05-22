
import { configSftp, cwd, localPathUploads } from './utils/config';
import { IncomingForm } from "formidable"


import fs from "fs"
let Client = require('ssh2-sftp-client');
let sftp = new Client();


export const config = {
  api: {
    bodyParser: false
  }
}


export default async (req, res) => {


  if (req.method === 'POST') {
    // Process a POST request

    let uploadedfile;


    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      uploadedfile = files.csv
      console.log(files.csv)
    })


    // sftp.connect(configSftp)
    //   .then(() => {

    //     sftp.put(data, remote)
    //       .then(() => {

    //         console.log("uplaoded sucess")

    //         sftp.end()
    //           .then(() => {

    //             // finish processing 
    //             res.status(200).send("sucess");

    //             // empty the directory
    //             const fsExtra = require('fs-extra')
    //             fsExtra.emptyDirSync(`${localPathUploads}`)


    //           }
    //           ).catch(e => console.error({ erorEnd: e }))


    //       }
    //       ).catch(e => console.error({ erorPut: e }))





    //   })
    //   .catch(e => console.error({ e }))

  } else {
    // Handle any other HTTP method
    res.status(404).send("bad request")
  }
}



// var fileArray = await fetch(remoteURl).then(res => res.arrayBuffer())
