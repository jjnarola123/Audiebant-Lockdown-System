app.controller('MessageController', function ($scope,$location,Constants,myService) {  
    var vm = this;  

    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            var data =JSON.parse(arg); 
            if(data[0].msg_type=="General"){
                vm.disabledLicDtls=true;
                disabledDbDtls=false;
                vm.src=data[0].msg_school_logo;
                vm.emoji=data[0].msg_custom_logo;
                vm.message=data[0].msg_text;         
                vm.msgcolor=data[0].msg_colour;
                $scope.$applyAsync();
            }else{
                vm.disabledLicDtls=false;
                disabledDbDtls=true;
            }          
         })
    };     
    vm.onSaveConnectionDtls=function(){
        axios.get('https://www.communicateandprotect.com/api/api.php?request=message_confirm&sitekey=90a02d12-d202-11ed-b741-005056ad37fa&msgID=1')
        .then(function (response) {
            if (response.data.status == Constants.ResultStatus[1]) {
                ipcRenderer.send('CloseMessage'); 
            }
        });    
        
    } 
});
