var restServerCtx = host;
var ResAdminAppView;
var restAdminFields;
var restAdminFieldsView;
var RestAdminCtntsView;
var restAdminCtntsView;
var tabOptionView;
var currTable;
var checkModel
var adminCtnt;
var fieldAcldatas;
var tabclick=false;
var currtableName;
var a=0;
var fieldSorts={
/*        "id":1,*/
/*    "bucket":2,*/
/*    "tableName":3,*/
    "name":4,
    "aliasName":5,
    "type":6,
    "minLength":7,
    "maxLength":8,
    "request":9,
    "displayType":10,
    "displayValue":11,
    "sort":12,
    "searchType":13,
    "validate":14,
    "formType":15,
    "formValue":16,
};
var requestMap = {
    0 : false,
    1 : true
};

	function doTest(){
		top.location= adminUrl + '#/login/'+bucketdate; 
	};


var restAdminCtntsViews=[];

$(function() {
    var originalUrl="";

    $("#addTabeList-dialog").dialog({
        title : '<span class="dialog_title">增加关联表</span>',
        autoOpen : false,
        width : 521,
        modal : true
    });
    
    // ====RestTable =========
    var RestTable =  Backbone.Model.extend({ });

    var RestTableView = Backbone.View.extend({
        tagName : "li",
        tabLiTemp : _.template($('#tabLi-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

        },
        events:{
            "click .tab_dtl":"getOriginal",//应用表点集
            "click .table_delete":"deltable"
        },
        render:function(){
            var modelJson= this.model.toJSON();
            var itemHtml = this.tabLiTemp(modelJson);
            $(this.el).html(itemHtml);
            $(this.el).addClass("tabLi");
            return this;
        },
        //点击后的加载
        getOriginal:function(){
            tabclick=true;
            currTable=this.model;
            currtableName=this.model.get('name');
        	if(dbType==1){
            //clear
            _.each(restAdminCtntsViews, function(ctntsViews) {
                ctntsViews.remove();
            });
            restAdminCtntsViews=[];
            tabOptionView.reset();
            $("#table_list").find("li").andSelf().removeClass("on");
            $(this.el).addClass("on");
            originalUrl = restServerCtx+"/admin/"+this.model.get("bucket")+"/"+this.model.get("name")+"/original";
            restAdminCtnts.fetch({url:originalUrl});
        	}if(dbType==2){
        		
            //clear
            _.each(restAdminCtntsViews, function(ctntsViews) {
                ctntsViews.remove();
            });
            restAdminCtntsViews=[];
            tabOptionView.reset();
            $("#table_list").find("li").andSelf().removeClass("on");
            $(this.el).addClass("on");
            originalUrl = restServerCtx+"/system/Tableval/one?bucket="+bucketdate+"&tablename="+currtableName;
            console.log(originalUrl);
            restAdminCtnts.fetch({url:originalUrl});
        	}
        },
    	deltable : function(event) {
            if (confirm("确认删除  [" + this.model.get('name') + "] 方法吗?")) {
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
    });
    
    var RestTableCollection =  Backbone.Collection.extend({
        url:restServerCtx+"/system/restTable/one",
        model : RestTable,
    });
    var restTables =new RestTableCollection();
    var restTableItemViews=[];
    var RestTablesView = Backbone.View.extend({
        el : $(".restAdmin_left"),
        initialize : function() {
            this.listenTo(restTables, 'reset', this.addAll);
            this.listenTo(restTables, 'add', this.addOne);
            this.listenTo(restTables, 'all', this.render);
            var url = restTables.url+"?bucket="+bucketdate;
            restTables.fetch({"url": url});
        },
        events:{
            "click .addTable":"showTabList"//增加张表
        },
        addOne : function(restTable) {
            if(restTable.get("name")=="restadmin"){
                return;
            }
            var view = new RestTableView({
                model : restTable,
            });
            restTableItemViews.push(view);
            $("#table_list").append(view.render().el);
        },
        addAll : function() {
            restTables.each(this.addOne, this);
        },
        render:function(){
            $("#table_list").html("");
            _.each(restTableItemViews,function(v){
                v.remove();
            });
            this.addAll();
        },
        showTabList:function(){
    		$(".list-group-bg").hide();
    		$(".list-group-bg2").show();
			$("#errMsgDiv").hide();
			var tableName
        	var addtablelist={};
        	addtablelist.url=host + '/system/restTable/one';
        	addtablelist.contentType="application/json;charset=UTF-8";
        	addtablelist.type='POST';
        	addtablelist.success=function (data){
                       var resAdminAppView=new ResAdminAppView(currentMode);
                  		//清除缓存
            		  $.ajax({
                            type:"DELETE",
                            //method/{bucket}/{restName}/{option}/{version}
                            ///app/{bucket}
                            url:restServerCtx+"/cache/table/"+bucketdate+"/"+tableName,
                            success:function(){
                                console.log(this.url+"  \t  缓存已清除.");
                            },
                            error:function(){
                                console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                            }
                        });
                        //清除缓存END
	                    $('#errMsgDiv').html('success');
	                    $('#errMsgDiv').attr('class', 'alert success');
	                    $('#errMsgDiv').fadeIn(500);
	                    $('#errMsgDiv').fadeOut(2500);
	                    $('#cancelAddTable').html('完 成');
        };
        addtablelist.Error=function (XMLHttpRequest, textStatus, errorThrown) {
                	$('#errMsgDiv').attr('class', 'alert danger');
                    $('#errMsgDiv').attr('title', 'F12 查看错误log');
                    $('#errMsgDiv').attr('class', 'alert success');
                    $('#errMsgDiv').fadeIn(500);
                    $('#errMsgDiv').fadeOut(2500);
                    console.log('-------ERROR-----');
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log('-------ERROR-End----');
               };
        	if(dbType==1){
        		 $("#addTabeList-dialog").dialog({
        			height : 620,
			    });
	    		$(".list-group-bg2").hide();
        		$(".list-group-bg").show();
            if(originalTableListView){
                var url = restServerCtx+"/admin/"+this.model.get("bucket")+"/original";
                originalTableColl.fetch({"url":url,reset:true});
            }else{
                originalTableListView= new OriginalTableListView({'model':this.model});
            }
            $("#addTabeList-dialog").dialog("open");
            $("#cancelAddTable").click(function (){
                $("#addTabeList-dialog").dialog("close");
            });
            $("#subAddTable").unbind( "click" );
            $("#subAddTable").click(function (){
            	var addtableval;
                var addTables= new  RestTableCollection();
                _.each(originalTableListView.itemViews,function(v){
                    if(v.selected){
                        tableName= v.$(".list-group-item-span").html();
 						addtableval = {
		                'bucket': bucketdate,
		                'name': tableName
		            	};
                    }
                });
            	addtableval = JSON.stringify(addtableval);
            	console.log(addtableval);
				addtablelist.data=addtableval;
				if(tableName){
				$.ajax(addtablelist);
				}else{
        		jAlert("没有得到表名，无法提交,请选择表.","提示");
        		return;
				}
            });
        	}if(dbType==2){//Mongo数据类型
    			 $("#addTabeList-dialog").dialog({
        			height : 320,
			    });
    		$(".list-group-bg").hide();
    		$(".list-group-bg2").show();
            $("#addTabeList-dialog").dialog("open");
            $("#cancelAddTable").click(function (){
                $("#addTabeList-dialog").dialog("close");
            });
            $("#subAddTable").unbind( "click" );
            $("#subAddTable").click(function (){
            	var name=$.trim($('#table_name').val());
            	var selectval = $.trim($("#new-table-select").val());
            	if(name){
            	var addtableval = {
                'bucket': bucketdate,
                'name': name
            	};
            	addtableval = JSON.stringify(addtableval);
            	alert(selectval);
            	addtablelist.data=addtableval;
				$.ajax(addtablelist);
            	}else{
            		jAlert("请输入表名","提示");
            	}
            }); /*end click*/
        	}
        }
    });
    var restTablesView;
    // ====RestAdminField Model=========
    var RestAdminField =  Backbone.Model.extend({
        idAttribute: "name"
    });

    // ====RestAdminField View===对字段进行排序未完成======
    var RestAdminFieldView = Backbone.View.extend({
        key:"",
        tagName : "th",
        fieldTemp : _.template($('#tabOriginal-template').html()),//Tab属性表栏
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events:{
            "click .filedName" : "sort",
        },
        render:function(){
            var modelJson= this.model.toJSON();
            //console.log(modelJson);
            modelJson.type= SqlType[modelJson.type];
            var itemHtml = this.fieldTemp(modelJson);
            //console.log(itemHtml);
            this.setKey(this.model.get("name"));
            $(this.el).html(itemHtml);
            $(this.el).addClass("fieldTh");
            return this;
        },
        sort:function(){
            console.log("sort__"+this.getKey());
            //FIXME 放到appview里
            var dom =this.$("div[name='filedSort']");
            var curClass =dom.attr('class');
            $("div[name='filedSort']").attr('class','filedSort');
            if(curClass=="filedSort" ||curClass=="filedSort des" ){
                dom.attr('class','filedSort asc');
                return ;
            }
            if(curClass=="filedSort asc" ){
                dom.attr('class','filedSort des');
            }
        },
        getKey:function(){
           return  this.key;
        },
        setKey:function(key){
            this.key=key;
        },
    });
    var RestAdminFieldCollection =  Backbone.Collection.extend({
        url:restServerCtx+"/admin/system/restadmin/original",
        model : RestAdminField,
        //FIXME //对结果进行排序
        comparator:function(model){
           // console.log("#comparator:"+model.get("name")+"_"+fieldSorts[model.get("name")]);
            return fieldSorts[model.get("name")];
        }
    });
    
     restAdminFields = new RestAdminFieldCollection();
    var RestAdminFieldsView = Backbone.View.extend({
        el : $("#restAdminFieldsTr"),
        initialize : function() {
            this.listenTo(restAdminFields, 'reset', this.addAll);
            this.listenTo(restAdminFields, 'all', this.render);
            restAdminFields.fetch({
                success :function(){
                    restAdminFieldsView.addAll();
                },
            });
        },
        addOne : function(restAdminField) {
           // console.log("addOne__"+ (++count));
            var flag = false;
            _.map(fieldSorts,function(v,k){
                // console.log(restAdminField.get("name")+ "__"+k);
                if(restAdminField.get("name")==k){
                    flag= true;
                }
            });
            if(!flag){
                return ;
            }
            var view = new RestAdminFieldView({
                model : restAdminField
            });
            $("#restAdminFieldsTr").append(view.render().el);
        },
        addAll : function() {
            restAdminFields.each(this.addOne, this);
        },
    });
    
    /**====RestAdminCtnt Model==表权限=======  */
    var RestAdminCtnt =  Backbone.Model.extend({
        idAttribute: "_id",
        isSelect: false,
    });

    /** ====RestAdminCtnt  Collection=========   */
    var RestAdminCtntCollection =  Backbone.Collection.extend({
        url:restServerCtx+"/system/restAdmin/one",
        model : RestAdminCtnt,
    });
        
    /**====RestAdminCtntTr View========= */
    var RestAdminCtntTrView = Backbone.View.extend({
        tagName : "tr",
        ctntTrTemp : _.template($('#tabCtntTr-template').html()),//字段表栏
        ctntTdTemp : _.template($('#tabCtntTd-template').html()),//要选择的字段类型
        mark:false,//是否选中
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events:{
            "change .td_chk":"setSign",//设置标记
            "click .td_chk":"getModel"
        },
        render:function(){
            adminCtnt= this.model;
            var trHtml = this.ctntTrTemp(this.model.toJSON());
            var trDom=$(this.el).html(trHtml);
            //console.log(trDom.html());
            var ctntTdTemp= this.ctntTdTemp;
            _.map( fieldSorts, function(v,k){
                //console.log( k+":"+v+"/ ");
               // console.log(adminCtnt.toJSON());
                //这里 控制显示转换
                var tdView ={};
                if(k=="type"){
                     tdView= ctntTdTemp({key:k,value:SqlType[adminCtnt.get(k)]});
                }else if(k=="displayType"){
                    tdView= ctntTdTemp({key:k,value:displayTypeMap[adminCtnt.get(k)]});
                }else if(k=="searchType"){
                    tdView= ctntTdTemp({key:k,value:searchTypeMap[adminCtnt.get(k)]});
                }else if(k=="formType"){
                    tdView= ctntTdTemp({key:k,value:formTypeMap[adminCtnt.get(k)]});
                }else{
                    tdView= ctntTdTemp({key:k,value:adminCtnt.get(k)});
                }
                trDom.append(tdView);
            });
//             console.log(this.el);
            return this;
        },
        getModel:function(){
        	checkModel=this.model;
        },
        setSign:function(){
            var chkProp =this.$(".td_chk").prop("checked");
            this.model.isSelect = chkProp;
            this.mark=chkProp;
//          console.log(" isSelect  :"+ this.model.get("isSelect"));
//          console.log(" mark  :"+this.mark);
        },
        showEdit:function(){
            if(this.mark==true){
               // console.log("showEdit ");
                var count =1;
                _.each(this.$(".field-val"),function(val){
                    if(count>1){  //通过 位置控制是否可编辑
                        $(val).hide();
                    }
                    count++;
                });
                count =1;
                _.each(this.$(".field-edit"),function(edit){
                    if(count>1){
                        $(edit).show();
                        console.log(edit);
                    }
                    count++;
                });
            }
        },
        saveCtnt:function(){
            var upCtnt =this.model;
            var bucket = upCtnt.get("bucket");
            var tabName = upCtnt.get("tableName");
            if(this.mark==true){
                //this.model.set("request",0);
                // console.log("showEdit ");
                _.each(this.$(".field-edit"),function(dom){
                     //console.log("saveCtnt:"+ $(dom).data('key')+"="+$(dom).val());
                     upCtnt.set( $(dom).data('key'),$(dom).val(),{silent: true});
                });
                var upCtntClone = upCtnt.clone();
                if(upCtntClone.get("id")!=0){
                    upCtntClone.idAttribute ="id";
                    upCtntClone.url =upCtnt.url()+"/"+upCtntClone.get("id");
                }else{
                    upCtntClone.url =upCtnt.url();
                }
                upCtntClone.save(null,{
                    error:function(){
                    	jAlert("字段["+upCtnt.get("name")+"] 保存失败",'提示');
                    },
                    success:function(){
                        _.each(this.$(".field-edit"),function(dom){
                            $(dom).hide();
                        });
                        _.each(this.$(".field-val"),function(dom){
                            $(dom).show();
                        });
                        this.$(".td_chk").prop("checked",false);
                        upCtnt.set("request",upCtntClone.get("request")==1?true:false);
                        tabOptionView.reset();
                        jAlert("字段["+upCtnt.get("name")+"] 已保存",'提示');
                        
                        $.ajax({
                            type:"DELETE",
                            url:restServerCtx+"/cache/admin/"+bucket+"/"+tabName,
                            success:function(){
                                console.log( bucket+"/"+tabName+"  缓存清除成功.");
                            },
                            error:function(){
                                console.log( bucket+"/"+tabName+"  缓存清除失败.");
                            }
                        });
                    }
                });
            }
        },
        viewReset:function(){
            this.mark=false;//去掉标记
            this.$(".td_chk").prop("checked",false);
            _.each(this.$(".field-edit"),function(dom){
                $(dom).hide();
            });
            _.each(this.$(".field-val"),function(dom){
                $(dom).show();
            });
        }
    });

    var restAdminCtnts = new RestAdminCtntCollection();
    
    /** ====RestAdminCtnts  View=========   */
    var RestAdminCtntsView = Backbone.View.extend({
        el : $("#restAdminCtnts"),
        initialize : function() {
            this.listenTo(restAdminCtnts, 'reset', this.addAll);
            this.listenTo(restAdminCtnts, 'add', this.addOne);
          //  this.listenTo(restAdminCtnts, 'all', this.render);
        },
        addOne : function(restAdminCtnt) {
           // console.log("addOne__"+ (++count));
            var view = new RestAdminCtntTrView({
                model : restAdminCtnt
            });
            restAdminCtntsViews.push(view);
            $("#restAdminCtntsTb").append(view.render().el);
        },
        addAll : function() {
            //console.log("ADD  ALL");
            restAdminCtnts.each(this.addOne, this);
        },
        render:function(){
            console.log("RestAdminCtntsView.render"+restAdminCtntsViews.length );
            _.each(restAdminCtntsViews,function(v){
                v.remove();
            });
            restAdminCtntsViews=[];
            this.addAll();
        },
    });
    
    var TabOptionView = Backbone.View.extend({
        el : $(".restAdmin_right"),
        initialize : function() {
        },
        events:{
            "click #edit":"toEdit",// 编辑字段
            "click #save":"toSave",//保存字段
            "click #save2":"toSave2",//保存字段
            "click #cancel":"cancelEdit",//取消编辑
            "click #cancel2":"cancelEdit2",//取消添加列
            "click #table_acl":"aclSetting",// 权限控制
            "click #field_acl":"fieaclSeting",//字段权限
            "click #addtablerow":"addtablerow",//添加
            "click #deltablerow":"Deltablerow",//删除
            
        },
        Deltablerow:function(event){
        	if(dbType==1){
        	jAlert("在此应用下，删除功能暂时不开放，敬请期待","温馨提示")
        	return;
        	}
        	if($(".td_chk:checked").length>1){
                jAlert("为避免误操作，仅支持单条操作.",'温馨提示');
                this.cancelEdit();
                return;
            };
            var currentFieldd=checkModel.get("name")||null;//获取当前所选的字段
            var currentFieldid=checkModel.get("id")||null;
        	 if (confirm("确认删除  [" + currentFieldd + "] 吗?")) {
    	 	checkModel.destroy();
            $.ajax({
            	type:"DELETE",
            	contentType:"application/json;charset=UTF-8",
            	url:restServerCtx+"/system/Tableval/one/"+currentFieldid,
            	success:function(){
            		jAlert("已经删除","提示");
            		tabOptionView.reset();
            		$("#deltablerow").hide();
            	},
            	error:function (XMLHttpRequest, textStatus, errorThrown) {
            		jAlert("删除失败，详情请查看控制台(F12)","提示");
                    console.log('-------ERROR-----');
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log('-------ERROR-End----');
              },
            });
        	 }
            event.stopPropagation();
        },
        addtablerow: function(){
        	if(dbType==1){
        	jAlert("在此应用下，添加功能暂时不开放，敬请期待","温馨提示");
        	return;
        	}
        	if(tabclick){
	        	if(a>0){
	        		jAlert("每次只能添加一条","提示");
	        	}else{
	        	var begindate = new Date();
	        	beginTime = begindate.getTime();
	        	$('#restAdminCtntsTb').append('<tr id="addtable-row"><td style="text-align:center"><input type="checkbox" disabled="disabled" class="td_chk"></td><td style="text-align:center"><input id="name"></td><td style="text-align:center"><input id="aliasName"></td><td style="text-align:center"><select id="type" ><option selected="selected" value="0"> null </option><option value="1"> char </option><option value="2"> numeric </option><option value="3"> decimal </option><option value="4"> int </option><option value="5"> smallint </option><option value="6"> float </option><option value="7"> real </option><option value="8"> double </option><option value="12"> varchar </option><option value="16"> boolean </option><option value="70"> datalink </option><option value="91"> date </option><option value="92"> time </option><option value="93"> timestamp </option><option value="-16"> longnvarchar </option><option value="-15"> nchar </option><option value="-9"> nvarchar </option><option value="-8"> rowid </option><option value="-7"> bit </option><option value="-6"> tinyint </option><option value="-5"> bigint </option><option value="-4"> longvarbinary </option><option value="-3"> varbinary </option><option value="-2"> binary </option><option value="-1"> longvarchar </option><option value="1111"> other </option><option value="2000"> java_object </option><option value="2001"> distinct </option><option value="2002"> struct </option><option value="2003"> array </option><option value="2004"> blob </option><option value="2005"> clob </option><option value="2006"> ref </option><option value="2009"> sqlxml </option><option value="2011"> nclob </option></select></td><td style="text-align:center"><input id="minLength"></td><td style="text-align:center"><input id="maxLength"></td><td style="text-align:center"><select id="request"><option value="0">false</option><option value="1">true</option></select></td><td style="text-align:center"><select id="displayType"><option selected="selected" value="1"> TEXT </option><option value="2"> CURSTOM </option><option value="3"> MANY2ONE </option><option value="5"> IMAGE </option></select></td><td style="text-align:center"><input id="displayValue"></td><td style="text-align:center"><input id="sort"></td><td style="text-align:center"><select id="searchType"><option selected="selected" value="0"> NULL </option><option value="3"> EQUAL </option><option value="5"> GREATER_THAN </option><option value="6"> GREATER_THAN_OR_EQUAL </option><option value="7"> LESS_THAN </option><option value="8"> LESS_THAN_OR_EQUAL </option><option value="9"> LIKE </option><option value="11"> IN </option></select></td><td style="text-align:center"><input id="validate"></td><td style="text-align:center"><select id="formType" ><option selected="selected" value="0"> NULL </option><option value="1"> INPUT </option><option value="2"> SELECT </option><option value="3"> RADIO </option><option value="5"> UPLOAD </option></select></td><td style="text-align:center"><input id="formValue"></td></tr>');
	        	var enddate = new Date();
	        	endTime = enddate.getTime();
	        	var usetime = endTime-beginTime;
	        	console.log(beginTime);
	        	console.log(endTime);
	        	console.log(usetime);
			    this.$("#save2").show();
			    this.$("#cancel2").show();
	            a++;
	            console.log(a);
	           }
        	}else{
        		jAlert("请先行选择要操作的表后再操作","提示");
        		tabclick=false;
        	}
        },
        toSave2:function(){
        	var addtablerowval={};
		    	var name=$.trim($('#name').val());
	        	var aliasName=$.trim($('#aliasName').val());
	        	var type=$.trim($('#type').val());
	        	var minLength=$.trim($('#minLength').val());
	        	var maxLength=$.trim($('#maxLength').val());
	        	var request=$.trim($('#request').val());
	        	var displayType=$.trim($('#displayType').val());
	        	var displayValue=$.trim($('#displayValue').val());
	        	var sort=$.trim($('#sort').val());
	        	var searchType=$.trim($('#searchType').val());
	        	var validate=$.trim($('#validate').val());
	        	var formType=$.trim($('#formType').val());
	        	var formValue=$.trim($('#formValue').val());
	        	var addtablerowdata={
	        		'bucket':bucketdate,
	        		'name':name,
	        		'aliasName':aliasName,
	        		'type':type,
	        		'minLength':minLength,
	        		'maxLength':maxLength,
	        		'request':request,
	        		'displayType':displayType,
	        		'displayValue':displayValue,
	        		'sort':sort,
	        		'searchType':searchType,
	        		'validate':validate,
	        		'formType':formType,
	        		'formValue':formValue,
	        		'tablename':currtableName,
	        	}
        		console.log(addtablerowdata);
	        	addtablerowdata = JSON.stringify(addtablerowdata);
	        	console.log(addtablerowdata);
	        	addtablerowval.data=addtablerowdata;
	        	addtablerowval.url= restServerCtx+"/system/Tableval/one";
	        	addtablerowval.type='POST';
        		addtablerowval.contentType="application/json;charset=UTF-8";
        		addtablerowval.success=function (data){
                  		/*清除缓存
            		  $.ajax({
                            type:"DELETE",
                            //method/{bucket}/{restName}/{option}/{version}
                            ///app/{bucket}
                            url:restServerCtx+"/cache/table/"+bucketdate+"/"+tableName,
                            success:function(){
                                console.log(this.url+"  \t  缓存已清除.");
                            },
                            error:function(){
                                console.log(this.url+"  \t   (/ □ \\)~ 清洁工罢工了！");
                            }
                        });
                        *///清除缓存END
		    	$("#addtable-row").remove();
            	$("#save2").hide();
		    	$("#cancel2").hide();
                _.each(restAdminCtntsViews,function(ctntsView){
                	ctntsView.viewReset();
            	});
            	a=0;
            	jAlert("添加成功，请点击左侧表刷新","提示");
        },
        addtablerowval.Error=function (XMLHttpRequest, textStatus, errorThrown) {
                	$('#errMsgDiv').attr('class', 'alert danger');
                    $('#errMsgDiv').attr('title', 'F12 查看错误log');
                    $('#errMsgDiv').attr('class', 'alert success');
                    $('#errMsgDiv').fadeIn(500);
                    $('#errMsgDiv').fadeOut(2500);
                    console.log('-------ERROR-----');
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log('-------ERROR-End----');
               };
        		console.log(addtablerowval);
	        	$.ajax(addtablerowval);
            },
        toEdit:function(){
            
            if($(".td_chk:checked").length<=0){
                jAlert("请选择要编辑的字段",'提示');
                return;
            };
            _.each(restAdminCtntsViews,function(value){
                value.showEdit();
            });
            console.info(restAdminCtntsViews);
            //console.log(ctntsView);
            this.$("#edit").hide();
            this.$("#save").show();
            this.$("#cancel").show();
            $("#deltablerow").show();
        },
        toSave:function(){
            _.each(restAdminCtntsViews,function(ctntsView){
                ctntsView.saveCtnt();
            });
        },
        cancelEdit:function(){
        	$("#deltablerow").hide();
            this.reset();
            _.each(restAdminCtntsViews,function(ctntsView){
                ctntsView.viewReset();
            });
        },
         cancelEdit2:function(){
         	a=0;
         	$("#addtable-row").remove();
         	this.$("#save2").hide();
		    this.$("#cancel2").hide();
		     this.reset();
            _.each(restAdminCtntsViews,function(ctntsView){
                ctntsView.viewReset();
            });
        },
        aclSetting:function(){
            if (!currTable) {
            	jAlert("请选择应用表",'提示');
                return;
            }
            if(!SyncLoad.findFile("../css/acl.css")){
                SyncLoad.includeFile("../css/", [ "acl.css" ]);
            };
            tableAclView.render(currTable);
        },
        fieaclSeting:function(){
        	
        	if($(".td_chk:checked").length<=0){
                jAlert("请选择字段",'提示');
                return;
            };
            if($(".td_chk:checked").length>1){
                jAlert("仅支持操作一条，以最后选的为准",'提示');
                return;
            };
        	if(!SyncLoad.findFile("../css/acl.css")){
                SyncLoad.includeFile("../css/", [ "acl.css" ]);
    		};
    		
            fieldAcldatas=currTable.get("fieldAcl");
			fieldAclView.render(checkModel);        
        },
        reset:function(){
            _.each(restAdminCtntsViews,function(view){
                view.mark=false;
            });
            this.$("#save").hide();
            this.$("#cancel").hide();
            this.$("#edit").show();
        }
    });
    
    
    /**
     * 显示 可以增加的应用表
     */
    var OriginalTableModel =  Backbone.Model.extend({ });
    var OriginalTableColl=  Backbone.Collection.extend({
        model:OriginalTableModel
    });
    var originalTableColl = new OriginalTableColl();
    var OriginalTableList_ItemView = Backbone.View.extend({
        tagName : "li",
        itemViewTemp : _.template($('#list-group-item-temp').html()),
        selected:false,
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render:function(){
            var itemDom =  this.itemViewTemp(this.model.toJSON());
            var curView =this;
            $(this.el).html(itemDom);
            $(this.el).addClass('list-group-item');
            $(this.el).attr('title',"Click to select ");
            $(this.el).toggle(function(){
                $(curView.el).addClass("selected");
                curView.selected=true;
            },function(){
                $(curView.el).removeClass("selected");
                curView.selected=false;
            });
            return this;
        },
    });
    
    var OriginalTableListView = Backbone.View.extend({
        el : "#addTabeList-dialog",
        itemViews: [],
        initialize : function() {
            this.listenTo(originalTableColl, 'add', this.addOne);
            this.listenTo(originalTableColl, 'reset', this.addAll);
            originalTableColl.url = restServerCtx+"/admin/"+this.model.get("bucket")+"/original";
            originalTableColl.fetch({reset:true});
        },
        events:{
        },
        addOne:function(itrmModel){
            var itrmView = new OriginalTableList_ItemView({
                model: itrmModel
            });
            this.itemViews.push(itrmView);
            $(".list-group").append(itrmView.render().el);
        },
        addAll:function(){
            console.log("addAll<<"+this.itemViews.length);
            _.each(  this.itemViews, function(v){
                v.remove();
            });
            this.itemViews=[];
            originalTableColl.each(this.addOne, this);
        }
        
    });
    var originalTableListView ;
      
    
    ResAdminAppView = Backbone.View.extend({
        el : $("#restAdmin"),
        getModel:function(){
            return this.model;
        },
        initialize : function() {
            var m =this.model;
            if(restTablesView){
                restTablesView.undelegateEvents();
                // 解除 原view 事件绑定
            }
            restTablesView=new RestTablesView({model:m});
            if(!restAdminFieldsView){
                restAdminFieldsView= new RestAdminFieldsView();
            }
            if(!tabOptionView){
                tabOptionView =new TabOptionView();
            }
            if(!restAdminCtntsView){
                //console.log("initialize  new");
                restAdminCtntsView= new RestAdminCtntsView({model:m});
            }else{
                console.log("initialize  render");
                restAdminCtntsView.render();
            }
            restAdminResize();
            $(window).resize(restAdminResize);
            
        },
    });
    
});
/**
 * 页面 自适应
 */
function restAdminResize(){
    //tiao整页面大小
    var h = $(".yymblb").height();
    $(".restAdmin").height(h+30);
    var w = $("body").width() -$(".yymblb").width()-$(".restAdmin_left").width();
    $(".restAdmin_right").width(w-40);
}

function toAdmin(){
	window.location.href = adminUrl + "/index.html#/login/"+bucketdate;
};
