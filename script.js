var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: `${__dirname}/src/windows/main.html`,
		controller: 'MainController'
	}).when('/dbcon', {
		title: '- Connection Settings',
		templateUrl: `${__dirname}/src/windows/dbcon.html`,
		controller: 'DbConController'
	}).when('/login', {
		title: '- Login',
		templateUrl: `${__dirname}/src/windows/login.html`,
		controller: 'LoginController'
	}).when('/zones', {
		title: '- Set Zones',
		templateUrl: `${__dirname}/src/windows/setzones.html`,
		controller: 'SetZonesController'
	}).when('/message', {
		templateUrl: `${__dirname}/src/windows/message.html`,
		controller: 'MessageController'
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
	  this.disabledLicDtls = true;	  
});

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);