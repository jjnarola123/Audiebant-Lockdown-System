const { ipcRenderer } = window.require('electron');
const axios = require('axios');

app.controller('DbConController', function ($scope, $location) {
    var vm = this;
    vm.onTestConnection = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            //vm.calculate();
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
