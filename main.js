const { BrowserWindow, app, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let win = null
var force_quit = false;
const createWindow = (Page, route) => 
{
   win = new BrowserWindow({
        width: 800,
        height: 675,
        // closable:false,
        minimizable:false,
        maximizable:false,       
        //autoHideMenuBar:"hedden",
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    win.on('close', function(e){
        if(!force_quit){
            e.preventDefault();
            win.hide();
        }
    });

    const data = {"route": route}
    win.loadFile(Page, {query: {"data": JSON.stringify(data)}})
    //win.loadFile(Page)
}

const createTrayAndMenu = () => {
    tray = new Tray( __dirname + '/assets/img/audiebant-tray-icon.jpg')
   
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
                force_quit=true; app.quit()
            }
        }
    ]
    let contextMenu = Menu.buildFromTemplate(template)
    tray.setToolTip('Audiebant Lockdown Solution')
    tray.setContextMenu(contextMenu)
}

let winMessage = null
const createMessage =(Page, route)=> {
    //if (!winMessage) {
    winMessage= new BrowserWindow({
        width: 800,
        height: 520,
        
        frame: false ,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
      });
  
    const data = {"route": route}
    winMessage.loadFile(Page, {query: {"data": JSON.stringify(data)}})
    //}
}

app.whenReady().then(() => { 
    createTrayAndMenu(); 
    checkMessage();
})

app.on('window-all-close', () => {
    if(process.platform !== 'darwin') app.quit()
})


ipcMain.on('close',()=> app.quit())

ipcMain.on('CloseMessage',()=> winMessage.close())
ipcMain.on('CloseWin',()=> win.close())

var messageObj;
function checkMessage(){
    setInterval(function(){
        axios.get('https://www.communicateandprotect.com/api/api.php?request=login&user_name=admin&password=admin')
        .then(function (response) {
            if(response.data.status =="Success"){
                messageObj = response.data.status;
                createMessage("index.html", "message");   
            }                   
        });    
    }, 15000);  
}

ipcMain.on('RequestMessage', (event) => {
    event.sender.send('MessageObject', messageObj)
 })
