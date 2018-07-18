$(document).ready(function(){
//  if(!Broswer.chrome){
//		jAlert("建议使用谷歌浏览器访问.",'提示');
//      alert("建议使用谷歌浏览器访问.");
//  }
    var name = $.cookie('name');
    if(name){
        $("#account").val(name);
    }
    $(document).keydown(function(event){
    	if (event.keyCode==13) 
    		$(".loginBtn").click();
    });
})
function loginMain(){
		var account = $("#account").val();
		var password = $("#password").val();
		if('' == account){
			error("请输入帐号");
			$("#account").focus();
			return false;
		}
		if(/[^@]+@[^@]+/.test(account) == false){
			error("请输入正确的邮箱地址");
			$("#account").focus();
			return false;
		}
		if('' == password){
			error("请输入密码");
			$("#password").focus();
			return false;
		}
		var jsonData = JSON.stringify({"username":account,"password":password});
		var rt = false;
		$.ajax({
		        type: "POST",
	            url: host + "/system/login",
	            contentType: "application/json;charset=UTF-8",
	            data: jsonData,
	            dataType: "json",
	            success: function (json) { 
				rt = true;
				$.cookie('name', json.user,{path: '/'});
				$.cookie('token', json.access_token, {expires: json.expires_in,path: '/'});
//				$.cookie('token', json.access_token, {expires: json.expires_in});
				window.location="html/list.html";
			},
			   error: function (err) {
        	    if(err.readyState!=4){
        	        error("连接服务器异常.");
        	        return;
        	    }
				var errmsg = err.responseText.replace(/\\\"/g, ""); 
				var msg = $.parseJSON(errmsg);
				if(msg.error == "Username or password error."){
				    error("用户名或密码错误");
				}else{
				    error("用户不存在");
				}
			}
		});
		if(rt == false){
			return false;
		}
	
};

$(".loginBtn").click(function(){
   loginMain();
});

function error(msg){
	jAlert(msg,'提示');
    //alert(msg);
}