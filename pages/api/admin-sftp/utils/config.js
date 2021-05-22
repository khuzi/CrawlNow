import path from "path"
export const configSftp = {
    host: "hamid.hopto.org",
    port: 22,
    username: "crawlnow_ftp",
    password: "Alt@!r10",
    readyTimeout: 5000
}


export const cwd = "/crawlnow_datasets"



export const configSftpLocal = {
    host: "yasmina.emi.ac.ma",
    port: 22,
    username: "melissati",
    password: "melissati ",
    readyTimeout: 5000

}

export const cwdLocal = "/home/ginf2022/melissati"




export const localPathDownloads = path.resolve('./zbuffer', "downloads");
// export const localPathDownloads = "./zbuffer/downloads"
export const localPathUploads = path.resolve('./zbuffer', "uploads");
// export const localPathUploads = "./zbuffer/uploads"



