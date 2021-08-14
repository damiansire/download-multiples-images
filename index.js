var https = require('https');
const fs = require("fs");

let GlobalConfig = JSON.parse(fs.readFileSync("./config.json"));
let filesLinksObj = JSON.parse(fs.readFileSync("./filesToDownload.json"));

function downloadFile(urlToDownload, fileName) {
    let basePath = `${GlobalConfig.relativePathToDownload}/${getCurrentDateTime()}`;
    createRelativeDirectoryRecursive(basePath);
    var downloadPath = `${basePath}/ ${fileName}`;
    var file = fs.createWriteStream(downloadPath);

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

function directoryDontExistSoCreate(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function getCurrentDateTime() {
    let f = new Date();
    return `Day-${f.getDate()}-Month-${(f.getMonth() + 1)}-year-${f.getFullYear()}`
}

function createRelativeDirectoryRecursive(path) {
    let pathArr = path.split("/") //[".","pepe","algo"]
    let initialDir = "."
    for (let index = 1; index < pathArr.length; index++) {
        initialDir += `/${pathArr[index]}`;
        directoryDontExistSoCreate(initialDir);
    }
}

filesLinksObj.forEach(fileObj => {
    downloadFile(fileObj.fileUrl, fileObj.fileName);
});


