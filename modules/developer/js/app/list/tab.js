
var roleCollView;//Role显示，以及增删改
var userCollView;//展示用户
//var restsetModelView;//用以用户表设置
//var groupList;
var roleList;
var userList;
var restsetList;
$(function() {
	 //req.url+="?"+parameurl;
	
	$("#tab_side ul li a").unbind().click(function() {
		$(".side_content_main").hide();
		$("#tab_side ul li a").removeClass("active");
		$(this).addClass("active");
		var f = $(this).data("targetid");
		if(f=="rest_group"){
	        $("#rest_group_table").html("");
	        $("#rest_group_table").append('<tr><th class="rest_tab_table_th">name</th><th class="rest_tab_table_th2">详情</th><th class="rest_tab_table_th3">操作</th></tr>');
			var GroupColl = Backbone.Collection.extend({
					//url:host+"/"+bucketdate+"/restGroup/one",
					url:restServerCtx + "/system/restGroup/one",
					//url:restServerCtx + "/system/restGroup/one?bucket="+bucketdate,
			});
					groupList = new GroupColl();
				if(groupCollView){
	       			groupCollView.undelegateEvents();
	       	}
					groupCollView = new GroupCollView();
		}
		if(f=="rest_role"){
			$("#rest_role_table").html("");
        	$("#rest_role_table").append('<tr><th class="rest_tab_table_th">name</th><th class="rest_tab_table_th">详情</th><th class="rest_tab_table_th">操作</th></tr>');
				var RoleColl = Backbone.Collection.extend({
					//url:host+"/"+bucketdate+"/restRole/one",
					url:restServerCtx+"/system/restRole/one",
					//url:restServerCtx+"/system/restRole/one?bucket="+bucketdate,
			});
					roleList = new RoleColl();
				if(roleCollView){
		       		roleCollView.undelegateEvents();
		      	}
					roleCollView = new RoleCollView();
		}
		if(f=="rest_user"){
			$("#rest_user_table").html("");
	        $("#rest_user_table").append('<tr><th class="rest_tab_table_th">用户名</th><th class="rest_tab_table_th4">状态</th><th class="rest_tab_table_th">mobile</th><th class="rest_tab_table_th">操作</th></tr>');
		      var UserColl = Backbone.Collection.extend({
			  		//url:host+"/"+bucketdate+"/users",
		  		url:host+"/"+bucketdate+"/users",
			});
				userList = new UserColl();
		       if(userCollView){
	       			userCollView.undelegateEvents();
		       }
		        	userCollView = new UserCollView();
		}
		if(f=="rest_userCFG"){
		var RestsetColl = Backbone.Collection.extend({
		url:host+"/system/restUser/one",
	});
			restsetList = new RestsetColl();
				if(usersetCollView){
            		usersetCollView.undelegateEvents();
        }
        	var usersetCollView= new UsersetCollView();
		}
		$("#" + f).show();
		f="";
		$(".loaderBg").show();
		$('#shclDefault').shCircleLoader({color:"#fff"});
	});
});