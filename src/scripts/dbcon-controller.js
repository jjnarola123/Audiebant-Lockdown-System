app.controller('DbConController', function ($scope, $location, myService, Constants) {
    var vm = this;
    const configPath=path.join(os.userInfo().homedir,"Downloads/config.JSON");
    $scope.cred;
    vm.onDisabled = function (){
        vm.disabledDbDtls = myService.disabledDbDtls;
        vm.disabledLicDtls = myService.disabledLicDtls;   
        
        if(window.localStorage.getItem("sitekey") !=null && window.localStorage.getItem("sitekey") != undefined && window.localStorage.getItem("sitekey") !=''){
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: Constants.Request[3],
                    sitekey: window.localStorage.getItem("sitekey") 
                }
            }).then(function (response) {
                if(response){
                    //validating site key
                   if(response.data.status == Constants.ResultStatus[1] && checkSiteKeyExpiry(response.data.data[0][0].key_expiry)){
                        vm.onLoadLocalInfo();
                    }else{
                        //uninstall
                         axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                            params: {
                                request: Constants.Request[9],
                                sitekey: window.localStorage.getItem("sitekey"),
                                PCName: os.hostname()
                            }
                        })         
                        vm.licresult = "Site key is expired";               
                    }
                }            
            });
        }   
        else{            
            vm.onLoadLocalInfo();
        }   
    }

    vm.onLoadLocalInfo = function () { 
        fs.readFile(configPath, 'utf8', function (err, data) {
            if (err){
                vm.result = "File not found "+configPath;
                vm.username = window.localStorage.getItem("username");
                vm.password = window.localStorage.getItem("password");
                vm.sitekey = window.localStorage.getItem("sitekey");
                vm.database = window.localStorage.getItem("database");
                vm.sitename = window.localStorage.getItem("sitename");
                validateDB(true);    
                validateSiteKey();
                $scope.$applyAsync();
            }
            else{   
              $scope.cred=JSON.parse(data);
              vm.database = $scope.cred.database!=undefined?$scope.cred.database:'';
              vm.username = $scope.cred.username!=undefined?$scope.cred.username:'';
              vm.password =$scope.cred.password!=undefined?$scope.cred.password:'';
              vm.sitekey = $scope.cred.siteKey!=undefined?$scope.cred.siteKey:'';
              validateDB(true);    
              validateSiteKey();
              $scope.$applyAsync();    
            }
        });
        ipcRenderer.send('GetSiteKey', vm.sitekey,window.localStorage.getItem("clientname"));  
    }

    vm.onTestConnection = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            validateDB(false);
        }
    };

    vm.onSaveSettings = function (f) {
        f.$submitted = true;
        if (f.$valid) {
            validateSiteKey();
        }
    };

    vm.onSaveAndClose = function(){    
        if(vm.database)
            window.localStorage.setItem("database", vm.database); 
        else
            window.localStorage.setItem("sitename",  '');   
        if(vm.username)
            window.localStorage.setItem("username", vm.username);
        else
            window.localStorage.setItem("username", '');
        if(vm.password)
            window.localStorage.setItem("password", vm.password);
        else
            window.localStorage.setItem("password", '');
        if(vm.sitekey && vm.sitename)
        {
            window.localStorage.setItem("sitekey", vm.sitekey);
            window.localStorage.setItem("sitename", vm.sitename);
        }else{
            window.localStorage.setItem("sitekey",'');
            window.localStorage.setItem("sitename",'');   
        }    
    
         ipcRenderer.send('GetSiteKey', vm.sitekey,window.localStorage.getItem("clientname"));
         ipcRenderer.send('CloseWin');
    }

    vm.onLogin = function(){
        $location.path('/login').search({param: 'fromdbcon'});
        $scope.$applyAsync();
    };  

    vm.onExit=function(){
        ipcRenderer.send('CloseWindowUni');
    }
    function checkSiteKeyExpiry(newDate){
        var date=new Date(newDate);
        var currentDate=new Date();
        return(Date.parse(newDate) >= Date.parse(currentDate));
    }

    function validateSiteKey(){   
        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                params: {
                    request: Constants.Request[3],
                    sitekey: vm.sitekey
                }
            })          
            .then(function (response) {
                if(response){
                    if(response.data.status == Constants.ResultStatus[1]){
                        vm.sitename = response.data.data[0][0].site_name;                    
                        //Install log.
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
                            params: {
                                request: Constants.Request[7],
                                sitekey: vm.sitekey,
                                PCName:os.hostname()
                            }
                        });
                    }
                    else{
                        vm.sitename = '';
                    }
                    vm.licresult = response.data.message;
                    $scope.$applyAsync();
                }
        });       
    }

    function validateDB(flag){ 
        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?', {
            params: {
                request: Constants.Request[2],
                host: "localhost",
                database: vm.database,
                username: vm.username,
                password: vm.password
            }
        })          
        .then(function (response) {                
            if(response){                    
                if(response.data.status == Constants.ResultStatus[1]){
                    vm.disabledLicDtls = flag;
                }               
                vm.result = response.data.message;
                $scope.$applyAsync();
            }
        });
    }
});
