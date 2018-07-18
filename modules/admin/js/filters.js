'use strict';

/* Filters */

var filters = angular.module('fastserAdminFilters', []);

filters.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


filters.filter('strcustom', function() {
  return function(input, format, type) {
	if(type == 2){
		var fmt = eval('(' + format + ')'); 
		return fmt[input];
	}else if(type == 3){
		return format[input];
	}else{
		return input;
	}
  };
});

filters.filter('checklist',['$routeParams',function($routeParams){
	return function(input){
		if($routeParams.model == input)
			return 'active';
		else
			return ''
	}
}]);


filters.filter('isShow',function(){
	return function(input){
		if(input>0)
			return '';
		else 
			return 'none';
	}
});
