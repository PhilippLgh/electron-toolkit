// In guest page.
const { ipcRenderer } = require('electron')

window.electron = {
    notifyHost: function() {
        setTimeout(() => {
            ipcRenderer.sendToHost('pong')
        }, 4 * 1000)
    }
}