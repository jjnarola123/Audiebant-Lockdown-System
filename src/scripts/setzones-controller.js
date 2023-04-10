app.controller('SetZonesController', function ($scope,$location,Constants,myService) {  
    var vm = this;

    vm.updateSelection = function(zoneId) {
        debugger
        $scope.groupzones.forEach(function(zone) {             
            debugger
            if(zone.id==zoneId){
                $scope.vm.disabledCheck =true;
            }
        });
       

      
        // groupzones.forEach(function(zones, index) {
        //   if (position != index) 
        //     zones.checked = false;
        // });
    }
    

    vm.onSaveConnectionDtls = function (f) {       
        if (f.$valid) {              
            count = 0;
            selectedZones=[];
            $scope.zones.forEach(function(zone) {
                if (zone.selected) {   
                   selectedZones.push({"id":zone.id,"zone_name":zone.zone_name})
                   count++;
                }
                vm.result="";
            });
            if(count==0){
               vm.result = "Please select at least one zone";
            }else{
                // axios.post('https://www.audiebant.co.uk/api/api.php?', {
                //     params: {
                //         selectedZones;
                //     }
                // }).then(function (response) {   });     
                ipcRenderer.send('close',[])
            }
        }
    }; 

    vm.onGetZones = function() {     
        vm.disabledCheck=false;
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
                        //get group zones
                        axios.get('https://www.audiebant.co.uk/api/api.php?',{
                            params: {
                                request: "zones",
                                _area:"DeanHigh"
                            }
                        }).then(function (data) {  
                            if(data){            
                                if(data.data.status==Constants.ResultStatus[1]){
                                    if(data.data.data.length >= 0){    
                                        for(let i=0;i<data.data.data.length;i++)
                                        {
                                            $scope.$apply(function () {
                                                $scope.groupzones=data.data.data[i];
                                            });
                                        }
                                    }
                                }
                            }else{
                                vm.groupresult="No Zone Found";
                            }
                        })
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
    
    vm.onLogin = function(){       
        $location.path('/login');
        $scope.$applyAsync();
    };  
});
