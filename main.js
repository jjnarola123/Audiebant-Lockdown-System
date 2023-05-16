const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');
let win = null
var force_quit = false;
const createWindow = (Page, route) => {
    win = new BrowserWindow({
        width: 800,
        height: 675,
        show: false,
        frame: false,   
        maximizable:false,
        icon: __dirname + '/assets/img/cp-tray-icon.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    win.on('close', function (e) {
        if (!force_quit) {
            e.preventDefault();
            win.hide();
        }
    });

    const data = { "route": route }
    win.loadFile(Page, { query: { "data": JSON.stringify(data) } })
}

const createTrayAndMenu = () => {
   // tray = new Tray(__dirname + '/assets/img/icon-mac-tray.png')
    tray = new Tray(__dirname + '/assets/img/cp-tray-icon.png')

    let template = [
        {
            label: 'Connection Settings',
            click: function () {
                win.show();
            }
        },
        {
            label: 'Set Zones',
            click: function () {
                winZones.reload();
                winZones.show();
            }
        },
        {
            label: 'Exit',
            click: function () {
                force_quit = true; app.quit()
            }
        },       
        { type: 'separator' },
        {
            label: 'Uninstall',
            click: function () {
                winUninstall.reload();
                winUninstall.show();
            }
        }      
    ]
    let contextMenu = Menu.buildFromTemplate(template)
    tray.setToolTip('Communicate and Protect')
    tray.setContextMenu(contextMenu)
}

let winZones = null
const createZonesWindow = (Page, route) => {
    winZones = new BrowserWindow({
        width: 800,
        height: 675,
        show: false,
        frame: false,        
        maximizable:false,
        icon: __dirname + '/assets/img/cp-tray-icon.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    winZones.on('close', function (e) {
        if (!force_quit) {
            e.preventDefault();
            winZones.hide();
        }
    });

    const data = { "route": route }
    winZones.loadFile(Page, { query: { "data": JSON.stringify(data) } })
}

let winMessage = null
const createMessage = (Page, route) => {
        winMessage = new BrowserWindow({
            width: 800,
            height: 600,
            maximizable:false,
            frame:false,
            icon: __dirname + '/assets/img/cp-tray-icon.png',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false
            }
        });  
        const data = { "route": route }
        winMessage.loadFile(Page, { query: { "data": JSON.stringify(data) } })
       
}

let winUninstall=null
const createUninsatllerWindow = (Page, route) => {
    winUninstall = new BrowserWindow({
        width: 800,
        height: 675,       
        show: false,
        frame: false,   
        maximizable:false,
        icon: __dirname + '/assets/img/cp-tray-icon.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    winUninstall.on('close', function (e) {
        if (!force_quit) {
            e.preventDefault();
            winUninstall.hide();
        }
    });

    const data = { "route": route }
    winUninstall.loadFile(Page, { query: { "data": JSON.stringify(data) } })
}

app.whenReady().then(() => {   
    createTrayAndMenu();
    createWindow("index.html", "dbcon");
    createZonesWindow("index.html", "zones");
    createUninsatllerWindow("index.html", "uninstall");
    checkMessage();
})

app.on('window-all-close', () => {
    if (process.platform !== 'darwin') app.quit()
})

var messageObj;
var site_key;
function checkMessage() {
    setInterval(function () {
        if(site_key != '')
        {
            axios.get('https://www.communicateandprotect.com/api/api.php?',{
                params: {
                    request:'message',
                    sitekey: site_key,
                    msgtype:'General'
                }      
            })
            .then(function (response) {
                if (response.data.status == "Success" && response.data.data[0][0].msg_scheduled==1) {
                    messageObj =  JSON.stringify(response.data.data[0]);
                    //if (!winMessage) {                 
                    createMessage("index.html", "message");
                    // }
                    // else{
                    //     winMessage.show(); 
                    // }
                }
            });
        }
    }, 15000);
}
winZones
ipcMain.on('RequestMessage', (event) => {
    event.sender.send('MessageObject', messageObj)
})

ipcMain.on('GetSiteKey', (event,args) => {
    site_key = args;
})

ipcMain.on('CloseWin', () => win.close())
ipcMain.on('CloseZoneWin', () => winZones.close())
ipcMain.on('CloseWindow', () => winUninstall.close())

ipcMain.on('getPath', (event) => {
    const getPath=app.getPath('exe');
    const appPath = path.dirname(getPath);   
    event.sender.send('sendPath', appPath)
})
ipcMain.on('CloseWindowUni', () => {
    force_quit = true;
     app.quit()

})

