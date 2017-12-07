const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");

const { ipcMain } = require("electron");

const is = require("./is.js");
var devConfig = {};
try { devConfig = require('../dev.config.js') } catch (error) {}
const PROJECT_DIR = is.dev ? devConfig.PROJECT_DIR : path.join(__dirname, '..', '..', '..');

class AppBridge {
    constructor() {

        ipcMain.on("spawn-builder", (event, arg) => {

            this.tryLaunch("node", "builder.js", true)
                /*
                    .then(child => {
                        return this.setupIpc(child);
                    })
                */
                .then(child => {
                    console.log("builder is ready");

                    var namespace = "builder_";

                    //TODO recieve this list from child
                    var eventTypes = ["done", "error", "debug"];

                    const debugCallback = data => {
                        event.sender.send(namespace + "debug", data.toString());
                    };
                    child.stdout.on("data", debugCallback)

                    const sendCallback = (event, message) => {
                        console.log("send to builder: ", message);
                        child.send(message);
                    };
                    ipcMain.on(namespace + "send", sendCallback);

                    const unsubscribeAndKill = () => {
                        child.stdin.pause();
                        child.stdout.pause();
                        child.stdout.removeListener("data", debugCallback);
                        ipcMain.removeListener(namespace + "send", sendCallback);
                        child.removeAllListeners();
                        child.kill("SIGKILL");
                    }

                    eventTypes.forEach(ev => {
                        child.on("message", message => {
                            console.log("forward message", message);
                            event.sender.send(namespace + message.type, message.data);

                            if (ev == "done") {
                                unsubscribeAndKill();
                            }
                        })

                        //ipc syntax
                        /*
                        child.on(ev, data => {
                            console.log("forward builder event", ev);
                            event.sender.send(namespace + ev, data);
                        });
                        */
                    });

                    event.sender.send("spawn-builder-complete", namespace, eventTypes);

                })
                .catch(err => {
                    console.log("error in builder", err);
                });


        });

        ipcMain.on("spawn-wrapper", (event, arg) => {

            /**
             * launch child process,
             * then create convenience emitter interface (legacy)
             * subscribe on emitter, representing child process
             * forwrad event through ipc in their own namespace
             * listen on backchannel
             */
            this.launchWrapper().then(child => {

                //TODO recieve this list from child
                var eventTypes = ["title-available", "closed", "blur", "focus", "show", "hide", "maximize", "unmaximize", "minimize", "resize"];
                var namespace = "c1_";

                eventTypes.forEach(ev => {
                    child.on(ev, (data) => {
                        //forward to renderer
                        //console.log("forward child event to renderer", ev, data)
                        event.sender.send((namespace + ev), data);
                    })
                })

                ipcMain.on(namespace + "send", (event, data) => {
                    child.send(data)
                })

                event.sender.send("spawn-complete", namespace, eventTypes);
            });
        });

    }
    tryLaunch(appPath, scriptPath, isDetached) {
        var self = this;
        return new Promise((resolve, reject) => {

            var child = spawn(appPath, [path.join(__dirname, scriptPath), PROJECT_DIR], {
                    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
                    //stdio: ["pipe", "pipe", "pipe", "pipe"],
                    //stdio: ["pipe", "pipe", "pipe"],
                    // if you pass some value, even an empty object,
                    // the electron process will always exit immediately on linux, works fine in OSX
                    // env: {}
                    // env: { 'DISPLAY': process.env.DISPLAY }
                    cwd: self.projectDir,
                    detached: false
                })
                .on("error", error => {
                    reject(error);
                });

            child.unref()


            var init = function(data) {
                try {
                    var message = data.toString().trim();
                    if (message === "~~~") {
                        setTimeout(() => { child.stdout.removeListener("data", init); }, 500);
                        resolve(child);
                    }
                    if (message === "!~~~") {
                        reject(new Error("ipc could not be established"))
                    }
                } catch (error) {
                    console.error("error: ", error);
                }
            };

            child.stdout.on("data", init);

            /*
            child.stdout.on("data", (data) => {
                console.log("debug child: ", data.toString())
            });
            */


        });
    }

    launchWrapper() {
        //https://github.com/electron/electron/issues/6656#issuecomment-236465350
        /*
        Also on macOS there two types of process, if you run the script in the main process, 
        a new instance of your app will be started, if you run it in the renderer process, 
        the script will be run in background. It is unclear which way would be expected.
        let paths = [
            `${process.execPath}`,
            "electron", 
            require.resolve(
                "electron", {
                    paths: [this.projectDir]
                }
            )];
        */
        let appPath = process.execPath;

        return this.tryLaunch(appPath, "wrapper.js")
            .then(child => {
                return this.setupIpc(child);
                //return this.setupIpcFallback(child);
            })
            .catch(error => {
                console.error("app could not be started", error);
                return;
            });
    }

    setupIpc(child) {
        var emitter = new EventEmitter();

        child
            .on("message", message => {
                emitter.emit(message.type, message.data);
            })
            .on("disconnect", () => {
                //child.kill();
            });


        child.stdout.on("data", function(data) {
            console.log("child console: ", data.toString())
        })


        emitter.send = (type, data) => {
            //console.log("send to child", type, data);
            child.send({
                type: type,
                data: data
            });
        };

        //provide convenience function to maximize user app
        emitter.maximize = () => {
            emitter.send("request-maximize");
        };

        return emitter;
    }

    // some configurations (os, webpack, node, electron) seem to have
    //issues with IPC and opening additional file descriptors
    //the problem occured on mac when child process was created in renderer
    //now, that this functionality is moved to the main process, ipc seems to be working fine and thi smethod is not needed
    //this method simulates regular ipc using stdout and stdin
    //we use emitter as facade to pass it to the renderer without leaking child
    //processes
    setupIpcFallback(child) {
        var emitter = new EventEmitter();

        /*for debugging:
        child.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        */

        //parse incoming message and emit as "regular" events
        child.stdout.on("data", function(data) {
            var message;
            try {
                message = data.toString("utf-8").trim();

                //if child process sends event faster than we read we get
                // "{"type":"blur","data":null}{"type":"focus","data":null}"
                //which is not valid JSON so we transofmr it to
                //{"type":"blur","data":null}#{"type":"focus","data":null}
                //and handle them separately.
                //{"type":"blur","data":null}# becomes ["{"type":"blur","data":null}", ""]
                //we ignore empty strings
                var messages = message.split("#");

                messages.forEach(msg => {
                    if (!msg) { return; }

                    //console.log("received message", msg)
                    var msg = JSON.parse(msg);

                    if (msg.type) {
                        var mtype = msg.type.trim();
                        //console.log("emit: ", mtype, msg.data);
                        emitter.emit(mtype, msg.data);
                    } else {
                        throw new Error("malformed message", m);
                    }
                });

            } catch (error) {
                //console.log("error", error, message);
            }
        })

        //provide backchannel
        emitter.send = (type, data) => {
            //console.log("send to child", type, data);
            child.stdin.write(JSON.stringify({
                type: type,
                data: data
            }));
        };

        //provide convenience function to maximize user app
        emitter.maximize = () => {
            emitter.send("request-maximize");
        };

        return emitter;
    }
}

module.exports = AppBridge;