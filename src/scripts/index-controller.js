const { ipcRenderer } = window.require('electron');

var app = angular.module('app', []);
app.controller('IndexController', function ($scope) {
  
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
});
