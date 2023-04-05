var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	debugger
	$routeProvider.when('/', {
        //title: 'Home',
		templateUrl: `${__dirname}/src/windows/dbcon.html`,
		controller: 'DbConController'
	}).when('/login', {
		templateUrl: `${__dirname}/src/windows/login.html`,
		controller: 'LoginController'
	}).otherwise({
		template: '404 Not Found'
	});
});