var restServerCtx = host;

var RestAppListView;
var restAppListView;
var RestmethodAppView;
var restmethodAppView;
//var restsetModelView;
var dbType;
var restSettingView;
var secretKeyView;
var resAdminAppView;
var RestView;
var groupShowModelView;

var groupCollView;
var groupList;
var methodList; 
var bucketdate;
var currentMode;
var scriptEditor;
var currentMethod;
var timerCollection;
var methodViewArr=[];
var restmethodAppViewMap={};

var optionTypeArr = [ "GET", "POST", "PUT", "DELETE" ];
var statusArr = [ 1, 0 ];
var paramTypeMap = {
    1 : "任意参数",
    2 : "限定参数",
    3 : "无参"
};
var displayTypeMap = {
    1 : "TEXT",
    2 : "CURSTOM",
    3 : "MANY2ONE",
	5 : "IMAGE"
};
var searchTypeMap = {
    0 : "NULL",
    3 : "EQUAL",
    5 : "GREATER_THAN",
    6 : "GREATER_THAN_OR_EQUAL",
	7 : "LESS_THAN",
	8 : "LESS_THAN_OR_EQUAL",
	9 : "LIKE",
	11 : "IN",
};
var formTypeMap = {
	0 : "NULL",
    1 : "INPUT",
    2 : "SELECT",
    3 : "RADIO",
	5 : "UPLOAD"
};

var userName='';
var token='';
var tokenInUrl='';

var rest_sync =Backbone.sync;
Backbone.sync =function(method, model, options){
    //hearder 增加Access token
    var _beforeSend = options.beforeSend;
    options.beforeSend = function(xhr) {
        xhr.setRequestHeader("token", $.cookie('token'));
        if (_beforeSend)
            return _beforeSend.apply(this, arguments);
    };
    
    // 出错时检查 出错原因
    var _error = options.error;
    if(!_error){
        return rest_sync.apply(this, arguments);
    }
    options.error = function (resp) {
        var respJson = $.parseJSON(resp.responseText) ;
        if(!respJson){
        	jAlert("服务器链接错误,请重新登录再试.",'提示');
            return _error.apply(this, arguments);
            //window.location="../login.html";
        }
        if(respJson.code==4010){
        	jAlert("token过期 或者 没权限.",'提示');
            return _error.apply(this, arguments);
          //  window.location="../login.html";
        }
        if(respJson.code==4032){
        	jAlert("token过期,请重新登录.",'提示');
            window.location=loginUrl;
        }
        return _error.apply(this, arguments);
    };
    return rest_sync.apply(this, arguments);
};



