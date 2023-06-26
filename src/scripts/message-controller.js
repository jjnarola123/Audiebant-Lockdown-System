app.controller('MessageController', function ($scope,Constants) {  
    var vm = this;  
    var data='';
    vm.onCheckMessage = function() {          
        $('body').removeClass('cls-body');
        $('header').css('background-color', '#c1272d')
        $('header').css('color', 'white')
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            data =JSON.parse(arg);  
            vm.msgname=data[0].msg_part_of;
            vm.message=data[0].msg_text;
            vm.sound=__dirname + '/assets/Messagetone.mp3';  
            vm.msglogo='https://www.audiebant.co.uk/api/assets/api_logo.png';
            vm.alert=__dirname + '/assets/img/alert.png';    
            $scope.$applyAsync();        
        });
     
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
