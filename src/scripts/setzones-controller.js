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
                        const setGetZoneDataById=document.getElementById("setGetZoneData");
                
                        const divison = document.createElement("div");
                        divison.setAttribute("class", "form-group");
                        divison.setAttribute("id", "frm"+response.data.data[i][j].id);
                        setGetZoneDataById.append(divison); 
                        
                        const setDataZone=document.getElementById("frm"+response.data.data[i][j].id);

                        var checkBox = document.createElement("INPUT");                    
                        checkBox.setAttribute("type", "checkbox");
                        checkBox.setAttribute("id", response.data.data[i][j].id);
                        checkBox.setAttribute("name",  response.data.data[i][j].zone_name);    
                        var label = document.createElement("LABEL");
                        label.innerHTML ='&nbsp;&nbsp;'+response.data.data[i][j].zone_name;
                        
                        setDataZone.appendChild(checkBox); 
                        setDataZone.appendChild(label); 
                        
                    }
                }
            }
          });
    };

    vm.onClose = function(){         
        ipcRenderer.send('close',[])
    };
    
});
