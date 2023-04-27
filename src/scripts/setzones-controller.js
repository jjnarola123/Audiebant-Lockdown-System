const $ = require('jquery')
app.controller('SetZonesController', function ($scope,$location,Constants,myService) {  
    var vm = this;
    vm.updateSelection = function(index) {
        
        if($('#allZones')[0].checked==true && index > 1){
            index=1;
        }
        if($('#allZones')[0].checked==true && index == 1){
            index=2;
        }
        $('#allZones')[0].checked=false;

        angular.forEach($scope.groupzones, function(zone) {     
            if(index==zone.id){
                if($('#'+zone.id)[0].checked==true){
                  $('#'+zone.id)[0].checked=true;
                }
                else{
                    $('#'+zone.id)[0].checked=false;
                }
            }
            else{
                $('#'+zone.id)[0].checked=false;
            } 
        });        
        angular.forEach($scope.zones, function(zone) {
            if(index==zone.zone_id){
                if($('#'+zone.zone_id)[0].checked==true){
                  $('#zone'+zone.zone_id)[0].checked=true;
                }
                else{
                    $('#zone'+zone.zone_id)[0].checked=false;
                }
            }
            else{
                $('#zone'+zone.zone_id)[0].checked=false;
            }
        });
    }        

    vm.updateAll=function(){
        if($('#allZones')[0].checked==true){
            angular.forEach($scope.groupzones, function(zonegroup) {             
                $('#'+zonegroup.id)[0].checked=true;                         
            });
            angular.forEach($scope.zones, function(zone) {
               $('#zone'+zone.zone_id)[0].checked=true;
            });
        }else{
            angular.forEach($scope.groupzones, function(zonegroup) {    
                $('#'+zonegroup.id)[0].checked=false;                                
            });
            angular.forEach($scope.zones, function(zone) {
                $('#zone'+zone.zone_id)[0].checked=false;
             });
        }
    }

    vm.onSaveZonesDtls = function (f) {       
        if (f.$valid) {              
            count = 0;
            selectedZones=[];
            $scope.zones.forEach(function(zone) {
               if($('#zone'+zone.zone_id)[0].checked==true){                
                   selectedZones.push({"id":zone.zone_id,"zone_name":zone.zone_name})
                   count++;
                }                
                vm.result="";
            });
            if(count==0){
               ipcRenderer.send('CloseZoneWin');
            }else{
                window.localStorage.setItem("savedZone", JSON.stringify(selectedZones));
                ipcRenderer.send('CloseZoneWin');
            }
        }
    }; 

    vm.onGetZones = function() {   
        vm.siteName= window.localStorage.getItem("sitename"),
        vm.disabledCheck=false;    
        $scope.checkAll=false;
        vm.disabledDbDtls = myService.disabledDbDtls;
        axios.get('https://www.communicateandprotect.com/api/api.php?', {
         params: {
            request:Constants.Request[4],
            sitekey:window.localStorage.getItem("sitekey"),
        }
        })
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
                    vm.getSavedZone= JSON.parse(window.localStorage.getItem("savedZone"));
                    $scope.$applyAsync();
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
                request:Constants.Request[8],
                sitekey:window.localStorage.getItem("sitekey")
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
        $location.path('/login').search({param: 'fromsetzones'});;
        $scope.$applyAsync();
    };  
});
