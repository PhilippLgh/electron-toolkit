const EventEmitter = require("events");

const fs = require('fs')
const path = require('path')

const os = require('os')

const uuidv4 = require('uuid/v4');

const { dialog } = require("electron").remote;
const { shell, ipcRenderer } = require("electron");

const ImageUtils = require("./ImageUtils");
const IconGenerator = require("./IconGenerator.js");
const AppCapturer = require("./AppCapturer.js");

const is = require("./is.js");
window.is = is;
window._ = require('lodash');

var devConfig = {};
try { devConfig = require('../dev.config.js') } catch (error) {}

const PROJECT_DIR = is.dev ? devConfig.PROJECT_DIR : path.join(__dirname, '..', '..', '..');
console.log("project dir", PROJECT_DIR)

const isImage = (file) => {
    var ext = path.extname(file).toLowerCase();
    return ['.png', '.svg', '.jpg', '.jpeg'].includes(ext);
}

const isVideo = (file) => {
    var ext = path.extname(file).toLowerCase();
    return ['.mp4', '.webm'].includes(ext);
}

let _packageJson;


function base64ToBuf(b64string) {
    var buf;
    if (typeof Buffer.from === "function") {
        buf = Buffer.from(b64string, "base64");
    } else {
        buf = new Buffer(b64string, "base64");
    }
    return buf;
}

//security measure
/*
window.eval = global.eval = function() {
    throw new Error(
        "Sorry, N1 does not support window.eval() for security reasons."
    );
};
*/

