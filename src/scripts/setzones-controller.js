//const { ipcRenderer} = window.require('electron');
//const axios = require('axios');
app.controller('SetZonesController', function ($scope) {  
    var vm = this;    
    vm.onSaveConnectionDtls = function (f) {       
        if (f.$valid) {              
            count = 0;
            $scope.zones.forEach(function(zone) {
                if (zone.selected) {
                   count++;
                   $scope.result="";
                }
            });
            if(count==0){
               $scope.result = "Please select zone";
            }
        }
    }; 

    vm.getZones = function() {
        axios.get('https://www.audiebant.co.uk/api/api.php?', {
            params: {
                request: "zones",
                _area:"DeanHigh"
            }
          })          
          .then(function (response) {
            if(response.data.data.length >= 0){    
                for(let i=0;i<response.data.data.length;i++)
                {
                    $scope.$apply(function () {
                        $scope.zones =response.data.data[i];
                    });
                }
            }
          });
    };
    
    vm.onClose = function(){         
        ipcRenderer.send('close',[])
    };
    
});
