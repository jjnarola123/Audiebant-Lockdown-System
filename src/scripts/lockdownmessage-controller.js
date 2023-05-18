app.controller('LockdownmessageController', function ($scope,Constants) {  
    var vm = this;  
    var data='';
    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessageLockdown');
        ipcRenderer.on('MessageObjectLockdown', (event, arg) => {
            data =JSON.parse(arg);                      
            vm.message=data[0].msg_text;
            vm.msgname=data[0].msg_setby;             
            $scope.$applyAsync();                 
        })
    };     
    vm.onSaveMessageDtls=function(){
        if(data!='')
        {     
            var siteKey=window.localStorage.getItem("sitekey");        
            axios.get('https://www.communicateandprotect.com/api/api.php?',{
                params: {
                    request:Constants.Request[6],
                    sitekey:siteKey,
                    PCName:os.hostname(),
                    msgID:data[0].msg_id
                }
            }).then(function (response) 
            {
                if(response)
                {             
                    if(response.data.status == Constants.ResultStatus[1])
                    {
                        axios.get('https://www.communicateandprotect.com/api/api.php?',{
                            params: {
                                request:Constants.Request[10],
                                sitekey:siteKey,
                                PCName:os.hostname(),
                                MessageID:data[0].msg_id
                            }
                        }).then(function (res){
                            ipcRenderer.send('CloseMessageLockdownWin');
                        });       
                    }else{
                        ipcRenderer.send('CloseMessageLockdownWin'); 
                    }
                }
                else
                {
                    ipcRenderer.send('CloseMessageLockdownWin'); 
                }            
            });
        }
        else
        {
            ipcRenderer.send('CloseMessageLockdownWin');
        }       
    } 
});
