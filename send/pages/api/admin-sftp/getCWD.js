import { configSftp } from './utils/config';

const Client = require('ssh2-sftp-client');
const sftp = new Client();

let content = [];

export default async (req, res) => {
    sftp.connect({
        host: "hamid.hopto.org",
        port: 22,
        username: "crawlnow_ftp",
        password: "Alt@!r10",
        readyTimeout: 5000
    })
        .then(async () => {



            // get actuall dir , then list its files 
            let cwd = await sftp.cwd()

            content = await sftp.list(`${cwd}`);
            await sftp.end()
            res.status(200).send({
                cwd,
                content

            })

        })

        .catch(e => console.error({ e }))





}