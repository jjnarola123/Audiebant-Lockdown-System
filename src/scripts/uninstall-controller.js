const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
app.controller('UninstallController', function ($scope,$location,Constants,myService) {  
    var vm = this;    
    let appPath='';
    vm.onUninstall = function () {   
        vm.disabledDbDtls = myService.disabledDbDtls;
        vm.sitekey= window.localStorage.getItem('sitekey');
        vm.siteName= window.localStorage.getItem("sitename");      
        ipcRenderer.send('getPath');
        ipcRenderer.on('sendPath', (event, arg) => {
            appPath=arg.split('/');
        })
        $scope.$applyAsync();      
    }

    vm.onSave = function (f) {  
        f.$submitted = true;
        if (f.$valid) 
        {
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: Constants.Request[9],
                    sitekey: vm.sitekey,
                    PCName: os.hostname()
                }
            })          
            .then(function (response) {
                if(response){       
                    if(response.data.status == Constants.ResultStatus[1]){                       
                        //Uninstall from Windows
                        window.localStorage.clear();   
                        if(process.platform.startsWith("win")){                              
                            var uninstallCommand = `powershell.exe -Command "$app = Get-WmiObject -Class Win32_Product -Filter 'Name = ''Audiebant Lockdown Solution'''; $app.Uninstall()"`;                      
                            exec(uninstallCommand, (error, stdout, stderr) => {
                                if (error) {          
                                    return;
                                }
                                ipcRenderer.send('CloseWindowUni');
                            });                           
                        }
                        else if(process.platform == 'darwin')
                        {
                            //Uninstall from MAC
                            let installationPath="";
                            for(let i=1;i<=appPath.length;i++){
                                if(appPath[i].includes('.app')){
                                    installationPath=installationPath + "/"+ appPath[i];
                                    break;
                                }else{
                                    installationPath=installationPath + "/" + appPath[i]; 
                                }
                            }
                            fs.remove(installationPath)
                            .then(() => {     
                              ipcRenderer.send('CloseWindowUni');
                            })
                            .catch((err) => {
                              console.error('Error removing folder:', err);
                            });                           
                        }
                        else{                
                            //Uninstall from linux   
                            const command = 'gnome-terminal -e "sudo apt purge audiebant-lockdown-solution"';
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Error executing command: ${error}`);
                                    return;
                                }                              
                                ipcRenderer.send('CloseWindowUni'); 
                            });                        
                        }                  
                    }else{
                        vm.result=response.data.status+ ": Invalid site key !";                       
                    }                  
                    $scope.$applyAsync();   
                }
            }); 
        }       
    };
    vm.onLogin = function(){
        $location.path('/login').search({param: 'fromuninstall'});
        $scope.$applyAsync();
    };
    vm.onCancel = function(){       
        ipcRenderer.send('CloseWindow');
    }
});