const { ipcRenderer } = window.require('electron');

var app = angular.module('app', []);
app.controller('SetZonesController', function ($scope) {
  
    var vm = this;

    vm.onSaveConnectionDtls = function (f) {
        if (f.$valid) {
            //vm.calculate();
        }
    };

    vm.onClose = function(){
        ipcRenderer.send('close',[])
    }
});
