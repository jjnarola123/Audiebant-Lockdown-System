const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const createWindow = (Page) => 
{
    const win = new BrowserWindow({
        width: 800,
        height: 675,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
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
                createWindow("zoneindex.html")
            }
        },
        {
            label:'Exit',
            click: function () {
                app.quit()
            }
        }
    ]
    let contextMenu = Menu.buildFromTemplate(template)
    tray.setToolTip('Audiebant Lockdown Solution')
    tray.setContextMenu(contextMenu)
}

let winMessage = null
const checkMessage =(Page)=> {
    winMessage= new BrowserWindow({
        show: false,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
      });
    winMessage.loadFile(Page);
}

app.whenReady().then(() => { 
    createTrayAndMenu(); 
    setInterval(function(){
        checkMessage( __dirname + '/src/windows/message.html')
    }, 15000);  
})

app.on('window-all-close', () => {
    if(process.platform !== 'darwin') app.quit()
})

ipcMain.on('close',()=> app.quit())
ipcMain.on('ShowMessage',()=> winMessage.show())

