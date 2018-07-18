var Common = {};
Common.AddEvent = function(e, d, c) {
	e.attachEvent ? e.attachEvent("on" + d, function() {
		c.call(e)
	}) : e.addEventListener(d, c, false)
};
Common.Select = {
	Clear: function(a) {
		a.options.length = 0
	},
	Add: function(c, a, b) {
		c.options.add(new Option(b, a))
	},
	Text: function(a) {
		return a.options[a.selectedIndex].text
	},
	Value: function(a) {
		return a.options[a.selectedIndex].value
	}
};
Common.GetFileInfo = {
	FileName: function(a) {
		return a.empty() ? "" : a.match(/([^\/]+)\.\w+$/)[1]
	},
	FullName: function(a) {
		return a.empty() ? "" : a.match(/([^\/]+)\.\w+$/)[0]
	}
};

function getElem(a) {
	return document.getElementById(a)
}

function getElemValue(a) {
	return document.getElementById(a).value
}
Common.XmlAttr = function(f, b) {
	try {
		var c = f.selectSingleNode(b);
		if (c != null && c.nodeType == 1) {
			var d = c.text || c.textContent;
			return d = d == undefined ? "" : d
		} else {
			return f.getAttribute(b)
		}
	} catch (g) {
		return ""
	}
};
Common.Selected = function(a) {
	if (document.getElementById("ulMenu")) {
		document.getElementById("ulMenu").className = "menulist " + a
	}
};

function checkIsEmpty(a) {
	if (a != null) {
		if (document.getElementById(a).value.trim() == "") {
			return false
		}
		return true
	}
}

function checkTextLength(b, a) {
	if (b != null) {
		if (document.getElementById(b).value.trim().length > a) {
			return false
		}
		return true
	}
}

function trim(a) {
	return a.replace(/(^\s*)|(\s*$)/g, "")
}

function ltrim(a) {
	return a.replace(/(^\s*)/g, "")
}

function rtrim(a) {
	return a.replace(/(\s*$)/g, "")
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "")
};
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "")
};
String.prototype.empty = function() {
	return this.trim() == ""
};
String.prototype.number = function() {
	return /^[+-]?\d+(\.\d+)?$/.test(this)
};
String.prototype.pic = function() {
	return /^.+.(gif|jpg|jpeg|png|bmp)$/i.test(this)
};
String.prototype.truncated = function(a) {
	var b = this.trim();
	return b.length > a ? b.substring(0, a) : b
};
String.prototype.confirm = function(a) {
	return this.trim() == a.trim()
};
String.prototype.format = function() {
	var a = arguments;
	return this.replace(/\{(\d+)\}/g, function(b, c) {
		return a[c]
	})
};

function checkIsDecimal(c, a) {
	c = new String(c);
	if (c.match(/^\d*\.?\d{0,2}$/) == null) {
		return false
	}
	var b = c.split(".");
	if (b.length == 1) {
		if (b[0].trim().length < 1) {
			return false
		}
	} else {
		if (b.length == 2) {
			if (b[0].trim().length < 1 || b[1].length != a) {
				return false
			}
		} else {
			return false
		}
	}
	return true
}

function CheckIsMoney(b) {
	if (b == 0) {
		return false
	}
	var a = new RegExp(/^\d*\.?\d{0,2}$/);
	if (!a.test(b)) {
		return false
	}
	if (Number(b) < 0.01) {
		return false
	}
	return true
}

function checkIsNumberic(a) {
	a = new String(a);
	if (a.match(/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/g) == null) {
		return false
	}
	return true
}

function checkIsCharAndNum(b) {
	var a = /^([A-Z]|[^u4E00-u9FA5]|[a-z]|[\d])*$/g;
	if (a.exec(b) == null) {
		return false
	}
	return true
}

function checkNumber(c) {
	var b = c.trim();
	var a = /[^0-9]/g;
	if (a.exec(b) == null) {
		return true
	}
	return false
}

function checkPlusNumber(c) {
	var b = c.trim();
	var a = /^[1-9]\d*$/;
	if (a.exec(b) == null) {
		return false
	}
	return true
}

function checkLetter(c) {
	var b = c.trim();
	var a = /[^A-Za-z]/g;
	if (a.exec(b) == null) {
		return true
	}
	return false
}

