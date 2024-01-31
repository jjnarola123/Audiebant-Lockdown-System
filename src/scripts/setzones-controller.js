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

        angular.forEach($scope.groupzones, function(groupzone) {     
            
            if(index==groupzone.id){
                if($('#'+groupzone.id)[0].checked==true){
                  $('#'+groupzone.id)[0].checked=true;
                }
                else{
                    $('#'+groupzone.id)[0].checked=false;
                }
            }
            else{
                $('#'+groupzone.id)[0].checked=false;
            } 
        });        
        angular.forEach($scope.zones, function(zone) {
            
            if(index==zone.id){
                if($('#'+zone.id)[0].checked==true){
                  $('#zone'+zone.id)[0].checked=true;
                }
                else{
                    $('#zone'+zone.id)[0].checked=false;
                }
            }
            else{
                $('#zone'+zone.id)[0].checked=false;
            }
        });
    }        

    vm.updateAll=function(){
        
        if($('#allZones')[0].checked==true){
            angular.forEach($scope.groupzones, function(zonegroup) {             
                $('#'+zonegroup.id)[0].checked=true;                         
            });
            angular.forEach($scope.zones, function(zone) {
               $('#zone'+zone.id)[0].checked=true;
            });
        }else{
            angular.forEach($scope.groupzones, function(zonegroup) {    
                $('#'+zonegroup.id)[0].checked=false;                                
            });
            angular.forEach($scope.zones, function(zone) {
                $('#zone'+zone.id)[0].checked=false;
             });
        }
    }

    vm.onSaveZonesDtls = function (f) { 
        if (f.$valid) {              
            count = 0;
            selectedZones=[];
            if($scope.zones !=null){            
                $scope.zones.forEach(function(zone) {
                if($('#zone'+zone.id)[0].checked==true){                
                    selectedZones.push({"id":zone.id,"zone_name":zone.zone_name})
                    count++;
                    }                
                    vm.result="";
                });
                if(count==0){
                ipcRenderer.send('CloseZoneWin');
                }else{                 
                    window.localStorage.setItem("savedZone", JSON.stringify(selectedZones));
                    ipcRenderer.send('GetSiteKey', window.localStorage.getItem("sitekey"),window.localStorage.getItem("clientname"));  
                    ipcRenderer.send('CloseZoneWin');
                }
            }else{
                ipcRenderer.send('CloseZoneWin');
            }
        }        
    }; 

    vm.onGetZones = function() {         
        if(window.localStorage.getItem("sitekey")){
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: Constants.Request[3],
                    sitekey: window.localStorage.getItem("sitekey") 
                }
            })          
            .then(function (response) {
                if(response){
                    if(response.data.status == Constants.ResultStatus[1] &&  checkSiteKeyExpiry(response.data.data[0][0].key_expiry)){
                    
                        vm.siteName= window.localStorage.getItem("sitename"),
                        vm.disabledCheck=false;    
                        $scope.checkAll=false;
                        vm.disabledDbDtls = myService.disabledDbDtls;
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                        params: {
                            request:Constants.Request[4],
                            _area:window.localStorage.getItem("clientname"),
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
                                    window.localStorage.setItem("clientname",'')
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
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?',{
                            params: {
                                request:Constants.Request[8],
                                _area:window.localStorage.getItem("clientname")
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
                    }
                    else{                        
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                            params: {
                                request: Constants.Request[9],
                                sitekey: window.localStorage.getItem("sitekey"),
                                PCName: os.hostname()
                            }
                        })  
                        $scope.$apply(function () {
                            vm.disabledDbDtls = myService.disabledDbDtls;
                            $scope.vm.result ="Site key is expired"; 
                        });                                  
                    }
                }
           });
           getZonesBySystem();
        }else{
            $scope.vm.result ="No site key found"; 
            vm.disabledDbDtls = myService.disabledDbDtls;
        }
   };

   function getZonesBySystem(){
        if(window.localStorage.getItem("sitekey")){
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: Constants.Request[11],
                    _area: 'DeanHigh',
                    PCName: os.hostname(), //'ERIC-PC',
                    sitekey: window.localStorage.getItem("sitekey") 
                }
            })
            .then(function (response) {
                if(response){
                    vm.zoneList = [];
                    if(response.data.status == Constants.ResultStatus[1]){
                        var zones = response.data.data[0];
                        zones.forEach(function(zone) {
                            vm.zoneList.push({"id":zone.Siteid,"zone_name":zone.TheSiteLocation});
                        })
                        window.localStorage.setItem("savedZone", JSON.stringify(vm.zoneList));
                    }
                }
            })
        }
        else{
            $scope.vm.result ="No site key found"; 
            vm.disabledDbDtls = myService.disabledDbDtls;
        }
    }

    vm.onLogin = function(){       
        $location.path('/login').search({param: 'fromsetzones'});;
        $scope.$applyAsync();
    };  
    function checkSiteKeyExpiry(newDate){
        var currentDate=new Date();
        return(Date.parse(newDate) >= Date.parse(currentDate));
    }
});
