app.controller('MessageController', function ($scope,Constants) {  
    var vm = this;  
    var data='';
    vm.onCheckMessage = function() {       
        $('body').removeClass('cls-body');
        vm.frmDate=new Date();    
        ipcRenderer.send('RequestMessage');
        ipcRenderer.on('MessageObject', (event, arg) => {
            data =JSON.parse(arg);  
            if(data[0].msg_school_logo=='')      
            {
                vm.src=__dirname + '/assets/img/icon-win.png';  
            }else{
                vm.src=data[0].msg_school_logo;  
            } 
            if(data[0].msg_sound=='0')      
            {
                vm.sound=__dirname + '/assets/Messagetone.mp3'; 
            }else{
                vm.sound=data[0].msg_sound;
            }       
            vm.emoji=data[0].msg_custom_logo;
            vm.msgcolor=data[0].msg_colour;                      
            vm.message=data[0].msg_text; 
            vm.fontsize=data[0].msg_fontsize;
            vm.msgname= data[0].msg_setby
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
                            ipcRenderer.send('CloseMessageGeneralWin');

                        });       
                    }else{
                        ipcRenderer.send('CloseMessageGeneralWin');
                    }
                }
                else
                {
                    ipcRenderer.send('CloseMessageGeneralWin');
                }            
            });
        }
        else
        {
            ipcRenderer.send('CloseMessageGeneralWin');
        }       
    } 
});
