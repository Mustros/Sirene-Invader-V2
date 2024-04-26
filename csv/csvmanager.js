const fs = require('fs');

const fileUtils = require('../utils/fileutils');

const CSV_FILES = [];

function splitCSV(csvFile) {
    const splitSizeInMB = 50;
    const chunkSize = 1024 * 1024 * splitSizeInMB;
    const chunkBuffer = Buffer.alloc(chunkSize);

    let bytesRead = 0;
    let offset = 0;
    let csvId = 0;

    const fp = fs.openSync(csvFile, 'r');

    while (bytesRead = fs.readSync(fp, chunkBuffer, 0, chunkSize, offset)) {

        let streamEnd = fileUtils.findLastCharacter("\n", chunkBuffer, bytesRead);
        let streamStart = 0; // Will be used to skip header

        if (streamEnd < 0) {
            throw "The buffer is too small or the file isn't an CSV.";
        } else {
            offset += streamEnd + 1;
        }

        // Remove csv file header
        if(csvId == 0) {
            streamStart = fileUtils.findFirstCharacter("\n", chunkBuffer, bytesRead);
            chunkBuffer.slice(0, streamStart++);
        }

        let csvFile = `./splitted/CSV-${csvId++}.csv`;
        fs.writeFileSync(csvFile, chunkBuffer.slice(streamStart, streamEnd));
        CSV_FILES.push(csvFile);
    }

    console.log("Finished splitting CSV into " + csvId + " files.");
}

function popCSV() {
    return CSV_FILES.pop();
}

function getCSVCount() {
    return CSV_FILES.length;
}

module.exports = {
    splitCSV,
    popCSV,
    getCSVCount
};