const { ipcRenderer } = require('electron');
const axios = require('axios');
const querystring = require('querystring');

app.controller('MainController', function ($scope, $location, myService, Constants) {
    var vm = this;
    
    vm.onMainInit = function (){
        debugger;
        let query = querystring.parse(global.location.search);
        let data = JSON.parse(query['?data']);

        if(data.route == "dbcon"){
            $location.path('/dbcon');
        }
        else if(data.route == "zones"){
            $location.path('/zones');
        }
        else if(data.route == "message"){
            $location.path('/message');
        }
    }
});