function checkChinese(c) {
	var b = c.trim();
	var a = /[^\u4E00-\u9FA5]/g;
	if (a.exec(b) == null) {
		return true
	}
	return false
}

function IsURL(c) {
	var b = c.trim();
	r = false;
	var a = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	if (a.exec(b) == null) {
		r = false
	} else {
		r = true
	}
	return r
}

function checkEmail(c) {
	var b = false;
	var a = /^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if (a.exec(c) == null) {
		b = false
	} else {
		b = true
	}
	return b
}

function checkZipCode(c) {
	var b = false;
	var a = /^[0-9]{6}$/;
	if (a.exec(c) == null) {
		b = false
	} else {
		b = true
	}
	return b
}

function checkMobile(f) {
	if (f == "") {
		return false
	}
	var e = f;
	if (f.trim() == "") {
		return false
	}
	var d = false;
	var g = /^(130|131|132|133|134|135|136|137|138|139|158|159)\d{8}$/;
	var c = /^(0130|0131|0132|0133|0134|0135|0136|0137|0138|0139|0158|0159)\d{8}$/;
	var b = /^(13|15|18)\d{9}$/;
	var a = /^(013|015|018)\d{9}$/;
	if (e.length == 12) {
		if (a.exec(e) == null) {
			d = false
		} else {
			d = true
		}
	}
	if (e.length == 11) {
		if (b.exec(e) == null) {
			d = false
		} else {
			d = true
		}
	}
	return d
}

function checkTelNum(g) {
	if (g == "") {
		return false
	}
	var f = false;
	var c = /^[0-9]{7,8}$/;
	var e = /^[0-9]{3,4}[-]{1}[0-9]{7,8}[-]{1}[0-9]{2,4}$/;
	var d = /^[0-9]{3,4}[-]{1}[0-9]{7,8}$/;
	var b = /^[0-9]{7,8}[-]{1}[0-9]{2,4}$/;
	var a = /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
	var h = /^[48]00[-]{1}\d{3}[-]{1}\d{4}$/;
	if (c.exec(g) == null && e.exec(g) == null && d.exec(g) == null && b.exec(g) == null && a.exec(g) == null && h.exec(g) == null) {
		f = false
	} else {
		f = true
	}
	return f
}

