const { app, BrowserWindow } = require('electron')
const { webContents } = require("electron");
const path = require('path')
const url = require('url')

//this can help if media stream is not working: window is black
//app.disableHardwareAcceleration();

const AppBridge = require("./AppBridge.js");
const bridge = new AppBridge();

const is = require('./is.js')

var port = is.dev ? (process.argv && process.argv.length > 2 ? process.argv[2].split('=')[1] : '3334') : '';
console.log("starting toolkit in ", (is.dev ? 'dev mode' : 'production mode'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

let willQuitApp = false;

function createWindow() {

    var package = require("../package.json");

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Electron Toolkit v" + package.version,
        webPreferences: {
            //nodeIntegration: false, // => webview won't work
            preload: path.join(__dirname, 'preload.js'),
        }

    })

    win.setMenu(null);

    if (is.dev) {
        win.loadURL("http://127.0.0.1:" + port + "/renderer/");
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, "..", "renderer", "index.html"),
            protocol: "file:",
            slashes: true
        }));
    }

    //ignore other title changes
    win.on("page-title-updated", function(ev) {
        ev.preventDefault();
    });

    //https://electron.atom.io/docs/api/browser-window/#event-close
    win.on('close', (e) => {
        //do not close:
        if (process.platform === 'darwin') {
            if (willQuitApp) {
                win = null
            } else {
                win.hide();
                e.preventDefault();
            }
        } else {
            win = null
        }
    })

    var webContents = win.webContents;

    if (is.dev) {
        webContents.openDevTools()
    }

    var handleRedirect = (e, url) => {
        //console.log("before navigate: ", url, webContents.getURL())
        if (url != webContents.getURL()) {
            e.preventDefault();
            require("electron").shell.openExternal(url);
        }
    };

    webContents.on("will-navigate", handleRedirect);
    webContents.on("new-window", handleRedirect);

    //Emitted when a new webContents is created.
    app.on('web-contents-created', (event, contents) => {

        contents.on('will-attach-webview', (event, webPreferences, params) => {
            // Strip away preload scripts if unused or verify their location is legitimate
            delete webPreferences.preload
            delete webPreferences.preloadURL

            // Disable node integration
            webPreferences.nodeIntegration = false

            // Verify URL being loaded
            if (!params.src.startsWith('https://launchfox.co/')) {
                event.preventDefault()
            }
        })

    })

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        //win = null
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (process.platform === "darwin") {
        if (win) {
            win.show();
        }
        if (win === null) {
            createWindow();
        }
    } else {
        createWindow();
    }
})

app.on("before-quit", () => (willQuitApp = true));