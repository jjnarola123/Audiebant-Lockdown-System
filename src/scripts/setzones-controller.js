const { ipcRenderer } = window.require('electron');
const axios = require('axios');
window.$ = window.jQuery = require('jquery');

var app = angular.module('app', []);
app.controller('SetZonesController', function ($scope) {
  
    var vm = this;    
    vm.onSaveConnectionDtls = function (f) {
       
        if (f.$valid) {  
        }
    }; 

    vm.getSetZones = function() {
        axios.get('https://www.audiebant.co.uk/api/api.php?', {
            params: {
                request: "zones",
                _area:"DeanHigh"
            }
          })          
          .then(function (response) {

            if(response.data.data.length >= 0){
          
                for(let i=0;i<response.data.data.length;i++)
                {
                    for(let j=0;j<response.data.data[i].length;j++)
                    {  
                        
                        const setGetZoneDataById=$("#setGetZoneData");                
                        const divison = $("<div class='form-group' id='frm"+response.data.data[i][j].id+"'>");                    
                        setGetZoneDataById.append(divison);                         
                        const setDataZone=$("#frm"+response.data.data[i][j].id);
                        const checkBox = $("<input type='checkbox' id='"+response.data.data[i][j].id+"' name='"+response.data.data[i][j].zone_name+"'/>");             
                        const label = $("<label for='"+response.data.data[i][j].zone_name+"'>&nbsp;&nbsp;"+response.data.data[i][j].zone_name+"</label>");
                                       
                        setDataZone.append(checkBox); 
                        setDataZone.append(label); 
                        
                    }
                }
            }
          });
    };
    
    vm.onClose = function(){         
        ipcRenderer.send('close',[])
    };
    
});
