'use strict';

/* Controllers */

var controllers = angular.module('fasterControllers',[]);

//*------登录验证-------*//
controllers.controller('loginCtrl',['$scope','$http','$location','$routeParams','authenticationService','permissions',function($scope,$http,$location,$routeParams,authenticationService,permissions){
	var appName = $routeParams.name ? $routeParams.name:"system";
	var cookieName = appName + "name",cookiePass = appName + "pass";
	if($.cookie(cookieName)){
		$scope.credentials = {username:$.cookie(cookieName),password:$.cookie(cookiePass)};
	} else {
		$scope.credentials = {username:'',password:''};
	}
	$scope.login = function(){
		if($("#loginMemory").attr("checked")=="checked"){
			var userName = $scope.credentials.username;
			var pass = $scope.credentials.password;
			$.cookie(appName + "name", userName , { expires:7 });
			$.cookie(appName + "pass", pass , { expires:7 });
		}
		authenticationService.login($scope.credentials).success(function(data){		//请求api
			var userId = data.access_token;
			var bucket = data.bucket;
			$http.get(basePath + '/token/' + userId).success(function(userInfo){    //测试不用传bucket
				$('#shclCcw').hide();
				$('.loaderBg').hide();
				permissions.set('userPermissions',JSON.stringify(userInfo));
				$location.path('/'+bucket);
			}).error(function(){
				$('#shclCcw').hide();
				$('.loaderBg').hide();
				sessionStorage.clear();
				alert("获取用户信息失败,请重新登录!");
				$location.path('/login/'+bucket);
			});
			//permissions.set(JSON.stringify(data.access_token));//{userid}
		});
	};
}]);

//*------系统表获取-------*//
controllers.controller('ModelListCtrl', ['$scope', '$routeParams', 'ListService', '$rootScope', '$location', '$http' , 'permissions','sessionService',
	function($scope, $routeParams, ListService, $rootScope, $location, $http, permissions,sessionService) {
   
    $scope.condtion = {};
	$scope.pages = 0;
	$scope.current = 0;
    
    $scope.search = function(){
        var condtion = angular.copy($scope.condtion);
        var params = '';
		var pageSize = 20;
		var result = [];
        if($scope.table){
            angular.forEach($scope.table.info, function(field, index){
                if(condtion[field.name]){
                    if(validator(field, condtion[field.name], $scope)){
                        result.push(field.name + "=" + condtion[field.name]);
                    }else{
                        return;return;
                    }
                }
            });
        }
		result.push("pageIndex=" + ($scope.current+1));
		result.push("pageSize=" + pageSize);
        params = result.join("&");
        var url = 'admin/' + $routeParams.bucket + "/" + $routeParams.model + '?callback=JSON_CALLBACK';
		if(params){
			url = url + "&" + params;
		}
		ListService.get(url).success(function(datas){
            $scope.values = datas;
        });
		//if($scope.pages <= 0){
		var index = url.indexOf('?');
		var urlCount = url.substring(0, index) + "/count" + url.substring(index, url.length);
		$http.jsonp(basePath + urlCount).success(function(datas){
			if(datas && datas.count > 0){
				$scope.pages = Math.ceil(datas.count/pageSize);
			}
		});
		//}		
    }
	
	$scope.remove = function(index) {
		var item = $scope.values[index];
        if(item){
			var url = basePath + 'admin/' + $routeParams.bucket + '/' + $routeParams.model + '/' + item.id;
            $http.delete(url).success(function(data, status){
				$scope.values.splice(index,1);
			});
        }
    }
	
	if(($routeParams.bucket && isEmptyObject($rootScope.tables)) || ($routeParams.bucket!=$rootScope.bucket)){
		$http.jsonp(basePath + 'admin/' + $routeParams.bucket +"?callback=JSON_CALLBACK").success(function(datas){
			$rootScope.tables = datas;
			permissions.set('tables',JSON.stringify(datas));
			$rootScope.bucket = $routeParams.bucket;
		});
	}
	
	if($routeParams.bucket && $routeParams.model){
	  	var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model + "/info?callback=JSON_CALLBACK";
	    $http.jsonp(url).success(function(data){
	    	$rootScope.table = data;
	    	sessionService.set("table",JSON.stringify(data));
	    	$rootScope.tableName = $routeParams.model;
	    });
		$scope.search();
	}
  
}]);

