const EventEmitter = require("events");

const fs = require('fs')
const path = require('path')

const { desktopCapturer, screen, ipcRenderer } = require("electron");

class AppCapturer {
    constructor(projectDir) {
        this.recorder;
        this.recordedChunks = [];
        this.numRecordedChunks = 0;
        this.localStream;
        this.project_dir = projectDir;

        this.buildDir = path.join(projectDir, "build");
        this.assetDir = path.join(this.buildDir, "assets");
    }

    generateImageFilename() {
        var timestamp = new Date().getTime();
        var name = "screenshot_" + timestamp + ".png";
        return name;
    }

    generateVideoFilename() {
        var timestamp = new Date().getTime();
        var name = "video_" + timestamp + ".webm";
        return name;
    }

    launch() {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("spawn-wrapper", "now");

            ipcRenderer.removeAllListeners("spawn-complete");
            ipcRenderer.once("spawn-complete", (event, namespace, events) => {
                var child = new EventEmitter()
                events.forEach(ev => {
                    var channel = namespace + ev;
                    ipcRenderer.on(channel, (evt, data) => {
                        child.emit(ev, data);
                    });
                })
                child.send = function(msg) {
                    ipcRenderer.send(namespace + "send", msg)
                }
                child.maximize = function() {
                    child.send("request-maximize")
                }
                resolve(child);
            });
        });
    }

    launchApp() {
        return this.launch().then(child => {
            this.childProcess = child;

            //find child window and extend protocol events with :
            //'ready' => ready to record &
            //'window-detection-failed'
            child.on("title-available", originalWindowTitle => {
                //console.log("received title available", originalWindowTitle);
                var detectionTitle = originalWindowTitle + "~";

                this.getWindowByTitle(detectionTitle)
                    .then(window => {
                        var windowId = window.id;

                        child.windowId = windowId;

                        //tell child to reset window title
                        child.send("detection-complete");

                        //notify app that we found the application window
                        //and are ready to record => will reste the window title
                        child.emit("ready", windowId);
                    })
                    .catch(err => {
                        console.log("error", err);
                        child.emit("window-detection-failed");
                    });
            });

            return child;
        });
    }

    getWindowByTitle(windowTitle, opts) {
        return new Promise((resolve, reject) => {
            let options = Object.assign({ types: ["window"] }, opts);
            desktopCapturer.getSources(options, (error, sources) => {
                if (error) {
                    return reject(error);
                }
                for (let i = 0; i < sources.length; ++i) {
                    //console.log("check: ", sources[i].name, " - ", windowTitle);
                    if (sources[i].name === windowTitle) {
                        return resolve(sources[i]);
                    }
                }
                reject(new Error("window not found"));
            });
        });
    }

    //known issues:
    //no windows aero effects: https://github.com/electron/electron/blob/8359c72347372176e3cb27735caa19d967dae762/atom/browser/api/atom_api_desktop_capturer.cc#L60
    getWindowThumb(windowTitle, thumbSize) {
        thumbSize = thumbSize || this.determineScreenShotSize();
        let options = { types: ["window"], thumbnailSize: thumbSize };
        return this.getWindowByTitle(windowTitle, options)
            .then(window => window.thumbnail);
    }

    determineScreenShotSize() {
        const screenSize = screen.getPrimaryDisplay().workAreaSize;
        const maxDimension = Math.max(screenSize.width, screenSize.height);
        return {
            width: maxDimension * window.devicePixelRatio,
            height: maxDimension * window.devicePixelRatio
        };
    }


    prepareAssetDir() {

        return new Promise((resolve, reject) => {
            this.prepareDirectory(this.buildDir)
                .then(data => {
                    return this.prepareDirectory(this.assetDir)
                })
                .then(data => {
                    resolve(data);
                })
        });

    }

    prepareDirectory(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if (err) {
                    if (err.code == "EEXIST") {
                        return resolve(dir);
                    }
                    reject(err);
                } else {
                    resolve(dir);
                }
            });
        });
    }

    takeScreenshotFromVideo(videoElement) {
        return new Promise((resolve, reject) => {

            /*
            if (!localStream) {
                resolve(null);
            }
            */

            var canvas = document.createElement("canvas");
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext("2d").drawImage(videoElement, 0, 0);
            var thumb = canvas.toDataURL("image/png");

            //TODO ImageUtils.saveDataUri(fullPath, thumb)

            this.prepareAssetDir()
                .then(dir => {
                    var scName = this.generateImageFilename();
                    var fullPath = path.join(dir, scName);

                    var asset = {
                        id: scName,
                        filename: scName,
                        data: thumb,
                        state: "ready",
                        role: scName.startsWith("main") ? "main" : "feature",
                        type: "image",
                        path: fullPath
                    };

                    var base64Data = thumb.replace(/^data:image\/png;base64,/, "");
                    var binaryData = new Buffer(base64Data, "base64").toString("binary");

                    fs.writeFile(fullPath, binaryData, "binary", function(err) {
                        if (err) return console.log(err);
                        //  console.log("screenshot saved");

                        resolve(asset);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    initScreenCapture(windowId) {
        if (this.localStream) {
            this.closeStream();
        }

        return new Promise((resolve, reject) => {
            if (!windowId) {
                return reject(new Error("no window id"));
            }

            navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: windowId,
                            maxWidth: window.screen.width - 10,
                            maxHeight: window.screen.height - 10
                        }
                    }
                },
                stream => {
                    this.localStream = stream;
                    // console.log("stream created", stream.getTracks().length);
                    resolve(URL.createObjectURL(stream));
                },
                err => {
                    //  console.log("The following error occurred: " + err.name);
                    reject(err);
                }
            );
        });
    }

    closeStream() {
        //  console.log("closing stream ..");
        if (!this.localStream) {
            return;
        }
        let tracks = this.localStream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        this.localStream = null;
    }

    startRecording() {

        if (!this.localStream) {
            //throw new Error("no stream available")
            //  console.error("no stream available");
            return;
        }

        try {
            //  console.log("Start recording the stream.");
            this.recorder = new MediaRecorder(this.localStream);
        } catch (e) {
            console.assert(false, "Exception while creating MediaRecorder: " + e);
            return;
        }

        var state = new EventEmitter();

        this.recorder.ondataavailable = event => {
            // console.log("data available fired");
            if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
                this.numRecordedChunks += event.data.byteLength;
            }

            if (this.recordedChunks.length == 0) {
                return;
            }

            let blob = new Blob(this.recordedChunks, {
                type: "video/webm"
            });
            var url = URL.createObjectURL(blob);

            this.prepareAssetDir()
                .then(dir => {

                    var vName = this.generateVideoFilename();
                    var p = path.join(dir, vName);

                    var asset = {
                        id: vName,
                        filename: vName,
                        data: url,
                        role: vName.startsWith("main") ? "main" : "feature",
                        type: "video",
                        path: p
                    };

                    state.emit("new-video", asset);

                    this.saveVideo(vName, p);
                })
                .catch(err => {
                    state.emit("recoder-error", err);
                });
        };

        this.recorder.onstop = () => {
            // console.log("recorderOnStop fired");
        };

        this.recorder.start();

        return state;
    }

    stopRecording() {
        if (!this.recorder || this.recorder.state == "inactive") {
            return;
        }
        this.recorder.stop();
    }

    saveVideo(name, p) {
        var self = this;
        let blob = new Blob(this.recordedChunks, { type: "video/webm" });

        var reader = new FileReader();
        reader.onload = function() {
            var buffer = new Buffer(reader.result);

            fs.writeFile(p, buffer, {}, (err, res) => {
                self.resetVideoRecorder();
                if (err) {
                    console.error(err);
                    return;
                }

            });
        };

        reader.readAsArrayBuffer(blob);
    }

    resetVideoRecorder() {
        //  this.localStream = null;
        this.recordedChunks = [];
        this.numRecordedChunks = 0;
    }
}

module.exports = AppCapturer;