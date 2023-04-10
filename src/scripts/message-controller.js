app.controller('MessageController', function ($scope,$location,Constants,myService) {  
    var vm = this;  
    vm.onCheckMessage = function() {    
        axios.get('https://www.communicateandprotect.com/api/api.php?request=login&user_name=admin&password=admin')
        .then(function (response) {
            if(response){
                if(response.data.status ==Constants.ResultStatus[1]){
                    $scope.$apply(function () {
                        ipcRenderer.send('ShowMessage');
                    });                
                }              
            }
        });     
    };     
});