function checkIDNO(d) {
	var f = new Array("验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
	var e = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外"
	};
	var d, g, b;
	var c, h;
	var a = new Array();
	a = d.split("");
	if (e[parseInt(d.substr(0, 2))] == null) {
		return f[4]
	}
	switch (d.length) {
		case 15:
			if ((parseInt(d.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(d.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(d.substr(6, 2)) + 1900) % 4 == 0)) {
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/
			} else {
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/
			} if (ereg.test(d)) {
				return f[0]
			} else {
				return f[2]
			}
			break;
		case 18:
			if (parseInt(d.substr(6, 4)) % 4 == 0 || (parseInt(d.substr(6, 4)) % 100 == 0 && parseInt(d.substr(6, 4)) % 4 == 0)) {
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
			} else {
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
			} if (ereg.test(d)) {
				c = (parseInt(a[0]) + parseInt(a[10])) * 7 + (parseInt(a[1]) + parseInt(a[11])) * 9 + (parseInt(a[2]) + parseInt(a[12])) * 10 + (parseInt(a[3]) + parseInt(a[13])) * 5 + (parseInt(a[4]) + parseInt(a[14])) * 8 + (parseInt(a[5]) + parseInt(a[15])) * 4 + (parseInt(a[6]) + parseInt(a[16])) * 2 + parseInt(a[7]) * 1 + parseInt(a[8]) * 6 + parseInt(a[9]) * 3;
				g = c % 11;
				h = "F";
				b = "10X98765432";
				h = b.substr(g, 1);
				if (h == a[17]) {
					return f[0]
				} else {
					return f[3]
				}
			} else {
				return f[2]
			}
			break;
		default:
			return f[1];
			break
	}
}

function checkHtml(c) {
	var b = c;
	var a = /[\<\>\<>\/>\<\/>]/g;
	if (a.exec(b) == null) {
		return true
	}
	return false
}

function getParasValue(b) {
	var d = window.location.search;
	if (d.indexOf(b) != -1) {
		var a = d.indexOf(b) + b.length + 1;
		var c = d.indexOf("&", a);
		if (c == -1) {
			return d.substring(a)
		} else {
			return d.substring(a, c)
		}
	} else {
		return ""
	}
}

function Encrypt(f, e) {
	if (f == "") {
		return ""
	}
	f = escape(f);
	if (!e || e == "") {
		var e = "1234"
	}
	e = escape(e);
	if (e == null || e.length <= 0) {
		alert("Please enter a password with which to encrypt the message.");
		return null
	}
	var m = "";
	for (var j = 0; j < e.length; j++) {
		m += e.charCodeAt(j).toString()
	}
	var g = Math.floor(m.length / 5);
	var b = parseInt(m.charAt(g) + m.charAt(g * 2) + m.charAt(g * 3) + m.charAt(g * 4) + m.charAt(g * 5));
	var a = Math.ceil(e.length / 2);
	var h = Math.pow(2, 31) - 1;
	if (b < 2) {
		alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
		return null
	}
	var c = Math.round(Math.random() * 1000000000) % 100000000;
	m += c;
	while (m.length > 10) {
		m = (parseInt(m.substring(0, 10)) + parseInt(m.substring(10, m.length))).toString()
	}
	m = (b * m + a) % h;
	var d = "";
	var l = "";
	for (var j = 0; j < f.length; j++) {
		d = parseInt(f.charCodeAt(j) ^ Math.floor((m / h) * 255));
		if (d < 16) {
			l += "0" + d.toString(16)
		} else {
			l += d.toString(16)
		}
		m = (b * m + a) % h
	}
	c = c.toString(16);
	while (c.length < 8) {
		c = "0" + c
	}
	l += c;
	return l
}

function Decrypt(f, e) {
	if (f == "") {
		return ""
	}
	if (!e || e == "") {
		var e = "1234"
	}
	e = escape(e);
	if (f == null || f.length < 8) {
		alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
		return
	}
	if (e == null || e.length <= 0) {
		alert("Please enter a password with which to decrypt the message.");
		return
	}
	var m = "";
	for (var j = 0; j < e.length; j++) {
		m += e.charCodeAt(j).toString()
	}
	var g = Math.floor(m.length / 5);
	var b = parseInt(m.charAt(g) + m.charAt(g * 2) + m.charAt(g * 3) + m.charAt(g * 4) + m.charAt(g * 5));
	var a = Math.round(e.length / 2);
	var h = Math.pow(2, 31) - 1;
	var c = parseInt(f.substring(f.length - 8, f.length), 16);
	f = f.substring(0, f.length - 8);
	m += c;
	while (m.length > 10) {
		m = (parseInt(m.substring(0, 10)) + parseInt(m.substring(10, m.length))).toString()
	}
	m = (b * m + a) % h;
	var d = "";
	var l = "";
	for (var j = 0; j < f.length; j += 2) {
		d = parseInt(parseInt(f.substring(j, j + 2), 16) ^ Math.floor((m / h) * 255));
		l += String.fromCharCode(d);
		m = (b * m + a) % h
	}
	return unescape(l)
}

function cutString(b, a) {
	var c = "";
	if (b != "") {
		if (b.length > a) {
			c = b.substring(0, a) + "..."
		} else {
			c = b
		}
	}
	return c
}

function AddFavorite(b, a) {
	try {
		window.external.addFavorite(b, a)
	} catch (c) {
		try {
			window.sidebar.addPanel(a, b, "")
		} catch (c) {
			alert("加入收藏失败，请使用Ctrl+D进行添加")
		}
	}
}

function SetHome(c, d) {
	try {
		c.style.behavior = "url(#default#homepage)";
		c.setHomePage(d)
	} catch (b) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
			} catch (b) {
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为’true’")
			}
			var a = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			a.setCharPref("browser.startup.homepage", d)
		}
	}
}

