app.controller('MessageController', function ($scope,Constants) {  
    var vm = this;  

    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            var data =JSON.parse(arg);  
            if(data[0].msg_school_logo=='')       {
                vm.src='file:///assets/img/image-not-found.png';
            }else{
               vm.src=data[0].msg_school_logo;  
            }
           
            vm.emoji=data[0].msg_custom_logo;
            vm.msgcolor=data[0].msg_colour;                      
            vm.message=data[0].msg_text; 
            vm.fontsize=data[0].msg_fontsize;
            $scope.$applyAsync();                 
         })
    };     
    vm.onSaveConnectionDtls=function(){

        var PCName=os.hostname();
        var SiteName=window.localStorage.getItem("sitename");
        var SiteKey=window.localStorage.getItem("sitekey");
        window.close();
       
      


    //     axios.get('https://www.communicateandprotect.com/api/api.php?',{
    //     params: {
    //         request:Constants.Request[6],
    //         sitekey:window.localStorage.getItem("sitekey"),
    //         msgID:'1'
    //     }
    // })      
    // .then(function (response) {
    //     if (response.data.status == Constants.ResultStatus[1]) {
    //         //ipcRenderer.send('CloseMessage'); 
    //         window.close();
    //     }
    // });            
    } 
});
