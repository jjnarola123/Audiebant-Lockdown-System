const { BrowserWindow, app, Tray, Menu, ipcMain,powerMonitor} = require('electron');
const axios = require('axios');
const path = require('path');
const os = require('os') 
const AutoLaunch = require('auto-launch');
let win = null
var force_quit = false;
const createWindow = (Page, route) => {
    win = new BrowserWindow({
        width: 800,
        height: 675,
        show: false,
        frame: false,   
        maximizable:false,
        icon: __dirname + '/assets/img/icon-win.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            devTools:false,
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
    //tray = new Tray(__dirname + '/assets/img/icon-mac-tray.png')
    tray = new Tray(__dirname + '/assets/img/cp-tray-icon.png')

    let template = [
        {
            label: 'Connection Settings',
            click: function () {
                win.reload();
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
        { type: 'separator' },
        {
            label: 'Disconnect',
            click: function () {
                winUninstall.reload();
                winUninstall.show();
            }
        }      
    ]
    let contextMenu = Menu.buildFromTemplate(template)
    tray.setToolTip('Audiebant Lockdown Solution')
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
        icon: __dirname + '/assets/img/icon-win.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            devTools:false,
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

let winLockdownMessage = null
const createMessage = (Page, route) => {
    winLockdownMessage = new BrowserWindow({
            width: 800,
            height: 610,
            maximizable:false,
            frame:false,
            alwaysOnTop: true,
            icon: __dirname + '/assets/img/icon-win.png',
            webPreferences: {
                nodeIntegration: true,
                devTools:false,
                enableRemoteModule: true,
                contextIsolation: false
            }
        });  

        winLockdownMessage.on('close', function (e) {         
            winLockdownMessage.webContents.close();   
            winLockdownMessage=null;         
        });
        const data = { "route": route }
        winLockdownMessage.loadFile(Page, { query: { "data": JSON.stringify(data) } })  
             
}

let winUninstall=null
const createUninsatllerWindow = (Page, route) => {
    winUninstall = new BrowserWindow({
        width: 800,
        height: 600,  
        show: false,
        frame: false, 
        maximizable:false,
        icon: __dirname + '/assets/img/icon-win.png',
        //autoHideMenuBar:"hedden",
        webPreferences: {
            nodeIntegration: true,
            devTools:false,
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
    if(process.platform.startsWith('win') || process.platform=='darwin'){
        const myAppAutoLauncher = new AutoLaunch({
            name: 'Audiebant Lockdown Solution',
            path: app.getPath('exe'),
        });
        
        myAppAutoLauncher.isEnabled().then((isEnabled) => {
            if (!isEnabled) {
                myAppAutoLauncher.enable();
            }
        });
    }else{
        const myAppAutoLauncher = new AutoLaunch({
            name:'Audiebant Lockdown Solution',
            path: process.execPath,
        });
        
        myAppAutoLauncher.isEnabled().then((isEnabled) => {
            if (!isEnabled) {
                myAppAutoLauncher.enable();
            }
        });
    }
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
var messageObjLockdown;
var site_key;
var sitename;
function checkMessage() {
    setInterval(function () {
      if(site_key != ''){
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: "sitekey",
                    sitekey: site_key
                }
            })          
            .then(function (response) {
                if(response){
                    if(response.data.status == "Success" && checkSiteKeyExpiry(response.data.data[0][0].key_expiry))
                    { 
                         var localZoneId=[];
                        //Get zone from local storage
                        winZones.webContents.executeJavaScript('localStorage.getItem("savedZone");', true)
                        .then(result => {                          
                           if(result !=null && result.length>0){
                                localZoneId=JSON.parse(result);
                            }
                        });                   
                       //Check message.
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?',{
                            params: {
                                request:'message',
                                sitename: sitename,
                                msgtype:'live'
                            }      
                        })
                        .then(function (response) {      
                            if (response.data.status == "Success") {
                                if (!winLockdownMessage) {
                                    createMessage("index.html", "message");                    
                                }                                      
                            }
                        });
                    } else{
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                            params: {
                                request: "uninstall",
                                sitekey: site_key,
                                PCName: os.hostname()
                            }
                        })  
                    }
                }   
            }); 
        }
    }, 15000);
}
ipcMain.on('RequestMessage', (event) => {
    event.sender.send('MessageObject', messageObj)
})
ipcMain.on('RequestMessageLockdown', (event) => {
    event.sender.send('MessageObjectLockdown', messageObjLockdown)
})

ipcMain.on('GetSiteKey', (event,siteKey,siteName) => {
    site_key = siteKey;
    site_name = siteName;
})

ipcMain.on('CloseWin', () => win.close())
ipcMain.on('CloseZoneWin', () => winZones.close())
ipcMain.on('CloseWindow', () => winUninstall.close())
ipcMain.on('CloseMessageLockdownWin', () => winLockdownMessage.close())

ipcMain.on('getPath', (event) => {
    const getPath=app.getPath('exe');
    const appPath = path.dirname(getPath);   
    event.sender.send('sendPath', appPath)
})
ipcMain.on('CloseWindowUni', () => {
    force_quit = true;
    app.quit()    
})

powerMonitor.on('shutdown', (event) => {   
    force_quit = true;
    app.quit()  
});

function checkSiteKeyExpiry(newDate){
    var date=new Date(newDate);
    var currentDate=new Date();
   return(Date.parse(newDate) >= Date.parse(currentDate));
}