function checkStyle(a) {
	if (a == 0) {
		document.getElementById("divDefault").style.display = "block";
		document.getElementById("divDetails").style.display = "none";
		document.getElementById("wd").innerHTML = '<span title="ntalker支持" id="wdk_user_' + AccessNsid + '" class="wdk_user_status_span" style="padding-left: 1px; margin-top: 3px; display: block;"> <a alt="跟我聊天" style="padding: 0px; overflow: visible; display: inline;" href="message.shtml"><img border="0" src="http://common.jxnsid.com/Message/tip04no.gif" id="wdk_presence_' + AccessNsid + '" style="display: inline; left: 0px; top: 0px;" name="wdk_presence_image" /></a></span>';
		document.getElementById("wp").innerHTML = ""
	} else {
		document.getElementById("divDefault").style.display = "none";
		document.getElementById("divDetails").style.display = "block";
		document.getElementById("wd").innerHTML = "";
		document.getElementById("wp").innerHTML = '<span title="ntalker支持" id="wdk_user_' + AccessNsid + '" class="wdk_user_status_span" style="padding-left: 1px; margin-top: 3px; display: block;"> <a alt="跟我聊天" style="padding: 0px; overflow: visible; display: inline;" href="message.shtml"><img border="0" src="http://common.jxnsid.com/Message/tip04no.gif" id="wdk_presence_' + AccessNsid + '" style="display: inline; left: 0px; top: 0px;" name="wdk_presence_image" /></a></span>';
		for (var b = 1; b <= 5; b++) {
			if (b == a) {
				document.getElementById("a" + b).className = "e"
			} else {
				document.getElementById("a" + b).className = ""
			}
		}
	}
}

function setCookie(b, h) {
	var c = new Date();
	var g = setCookie.arguments;
	var e = setCookie.arguments.length;
	var d = (e > 2) ? g[2] : null;
	var j = (e > 3) ? g[3] : null;
	var f = (e > 4) ? g[4] : null;
	var a = (e > 5) ? g[5] : false;
	if (d != null) {
		c.setTime(c.getTime() + (d * 1000))
	}
	document.cookie = b + "=" + escape(h) + ((d == null) ? "" : ("; expires=" + c.toGMTString())) + ((j == null) ? "" : ("; path=" + j)) + ((f == null) ? "" : ("; domain=" + f)) + ((a == true) ? "; secure" : "")
}

function getCookieVal(b) {
	var a = document.cookie.indexOf(";", b);
	if (a == -1) {
		a = document.cookie.length
	}
	return unescape(document.cookie.substring(b, a))
}

function getCookie(d) {
	var b = d + "=";
	var f = b.length;
	var a = document.cookie.length;
	var e = 0;
	while (e < a) {
		var c = e + f;
		if (document.cookie.substring(e, c) == b) {
			return getCookieVal(c)
		}
		e = document.cookie.indexOf(" ", e) + 1;
		if (e == 0) {
			break
		}
	}
	return null
}

function delCookie(a) {
	var c = new Date();
	c.setTime(c.getTime() - 1);
	var b = getCookie(a);
	document.cookie = a + "=" + b + "; expires=" + c.toGMTString()
}

function ReplyOnblur() {
	var a = document.getElementById("txtMessage");
	if (a.value == "发表意见请在此对话框中输入，最多可输入500字") {
		a.value = ""
	}
}

function getCount() {
	var a = document.getElementById("count");
	if (a != undefined && a != null) {
		var d = document.getElementById("txtMessage");
		var b = (500 - d.value.length);
		a.innerHTML = b;
		if (b < 0) {
			alert("输入内容过多");
			return false
		}
	}
}

function SetFat(g, b, f, e) {
	var a = document.getElementById(g);
	var d = a.getElementsByTagName("a");
	for (i = 0; i < d.length; i++) {
		d[i].className = f;
		if (d[i] == e) {
			e.className = b
		}
	}
}