$(function() {
    
    /**
     * 获取用户信息
     */
    userName = $.cookie("name");
    $("#userName").html(userName);
    $(".yymb").addClass("on");
    /**
     * 初始化页面
     */
    scriptEditor = ace.edit("editor");
    scriptEditor.setTheme("ace/theme/eclipse");
    scriptEditor.getSession().setMode("ace/mode/javascript");
    $("#new-code-dialog").dialog({
        title : '<span id="method_dialog_title">添加新的方法</span>',
        autoOpen : false,
        width : 500,
        height : 520,
        modal : true
    });
     $("#new-user-dialog").dialog({
        title : '<span id="user_dialog_title">添加用户组</span>',
        autoOpen : false,
        width : 500,
        height : 520,
        modal : true
    });
     $("#new-user-dialog2").dialog({
        title : '<span id="method_dialog_title2">添加Role</span>',
        autoOpen : false,
        width : 500,
        height : 520,
        modal : true
    });
    jQuery("#new-app-dialog").dialog({
        title : '<span id="dialog_loading">新增app</span>',
        autoOpen : false,
        width : 469,
        height : 306,
        modal : true
    });
    
    
    // ====RestApp Model=========
    var RestApp = Backbone.Model.extend({
        url : restServerCtx + '/system/restApps/one',
    });

    // ====RestApp Collection=========
    var RestList = Backbone.Collection.extend({
        url : restServerCtx + '/system/restApps/one',
        model : RestApp,
    });
    var restList = new RestList();
    // ==== RestApp appOption View=========Rest头栏Option选项
    var RestOptionView = Backbone.View.extend({
        appOptionTem : _.template($('#appOptionTem').html()),
        
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events : {
            "click a" : "showDtailView",
        },
        render : function() {
            var appOptionItemHtml = this.appOptionTem(this.model.toJSON());
            $(this.el).html(appOptionItemHtml);
            return this;
        },
        showDtailView:function(){
        	currentMode=this.model;
        	bucketdate=this.model.get("bucket");
        	dbType=this.model.attributes.dbType;
        	console.info("Option点击时获取的bucket"+bucketdate);
            $(restAppListView.el).hide();
            $("#appDetail").show();
            // $("#appSet").hide();
            // alert(this.model.get("bucket"));
            $("#select>span").html(this.model.get("name"));
            //restmethodList.reset();
            fillDetail(this.model);
            
/*            if(!restmethodAppView){
            }else{
                restmethodList.fetch({
                    url : restmethodList.url+"?bucket="+this.model.get("bucket"),
                });
            }*/
        }
    });
    
    // ==== RestApp itrm View=========restApp点击事件
     RestView = Backbone.View.extend({
        tagName : "li",
        restItemTemplate : _.template($('#restItem-template').html()),
        events : {
            "click a" : "showDetail",
            "click .sccx" : "update",
            "click .m3" : "showUseracl"
        },
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        // 渲染数据到 item-template 中，然后返回对自己的引用this
        render : function() {
            var itemHtml = this.restItemTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        },

        showDetail : function(e) {
        	bucketdate=this.model.get("bucket");
        	dbType=this.model.attributes.dbType;
        	currentMode=this.model;
        	console.info("App点击时获取的bucket:"+bucketdate);
            var currentBtnName= e.target.name;
            
            $(restAppListView.el).hide();

            fillDetail( this.model);
            $("#select>span").html(this.model.get("name"));

            $("#appDetail").show();
            $(".yymblb>a").removeClass("on");
            $("#"+currentBtnName+"_nav").addClass("on");
            
            $(".yymbbg>div").hide();
            $(".yymblb").show();
            $("#"+currentBtnName).show();
        },
        showUseracl : function () {
        	bucketdate=this.model.get("bucket");
    			/*用户组管理 所加载*/
		var GroupColl = Backbone.Collection.extend({
			//url:host+"/"+bucketdate+"/restGroup/one",
			//url:restServerCtx + "/system/restGroup/one",
			url:host+"/system/restGroup/one",
			
		});
			groupList = new GroupColl();
		
		if(groupCollView){
       		groupCollView.undelegateEvents();
       }
			groupCollView = new GroupCollView();
				/*用户组管理 所加载 End*/   
        }
    });
    // ======== RestApp View=================================
    RestAppListView = Backbone.View.extend({
        el : $("#appListDiv"),
        initialize : function() {
            this.listenTo(restList, 'reset', this.addAll);
            this.listenTo(restList, 'add', this.addOne);
            this.listenTo(restList, 'all', this.render);
            restList.fetch();
        },
        events : {
            "click #new_restapp" : "newRestApp",
        },
        addOne : function(rest) {
            var view = new RestView({
                model : rest
            });
            var optionView = new RestOptionView({
                model : rest
            });
            $(".option").append(optionView.render().el);
            $("#restAppUl").append(view.render().el);
        },
        addAll : function() {
            restList.each(this.addOne, this);
        },
        render : function() {
            $("#appAmount").html(restList.length);
        },
        newRestApp : function() {
            $("#new-app-dialog").dialog("open");

            $("#new-app-dialog-cancel").bind("click", function() {
                $("#new-app-dialog").dialog("close");
            });

            $("#submit-save-app").bind("click", function() {
                var appName = $("#appName").val().replace(/(^\s*)|(\s*$)/g, "");
                var bucket = $("#bucket").val().replace(/(^\s*)|(\s*$)/g, "");
                var msgDom = $("#msg");
                if (!appName) {
                    fade(msgDom, "请输入app名称.");
                    return false;
                }
                if (!bucket) {
                    fade(msgDom, "请输入bucket.");
                    return false;
                }
                fade(msgDom, "");
                $("#new-app-dialog .input").val("");
                // var createTime=date2str(new Date());
                // alert(createTime);
                var newApp = new RestApp();
                newApp.set({
                    "name" : appName,
                    "bucket" : bucket,
                    "user":$.cookie("name")
                });
                restList.create(newApp, {
                    wait: true,
//                    silent: true,
                    error : function() {
                        jAlert("创建失败",'提示');
                        //alert("创建失败");
                    },
                    success : function() {
                        $.ajax({
                            type:"DELETE",
                            //method/{bucket}/{restName}/{option}/{version}
                            ///app/{bucket}
                            url:restServerCtx+"/cache/table/"+bucket+"/restapp",
                            success:function(){
                                console.log(this.url+"  \t  缓存已清除.");
                            },
                            error:function(){
                                console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                            }
                        });
                        jAlert(newApp.get("id")+"创建成功.",'提示');
                        //alert(newApp.get("id")+"创建成功.");
                        $("#new-app-dialog").dialog("close");
                    },
                });
            });
        }
    });

    restAppListView = new RestAppListView();

    // =================================================
    // === method App ===
    // =================================================
    // ====methodModel =========
    var RestmethodModel = Backbone.Model.extend({
        defaults : function() {
            return {
                option : "GET",
                seconds : -1,
                status : 1,
                version : "",
                script:"function main(request, context, modules) {  var db = modules.data;  var utils = modules.utils;}"
            };
        },
    });

    // ====method Collection=========
    var RestmethodList = Backbone.Collection.extend({
        url : restServerCtx + "/system/restMethods/one",
        model : RestmethodModel,

    /*
     * sync: function(method, model, options){ options.dataType = "jsonp";
     * return Backbone.sync(method, model, options); }
     */
    });
    var restmethodList = new RestmethodList();

    // ====method View=========
    var RestmethodView = Backbone.View.extend({
        tagName : "li",
        events : {
            "mouseover  .methodLia" : "showOption",
            "mouseout  .methodLia" : "hideOption",
            "click .methodLia" : "showScript",//点击后根据相应的栏目出现代码并且判断方式
            "click .method_edit" : "editMethod",
            "click .method_delete" : "deleteMethod",
        },
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        methodTemplate : _.template($('#methodItem-template').html()),
        methodCtxTemplate : _.template($('#methodCtx-template').html()),

        render : function() {
            var itemHtml = this.methodTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            if(this.model.get("option")=="GET"){
                this.$(".method_option").addClass("opGET");
            }
            if(this.model.get("option")=="POST"){
                this.$(".method_option").addClass("opPOST");
            }
            if(this.model.get("option")=="PUT"){
                this.$(".method_option").addClass("opPUT");
            }
            if(this.model.get("option")=="DELETE"){
                this.$(".method_option").addClass("opDELETE");
            }
            $(this.el).attr("id", "methodLi_" + this.model.cid);
            return this;
        },
        showOption : function() {
            this.$('.method_delete').show();
            this.$('.method_edit').show();
        },
        hideOption : function() {
            $(".method_delete").hide();
            $('.method_edit').hide();
        },
        showScript : function() {
            $("#methodUl >li").removeClass("on");
            $(this.el).addClass("on");
            // alert("showScript"+this.model.get("id"));
            var url = host+
                    "/"+this.model.get("bucket")+
                    "/"+this.model.get("name")+
                    "/"+this.model.get("version");
            $(".reqURL").html("["+this.model.get("option")+"]  "+url);
            scriptEditor.getSession().setValue(format(this.model.get("script")));
            // console.log("script-----------"+scriptEditor.getSession().getValue());
            
            //判断是否为Put,如果为PUT显示PUT框
             var method = this.model;
            var optionType =  method.get("option");
            //切换Tab时清空结果
            if(optionType){
            	$("#method_response code").empty();
            }
      
            //判断接口类型
            
            if(optionType=="GET"||optionType=="DELETE"){
            	$("#paramstext").hide();
            	$(".putparame").hide();
            }if(optionType=="PUT"||optionType=="POST"){
            	$("#paramstext").show();
            }if(optionType=="PUT"){
            	$(".putparame").show();
            }else{
                jsonObj="";
            	$(".putparame").hide();
            	$('.putparame input').val('');//Id输入框
                $("#m_list > tbody").show();//显示加值框
                document.getElementById('paramstext').value='';
                document.getElementById('add_params1').style.display="block";
            }
            
        },

        deleteMethod : function(event) {
            if (confirm("确认删除  [" + this.model.get('name') + " / " + this.model.get('option') + "] 方法吗?")) {
                this.model.destroy({
                    success: function(model, response) {
                        jAlert("删除成功",'提示');
                        //alert("删除成功");
                },
                error: function(model, response) {
                	jAlert("删除失败",'提示');
                    //alert("删除失败");
                }
                });
            }
            event.stopPropagation();
        },
        editMethod : function() {
            var ctxHtml = this.methodCtxTemplate(this.model.toJSON());
            var updateMethod = this.model;
            $("#new-code-dialog").html(ctxHtml);
            $("#method_dialog_title").html("属性设置");
            $("#submit-save-code").val("确认更改");
            $("#new-code-dialog").dialog("open"); 
            $("#method_name").focus();
            $("#new-code-dialog-cancel").bind("click", function() {
                $("#new-code-dialog").dialog("close");
            });
            $("#submit-save-code").bind("click", function() {
                var name = $.trim($("#method_name").val());
                var option = $.trim($("#method_option").val());
                var paramType = $.trim($("#method_paramType").val());
                var version = $.trim($("#method_version").val());
                var seconds = $.trim($("#method_seconds").val());//缓存
                var status = $.trim($("input[name='method_status']:checked").val());

                updateMethod.set({
                    "name" : name,
                    "option" : option,
                    "version" : version,
                    "seconds" : seconds,
                    "status" : status,
                    "paramType" : paramType
                });

                // console.log("updateMethod.toJSON()=");
                // console.log(updateMethod.toJSON());
                updateMethod.save({}, {
                    error : function() {
                        jAlert("保存失败",'提示');
                        //alert("保存失败");
                    },
                    success : function() {
                        $.ajax({
                            type:"DELETE",
                            //method/{bucket}/{restName}/{option}/{version}
                            url:restServerCtx+
                                "/cache/method/"+
                                updateMethod.get("bucket")+"/"+
                                updateMethod.get("name")+"/"+
                                updateMethod.get("option")+"/"+
                                updateMethod.get("version"),
                            success:function(){
                                console.log(this.url+"  \t  缓存已清除.");
                            },
                            error:function(){
                                console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                            }
                        });
                        jAlert(updateMethod.get("id")+ "保存成功.",'提示');
                        //alert(updateMethod.get("id")+ "保存成功.");
                        $("#new-code-dialog").dialog("close");
                    },
                });
            });

        },
    });

    // ============method AppView =======================
    var copyURL_clip;
    RestmethodAppView = Backbone.View.extend({
        el : $(".yymbxq"),
        initialize : function() {
            this.listenTo(restmethodList, 'reset', this.addAll);
            this.listenTo(restmethodList, 'add', this.addOne);
            this.clearMethodView();
            this.copyURL_Init();
            restmethodList.fetch({
                url : restmethodList.url+"?bucket="+this.model.get("bucket"),
                reset:true
            });
        },
        events : {
            "click #send_request" : "requestCode",//显示Code结果
            "click #editor_code_save" : "saveScript",
            "click #editor_code_format" : "formatScript",
            "click #addMethod" : "addMethod",
            "click #add_params": "addTable",
            "click #hidecode" : "hideShowCode",//隐藏于显示Code结果
            "click .del_market" : "deleteparame",
            "click #editor_field_setting" : "editField", 
            "click #acl_setting" : "aclSetting",  //method ACL 控制
            "keydown  .vali_code_main":"keyEvent",
         },

        methodCtxTemplate : _.template($('#methodCtx-template').html()),
        clip:function(){
            
        },
        addOne : function(restmethodModel) {
            var currAppbucket = this.model.get("bucket");
            if (currAppbucket == restmethodModel.get("bucket")) {
                var view = new RestmethodView({
                    model : restmethodModel
                });
                methodViewArr.push(view);
                $("#methodUl").append(view.render().el);
            };
        },
        addAll : function() {
            restmethodList.each(this.addOne, this);
        },
        showScript : function(restmethodModel) {
            var view = new RestmethodView({
                model : restmethodModel
            });
        },
        saveScript : function() {
            // alert("saveScript");
            currentMethod = this.getCurrentMethod();

            if (!currentMethod) {
                jAlert("请选择方法.",'提示');
                //alert("请选择方法");
                return;
            }
            var script = scriptEditor.getSession().getValue();
            // console.log("script-----"+script);
            script = trimSpace(script);
            // console.log("script--trim ed---"+script);
            currentMethod.set("script", script);
            currentMethod.save(null, {
                error : function() {
                	jAlert("保存失败.",'提示');
                    //alert("保存失败");
                },
                success : function() {
                    $.ajax({
                        type:"DELETE",
                        //method/{bucket}/{restName}/{option}/{version}
                        ///app/{bucket}
                        url:restServerCtx+
                        "/cache/method/"+
                        currentMethod.get("bucket")+"/"+
                        currentMethod.get("name")+"/"+
                        currentMethod.get("option")+"/"+
                        currentMethod.get("version"),
                        success:function(){
                            console.log(this.url+"  \t  缓存已清除.");
                        },
                        error:function(){
                            console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                        }
                    });
                    
                    $.ajax({
                        type:"DELETE",
                        //method/{bucket}/{restName}/{option}/{version}
                        // "/method/{bucket}/{restName}"
                        //"/app/{bucket}
                        url:restServerCtx+
                            "/cache/app/"+
                            currentMethod.get("bucket") ,
                        success:function(){
                            console.log(this.url+"  \t  缓存已清除.");
                        },
                        error:function(){
                            console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                        }
                    });
                    jAlert("保存成功.",'提示');
                    //alert("保存成功.");
                },
            });
        },
        formatScript : function() {
            currentMethod = this.getCurrentMethod();

            if (!currentMethod) {
            	jAlert("请选择方法",'提示');
                //alert("请选择方法");
                return;
            }
            var script = scriptEditor.getSession().getValue();
            // console.log("1.
            // scriptEdito.get(script)-----"+currentMethod.get("script"));
            script = format(script);
            // console.log("2. format(script)-----"+script);
            scriptEditor.getSession().setValue(script);

        },

        getCurrentMethod : function() {
            var methodDomId = $("li[id^='methodLi_'][class='on']").attr("id");
            if (methodDomId) {
                methodCid = methodDomId.split("_")[1];
                // console.log(restmethodList.get(methodCid).toJSON());
                return restmethodList.get(methodCid);
            }
        },
        addMethod : function() {
            var currAppbucket = this.model.get("bucket");
            var newMethod = new RestmethodModel({
                bucket : currAppbucket
            });
            var ctxHtml = this.methodCtxTemplate(newMethod.toJSON());
            $("#new-code-dialog").html(ctxHtml);
            $("#method_dialog_title").html("新增方法");
            $("#submit-save-code").val("确认创建");
            $("#new-code-dialog").dialog("open");
            $("#method_name").focus();
            $("#submit-save-code").bind("click", function() {
                var name = $.trim($("#method_name").val());			//方法名
                var option = $.trim($("#method_option").val());		//请求方式
                var paramType = $.trim($("#method_paramType").val());//参数类型
                var version = $.trim($("#method_version").val());	//版本号
                var seconds = $.trim($("#method_seconds").val());	//缓存值
                var status = $.trim($("input[name='method_status']:checked").val());//方法状态

                newMethod.set({
                    "name" : name,
                    "option" : option,
                    "version" : version,
                    "seconds" : seconds,
                    "status" : status,
                    "paramType" : paramType
                });
                restmethodList.create(newMethod, {
                    error : function() {
                        jAlert("创建失败",'提示');
                        //alert("创建失败");
                    },
                    success : function() {
                    	jAlert("创建成功",'提示');
                        //alert("创建成功.");
                        $("#new-code-dialog").dialog("close");
                    },
                });

            });
            $("#new-code-dialog-cancel").bind("click", function() {
                $("#new-code-dialog").dialog("close");
            });
        },
        editField : function() {
            currentMethod = this.getCurrentMethod();
            if (!currentMethod) {
            	jAlert("请选择方法",'提示');
                //alert("请选择方法");
                return;
            }
            
            SyncLoad.includeFile("../css/", [ "field.css" ]);
            try {
                updateField(currentMethod);
            } catch (e) {
                SyncLoad.includeFile("../js/app/detail/",  ["field.js"],function(){
                    updateField(currentMethod);
                });
            }
            
        },
        aclSetting:function(){
            currentMethod = this.getCurrentMethod();
            if (!currentMethod) {
            	jAlert("请选择方法",'提示');
                //alert("请选择方法");
                return;
            }
            
            if(!SyncLoad.findFile("../css/acl.css")){
                SyncLoad.includeFile("../css/", [ "acl.css" ]);
            };
            methodAclView.render(currentMethod);
             
        },
        keyEvent:function(event){
            if (event.ctrlKey == true && event.keyCode == 83) {//Ctrl+S
            	//event.returnValue=false 设置事件的返回值为false,即取消事件处理
                event.returnValue=false;
                //阻止把事件分派到其他节点
                event.stopPropagation();
               this.saveScript();
               return false;
            }
        },
        clearMethodView:function(){
            _.each(methodViewArr, function(methodView) {
                methodView.remove();
            });
            methodViewArr=[];
        },
        copyURL_Init:function(event){
            if(copyURL_clip){
                return
            }    
            copyURL_clip = new ZeroClipboard($('#copyURL'));
            copyURL_clip.on( "copy", function (event) {
                var clipboard = event.clipboardData;
                var value = $(".reqURL").html();
                if(!value){
                    return
                }
                clipboard.setData( "text/plain", value );
                jAlert(value+"\n\n 已经拷贝到剪切板.",'提示');
                //alert( value+"\n\n 已经拷贝到剪切板.");
            });
            
        },
        hideShowCode:function() {
            if ($("#method_response").is(":hidden")) {
                $("#method_response").show();
            } else {
                $("#method_response").hide();
            }
        },
        deleteparame:function(e){
        var e = $(e.currentTarget).parent().parent();
        e.remove()
        },
        
 requestCode:function() {
             $("#method_response").show();//响应结果
             var method = this.getCurrentMethod();
             console.log(method);
             var url = host+
                "/"+method.get("bucket")+
                "/"+method.get("name")+
                "/"+method.get("version");
            var optionType =  method.get("option");
                console.log(optionType);
       //----------------------------------------
      /* var req ={};
            if("有参数"){
            	url+="参数";
            }
            req.url=url;
            req.type=optionType;
            if(data){
            	req.data=data;
            }
            req.success=req.error=function(req){
            }
            $.ajax(req);
        */
       //-------------------------------------
       //PUT  URL
       		var putparame=$(".putparame input").val();
       		console.log("putparame:"+putparame);
        //小框值
       	 	var parameurl = "";
            var e = "";
       	 $("#m_list tr:visible").each(function() {
            var parame1 = $(this).find("input[type='text']").eq(0).val();
            var parame2 = $(this).find("input[type='text']").eq(1).val();
            if ($.trim(parame1)) {
                e = "&"
                parameurl = parameurl + e + "" + parame1 + "=" + parame2 + "";
            }
        });
        console.info(parameurl);
       //大框值
       parameurl =parameurl.replace(/&/,'');//去掉GET前的&
       var jsonObj = $("#paramstext").val();//大框值
       console.log("parameurl:"+parameurl);
       console.log(jsonObj);
       //开始判断
       var req ={};
       req.url=url;
       req.contentType="application/json;charset=UTF-8";
       req.type=optionType;
       	//判断PUT
		if(putparame){
			req.url+="/"+putparame+"/";
		}
       if(parameurl){//判断GET的取值
        req.url+="?"+parameurl;
       }
		console.info(req.url);
       if(jsonObj){//判断Textarea取值
       	req.data=jsonObj;
       }
      req.success=function (data,textStatus,XMLHttpRequest) {
      	  $("#method_response code").html("服务状态:"+XMLHttpRequest.status +"\n"
      	  	+"状态 :"+textStatus+"\n"
      	  	+"提交方式:"+optionType+"\n"
      	  	+"URL:"+req.url+"\n"
      	  	+"详情:"+XMLHttpRequest.responseText)
      	  	.append("\t data:"+data);

      };
      req.error=function(XMLHttpRequest, textStatus, errorThrown){
			               $("#method_response code").html("服务状态:"+XMLHttpRequest.status+"\n"
			               +"状态 :"+textStatus+"\n"
			               +"类型:"+errorThrown+"\n"
			               +"提交方式:"+optionType+"\n"
			               +"URL:"+req.url+"\n"
			               +"错误详情:"+format(XMLHttpRequest.responseText));
      };
      //Ajax处理
      $.ajax(req);
 	},
    addTable: function  () {        //添加参数值
        $("#m_list").append($(".cl").clone(true).removeClass().show())
     }
    });
    
    /**
     * 应用设置页面
     */
    var RestSettingView = Backbone.View.extend({
        el:"#appSet",
        restDtailTemplate : _.template($('#restDtail-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },
        events:{
            "click .sccx ":"update"
        },
        render : function() {
            var dtailHtml = this.restDtailTemplate(this.model.toJSON());
            $(this.el).html(dtailHtml);
            return this;
        },
        update : function(){
           var  updateApp = this.model;
            var rest_name = $.trim($("#rest_name").val());
            var rest_bucket = $.trim($("#rest_bucket").val());
            var rest_dbType = $.trim($("#rest_dbType").val());
            var rest_dbDriverClass = $.trim($("#rest_dbDriverClass").val());
            var rest_dbURL = $.trim($("#rest_dbURL").val());
            var rest_dbUsername = $.trim($("#rest_dbUsername").val());
            var rest_dbPassword = $.trim($("#rest_dbPassword").val());
            var rest_secretKey = $.trim($("#rest_secretKey").val());
            var rest_status = $.trim($("#rest_status").val());
           // var rest_script = $.trim($("#rest_script").val());

            if (!rest_name) {
            	jAlert("请输入名称",'提示');
                return;
            } else if (!rest_bucket) {
            	jAlert("请输入标示",'提示');
                return;
            }

            updateApp.set({
                "name" : rest_name,
               // "script" : rest_script,
                "dbType" : rest_dbType,
                "dbDriverClass" : rest_dbDriverClass,
                "dbURL" : rest_dbURL,
                "dbUsername" : rest_dbUsername,
                "dbPassword" : rest_dbPassword,
                "status" : rest_status,
                "secretKey" : rest_secretKey
            });

           // console.log("update.toJSON()=");
//            console.log(update.toJSON());
            updateApp.save(null, {
                success : function() {
                    $.ajax({
                        type:"DELETE",
                        //method/{bucket}/{restName}/{option}/{version}
                        ///app/{bucket}
                        url:restServerCtx+"/cache/table/"+bucket+"/restapp",
                        success:function(){
                            console.log(this.url+"  \t  缓存已清除.");
                        },
                        error:function(){
                            console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                        }
                    });
                    jAlert("更新成功",'提示');
                    //alert("更新成功");
                    $("#new-code-dialog").dialog("close");
                },
                error : function() {
                	jAlert("更新失败",'提示');
                    //alert("更新失败");
                },
            });
        
        }
    });
    
    /**
     * 用户设置
     */
/*    	var RestsetModelView =Backbone.View.extend({
		el:"#rest_userCFG",
		restUserSetTemplate : _.template($('#restuserset-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },
        events:{
 			"click #usersetput":"showModify",
        },
        render:function() {
            var itemHtml = this.restUserSetTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        },
        showModify:function() {
        	jAlert("dsa","das");
        }
    });*/
    /**
     * 应用密钥 页面
     */
    var SecretKeyView = Backbone.View.extend({
        el:"#secretKey",
        contTemp: _.template($('#secretKeyCont-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
            this.copyInit();
        },
        events:{
         //   "click .button ":"copy" 
        },
        render : function() {
            var dtailHtml = this.contTemp(this.model.toJSON());
            $(this.el).html(dtailHtml);
            return this;
        },
//        copy:function(event){
//            var currentBtnId= event.currentTarget.id;
//            var handle =currentBtnId.split("_")[0];
//            var currentTextId = handle+"_text";
//            var value = $("#"+currentTextId).val();
//            
//           // console.log("get value:"+value );
//            
//            var clip = new ZeroClipboard.Client();
//            clip.setText(value);                 
//            clip.glue(currentBtnId);
//            alert(value+" 已经复制到剪切板.");
//        },
        copyInit:function(){
            console.log("copyInit");
            var secretKeyClip = new ZeroClipboard(this.$('.button'));
            secretKeyClip.on( "copy", function (event) {
                var clipboard = event.clipboardData;
                var currentTextId = event.target.id.split("_")[0]+"_text";
                var value = $("#"+currentTextId).val();
                clipboard.setData( "text/plain", value );
                jAlert( value+"\n\n 已经拷贝到剪切板.",'提示');
            });
        }
    });
    
    /**
     * 根据App 填充详情页
     */
    function fillDetail(appModel){
        if(restmethodAppView){
            restmethodAppView.stopListening();
            restmethodAppView.undelegateEvents();
        }
        restmethodAppView = new RestmethodAppView({ model : appModel });
        /*应用设置*/
        if(restSettingView){
            restSettingView.undelegateEvents();
        }
        restSettingView= new RestSettingView( {model :appModel});
        
        if(secretKeyView){
            secretKeyView.undelegateEvents();
        }
        secretKeyView = new SecretKeyView( {model :appModel});
       // secretKeyView.copyInit();
        if(resAdminAppView){
            resAdminAppView.undelegateEvents();
        }
        resAdminAppView=new ResAdminAppView({model :appModel});
        /*权限控制*/
        if(methodAclView){
            methodAclView.undelegateEvents();
        }
        methodAclView=new MethodAclView({model :appModel});
        
        if(tableAclView){
            tableAclView.undelegateEvents();
        }
        tableAclView=new TableAclView({model :appModel});
        if(fieldAclView){
        	fieldAclView.undelegateEvents();
        }
        	fieldAclView=new FieldAclView({model:appModel});
		if(groupShowModelView){
    		groupShowModelView.undelegateEvents();
 		}
        groupShowModelView =new GroupShowModelView({model :appModel});
        var TimerCollection= Backbone.Collection.extend({
    	 	url:restServerCtx+"/system/restTimer/one",
    	 });
    	 timerCollection= new TimerCollection();
        if(timerView){
        	timerView.undelegateEvents();
        }
        var timerView=new TimerView({model :appModel});
        var RestmethodList = Backbone.Collection.extend({
			url: restServerCtx + "/system/restMethods/one",
		});
		methodList = new RestmethodList();
        if(restmethodListView){
        	restmethodListView.undelegateEvents();
        }
        var restmethodListView=new RestmethodListView({model :appModel});
//       if(restsetModelView){
//          restsetModelView.undelegateEvents();
//      }
//      restsetModelView=new RestsetModelView({model :appModel});
        
        
        ZeroClipboard.config( { swfPath: "../js/jslib/ZeroClipboard.swf" } );
        		tabclick=false;
    }
});



function format(source) {

    if (the.beautify_in_progress || !source) {
        return;
    }

    store_settings_to_cookie();

    the.beautify_in_progress = true;
    // var source = editorValue ?editorValue : $('#source').val(), output, opts
    // = {};
    // console.log("source==" + source);
    // console.log("trimSpace(source)==" + trimSpace(source));
    var opts = {};
    opts.indent_size = $.cookie('tabsize');
    opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
    opts.max_preserve_newlines = $.cookie('max-preserve-newlines');
    opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
    opts.keep_array_indentation = $.cookie('keep-array-indentation');
    opts.break_chained_methods = $.cookie('break-chained-methods');
    opts.indent_scripts = $.cookie('indent-scripts');
    opts.brace_style = $.cookie('brace-style');
    opts.space_before_conditional = $.cookie('space-before-conditional');
    opts.unescape_strings = $.cookie('unescape-strings');
    opts.wrap_line_length = $.cookie('wrap-line-length');
    opts.space_after_anon_function = true;

    if ($.cookie('detect-packers') == 'on') {
        source = unpacker_filter(source);
    }
    the.beautify_in_progress = false;
    return js_beautify(source, opts);

}

var the = {
    use_codemirror : (!window.location.href.match(/without-codemirror/)),
    beautify_in_progress : false,
    editor : null
// codemirror editor
};

function store_settings_to_cookie() {
    var opts = {
        expires : 360
    };
    // 缩进
    $.cookie('tabsize', 4, opts);
    // "collapse">用括号控制语句 "expand">括号在本行 "end-expand">结束括号在本行
    $.cookie('brace-style', 'collapse', opts);
    // 是否检测加壳和混淆器
    $.cookie('detect-packers', $('#detect-packers').prop('checked') ? 'on' : 'off', opts);
    /*
     * <option value="-1">删除所有多余的换行符</option> <option value="1">允许标记之间1个换行符</option>
     * <option value="2">允许标记之间2个换行符</option> <option value="5">允许标记之间5个换行符</option>
     * <option value="10">允许标记之间10个换行符</option> <option value="0">允许标记之间无限个换行符</option>
     */
    $.cookie('max-preserve-newlines', "1", opts);
    // 保持数组缩排？
    $.cookie('keep-array-indentation', $('#keep-array-indentation').prop('checked') ? 'on' : 'off', opts);
    // 链式方法调用换行？
    $.cookie('break-chained-methods', $('#break-chained-methods').prop('checked') ? 'on' : 'off', opts);
    // 条件语句的前空格: "if(x)" / "if (x)"
    $.cookie('space-before-conditional', $('#space-before-conditional').prop('checked') ? 'on' : 'off', opts);
    // encode编码，例如 \xNN 或 \uNNNN?
$.cookie('unescape-strings', $('#unescape-strings').prop('checked') ? 'on' : 'off', opts);
    // 满 x 个字符换行 0 不换行
    $.cookie('wrap-line-length', 0, opts);

}
/**
 * 把多个空格替换成一个
 */
function trimSpace(string) {
    return string.replace(/\s+/g, ' ');
}

function date2str(d) {
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + d.getDate()).slice(-2) + " ";
    ret += ("00" + d.getHours()).slice(-2) + ":";
    ret += ("00" + d.getMinutes()).slice(-2) + ":";
    ret += ("00" + d.getSeconds()).slice(-2);
    return ret;
}
