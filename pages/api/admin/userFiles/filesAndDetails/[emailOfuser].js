// this api will go to the database , dataset  document ,then return    all files belongin to a user

import { database } from "../../../../../firebase/firebase";

export default async (req, res) => {
  const {
    query: { emailOfuser },
  } = req;

  try {
    let queryUFDataset = database.collection("userFiles");

    let response = [];
    await queryUFDataset.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
        if (doc.data().email === emailOfuser) {
          const selectedItem = {
            id: doc.id,
            email: doc.data().email,
            filename: doc.data().filename,
            price: doc.data().price,
            isPaid: doc.data().isPaid,
          };
          response.push(selectedItem);
        }
      }
    });

    // let allFilenames = [];
    // response.forEach((item) => allFilenames.push(item.filename));

    // till now we have the array containg the filenaes belong to a user, let s search for their info in dataset
    let queryDtDataset = database.collection("datasets");
    let ResponseNew = [];
    await queryDtDataset.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      docs.forEach((doc) => {
        const focused = response.find(
          (res1) => res1.filename === doc.data().filename
        );
        if (focused) {
          const selectedItem = {
            id: focused.id,
            title: doc.data().filename,
            size: doc.data().size,
            uploadTime: doc.data().uploadTime,
            price: focused.price,
            isPaid: focused.isPaid,
          };
          ResponseNew.push(selectedItem);
        }
      });
    });

    // let returnArray = ResponseNew.filter((item) =>
    //   allFilenames.includes(item.title)
    // );

    // let arr = [];
    // returnArray.forEach((elt) => {
    //   if (!arr.includes(returnArray.find((itm) => itm.title == elt.title)))
    //     arr.push(elt);
    // });

    return res.status(200).send(ResponseNew);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
