import { database } from "../../../firebase/firebase";

export default async function writeUserData(req, res) {
  if (req.method === "POST") {
    console.log("body = ", req.body);
    const resp = database
      .collection("userFiles")
      .where("email", "==", req.body.email);
    const data = await resp.get();
    const allFiles = [];
    data.forEach((item) => {
      allFiles.push(item.data().filename);
    });

    const isValid = allFiles.includes(req.body.filename);
    if (!isValid) {
      database
        .collection("userFiles")
        .doc("uf2" + new Date().getTime())
        .set(req.body);

      res.status(200).send("succcesfuly sent to :   =>  " + req.body.email);
    } else {
      res.status(400).send("Duplicate file not allowed");
    }
  } else {
    // Handle any other HTTP method

    // console.log(allClients)
    res.status(200).send("done");
  }
}
