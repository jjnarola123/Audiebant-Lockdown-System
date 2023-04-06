var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	debugger
	$routeProvider.when('/', {
		templateUrl: `${__dirname}/src/windows/setzones.html`,
		controller: 'SetZonesController'
	}).when('/login', {
		templateUrl: `${__dirname}/src/windows/login.html`,
		controller: 'LoginController'
	}).otherwise({
		template: '404 Not Found'
	});
});

app.constant('Constants', {
    Roles: {
        1: 'Admin',
        2: 'User',
        3: 'Guest'
	},
	ResultStatus:{
		1: 'Success',
		2: 'Failed'
	}
}); 

app.service('myService', function() {
	this.disabledDbDtls = true;
});