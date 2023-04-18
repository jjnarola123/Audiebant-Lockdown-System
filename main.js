const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let win = null
var force_quit = false;
const createWindow = (Page, route) => {
    win = new BrowserWindow({
        width: 800,
        height: 675,
        show: false,
        // closable:false,
        minimizable: false,
        maximizable: false,
        icon: __dirname + '/assets/img/cp-tray-icon.jpg',
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
    tray = new Tray(__dirname + '/assets/img/cp-tray-icon.jpg')

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
        // closable:false,
        minimizable: false,
        maximizable: false,
        icon: __dirname + '/assets/img/cp-tray-icon.jpg',
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
            minimizable: false,
            maximizable: false,
            icon: __dirname + '/assets/img/cp-tray-icon.jpg',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false
            }
        });

        const data = { "route": route }
        winMessage.loadFile(Page, { query: { "data": JSON.stringify(data) } })
}

app.whenReady().then(() => {
    createTrayAndMenu();
    createWindow("index.html", "dbcon");
    createZonesWindow("index.html", "zones");
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
                if (response.data.status == "Success") {
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

ipcMain.on('RequestMessage', (event) => {
    event.sender.send('MessageObject', messageObj)
})

ipcMain.on('GetSiteKey', (event,args) => {
    site_key = args;
})

ipcMain.on('CloseWin', () => win.close())
