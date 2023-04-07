const { ipcRenderer } = require('electron');
const axios = require('axios');

app.controller('DbConController', function ($scope, $location, myService, Constants) {
    var vm = this;
    vm.onDisabled = function (){
        vm.disabledDbDtls = myService.disabledDbDtls;
        vm.disabledLicDtls = myService.disabledLicDtls;
    }

    vm.onTestConnection = function (f) {
        f.$submitted = true;
        debugger;
        if (f.$valid) {
            axios.get('https://www.communicateandprotect.com/api/api.php?', {
                params: {
                    request: "dbc",
                    database: vm.database,
                    username: vm.username,
                    password: vm.password
                }
              })          
              .then(function (response) {
                if(response){
                    if(response.data.status == Constants.ResultStatus[1]){
                        vm.disabledLicDtls = false;
                        myService.disabledLicDtls = false;
                        // $location.path('/');
                        // $scope.$applyAsync();
                    }
                    else{
                        vm.result = response.data.message;
                        $scope.$applyAsync();
                    }
                }
            });
        }
    };

    vm.onSaveSettings = function (f) {
        // f.$setPristine();
        f.$submitted = true;
        if (f.$valid) {
            
        }
    };

    vm.onSaveAndClose = function(){
        ipcRenderer.send('close',[])
    }

    vm.onLogin = function(){
        $location.path('/login');
        $scope.$applyAsync();
    };  
 
});
