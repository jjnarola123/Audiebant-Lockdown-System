const { ipcRenderer } = window.require('electron');
const axios = require('axios');

app.controller('DbConController', function ($scope, $location, myService) {
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
                        myService.disabledLicDtls = false;
                        // $location.path('/');
                        // $scope.$applyAsync();
                    }
                    else{
                        vm.result = response.data.message;
                        //$scope.$applyAsync();
                    }
                }
              });
        }
    };

    vm.onSaveConnectionDtls = function (f) {
        // f.$setPristine();
        // vm.speed = 0;
        // vm.speedMode = vm.speedModes[0];
        // vm.size = 0;
        // vm.sizeMode = vm.sizeModes[0];
        // vm.res = null;
    };

    vm.onClose = function(){
        ipcRenderer.send('close',[])
    }

    vm.onLogin = function(){
        $location.path('/login');
        $scope.$applyAsync();
    };  
 
});
