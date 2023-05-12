const { spawn } = require('child_process');
app.controller('UninstallController', function ($scope,$location,Constants,myService) {  
    var vm = this;    

    vm.onUninstall = function () {   
        vm.sitekey= window.localStorage.getItem('sitekey');
        vm.siteName= window.localStorage.getItem("sitename"),
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
                        // uninstall from linux   
                        spawn('gnome-terminal', ['-e', 'sudo apt purge communicate-and-protect']);
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