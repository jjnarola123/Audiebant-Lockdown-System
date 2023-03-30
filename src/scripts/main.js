const { BrowserWindow, app } = require('electron');
const path = require('path');
//const Tray = electron.Tray
//const iconPath = path.join(__dirname,'C&P-Final-03.jpg')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile("src/views/index.html")
}

app.whenReady().then(() => {
    createWindow();
    //new Try(iconPath)
})

app.on('window-all-close', () => {
    if(process.platform !== 'darwin') app.quit()
})