function SetHeights() {
	var b = "MainLeft";
	var a = "MainRight";
	if (arguments.length > 0) {
		if (arguments[0]) {
			b = arguments[0]
		}
		if (arguments[1]) {
			a = arguments[1]
		}
	}
	window.setInterval(function() {
		var d = document.getElementById(b);
		var f = document.getElementById(a);
		if (d != null && d != undefined && d != "undefined" && f != null && f != undefined & f != "undefined") {
			d.style.height = "";
			f.style.height = "";
			var c = d.offsetHeight;
			var e = f.offsetHeight;
			if (c > e) {
				f.style.height = "" + (c - 20) + "px"
			} else {
				d.style.height = "" + e + "px"
			}
		}
	}, 400)
}
var Menus = {
	c: null,
	t: null,
	cl: null,
	s: "",
	Init: function(b, l, a) {
		Menus.c = b;
		Menus.t = l;
		Menus.cl = a;
		var c = 0;
		var f = document.getElementsByTagName("ul");
		var g = null;
		for (var d = 0; d < f.length; d++) {
			if (f[d].className == "newscategory") {
				g = f[d]
			}
		}
		containid = b;
		var e = document.getElementById(containid) || g;
		Menus.con = e;
		if (e) {
			var h = e.getElementsByTagName(l);
			for (var d = 0; d < h.length; d++) {
				h[d].onclick = function() {
					for (k = 0; k < h.length; k++) {
						if (h[k] == this) {
							document.cookie = b + "=" + k + "; path=/"
						}
					}
				}
			}
		}
		Common.AddEvent(window, "load", Menus.GetIndex)
	},
	Load: function(d, b, f) {
		Menus.c = d;
		Menus.t = b;
		Menus.cl = f;
		containid = d;
		var e = document.getElementById(containid);
		Menus.con = e;
		if (e) {
			var a = e.getElementsByTagName(b);
			for (var c = 0; c < a.length; c++) {
				a[c].onclick = function() {
					for (k = 0; k < a.length; k++) {
						if (a[k] == this) {
							document.cookie = d + "=" + k + "; path=/"
						}
					}
				}
			}
		}
		Common.AddEvent(window, "load", Menus.GetIndex)
	},
	GetIndex: function() {
		if (document.cookie) {
			var e = document.cookie.split(";");
			for (i = 0; i < e.length; i++) {
				var g = e[i].split("=");
				if (g[0].toString().trim() == (Menus.c)) {
					var c = g[1];
					var f = Menus.con;
					if (f) {
						var b = f.getElementsByTagName(Menus.t);
						for (var a = 0; a < b.length; a++) {
							if (a != c) {
								b[a].className = ""
							}
						}
						if (b[c]) {
							b[c].className = Menus.cl
						}
					}
				}
			}
		}
	}
};
Common.GetUserFace = function(c, b, a) {
	if (c != "" && c != null && a) {
		return c.replace("Org", a)
	}
	switch (b) {
		case "0":
			c = "http://common.jxnsid.com/common/defaultface/member_m110X110.jpg";
			break;
		case "1":
			c = "http://common.jxnsid.com/common/defaultface/party146X146.gif";
			break;
		case "2":
			c = "http://common.jxnsid.com/common/defaultface/Ent86X47.jpg";
			break;
		case "3":
			c = "http://common.jxnsid.com/common/defaultface/Org110X110.gif";
			break;
		default:
			c = "http://common.jxnsid.com/common/defaultface/party146X146.gif";
			break
	}
	return c
};

function ClearContent() {
	var a = ["发表意见请在些对话框中输入，最多可输入500字!"];
	var b = document.getElementById("txtMessage") || document.getElementById("txtContent");
	if (KE) {
		if (a.join("|").indexOf(KE.util.getData("txtMessage")) != -1) {
			KE.util.setFullHtml("txtMessage", "")
		}
	} else {
		if (a.join("|").indexOf(b.value) != -1) {
			b.value = ""
		}
	}
}

function CheckAll(b, e) {
	var a = document.getElementById(b);
	var d = a.getElementsByTagName("input");
	for (var c = 0; c < d.length; c++) {
		if (d[c].type == "checkbox") {
			if (e) {
				d[c].checked = e.checked
			} else {
				d[c].checked = true
			}
		}
	}
}

function CancleAll(b, e) {
	var a = document.getElementById(b);
	var d = a.getElementsByTagName("input");
	for (var c = 0; c < d.length; c++) {
		if (d[c].type == "checkbox") {
			if (e) {
				d[c].checked = e.checked
			} else {
				d[c].checked = false
			}
		}
	}
}

function GetQueryString(a) {
	var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)");
	var c = window.location.search.substr(1).match(b);
	if (c != null) {
		return unescape(c[2])
	}
	return null
}

function getByteLen(c) {
	var a = c.length;
	var d = a;
	for (var b = 0; b < a; b++) {
		if (c.charCodeAt(b) < 0 || c.charCodeAt(b) > 255) {
			d++
		}
	}
	return d
}

function getByteVal(e, a) {
	var d = "";
	var b = 0;
	for (var c = 0; c < e.length; c++) {
		if (e[c].match(/[^\x00-\xff]/ig) != null) {
			b += 2
		} else {
			b += 1
		} if (b > a) {
			break
		}
		d += e[c]
	}
	return d
};