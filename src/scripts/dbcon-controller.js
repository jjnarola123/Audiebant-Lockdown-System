app.controller('DbConController', function ($scope, $location, myService, Constants) {
    var vm = this;
    vm.onDisabled = function (){
        vm.disabledDbDtls = myService.disabledDbDtls;
        vm.disabledLicDtls = myService.disabledLicDtls;
    }

    vm.onTestConnection = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            axios.get('https://www.communicateandprotect.com/api/api.php?', {
                params: {
                    request: "dbc",
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
                    request: "sitekey",
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
        ipcRenderer.send('CloseWin');
    }

    vm.onLogin = function(){
        $location.path('/login');
        $scope.$applyAsync();
    };  
 
});
