app.controller('MessageController', function ($scope,Constants) {  
    var vm = this;  
    var data='';
    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        $('header').css('background-color', '#c1272d')
        $('header').css('color', 'white')
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessageLockdown');
        vm.msgname="DeanHigh";
        vm.message="Audiebant Test Message";
        vm.sound=__dirname + '/assets/Messagetone.mp3'; 
        vm.msglogo=__dirname + '/assets/img/icon-win.png';   
        vm.alert=__dirname + '/assets/img/alert.png';   
        $scope.$applyAsync();        
    };     
    vm.onSaveMessageDtls=function(){
        if(data!='')
        {     
            var siteKey=window.localStorage.getItem("sitekey");    
            var siteName = window.localStorage.getItem("clientname");    
            axios.get('https://www.audiebant.co.uk/api/api_desktop.php?',{
                params: {
                    request:Constants.Request[6],
                    sitekey:siteKey,
                    msgID:data[0].msg_id,
                    type:"live",
                    sitename:siteName,                   
                }
            }).then(function (response) 
            {
                if(response)
                {             
                    if(response.data.status == Constants.ResultStatus[1])
                    {
                        axios.get('https://www.audiebant.co.uk/api/api_desktop.php?',{
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
