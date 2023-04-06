app.controller('LoginController', function ($scope, $location, Constants, myService) {
    var vm = this;

    vm.onClose = function(){
        ipcRenderer.send('close',[])
    }

    vm.onLogin = function(f) {
        f.$submitted = true;
        if (f.$valid) {  
        axios.get('https://www.communicateandprotect.com/api/api.php?', {
            params: {
                request: "login",
                user_name: vm.username,
                password: vm.password
            }
          })          
          .then(function (response) {
            if(response){
                if(response.data.status == Constants.ResultStatus[1] && response.data.data.role == Constants.Roles[1]){
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