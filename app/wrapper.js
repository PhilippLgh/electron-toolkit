const { app, BrowserWindow } = require('electron')

const fs = require('fs');
const path = require('path');


//ipc channel not working: try fallback
var out;
var inp;
if (typeof process.send !== 'function') {

    out = fs.createWriteStream(null, { fd: 1 })
    inp = fs.createReadStream(null, { fd: 0 })

    process.send = function(data) {
        out.write(JSON.stringify(data) + "#");
    };

    inp.on("data", data => {
        try {
            var message = data.toString();
            var m = JSON.parse(message);
            process.emit("message", m);
        } catch (error) {
            console.log("error", error);
        }
    });

}


//notify parent that child process is ready
console.log("~~~")
process.send({
    type: 'ready'
})


app.on('browser-window-created', (event, win) => {


    let title = win.getTitle();
    console.log("window-created: " + title)

    process.on('message', message => {
        //console.log("message", message)
        if (message.type === 'detection-complete') {
            //reset title
            win.setTitle(title);
        }

        if (message.type === 'request-maximize') {
            if (win.isMinimized()) {
                win.restore()
            }
        }

    });

    var timer = setTimeout(() => {
        process.send({
            'type': 'title-available',
            'data': win.getTitle()
        })
        win.setTitle(title + "~");
    }, 2000);

    win.webContents.on('page-title-updated', () => {

        clearTimeout(timer);

        title = win.getTitle();

        process.send({
            'type': 'title-available',
            'data': win.getTitle()
        })

        win.setTitle(title + '~');

    })



    //the parent app is interested in the following window events:
    var eventTypes = ["closed", "blur", "focus", "show", "hide", "maximize", "unmaximize", "minimize", "resize"]

    eventTypes.forEach(ev => {
        win.on(ev, () => {
            process.send({
                'type': "" + ev,
                'data': null
            })
        })
    })

    win.on('closed', () => {
        console.log("window closed");
        if (process.disconnect) {
            process.disconnect();
        }
        //if fallback is used make sure streams on fds are closed
        if (out) {
            //fs.closeSync(0);
            //fs.closeSync(1);
            out.close();
            // inp.close();
            out.destroy();
            // inp.destroy();
        }
        app.quit();
        win = null
    })

})


const PROJECT_DIR = process.argv[2];
const pjPath = path.join(PROJECT_DIR, "package.json");
const pjson = require(pjPath);
const mainPath = pjson.main || "index.js";
const mainPathAbs = path.join(PROJECT_DIR, mainPath);
require(mainPathAbs);