window.Toolkit = {

    Config: {
        PROJECT_DIR: PROJECT_DIR,
        LAUNCHFOX_HOST: is.dev ? devConfig.LAUNCHFOX_HOST : "launchfox.co"
    },

    IconGenerator: new IconGenerator(PROJECT_DIR),

    AppCapturer: new AppCapturer(PROJECT_DIR),


    saveZipAs: function(b64string, fileName) {
        return new Promise((resolve, reject) => {
            dialog.showSaveDialog({
                    title: "Save website",
                    defaultPath: path.join(PROJECT_DIR, fileName),
                    filters: [{ name: "application/zip", extensions: ["zip"] }]
                },
                filepath => {
                    if (filepath === undefined) {
                        return reject(new Error("invalid path"));
                    }
                    var buf = base64ToBuf(b64string);
                    fs.writeFile(filepath, buf, err => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(filepath);
                    });
                }
            );
        });
    },

    getSystemInfo: function() {
        return {
            'electron': process.versions.electron,
            'platform': os.platform(),
            'arch': os.arch()
        }
    },

    getProjectID: function() {
        var configPath = path.join(__dirname, "..", "config.json");
        if (fs.existsSync(configPath)) {
            var data = fs.readFileSync(configPath, 'utf8');
            if (data) {
                var id = JSON.parse(data).id;
                if (id) {
                    return id;
                }
            }
        }
        var id = uuidv4();
        var content = {
            "id": id
        }
        fs.writeFile(configPath, JSON.stringify(content), 'utf8', function(err) {});
        return id;
    },

    //safe function that checks file relative to project dir
    //should be preferred over absolute paths
    //TODO make sure that relative path p is not leaving dir: ../../..
    base64: function(p) {
        var _p = path.join(PROJECT_DIR, p);
        return ImageUtils.loadAsDataUri(_p)
    },
    base64Asset: function(p) {
        var _p = path.join(__dirname, '..', 'assets', p);
        return ImageUtils.loadAsDataUri(_p)
    },
    base64_abs: function(p) {
        var type = path
            .extname(p)
            .toLowerCase()
            .substring(1);
        var data = "";
        switch (type) {
            case "svg":
                data = "data:image/svg+xml;base64,";
                break;
            default:
                data = "data:image/" + type + ";base64,";
                break;
        }
        //var type = 'data:image/svg+xml;base64,'
        // console.log(type);
        //'data:image/png;base64,'
        var content = fs.readFileSync(p);
        return data + content.toString("base64");
    },

    readPackageJson: function() {
        console.log("read from ", PROJECT_DIR);

        return new Promise((resolve, reject) => {
            var pjPath = path.join(PROJECT_DIR, "package.json");
            fs.readFile(pjPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                var packageJson = JSON.parse(data);
                _packageJson = packageJson;
                resolve(packageJson);
            });
        });
    },
    writePackageJson: function(data) {
        console.log("write to ", PROJECT_DIR);
        return new Promise((resolve, reject) => {
            var pjPath = path.join(PROJECT_DIR, "package.json");
            fs.writeFile(pjPath, data, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    },

    /*
    loadWebsiteData: function() {
        return new Promise((resolve, reject) => {
            this.WebsiteManager.loadWebsiteData().then(data => {
                resolve(data);
            });
        });
    },
    */

    generateBuildFile: function(data) {
        return new Promise((resolve, reject) => {
            var fullPath = path.join(PROJECT_DIR, "electron-builder.json");
            var json = JSON.stringify(data);
            fs.writeFile(fullPath, json, function(err, data) {
                if (err) { return reject(err); }
                resolve();
            });
        });
    },

    generateArtifacts: function(model) {

        return new Promise((resolve, reject) => {

            var emitter = new EventEmitter();

            //console.log("generate installer called")
            ipcRenderer.send("spawn-builder", "now");

            ipcRenderer.removeAllListeners("spawn-builder-complete");
            ipcRenderer.once("spawn-builder-complete", function(event, namespace, eventTypes) {

                emitter.emit('status', 'process started')

                ipcRenderer.send(namespace + "send", {
                    type: 'build',
                    data: model
                });

                eventTypes.forEach(ev => {
                    var nev = namespace + ev;
                    ipcRenderer.on(nev, (event, data) => {
                        //console.log("received builder event", nev, data)
                        emitter.emit(ev, data)
                    })
                });

            })

            resolve(emitter)

        });


    },

    loadLogos: function() {
        return new Promise((resolve, reject) => {
            var logosPath = path.join(PROJECT_DIR, "build", "png");
            fs.readdir(logosPath, (err, files) => {
                if (err) {
                    return resolve([]);
                    //return reject(err);
                }

                var logos = files.map(file => {
                    var fullPath = path.join(logosPath, file);

                    //FIXME
                    var content = fs.readFileSync(fullPath);

                    return {
                        id: file,
                        filename: file,
                        data: "data:image/png;base64," + content.toString("base64"), //TODO use ImageUtils
                        type: "image",
                        path: fullPath,
                        size: content.length
                    };
                });

                logos.sort((a, b) => {
                    return a.size - b.size;
                });
                resolve(logos);
            });
        });
    },
    loadAssets: function() {
        return new Promise((resolve, reject) => {
            var screenshotPath = path.join(PROJECT_DIR, "build", "assets");

            fs.readdir(screenshotPath, (err, files) => {
                if (err) {
                    // /console.log("error");
                    return resolve([]);
                    // return reject(err);
                }

                var screens = files.map(file => {
                    var fullPath = path.join(screenshotPath, file);
                    //FIXME
                    var content = fs.readFileSync(fullPath);

                    //console.log(content);
                    var blob = new Blob([new Uint8Array(content)]);
                    var fileURL = URL.createObjectURL(blob);

                    if (isImage(file)) {
                        return {
                            id: file,
                            filename: file,
                            data: "data:image/png;base64," + content.toString("base64"), //TODO use ImageUtils
                            state: "ready",
                            role: file.startsWith("main") ? "main" : "feature",
                            type: "image",
                            path: fullPath
                        };
                    } else if (isVideo(file)) {
                        return {
                            id: file,
                            filename: file,
                            data: fileURL,
                            state: "ready",
                            role: file.startsWith("main") ? "main" : "feature",
                            type: "video",
                            path: fullPath
                        };
                    } else {
                        return null;
                    }
                });

                screens = screens.filter(function(screen) {
                    return typeof screen != undefined && screen != null;
                });

                resolve(screens);
            });
        });
    },

    openLink: function(link) {
        shell.openExternal(link);
    },

    openInExplorer: function(filePath) {
        shell.showItemInFolder(filePath);
    },

    deleteAsset: function(filePath) {
        console.log(filePath);
        fs.unlink(filePath, function(err) {
            if (err) {
                console.log("delete did not work", filePath);
            } else {
                console.log("file deleted");
            }
        });
    }
};