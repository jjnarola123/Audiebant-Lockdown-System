var app = angular.module('app', []);

//const { BrowserWindow } = require('node_modules/electron');
app.controller('IndexController', function () {
    //var win = remote.getCurrentWindow();
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

    vm.onClose = function(f){
        //win.close();
    }
});
