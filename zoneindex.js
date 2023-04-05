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