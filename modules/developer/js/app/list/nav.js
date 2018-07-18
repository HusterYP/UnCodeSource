$("#logodiv").click(function() {
	window.location = "http://www.uncode.cn";
});

// 顶部 退出
$(".tc").click(logout);

function logout() {
		$.ajax({
			type: "GET",
			url: host + "/" + $.cookie("token") + "/logout",
			success: function() {

				$.cookie('token', null, {
					expires: -1,
					path: '/'
				});
				window.location = loginUrl;
			},
			error: function() {
				$.cookie('token', null, {
					expires: -1,
					path: '/'
				});
				// window.location="../login.html";
			}
		});

	}
	//顶部 应用面板
$(".yymb").click(showPanel);

function showPanel() {
	$("#appDetail").hide();
	$("#appListDiv").show();
}

//详情页 导航
$(".yymblb>a").click(function() {
	if (!this.id) {
		return;
	}
	var handle = this.id.split("_")[0];
	// 导航栏改变
	$(".yymblb>a").removeClass("on");
	$(this).addClass("on");
	//右侧 内容改变
	$(".yymbbg>div").hide();
	$("#" + handle).show();

});
//顶部 账户管理

$(".zhgl").click(zhgl());

function zhgl() {
	zhxx();
	var username = $.cookie("name");
	$("#userName").html($.cookie("name"));
	$.ajax({
		type: "get",
		url: host + "/system/user?username=" + username,
		dataType: "json",
		success: function(info) {
			//console.log(info)
			$("#email").val(info.username);
			$("#name").val(info.name);
			$("#mobile").val(info.mobile);
			$("#telephone").val(info.telephone);
			$("#qq").val(info.qq);
			$("#address").val(info.address);
			$("#zipcode").val(info.zipcode);
			$("#company").val(info.company);
		},
		error: function(err) {
			if (err.readyState != 4) {
				error("连接服务器异常.");
				return;
			}
			var errmsg = err.responseText.replace(/\\\"/g, "");
			var msg = $.parseJSON(errmsg);
			if (msg.error == "Username or password error.") {
				error("用户名或密码错误");
			} else {
				error("用户不存在");
			}
		}
	});
};
//账户信息修改
var zhCommit = function() {
		var flag = account.validateAll();
		if (flag) {
			$("#user-form").submit(function() {
				var data = {
					//					id:info.id,
					username: $.cookie("name"),
					name: $("#name").val(),
					mobile: $("#mobile").val(),
					telephone: $("#telephone").val(),
					qq: $("#qq").val(),
					address: $("#address").val(),
					zipcode: $("#zipcode").val(),
					company: $("#company").val()
				};
				data = JSON.stringify(data);
				$.ajax({
					type: "post",
					url: host + "/system/user",
					contentType: "application/json;charset=UTF-8",
					dataType: "json",
					data: data,
					success: function() {
						$("#zhxx").append("<div id=\"msg\" class=\"bannertips bannertips_succ\">保存成功！</div>")
						resetzh();
					}
				});
				return false;
			});
		} else {
			return false;
		}
	}
	//修改密码
var mmCommit = function() {
	var flag = validateAll();
	if (flag) {
		$("#psw-form").submit(function() {
			var data = {
				username: $.cookie("name"),
				oldPassword: $("#oldPassword").val(),
				password: $("#password").val()
			};
			data = JSON.stringify(data);
			$.ajax({
				type: "post",
				url: host + "/system/resetpass",
				contentType: "application/json;charset=UTF-8",
				dataType: "json",
				data: data,
				success: function() {
					$("#xgmm").append("<div id=\"msg\" class=\"bannertips bannertips_error\">密码修改成功！</div>")
					resetmm();
				},
				error: function() {
					$("#xgmm").append("<div id=\"msg\" class=\"bannertips bannertips_error\">原始密码不正确！</div>")
					resetmm();
				}
			});
			return false;
		});
	} else {
		return false;
	}
}
function resetzh(){
	$("#nameMsg").remove();
	$("#mobileMsg").remove();
	$("#phoneMsg").remove();
	$("#qqMsg").remove();
	$("#postMsg").remove();
	$("#companyMsg").remove();
	$("#addressMsg").remove();
}
function resetmm(){
	$("#password").val("");
	$("#oldPassword").val("");
	$("#repsw").val("");
	$("#oldMsg").remove();
	$("#repswMsg").remove();
	$("#pswMsg").remove();
}
function zhxx() {
	$(".zhxx").show();
	$(".xgmm").hide();
	$("#a_zhxx").addClass("on");
	$("#a_xgmm").removeClass("on");
}

function xgmm() {
	$(".xgmm").show();
	$(".zhxx").hide();
	$("#oldPassword").val("");
	$("#userName").val($.cookie("name"));
	$("#a_zhxx").removeClass("on");
	$("#a_xgmm").addClass("on");
}
$(function() {});