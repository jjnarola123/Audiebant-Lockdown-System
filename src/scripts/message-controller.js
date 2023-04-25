app.controller('MessageController', function ($scope,Constants) {  
    var vm = this;  
    var data='';
    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            data =JSON.parse(arg);                      
            vm.message=data[0].msg_text; 
            $scope.$applyAsync();                 
         })
    };     
    vm.onSaveMessageDtls=function(){
        if(data!='')
        {
            var PCName=os.hostname();
            var siteName=window.localStorage.getItem("sitename");
            var siteKey=window.localStorage.getItem("sitekey");        
            axios.get('https://www.audiebant.co.uk/api/desktop_api.php?',{
                params: {
                    request:Constants.Request[6],
                    sitekey:siteKey,
                    msgID:data[0].msg_id
                }
            })      
            .then(function (response) {
                //ack_log
                axios.get('https://www.audiebant.co.uk/api/desktop_api.php?',{
                    params: {
                        request:Constants.Request[6],
                        sitekey:siteKey,
                        msgID:data[0].msg_id
                    }
                }).then(function (data) { 


                });                
                window.close();
            });     
        }    
        
        window.close();
    } 
});
