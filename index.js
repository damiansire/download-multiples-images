const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url"); // Import the URL module

let { downloadUrlAttribute, fileNameAttribute, inputFolderPath, outputFolderPath, defaultExtension } = JSON.parse(
  fs.readFileSync("config.json")
);

function cleanUrl(url) {
  const regex = /\?.*$/;
  const cleanUrlResult = url.replace(regex, "");
  return cleanUrlResult;
}

function isLocalFileSystemUrl(string) {
  if (string.startsWith("./") || string.startsWith("/")) {
    return true;
  }
  return false;
}

async function downloadFile(downloadUrl, nameToSave) {
  const currentDate = getCurrentDateTime();

  if (!downloadUrl) {
    console.error(`Error: Missing download URL for file ${nameToSave}`);
    return;
  }

  if (!nameToSave) {
    nameToSave = `${currentDate}`;
    console.warn(`Warning: No filename provided, using ${nameToSave}`);
  }

  if (isLocalFileSystemUrl(downloadUrl)) {
    console.log(`Local url detected: ${downloadUrl}, ignored this file`);
    return;
  }

  const basePath = path.join(outputFolderPath, getCurrentDateTime());
  fs.mkdirSync(basePath, { recursive: true }); // Ensure directory exists

  if (!nameToSave.includes(".")) {
    let fileExtension = path.extname(cleanUrl(downloadUrl));
    if (!fileExtension) {
      console.log(`Don't have extension for ${nameToSave} set default extension: ${defaultExtension}`);
      fileExtension = defaultExtension;
    }
    nameToSave = nameToSave + fileExtension;
  }

  const downloadPath = path.join(basePath, nameToSave);

  try {
    const file = fs.createWriteStream(downloadPath); // Write to file, not URL

    const response = await new Promise((resolve, reject) => {
      https.get(downloadUrl, resolve).on("error", reject);
    });

    response.pipe(file);

    await new Promise((resolve, reject) => {
      file.on("finish", resolve);
      file.on("error", reject);
    });

    console.log("Download complete:", downloadPath);
  } catch (err) {
    console.error("Download error for", downloadUrl, "reason:", err.message);

    try {
      fs.unlinkSync(downloadPath); // Cleanup incomplete file
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr.message);
    }
  }
}

function getCurrentDateTime() {
  let f = new Date();
  return `Day-${f.getDate()}-Month-${f.getMonth() + 1}-year-${f.getFullYear()}`;
}

fs.readdir(inputFolderPath, (err, files) => {
  if (err) {
    console.error("Error al leer la carpeta:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      // Filtra solo archivos .json
      const filePath = path.join(inputFolderPath, file);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error al leer el archivo:", err);
          return;
        }

        try {
          const fileData = JSON.parse(data);
          fileData.forEach((element) => {
            const downloadUrl = element[downloadUrlAttribute];
            const nameToSave = element[fileNameAttribute];
            downloadFile(downloadUrl, nameToSave);
          });
        } catch (err) {
          console.error("Error al analizar JSON:", err);
        }
      });
    }
  });
});
