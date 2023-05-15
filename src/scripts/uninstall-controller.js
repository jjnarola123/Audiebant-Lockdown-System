const { spawn,exec } = require('child_process');

app.controller('UninstallController', function ($scope,$location,Constants,myService) {  
    var vm = this;    
    let appPath='';
    vm.onUninstall = function () {   
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
            axios.get('https://www.communicateandprotect.com/api/api.php?', {
                params: {
                    request: Constants.Request[9],
                    sitekey: vm.sitekey,
                    PCName: os.hostname()
                }
            })          
            .then(function (response) {
                if(response){                
                    if(response.data.status == Constants.ResultStatus[1]){
                        window.localStorage.clear(); 
                        if(process.platform == 'darwin'){

                            let installationPath="";
                            for(let i=1;i<=appPath.length;i++){
                                if(appPath[i]=='communicate-and-protect.app'){
                                    installationPath=installationPath + "/" + appPath[i];
                                    break;
                                }else{
                                    installationPath=installationPath + "/" + appPath[i]; 
                                }
                            }

                            const command = `osascript -e 'tell application "Terminal" to do script "sudo rm -rf  ${installationPath}"'`;
                    
                            exec(command, (error, stdout, stderr) => {
                              if (error) {                              
                                return;
                              }                    
                            });
                        }
                        else{                        
                            // uninstall from linux   
                            spawn('gnome-terminal', ['-e', 'sudo apt purge communicate-and-protect']);                           
                        }
                        ipcRenderer.send('CloseWindow');
                  
                    }else{
                        vm.result=response.data.status+ ": Invalid site key !";                       
                    }
                    $scope.$applyAsync();   
                }
            }); 
        }       
    };

    vm.onCancel = function(){       
        ipcRenderer.send('CloseWindow');
    }
});