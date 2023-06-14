app.controller('LoginController', function ($scope, $location, Constants, myService) {
    var vm = this;

    vm.onBack = function(){
        var urlParams = $location.search();
        if(urlParams.param == "fromdbcon"){
            $location.path('/');
        }
        else if(urlParams.param == "fromsetzones"){
            $location.path('/zones');
        }
        else if(urlParams.param == "fromuninstall"){
            $location.path('/uninstall');
        }
        //ipcRenderer.send('CloseWin');
    }

    vm.onLogin = function(f) {
        f.$submitted = true;
        if (f.$valid) {  
        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
            params: {
                request: Constants.Request[1],
                user_name: vm.username,
                password: vm.password
            }
          })          
          .then(function (response) {
            if(response){                
                if(response.data.status == Constants.ResultStatus[1] && response.data.data.role == Constants.Roles[2])
                {  
                    window.localStorage.setItem("clientname",  response.data.data.client); 
                    myService.disabledDbDtls = false;
                    $location.path('/');
                    $scope.$applyAsync();
                }
                else{
                    vm.result = response.data.message;
                    $scope.$applyAsync();
                }
            }
          });
        }
    };
})