const { ipcRenderer } = window.require('electron');
const axios = require('axios');

var appMessage = angular.module('appMessage', []);

appMessage.constant('Constants', {
	ResultStatus:{
		1: 'Success',
		2: 'Failed'
	}
}); 

appMessage.controller('MessageController', function ($scope, Constants) {  
    var vm = this;  
    vm.onCheckMessage = function() {    
        axios.get('https://www.communicateandprotect.com/api/api.php?request=login&user_name=admin&password=admin')
        .then(function (response) {
            if(response){
                if(response.data.status ==Constants.ResultStatus[1]){
                    $scope.$apply(function () {
                        ipcRenderer.send('ShowMessage');
                    });                
                }              
            }
        });     
    };     
});
