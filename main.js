const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const createWindow = (Page, route) => 
{
    const win = new BrowserWindow({
        width: 800,
        height: 675,
        // closable:false,
        // minimizable:false,
        // maximizable:false,       
        //autoHideMenuBar:"hedden",
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    
    const data = {"route": route}
    win.loadFile(Page, {query: {"data": JSON.stringify(data)}})
    //win.loadFile(Page)
}

const createTrayAndMenu = () => {
    tray = new Tray('assets/img/audiebant-tray-icon.jpg')
   
    let template = [
        {
            label:'Connection Settings',
            click: function () {
                createWindow("index.html", "dbcon")
            }
        },
        {
            label:'Set Zones',
            click: function () {
                createWindow("index.html", "zones")
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
const checkMessage =(Page, route)=> {
    winMessage= new BrowserWindow({
        width: 800,
        height: 520,
        show: false,
        frame: false ,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
      });
    //winMessage.loadFile(Page);
    const data = {"route": route}
    winMessage.loadFile(Page, {query: {"data": JSON.stringify(data)}})
}

app.whenReady().then(() => { 
    createTrayAndMenu(); 
    setInterval(function(){
        checkMessage("index.html", "message")
        //checkMessage( __dirname + '/src/windows/message.html')
    }, 15000);  
})

app.on('window-all-close', () => {
    if(process.platform !== 'darwin') app.quit()
})

ipcMain.on('close',()=> app.quit())
ipcMain.once('ShowMessage',()=> winMessage.show())

