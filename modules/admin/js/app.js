'use strict';

/* App Module */

var fastser = angular.module('fastser', ['fastserAdminFilters', 'fastserAdminServices', 'fastserAdminDirectives','fasterControllers']),appName;

fastser.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  	  when('/login',{templateUrl:'fastser/login.html',	controller:'loginCtrl'}).
  	  when('/login/:name',{templateUrl:'fastser/login.html',	controller:'loginCtrl'}).
      when('/:bucket', {templateUrl: 'fastser/list.html',   controller: 'ModelListCtrl'}).
	  when('/:bucket/:model', {templateUrl: 'fastser/list.html',   controller: 'ModelListCtrl'}).
      when('/:bucket/:model/create', {templateUrl: 'fastser/create.html',   controller: 'ModelDetailCtrl'}).
      when('/:bucket/:model/detail/:id', {templateUrl: 'fastser/detail.html', controller: 'ModelDetailCtrl'}).
      when('/:bucket/:model/modify/:id', {templateUrl: 'fastser/modify.html', controller: 'ModelDetailCtrl'}).
      when('/:bucket/:model/o2m/:id', {templateUrl: 'fastser/one2many.html', controller: 'ModelOne2manyCtrl'}).
      otherwise({redirectTo: '/login'});
}]);


fastser.run(['$rootScope','$location','$routeParams','authenticationService',function($rootScope,$location,$routeParams,authenticationService){
	var notRequireRootPath = '/login';
	
	$rootScope.$on('$routeChangeSuccess',function(event,next,current){
		if($location.path().indexOf(notRequireRootPath)<0 && !authenticationService.isLoggedIn()){
			alert('Please Login!');
			$location.path('/login');
		}
		if(sessionStorage.getItem("application")!=undefined && $location.path().indexOf(sessionStorage.getItem("application"))<0){
			alert('Please Login!');
			sessionStorage.clear();
			$location.path('/login');
		}
	});
	
	$rootScope.logout = function() {
		authenticationService.logout();
		$location.path('/login/'+$routeParams.bucket);
	};
}]);
