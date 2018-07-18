var account = function() {
	return {
		CheckName: function() {
			$("#nameMsg").removeClass().html("");
			var a = $.trim($("#name").val());
			if (a.length < 2) {
				$("#nameMsg").addClass("Wrong").html("\u9519\u8bef")
				return false
			} else {
				if (a.length > 15) {
					$("#nameMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u59d3\u540d")
					return false
				} else {
					$("#nameMsg").addClass("Right").html("\u6b63\u786e");
					return true
				}
			}
		},
		CheckQQ: function() {
			$("#qqMsg").removeClass().html("");
			var a = $.trim($("#qq").val());
			if (a.length >= 5 && a.length<14 && checkNumber(a)) {
				$("#qqMsg").addClass("Right").html("\u6b63\u786e");
				return true
			} else {
				$("#qqMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u6b63\u786e\u7684QQ\u53f7\u7801")
				return false
			}
		},
		CheckMobile: function() {
			$("#mobileMsg").removeClass().html("");
			var a = $.trim($("#mobile").val());
			if (checkMobile(a)) {
				$("#mobileMsg").addClass("Right").html("\u6b63\u786e");
				return true
			} else {
				$("#mobileMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801")
				return false
			}
		},
		CheckPhone: function() {
			$("#phoneMsg").removeClass().html("");
			var a = $.trim($("#telephone").val());
			if (checkTelNum(a)||a=="") {
				$("#phoneMsg").addClass("Right").html("\u6b63\u786e");
				return true
			} else {
					$("#phoneMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u7535\u8bdd\u53f7\u7801")
					return false
				}
		},
		CheckCompany: function() {
			$("#companyMsg").removeClass().html("");
			var a = $.trim($("#company").val());
//			if (a == "") {
//				$("#companyMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u516c\u53f8\u540d\u79f0");
//				return false
//			} else {
				$("#companyMsg").addClass("Right").html("\u6b63\u786e");
				return true
//			}
		},
		CheckAddress: function() {
			$("#addressMsg").removeClass().html("");
			var a = $.trim($("#address").val());
			if (a == "") {
				$("#addressMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u8054\u7cfb\u5730\u5740");
				return false
			} else {
				$("#addressMsg").addClass("Right").html("\u6b63\u786e");
				return true
			}
		},
		CheckPost: function() {
			$("#postMsg").removeClass().html("");
			var a = $.trim($("#zipcode").val());
			if (a.length == 6 && checkNumber(a)) {
				$("#postMsg").addClass("Right").html("\u6b63\u786e");
				return true
			} else {
				$("#postMsg").addClass("Wrong").html("\u8bf7\u8f93\u5165\u6b63\u786e\u90ae\u7f16");
				return false
			}
		},
		validateAll: function() {
			if( this.CheckName() && this.CheckMobile() && this.CheckQQ() && this.CheckAddress() && this.CheckPost()&& this.CheckPhone()){
				return true
			}else{
				return false
			}
		}
	}
}();

function CheckOld() {
	$("#oldMsg").removeClass();
	$("#oldMsg").html("");
	var a = $.trim($("#oldPassword").val());
	if (a.length >= 4) {
		$("#oldMsg").addClass("Right");
		$("#oldMsg").html("&nbsp;");
		return true
	} else {
		$("#oldMsg").addClass("Wrong");
		$("#oldMsg").html("\u8bf7\u586b\u5199\u539f\u59cb\u5bc6\u7801");
		return false
	}
}

function CheckPsw() {
	$("#pswMsg").removeClass();
	$("#pswMsg").html("");
	var a = $.trim($("#password").val());
	if (a.length >= 4) {
		$("#pswMsg").addClass("Right");
		$("#pswMsg").html("&nbsp;");
		return true
	} else {
		$("#pswMsg").addClass("Wrong");
		$("#pswMsg").html("\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c11\u4e8e6\u4e2a\u5b57\u7b26");
		return false
	}
}

function CheckRepsw() {
	$("#repswMsg").removeClass();
	$("#repswMsg").html("");
	var a = $.trim($("#password").val());
	var b = $.trim($("#repsw").val());
	if (b.length == 0) {
		$("#repswMsg").addClass("Wrong");
		$("#repswMsg").html("\u8bf7\u518d\u6b21\u586b\u5199\u5bc6\u7801");
		return false
	} else {
		if (a == b) {
			$("#repswMsg").addClass("Right");
			$("#repswMsg").html("&nbsp;");
			return true
		} else {
			$("#repswMsg").addClass("Wrong");
			$("#repswMsg").html("\u4e0e\u91cd\u590d\u5bc6\u7801\u4e0d\u4e00\u81f4");
			return false
		}
	}
}

function validateAll() {
	if (CheckOld() && CheckPsw() && CheckRepsw()) {
		return true
	} else {
		return false
	}
};