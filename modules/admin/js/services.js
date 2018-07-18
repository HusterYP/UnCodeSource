'use strict';

/* Services */

var services = angular.module('fastserAdminServices', ['ngResource']);

var basePath = "http://127.0.0.1\:8181/";		//测试路径
//var basePath = "http://rest.uncode.cn/";  		//线上路径
//文件上传服务器
var uploadPath = "";

function inString(str,search){
		if(_.isArray(search)){
			for(var i=0;i<search.length;i++){
				if(str.indexOf(search[i])>=0)
					return true;
			}
			return false;
		} else {
			if(str.indexOf(search)>=0)
				return true;
			else	
				return false;
		}
};

services.factory('ListService', ['$http', function($http) {
	var target = {};
	target.get = function(url){
		return $http.jsonp(basePath + url);
	}
	return target;
}]);


services.factory('sessionService',function(){	//session服务
	return {
		get:function(key){
			return sessionStorage.getItem(key);
		},
		set:function(key,val){
			return sessionStorage.setItem(key,val);
		},
		unset:function(key){
			return sessionStorage.removeItem(key);
		},
		clear:function(){
			return sessionStorage.clear();
		}
	};
});

services.factory('authenticationService',['$http','$location','$routeParams','sessionService',function($http,$location,$routeParams,sessionService){		//与后台api交互，进行认证服务
	var cacheSession = function() {
		sessionService.set('authenticated',true);
		if($routeParams.name){
			sessionService.set('application',$routeParams.name);
		}else{
			sessionService.set('application',"system");
		}
	};
	var uncacheSession = function() {
		sessionService.clear();
	};
	var loginError = function(data,status) {
		if(status!=400){
			alert("服务器连接异常.");
        	return;
        }
		if(data.error == "Username or password error."){
			alert("用户名或密码错误");
		}else{
			alert("用户不存在");
		}
	};
	return {
		login: function(credentials) {
			$('#shclCcw').shCircleLoader({clockwise: false,color:"#84af00"});
			$('.loaderBg').show();
			if($routeParams.name == undefined){
				var login = $http.post(basePath+'system/login',credentials);	//请求api登录验证launcher
			} else {
				var login = $http.post(basePath+ $routeParams.name +'/login',credentials);	//e.q:/launcher
			}			
			login.success(function(){
				cacheSession();
			});
			login.error(function(data,status){
				$('#shclCcw').hide();
				$('.loaderBg').hide();
				loginError(data,status);
			});
			return login;
		},
		logout: function() {
			uncacheSession();
		},
		isLoggedIn: function() {
			return sessionService.get('authenticated');
		}
	};
}]);


services.factory('permissions',['$rootScope','$routeParams','sessionService',function($rootScope,$routeParams,sessionService){		//权限管理服务
	return {
		set:function(target,permissions) {
			sessionService.set(target,permissions);
			//$rootScope.$broadcast('permissionsChanged');
		},
		hasPermission:function(permission) {
			var userPermission = JSON.parse(sessionService.get('userPermissions'));
			var tables = JSON.parse(sessionService.get('tables'));
			var tableInfos = _.findWhere(tables,{name:$routeParams.model});		//当前表的信息
			if(tableInfos && tableInfos.tableAcl)
				var tablePermissions = tableInfos.tableAcl;		//当前表的权限信息
			else
				var tablePermissions = null;
//			var tablePermissions;
//			if($routeParams.model=='restfield'){
//				tablePermissions = {
//					"write":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"user2"},
//					"read":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"},
//					"insert":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"user2"},
//					"update":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"},
//					"remove":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"}
//				};	
//			} else{
//				tablePermissions = {
//					"write":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"user2"},
//					"read":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"},
//					"insert":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"},
//					"update":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"user2"},
//					"remove":{"group":"MANAGER,WORKER","role":"ROLE1,ROLE2","user":"ywj@xiaocong.tv,user2"}
//				};
//			}
			if(tablePermissions == null){
				return true;
			} else {
				if(_.isString(tablePermissions)){
					tablePermissions = JSON.parse(tablePermissions);
				}
				if(inString(tablePermissions.write.group,userPermission.group)||inString(tablePermissions.write.role,userPermission.role)||inString(tablePermissions.write.user,userPermission.user)){
					return true;
				} else {
					if(inString(tablePermissions[permission].group,userPermission.group)||inString(tablePermissions[permission].role,userPermission.role)||inString(tablePermissions[permission].user,userPermission.user))
						return true;
					else
						return false;
				}
			}
		}
	};
}]);






