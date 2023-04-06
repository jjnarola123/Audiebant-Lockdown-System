const { ipcRenderer } = window.require('electron');
const axios = require('axios');

app.controller('SetZonesController', function ($scope,$location,Constants,myService) {  
    var vm = this;    
    vm.onSaveConnectionDtls = function (f) {       
        if (f.$valid) {              
            count = 0;
            $scope.zones.forEach(function(zone) {
                if (zone.selected) {
                   count++;
                   vm.result="";
                }
            });
            if(count==0){
               vm.result = "Please select at least one zone";
            }
        }
    }; 

    vm.onGetZones = function() {
     
        vm.disabledDbDtls = myService.disabledDbDtls;     
        axios.get('https://www.audiebant.co.uk/api/api.php?', {
            params: {
                request: "zones",
                _area:"DeanHigh"
            }
        }).then(function (response) {                
            if(response){            
                if(response.data.status==Constants.ResultStatus[1]){
                    if(response.data.data.length >= 0){    
                        for(let i=0;i<response.data.data.length;i++)
                        {
                            $scope.$apply(function () {
                                $scope.zones =response.data.data[i];
                            });
                        }
                    }
                }
                else{
                    vm.result=response.data.status;
                }
            }else{
                vm.result="No Data Found";
            }
        }).catch(error => {
            if (error.response) {
                $scope.$apply(function () {
                    $scope.vm.result =error.response.status + error.response.statusText;
                });
            }
        });
    };
    
    vm.onClose = function(){         
        ipcRenderer.send('close',[])
    };

    vm.onLogin = function(){
       
        $location.path('/login');
        $scope.$applyAsync();
    };  
});
