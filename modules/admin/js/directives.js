'use strict';

/* Directives */
var directive = angular.module('fastserAdminDirectives', []);

//分页
directive.directive('paginate', function($timeout) {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            pages: '@paginatePages',
            currentPage: '=',
			data: '&'
        },
        template: '<div class="pagination-holder dark-theme">' + '</div>',
        controller: function($scope, $element, $attrs) {
            var halfDisplayed = 1.5,
                displayedPages = 3,
                edges = 2;
            $scope.getInterval = function() {
                return {
                    start: Math.ceil($scope.currentPage > halfDisplayed ? Math.max(Math.min($scope.currentPage - halfDisplayed, ($scope.pages - displayedPages)), 0) : 0),
                    end: Math.ceil($scope.currentPage > halfDisplayed ? Math.min($scope.currentPage + halfDisplayed, $scope.pages) : Math.min(displayedPages, $scope.pages))
                };
            }
            $scope.selectPage = function(pageIndex) {
                $scope.currentPage = pageIndex;
                $scope.draw();
                $scope.$apply();
				if($scope.data() && angular.isFunction($scope.data())){
					$scope.data()();
				}
            }
            $scope.appendItem = function(pageIndex, opts) {
                var options, link;

                pageIndex = pageIndex < 0 ? 0 : (pageIndex < $scope.pages ? pageIndex : $scope.pages - 1);

                options = $.extend({
                    text: pageIndex + 1,
                    classes: ''
                }, opts || {});

                if (pageIndex == $scope.currentPage) {
                    link = $('<span class="current">' + (options.text) + '</span>');
                } else {
                    link = $('<a href="javascript:void(0)" class="page-link">' + (options.text) + '</a>');
                    link.bind('click', function() {
                        $scope.selectPage(pageIndex);
                    });
                }

                if (options.classes) {
                    link.addClass(options.classes);
                }

                $element.append(link);
            }
            $scope.draw = function() {


                $($element).empty();
                var interval = $scope.getInterval(),
                    i;

                // Generate Prev link
                if (true) {
                    $scope.appendItem($scope.currentPage - 1, {
                        text: 'Prev',
                        classes: 'prev'
                    });
                }

                // Generate start edges
                if (interval.start > 0 && edges > 0) {
                    var end = Math.min(edges, interval.start);
                    for (i = 0; i < end; i++) {
                        $scope.appendItem(i);
                    }
                    if (edges < interval.start) {
                        $element.append('<span class="ellipse">...</span>');
                    }
                }

                // Generate interval links
                for (i = interval.start; i < interval.end; i++) {
                    $scope.appendItem(i);
                }

                // Generate end edges
                if (interval.end < $scope.pages && edges > 0) {
                    if ($scope.pages - edges > interval.end) {
                        $element.append('<span class="ellipse">...</span>');
                    }
                    var begin = Math.max($scope.pages - edges, interval.end);
                    for (i = begin; i < $scope.pages; i++) {
                        $scope.appendItem(i);
                    }
                }

                // Generate Next link
                if (true) {
                    $scope.appendItem($scope.currentPage + 1, {
                        text: 'Next',
                        classes: 'next'
                    });
                }
            }
        },
        link: function(scope, element, attrs, controller) {
            $timeout(function() {
                scope.draw();
            }, 2000);
scope.$watch(scope.paginatePages,function(){scope.draw();})
        }

    }
});

// 图片上传指令
directive.directive('uploader', function () {
	return {
		restrict: 'C',
		replace: true,
		template: '<div class="image-uploader">' + '</div>',
		scope: {
			path: '='
			//uploadNamespace: '@'
		},
		controller: function($scope, $element, $attrs) {			
			/*------------------------------------*\
				上传控件渲染
			\*------------------------------------*/
			$($element).empty();
			var imgs = "";
			if($scope.path == undefined){
				$scope.path = [];
			}
			for(var x in $scope.path) {
				var imgstr = '<img style="height:76px;width:76px" src="'  + $scope.path[x] + '" />';
				imgs += imgstr;
			}
			var img = $(imgs);
			img.click(function(){
				$(this).toggleClass("imgChecked");
				img.not($(this)).removeClass("imgChecked");
			});			
			//var img = $('<img style="height:76px;width:76px" src="' + uploadPath + "/" + $scope.path + '" />');
			var file = $('<br/><input type="file" id="uploadFile" style="width:150px"/>');
			var button = $('<button>上传</button>');
			var message = $('<span style="color:red"></span>');
			$element.append(img);
			$element.append(file);
			$element.append(button);
			$element.append(message);
			
			/*------------------------------------*\
				上传事件绑定
			\*------------------------------------*/
			button.bind('click', function() {
				var file = document.getElementById('uploadFile').files[0];
                var _u = new XCUPload({
					file: file,
					maxSize: 1024 * 1024,
		            //extFilters: ['.png', '.jpg'],
					onUploadError: function (msg) {
						message.html(msg);
					},
					onProgress: function (u, t) {
						var percent = (u / t) * 100;
						percent = parseFloat(percent).toFixed(2) + "%";
						message.html(percent);
					},
					onComplete: function (info) {
						if($(".uploader").find(".imgChecked").length==0){
							var addimg = '<img style="height:76px;width:76px" src="' + uploadPath + "/" + info.path + '" />';
							img.after(addimg);
							$scope.path.push(uploadPath +"/"+ info.path);
							$(".uploader").find("img").unbind().click(function(){
								$(this).toggleClass("imgChecked");
								$(".uploader").find("img").not($(this)).removeClass("imgChecked");
							});
						}else {
							$(".uploader").find(".imgChecked").attr("src", uploadPath +"/"+ info.path);
							$scope.path[$(".uploader").find(".imgChecked").index()] = uploadPath +"/"+ info.path;
						}						
						_u = null;
					}
				});
				_u.upload();
            });
		}
		
	}
});


//权限判断
directive.directive('hasPermission',['permissions',function(permissions){
	return {
		link: function(scope,element,attrs) {
			if(!_.isString(attrs.hasPermission))
				throw "hasPermission value must be a string";
			
			var value = attrs.hasPermission;
			var notPermissionFlag = value[0] === '!';
			if(notPermissionFlag) {
				value = value.slice(1);
			}
			
			function toggleBasedOnPermission() {
				var hasPermission = permissions.hasPermission(value);
				if((hasPermission && !notPermissionFlag)||(!hasPermission && notPermissionFlag))
					element.show();
				else
					element.hide();
			}
			toggleBasedOnPermission();
			//scope.$on('permissionsChanged',toggleBasedOnPermission);
		}
	};
}]);

//登录判断
directive.directive('islogin',['authenticationService',function(authenticationService){
	return function($scope,$element,$attrs){
		var value = $attrs.islogin;
		var notLogin = value[0] === "!";
		function toggleBasedOnLogin(){
			if((authenticationService.isLoggedIn() && !notLogin) || (!authenticationService.isLoggedIn() && notLogin)){
				$element.show();
			}else {
				$element.hide();
			}
				
		}
		toggleBasedOnLogin();
		$scope.$on('$routeChangeSuccess',toggleBasedOnLogin);
	}
}])

