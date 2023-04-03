const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

const createWindow = (Page) => 
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'src/scripts/main-preload.js')
        }
    })

    win.loadFile(Page)
}

const createTrayAndMenu = () => {
    tray = new Tray('assets/img/audiebant-tray-icon.jpg')
   
    let template = [
        {
            label:'Connection Settings',
            click: function () {
                createWindow("index.html")
            }
        },
        {
            label:'Set Zones',
            click: function () {
                createWindow("src/windows/setzones.html")
            }
        },
        {
            label:'Test Popup'
        },
        {
            label:'About'
        },
        {
            label:'Exit',
            click: function () {
                app.quit()
            }
        }
    ]
    let contextMenu = Menu.buildFromTemplate(template)
    tray.setToolTip('Audiebant Lockdown System')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createTrayAndMenu();
})

app.on('window-all-close', () => {
    if(process.platform !== 'darwin') app.quit()
})

ipcMain.on('close',()=> app.quit())
