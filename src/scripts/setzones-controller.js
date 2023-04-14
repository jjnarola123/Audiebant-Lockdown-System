const $ = require('jquery')
app.controller('SetZonesController', function ($scope,$location,Constants,myService) {  
    var vm = this;
    vm.updateSelection = function(index) {
        $scope.checkAll=false; 
        angular.forEach($scope.groupzones, function(zone) { 
            if(index!=zone.id){
                $('#'+zone.id)[0].checked=false;
            }
        });
        
        angular.forEach($scope.zones, function(zone) {
            if(index==zone.zone_id){
                $('#z'+zone.zone_id)[0].checked=true;
            }
            else{
                $('#z'+zone.zone_id)[0].checked=false;
            }
        });
    }        

    vm.updateAll=function(f){
        if(f.checkAll==false){
            $scope.checkAll='All';
            angular.forEach($scope.groupzones, function(zonegroup) {             
                $('#'+zonegroup.id)[0].checked=true;                         
            });
        }else{
            $scope.checkAll=false;
            angular.forEach($scope.groupzones, function(zonegroup) {    
                $('#'+zonegroup.id)[0].checked=false;                                
            });
        }
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
                ipcRenderer.send('CloseWin');
            }
        }
    }; 

    vm.onGetZones = function() {    

     
        vm.disabledCheck=false;    
        $scope.checkAll=false;
        vm.disabledDbDtls = myService.disabledDbDtls;
        axios.get('https://www.communicateandprotect.com/api/api.php?request=zones&sitekey=90a02d12-d202-11ed-b741-005056ad37fa')
        .then(function (response) {        
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
                    vm.result=response.data.status+" :"+ response.data.message;
                    $scope.$applyAsync();
                }
            }else{
                vm.result="No Data Found";
                $scope.$applyAsync();
            }
        }).catch(error => {
            if (error.response) {
                $scope.$apply(function () {
                    $scope.vm.result =error.response.status + error.response.statusText;
                });
            }
        });

        //get group zones
        axios.get('https://www.communicateandprotect.com/api/api.php?',{
            params: {
                request:'groups',
                sitekey:'90a02d12-d202-11ed-b741-005056ad37fa'
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
            }
        })
    };

    vm.onLogin = function(){       
        $location.path('/login');
        $scope.$applyAsync();
    };  
});
