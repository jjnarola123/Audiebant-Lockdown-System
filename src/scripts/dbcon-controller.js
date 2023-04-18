app.controller('DbConController', function ($scope, $location, myService, Constants) {
    var vm = this;
    vm.onDisabled = function (){
        vm.disabledDbDtls = myService.disabledDbDtls;
        vm.disabledLicDtls = myService.disabledLicDtls;
        vm.onLoadLocalInfo();
    }

    vm.onLoadLocalInfo = function () {
        vm.database = window.localStorage.getItem("database");
        vm.username = window.localStorage.getItem("username");
        vm.password = window.localStorage.getItem("password");
        vm.sitekey = window.localStorage.getItem("sitekey");
        vm.sitename = window.localStorage.getItem("sitename");
        ipcRenderer.send('GetSiteKey', vm.sitekey);
    }

    vm.onTestConnection = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            axios.get('https://www.communicateandprotect.com/api/api.php?', {
                params: {
                    request: Constants.Request[2],
                    host: "45.157.41.195",
                    database: vm.database,
                    username: vm.username,
                    password: vm.password
                }
              })          
              .then(function (response) {
                if(response){
                    if(response.data.status == Constants.ResultStatus[1]){
                        vm.result = '';
                        vm.disabledLicDtls = false;
                        myService.disabledLicDtls = false;
                    }
                    else{
                        vm.disabledLicDtls = true;
                        vm.result = response.data.message;
                    }
                    $scope.$applyAsync();
                }
            });
        }
    };

    vm.onSaveSettings = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            axios.get('https://www.communicateandprotect.com/api/api.php?', {
                params: {
                    request: Constants.Request[3],
                    sitekey: vm.sitekey
                }
              })          
              .then(function (response) {
                  debugger;
                if(response){
                    if(response.data.status == Constants.ResultStatus[1]){
                        vm.sitename = response.data.data[0][0].site_name;
                        vm.licresult = '';
                    }
                    else{
                        vm.licresult = response.data.message;
                        vm.sitename = '';
                    }
                    $scope.$applyAsync();
                }
            });
        }
    };

    vm.onSaveAndClose = function(){
        if(vm.database)
            window.localStorage.setItem("database", vm.database);
        else
            window.localStorage.setItem("database", '');
        if(vm.username)
            window.localStorage.setItem("username", vm.username);
        else
            window.localStorage.setItem("username", '');
        if(vm.password)
            window.localStorage.setItem("password", vm.password);
        else
            window.localStorage.setItem("password", '');
        if(vm.sitekey)
            window.localStorage.setItem("sitekey", vm.sitekey);
        else
            window.localStorage.setItem("sitekey", '');
        if(vm.sitename)
            window.localStorage.setItem("sitename", vm.sitename);
        else
            window.localStorage.setItem("sitename", '');
        ipcRenderer.send('GetSiteKey', vm.sitekey);
        ipcRenderer.send('CloseWin');
    }

    vm.onLogin = function(){
        $location.path('/login');
        $scope.$applyAsync();
    };  
 
});
