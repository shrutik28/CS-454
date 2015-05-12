var app = angular.module('app',['ngSanitize','ngRoute','ui.select'])
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	$locationProvider.html5Mode({enabled: true,requireBase: false}).hashPrefix('!');
	$routeProvider
	.when('/',{
		templateUrl: 'views/list',
		controller: 'ListCtrl'
	})
	.when('/:id',{
		templateUrl: 'views/character',
		controller: 'CharacterCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
