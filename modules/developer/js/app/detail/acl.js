/**
 * 权限控制 
 */


var methodAclView;
var MethodAclView;
var tableAclView;
var TableAclView;
var FieldAclView
var fieldAclView;
var currentFieldval;//获取出字段的名字
var fieldAcldatass;//数据库取出的字段权限数组
$(function(){
    
    /*=======Restgroup=============*/
    var RestgroupView =Backbone.View.extend({
        tagName : "label",
        restgroupTemplate : _.template($('#restGroup-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render:function(){
            var itemHtml = this.restgroupTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            $(this.el).attr("title",this.model.get("name")+"\n"+(this.model.get("desc")||" "));
            return this;
        }
    });
    
    
    var RestgroupColl  = Backbone.Collection.extend({
        url : host + '/system/restGroup/one',
    });
    var restgroupColl = new RestgroupColl();
    
    var RestgroupCollView =Backbone.View.extend({
        el:"#restgroup",
        initialize :function(){
            this.listenTo(restgroupColl, 'reset', this.addAll);
            this.listenTo(restgroupColl, 'add', this.addOne);
            var url =restgroupColl.url+"?bucket="+bucketdate;
            restgroupColl.fetch({'url':url,reset:true});
        },
        addOne : function(restGroup) {
            console.log("RestgroupCollView add one");
            var view = new RestgroupView({
                model : restGroup
            });
            $("td[data-aclType='group']").append(view.render().el);
        },
        addAll : function() {
            $("td[data-aclType='group']").html("");
            if(restgroupColl.length==0){
                $("td[data-aclType='group']").html("无匹配用户组");
            }
            restgroupColl.each(this.addOne, this);
        },
        render : function() {
            console.log("RestgroupCollView render");
        }
    });
    
    /*=======RestRole============*/
    var RestRoleView =Backbone.View.extend({
        tagName : "label",
        restgroupTemplate : _.template($('#restRole-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render:function(){
            var itemHtml = this.restgroupTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            $(this.el).attr("title",this.model.get("name")+"\n"+(this.model.get("desc")||" "));
            return this;
        }
    });
    
    var RestRoleColl  = Backbone.Collection.extend({
        url : host + '/system/restRole/one',
    });
    var restRoleColl = new RestRoleColl();
    
    var RestRoleCollView =Backbone.View.extend({
        el:"#restRole",
        initialize :function(){
            this.listenTo(restRoleColl, 'reset', this.addAll);
            this.listenTo(restRoleColl, 'add', this.addOne);
            this.listenTo(restRoleColl, 'all', this.render);
            var url =restRoleColl.url+"?bucket="+bucketdate;
            restRoleColl.fetch({'url':url ,reset:true});
        },
        addOne : function(restRole) {
            var view = new RestRoleView({
                model : restRole
            });
            $("td[data-aclType='role']").append(view.render().el);
        },
        addAll : function() {
            $("td[data-aclType='role']").html("");
            if(restRoleColl.length==0){
                $("td[data-aclType='role']").html("无匹配角色");
            }
            restRoleColl.each(this.addOne, this);
        },
        render : function() {
            //console.log("restRole render");
        }
    });
    
    /*=======RestUserInfo============*/
    var RestUserInfoView =Backbone.View.extend({
        tagName : "label",
        restgroupTemplate : _.template($('#restUserInfo-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render:function(){
            var itemHtml = this.restgroupTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            $(this.el).attr("title",this.model.get("username"));
            return this;
        }
    });
    var RestUserInfoColl  = Backbone.Collection.extend({
        //url : host + '/system/restUserInfo/one',
        //url:host+"/"+bucketdate+"/users",
    });
    var restUserInfoColl = new RestUserInfoColl();
    
    var RestUserInfoCollView =Backbone.View.extend({
        el:"#restUserInfo",
        initialize :function(){
            this.listenTo(restUserInfoColl, 'reset', this.addAll);
            this.listenTo(restUserInfoColl, 'add', this.addOne);
            this.listenTo(restUserInfoColl, 'all', this.render);
            restUserInfoColl.fetch({
            	url:host+"/"+bucketdate+"/users",
            	reset:true
            });
        },
        addOne : function(restUserInfo) {
            var view = new RestUserInfoView({
                model : restUserInfo
            });
            $("td[data-aclType='user']").append(view.render().el);
        },
        addAll : function() {
            $("td[data-aclType='user']").html("");
            if(restUserInfoColl.length==0){
                $("td[data-aclType='user']").html(" 无匹配用户");
            }
            restUserInfoColl.each(this.addOne, this);
        },
        render : function() {
            //console.log("restUserInfo render");
        }
    });
    /*============MethodAclView============*/
    MethodAclView= Backbone.View.extend({
        el : $("#methodAcl-setting-dialog"),
        initialize : function(){ 
            $("#methodAcl-setting-dialog").dialog({
                title : '<span id="methodAcl_dialog_title">权限设置</span>',
                autoOpen : false,
                width : 600,
                height : 476,
                modal : true
            });
              new RestgroupCollView({model:this.model});
              new RestRoleCollView({model:this.model});
              new RestUserInfoCollView();
            $("#subAddAcl").bind('click',function(){
                var methodAcl={group:"",role:"",user:""};
                $.each( methodAcl ,function(acl_i,acl_v){
                    var aclCnt=[];
                    $.each( $("#"+acl_i+"List input[type='checkbox']"),function(i,dom){ 
                        if(dom.checked){
                            aclCnt.push(dom.value);
                        }
                    });
                    methodAcl[acl_i]=aclCnt.toString();
                    if(!methodAcl[acl_i]){
                        delete  methodAcl[acl_i];
                    }
                });
                currentMethod.save('acl',  JSON.stringify(methodAcl), {
                    wait:true,
                    success:function(){
                        $("#acl-setting-alert").hide();
                        $("#acl-setting-alert").html("success");
                        $("#acl-setting-alert").attr("class","alert success");
                        $("#acl-setting-alert").fadeIn(500);
                    },
                    error:function(err,resp){
                        $("#acl-setting-alert").hide();
                        $("#acl-setting-alert").html("["+resp.status+"] "+resp.statusText +"!    'F12' 可以查看错误log." );
                        console.log("权限设置Error :"+resp.responseText);
                        $("#acl-setting-alert").attr("class","alert danger");
                        $("#acl-setting-alert").attr("title","F12 查看错误log");
                        $("#acl-setting-alert").fadeIn(500);
                    }
                    });
                    $("cancelAddAcl").html("完成");

            });
            $("#cancelAddAcl").bind('click',function(){
                $("#methodAcl-setting-dialog").dialog("close");
            });
        },
        render:function(currentMethod){
            $("#acl-setting-alert").hide();
            var aclData=currentMethod.get("acl")||null;
            var methodAcl=eval('('+aclData+')');
            this.adapt(methodAcl);
            console.log("----------方法权限------");
            console.log(methodAcl);
            console.log("----------方法权限-----End-");
            $("#methodAcl_dialog_title").html("权限设置-"+currentMethod.get("name"));
            $("#methodAcl-setting-dialog").dialog("open");
            $("cancelAddAcl").html("取消");
            
        },
        //显示 acl 内容
        adapt:function(methodAcl){
            this.$("input[type='checkbox']").attr("checked",false);
            if(!methodAcl){
                return;
            }
            $.each( methodAcl ,function(acl_i,acl_v){
                if(!acl_v){
                    return;
                }
                var aclArr = acl_v.split(',');
                $.each( $("#"+acl_i+"List input[type='checkbox']"),function(i,dom){
                    for (g_i in aclArr){
                        if(aclArr[g_i]==dom.value){
                            dom.checked=true;
                        }
                    }
                });
            });
        }
        // methodCtxTemplate : _.template($('#methodCtx-template').html()),
    });
    /*============TableAclView============*/
    TableAclView= Backbone.View.extend({
        el : $("#tableAcl-setting-dialog"),
        initialize : function(){ 
            $("#tableAcl-setting-dialog").dialog({
                title : '<span id="tableAcl_dialog_title">权限设置</span>',
                autoOpen : false,
                width : 600,
                height : 518,
                modal : true
            });
              new RestgroupCollView({model:this.model});
              new RestRoleCollView({model:this.model});
              new RestUserInfoCollView();
            $("#tab_subAddAcl").bind('click',function(){
                var tableAcl={write:"",read:"",insert:"",update:"",remove:""};
                $.each( tableAcl ,function(tab_i,tab_v){
                    var methodAcl={group:"",role:"",user:""};
                    $.each( methodAcl ,function(acl_i,acl_v){
                        var aclCnt=[];
                        $.each( $("#tab_"+tab_i+"_"+acl_i+"List input[type='checkbox']"),function(i,dom){ 
                            if(dom.checked){
                                aclCnt.push(dom.value);
                            }
                        });
                        methodAcl[acl_i]=aclCnt.toString();
                        if(!methodAcl[acl_i]){
                            delete  methodAcl[acl_i];
                        }
                    });
                    tableAcl[tab_i]=methodAcl;
                });
                console.info("-----tableAcl-----");
					console.info(tableAcl);
					console.log(JSON.stringify(tableAcl));
				console.info("----------");
				
				
				
                currTable.save('tableAcl',  JSON.stringify(tableAcl));
                currTable.save(null, {
                    wait:true,
                    success:function(){
                    	$("#tab_cancelAddAcl").html("完 成 ");
                        $("#tableAcl-setting-alert").hide();
                        $("#tableAcl-setting-alert").html("success");
                        $("#tableAcl-setting-alert").attr("class","alert success");
                        $("#tableAcl-setting-alert").fadeIn(500);
                        $("#tableAcl-setting-alert").fadeOut(3000);
                    },
                    error:function(err,resp){
                        $("#tableAcl-setting-alert").hide();
                        $("#tableAcl-setting-alert").html("["+resp.status+"] "+resp.statusText +"!    'F12' 可以查看错误log." );
                        console.log("权限设置Error :"+resp.responseText);
                        $("#tableAcl-setting-alert").attr("class","alert danger");
                        $("#tableAcl-setting-alert").attr("title","F12 查看错误log");
                        $("#tableAcl-setting-alert").fadeIn(500);
                        $("#tableAcl-setting-alert").fadeOut(3000);
                    }
                });
                
            });
            $("#tab_cancelAddAcl").bind('click',function(){
                $("#tableAcl-setting-dialog").dialog("close");
            });
        },
        events:{
            "click .acl-nav>li":"switchTab"//切换选项卡
        },
        render:function(currTable){
            $("#tableAcl-setting-alert").hide();
            var aclData =currTable.get("tableAcl")||null;
            console.info(aclData);
            var tableAcl=eval('('+aclData +')');
            console.log(tableAcl);
            this.adapt(tableAcl);
            $("#tableAcl_dialog_title").html("权限设置-"+currTable.get("name"));
            $("#tab_cancelAddAcl").html("取 消 ");
            $("#tableAcl-setting-dialog").dialog("open");
        },
        //适配 acl 内容
        adapt:function(tableAcl){
            this.$("input[type='checkbox']").attr("checked",false);
            if(!tableAcl){
                return;
            }
            for(tab_i in tableAcl){
                var methodAcl=tableAcl[tab_i];
                $.each( methodAcl ,function(acl_i,acl_v){
                    if(!acl_v){
                        return;
                    }
                    var aclArr = acl_v.split(',');
                    $.each( $("#tab_"+tab_i+"_"+acl_i+"List input[type='checkbox']"),function(i,dom){
                        for (g_i in aclArr){
                            if(aclArr[g_i]==dom.value){
                                dom.checked=true;
                            }
                        }
                    });
                });
            }
        },
        /**
         * 切换选项卡
         */
        switchTab:function(event){
            console.log("切换选项卡"+event.currentTarget);
            var currLi=event.currentTarget;
            var handle =$(currLi).data("handle");
            $(".acl-nav>li").removeClass("active");
            $(currLi).addClass("active");

            $("#tableAcl-setting-dialog table").hide();
            $("#tableAcl-setting-dialog table#tab-acl-"+handle).show();
            
        }
    });
    
    /*============FieldAclView============*/
	FieldAclView= Backbone.View.extend({
        el : $("#fieldAcl-setting-dialog"),
        initialize : function(){ 
            $("#fieldAcl-setting-dialog").dialog({
                title : '<span id="fieldAcl-setting-title">权限设置</span>',
                autoOpen : false,
                width : 600,
                height:518,
                modal : true
            });
            new RestgroupCollView({model:this.model});
            new RestRoleCollView({model:this.model});
            new RestUserInfoCollView({model:this.model});
            												//提交按钮
            $("#field_subAddAcl").bind('click',function(){
	            var fieldAcl={write:"",read:"",insert:"",update:"",remove:""};
                $.each( fieldAcl ,function(fie_i,fie_v){
                    var methodAcl={group:"",role:"",user:""};
                    $.each( methodAcl ,function(acl_i,acl_v){
                        var aclCnt=[];
                        $.each( $("#fie_"+fie_i+"_"+acl_i+"List input[type='checkbox']"),function(i,dom){ 
                            if(dom.checked){
                                aclCnt.push(dom.value);
                            }
                        });
                        methodAcl[acl_i]=aclCnt.toString();
                        if(!methodAcl[acl_i]){
                            delete  methodAcl[acl_i];
                        }
                    });
                    fieldAcl[fie_i]=methodAcl;
                });
                console.info("-------选择的字段权限-------");
				console.log(JSON.stringify(fieldAcl));
            	var fieldAcldate = {};
            	var fieldAcls;
            	fieldAcldate[currentFieldval] = fieldAcl;//封装字段权限
        		console.log(JSON.stringify(fieldAcldate));
            	console.info("-----选择的字段权限--End-----");
    			if(!fieldAcldatas){						//判断是否为空
           			fieldAcls=fieldAcldate;
           		}else{
       				fieldAcls= eval('('+fieldAcldatas+')');//字符串转换为数组
	        		$.each(fieldAcls, function(i,v) { 
	        			if(currentFieldval==i){
	        				fieldAcls[i]=fieldAcldate[i];	//替换掉所拥有的权限
	        				return false;
	           			}
	        			if(currentFieldval!=i){
 				           	var currentFieldval1=currentFieldval;//获取当前所选的字段
	        				console.log(fieldAcldate.currentFieldval1);
	        				fieldAcls[currentFieldval1]=fieldAcldate[currentFieldval1];
	        				return false;
	        			}
	        		});
       			}
           		
				console.info("------字段权限----------");
          		console.log(JSON.stringify(fieldAcls));
    			$.each(fieldAcls, function(i,v) {    
            		console.log(i+"---------"+v);                                                          
            	});


				currTable.save('fieldAcl',  JSON.stringify(fieldAcls));
	                currTable.save(null, {
	                    wait:true,
	                    success:function(){
	                    	$("#field_cancelAddAcl").html("完 成 ");
	                        $("#tableAcl-setting-alert2").hide();
	                        $("#tableAcl-setting-alert2").html("success");
	                        $("#tableAcl-setting-alert2").attr("class","alert success");
	                        $("#tableAcl-setting-alert2").fadeIn(500);
	                        $("#tableAcl-setting-alert2").fadeOut(3000);
	                    },
	                    error:function(err,resp){
	                        $("#tableAcl-setting-alert2").hide();
	                        $("#tableAcl-setting-alert2").html("["+resp.status+"] "+resp.statusText +"!    'F12' 可以查看错误log." );
	                        console.log("权限设置Error :"+resp.responseText);
	                        $("#tableAcl-setting-alert2").attr("class","alert danger");
	                        $("#tableAcl-setting-alert2").attr("title","F12 查看错误log");
	                        $("#tableAcl-setting-alert2").fadeIn(500);
	                        $("#tableAcl-setting-alert2").fadeOut(3000);
	                    }
	                });
            });
            $("#field_cancelAddAcl").bind('click',function(){
                $("#fieldAcl-setting-dialog").dialog("close");
            });
        },
        render:function(currentField){
            $("#tableAcl-setting-alert2").hide();
            currentFieldval=currentField.get("name")||null;//获取当前所选的字段
            console.info(currentFieldval);
           	//获取字段的权限
           	console.info("------数据库获取到的字段权限----------");
           	console.log(fieldAcldatas);
           	console.info("--------字段权限End------");
           	var fieacldate;//储存匹配到的权限
           	if(!fieldAcldatas){
           		fieacldate=fieldAcldatas;
           	}else{
       			fieldAcldatass= eval('('+fieldAcldatas+')');//字符串转换为数组
	           	$.each(fieldAcldatass, function(i,v) {
	           		if(currentFieldval==i){
	           			fieacldate=v;
	           		}
	           		console.log(i+"--"+v);
	           	});
           	}
            //开始渲染所拥有的权限
            this.adapt(fieacldate);
            //获取字段的名字
            $("#fieldAcl-setting-title").html("字段权限设置-"+currentField.get("name"));
            $("#field_cancelAddAcl").html("取 消 ");
            $("#fieldAcl-setting-dialog").dialog("open");
        },
         events:{
            "click .acl-nav>li":"switchTab2"//切换选项卡
        },
        switchTab2:function(event){
            console.log("切换字段选项卡"+event.currentTarget);
            var currLi=event.currentTarget;
            var handle1 =$(currLi).data("handle");//当前的子权限
            $(".acl-nav>li").removeClass("active");
            $(currLi).addClass("active");

            $("#fieldAcl-setting-dialog table").hide();
            $("#fie-acl-"+handle1).show();
            
        },
        
        //显示 acl 内容
        adapt:function(fieacldate){
            this.$("input[type='checkbox']").attr("checked",false);
            if(!fieacldate){
                return;
            }
            for(fie_i in fieacldate){
                var methodAcl=fieacldate[fie_i];
                $.each( methodAcl ,function(acl_i,acl_v){
                    if(!acl_v){
                        return;
                    }
                    var aclArr = acl_v.split(',');
                    $.each( $("#fie_"+fie_i+"_"+acl_i+"List input[type='checkbox']"),function(i,dom){
                        for (g_i in aclArr){
                            if(aclArr[g_i]==dom.value){
                                dom.checked=true;
                            }
                        }
                    });
                });
            }
        },
        // methodCtxTemplate : _.template($('#methodCtx-template').html()),
    });
    
    
});

