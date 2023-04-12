app.controller('MessageController', function ($scope,$location,Constants,myService) {  
    var vm = this;  

    vm.onCheckMessage = function() {    
        vm.frmDate=new Date();   

        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            vm.message = arg;  
            $scope.$applyAsync();
         })
    };     
    vm.onSaveConnectionDtls=function(){
        ipcRenderer.send('CloseMessage'); 
    } 
});
