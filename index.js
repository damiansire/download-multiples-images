const https = require('https');
const fs = require("fs");
const path = require('path');

let globalConfig = JSON.parse(fs.readFileSync("config.json"));
let filesLinksObj = JSON.parse(fs.readFileSync("filesToDownload.json"));

function downloadFile(urlToDownload, fileName) {
    let basePath = path.join(globalConfig.relativePathToDownload, getCurrentDateTime());
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }
    let downloadPath = path.join(basePath, fileName);
    let file = fs.createWriteStream(downloadPath);

    https.get(urlToDownload, function (response) {
        response.pipe(file);
        file.on("finish", function () {
            file.close();
            console.log("DONE LOADING");
        })
    }).on("error", function (err) {
        console.log("ERROR " + err.message);
        fs.unlink(downloadPath);
    });
}

function getCurrentDateTime() {
    let f = new Date();
    return `Day-${f.getDate()}-Month-${(f.getMonth() + 1)}-year-${f.getFullYear()}`
}

filesLinksObj.forEach(fileObj => {
    downloadFile(fileObj.fileUrl, fileObj.fileName);
});

