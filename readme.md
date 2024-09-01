# File Downloader

This Node.js project allows you to download files from URLs specified within JSON files.

It organizes downloads into date-based folders and intelligently handles filenames, extensions, and potential errors.

## Usage

Create the input folder and place your JSON files inside.

The JSON files should contain an array of objects.

This array of objects will be iterated over, and for each object, the 'url' attribute will be examined, and the file will be downloaded using the corresponding name.

In config.json, you can configure which attribute of the object will be used to obtain the URL and which attribute of the object will be used to get the filename.

## Execution:

Run the Node.js script:

```Bash
node index.js
```

## Configuration

In config.json:

downloadUrlAttribute: The name of the attribute in the JSON that contains the download URL.

fileNameAttribute: The name of the attribute in the JSON that contains the desired filename.

inputFolderPath: The path to the folder containing the input JSON files.

outputFolderPath: The path to the folder where downloaded files will be saved.

defaultExtension: The default file extension to use if it cannot be determined from the URL.

## Notes

The script will process all .json files within the input folder.

Downloads will be organized into subfolders within outputFolderPath.

If a JSON file contains local URLs (starting with "./" or "/"), these will be ignored.

If an error occurs during the download, the script will attempt to clean up the incomplete file.
