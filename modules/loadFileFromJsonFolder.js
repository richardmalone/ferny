const fs = require("fs");
const ppath = require('persist-path')('Ferny');

function loadFileFromJsonFolder(subfolder, fileName) {
    return new Promise((resolve, reject) => {
        checkDirExists(ppath).then(() => {
            checkDirExists(ppath + "/json").then(() => {
                checkDirExists(ppath + "/json/" + subfolder).then(() => {
                    checkFileExists(ppath + "/json/" + subfolder + "/" + fileName + ".json").then(() => {
                        fs.readFile(ppath + "/json/" + subfolder + "/" + fileName + ".json", (err, data) => {
                            if(!err) {
                                resolve(data);
                            }
                        });
                    });
                });
            });
        });
    });
}

function checkDirExists(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, (exists) => {
            if(exists) {
                resolve();
            } else {
                fs.mkdir(path, (err) => {
                    if(err) {
                        throw err;
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

function checkFileExists(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, (exists) => {
            if(exists) {
                resolve();
            }
        });
    });
}

module.exports = loadFileFromJsonFolder;