//*------表详细信息的获取和操作-------*//
controllers.controller('ModelDetailCtrl', [ '$scope', '$routeParams', '$rootScope', '$location', '$http' , 'sessionService',
     function($scope, $routeParams, $rootScope, $location, $http, sessionService) {
    
    $scope.entity = {};
    $scope.cbvalue = {};
	
	if($routeParams.bucket && isEmptyObject($rootScope.tables)){
		$http.jsonp(basePath + 'admin/' + $routeParams.bucket +"?callback=JSON_CALLBACK").success(function(datas){
			$rootScope.tables = datas;
			$scope.bucket = $routeParams.bucket;
		});
	}
	  
	if($routeParams.bucket && $routeParams.model){
		var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model + "/info?callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(data){
			$rootScope.table = data;
			$scope.tableName = $routeParams.model;
		});
	}
	
	$scope.save = function() {
        var submit = true;
        var mod = angular.copy($scope.entity);
        if(mod){
            angular.forEach($scope.table.info, function(field, index){
                if(validator(field, mod[field.name], $scope)){
                	if(field.formType=="5" && mod[field.name]!=null){
						mod[field.name] = mod[field.name].toString();
					} 
                }else{
                    submit = false;
                    return;
                }
            });
        }
        if(submit){
            var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model;
            $http.post(url, mod).success(function(data, status){
                $location.path('/' + $routeParams.bucket + "/" + $routeParams.model + "/detail/" + data.result);
            });
        }
    }
	
	$scope.modify = function() {
        var submit = true;
        var mod = angular.copy($scope.entity);
		var update = {};
        if(mod){
            angular.forEach($scope.table.info, function(field, index){
                if(validator(field, mod[field.name], $scope)){
                	if(mod[field.name]==null || $scope.origin[field.name]==null){
                		if(mod[field.name] != $scope.origin[field.name]){
							if(field.formType=="5" && mod[field.name]!=null){
								update[field.name] = mod[field.name].toString();
							} else {
								update[field.name] = mod[field.name];
							}
						}
                	} else {
                		if(mod[field.name].toString() != $scope.origin[field.name].toString()){
							if(field.formType=="5"){
								update[field.name] = mod[field.name].toString();
							} else {
								update[field.name] = mod[field.name];
							}
						}
                	}					
                }else{
                    submit = false;
					return;
                }
            });
        }
//      console.log(mod);
//      console.log($scope.origin);        
//      console.log(update);

        if(submit && isEmptyObject(update) == false){
            var url = basePath + 'admin/' + $routeParams.bucket + '/' + $routeParams.model + '/' + $routeParams.id;
			$http.put(url, update).success(function(data, status){
                $location.path('/' + $routeParams.bucket + '/' + $routeParams.model + '/detail/' + $routeParams.id);
            }).error(function(data,status){
            	alert("服务器连接异常，请稍后再尝试！");
            });
        }
    }
	
	$scope.back = function() {
 		window.history.go(-1);
 	}
    
	if($routeParams.id){
		var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model + "/" + $routeParams.id + "?callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(datas){
			var x,listInfos,table = JSON.parse(sessionService.get("table"));
			for(x in datas){
				if(datas[x] != null){
					listInfos = _.findWhere(table.info,{name:x});		//当前列的信息
					if(listInfos !=null && listInfos.displayType == 5){
						datas[x] = datas[x].split(",");
					}
				}
			}
			$scope.entity = datas;
			$scope.origin = angular.copy($scope.entity);
		});
    }
    
}]);


controllers.controller('ModelOne2manyCtrl', [ '$scope', '$routeParams', '$rootScope', '$location', '$http' ,
     function($scope, $routeParams, $rootScope, $location, $http) {
    
    $scope.entity = {};
    $scope.cbvalue = {};
	
	if($routeParams.bucket && isEmptyObject($rootScope.tables)){
		$http.jsonp(basePath + 'admin/' + $routeParams.bucket +"?callback=JSON_CALLBACK").success(function(datas){
			$rootScope.tables = datas;
			$scope.bucket = $routeParams.bucket;
		});
	}
	  
	if($routeParams.bucket && $routeParams.model){
		var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model + "/info?callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(data){
			$rootScope.table = data;
			$scope.tableName = $routeParams.model;
		});
	}
	
	if($routeParams.id){
		var url = basePath + 'admin/' + $routeParams.bucket + "/" + $routeParams.model + "/" + $routeParams.id + "/one2many?callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(datas){
			$scope.entity = datas.one;
			$scope.list = datas.list;
		});
    }
	
	$scope.addOne2many = function(index) {
		var item = $scope.list[index];
        if(item){
			var url = basePath + 'admin/' + $routeParams.bucket + '/' + $routeParams.model + '/' + $routeParams.id + '/' + item.id;
			$http.post(url, {}).success(function(data, status){
                $scope.list[index].flag = true;
				//$location.path('/' + $routeParams.bucket + '/' + $routeParams.model + '/o2m/' + $routeParams.id);
            });
		}
    }
	
	$scope.delOne2many = function(index) {
        var item = $scope.list[index];
        if(item){
			var url = basePath + 'admin/' + $routeParams.bucket + '/' + $routeParams.model + '/' + $routeParams.id + '/' + item.id;
			$http.delete(url).success(function(data, status){
                $scope.list[index].flag = false;
				//$location.path('/' + $routeParams.bucket + '/' + $routeParams.model + '/o2m/' + $routeParams.id);
            });
		}
    }
    
 
}]);


function validator(field, value, $scope){
	if(field.request){
		if(value){
			field.validateError = false;
			field.validateErrorMessage = '';
		}else{
			field.validateError = true;
			field.validateErrorMessage = 'request';
			return false;
		}
	}
	if(value){
		if(value.length > field.maxLength){
			field.validateError = true;
			field.validateErrorMessage = 'too long';
			return false;
		}else{
			field.validateError = false;
			field.validateErrorMessage = '';
		}
		if(value.length < field.minLength){
			field.validateError = true;
			field.validateErrorMessage = 'too short';
			return false;
		}else{
			field.validateError = false;
			field.validateErrorMessage = '';
		}
		if(field.validate){
			if(checkRegular(value, field.validate)){
				field.validateError = false;
				field.validateErrorMessage = '';
			}else{
				field.validateError = true;
				field.validateErrorMessage = 'validate error';
				return false;
			}
		}
	}
	return true;
}


function checkRegular(value, reguExpr){
    var rt = value.match(reguExpr);     
    if(rt == null){
       return false;    
    }
    return true;
}

 function isEmptyObject( obj ) {
	 for ( var name in obj ) {
		 return false;
	 }
	 return true;
 }

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];
