import { database } from "../../../firebase/firebase"





export default async function (req, res) {
    if (req.method === 'POST') {

        // console.log(req.body) //this returns an empty object, why??
        // database.collection("admins").doc("ad" + new Date().getTime()).set(req.body);
        // res.status(200).send("successfully add :   =>  " + req.body.email)
        try {
            let query = database.collection('admins');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        email: doc.data().email,
                        password: doc.data().password
                    };
                    response.push(selectedItem);
                }
            });
            let filteredResponse = response.filter(item => item.email === req.body.email && item.password === req.body.password)
            let returnArray = [];
            filteredResponse.forEach(item => returnArray.push(item.email))

            return res.status(200).send(returnArray.length ? "/dashboard_Admin" : false);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        ;





    } else {
        // Handle any other HTTP method






        // console.log(allClients)
        res.status(200).send("done")
    }


};
