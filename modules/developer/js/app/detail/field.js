/**
 * 方法 参数设置
 */

var initFlag = false;

/** Field Model */
var FieldModel;
/** Field Collection */
var FieldCollection;
var fieldCollection;
var FieldView;
var fieldViewArr = [];
var fieldAppView;

function fieldInit() {
    if (!initFlag) {
        $("#edit-field-dialog").dialog({
            title : '<span id="field_dialog_title">参数设置</span>',
            autoOpen : false,
            width : 630,
            height : 306,
            modal : true
        });
        fieldAppView = new FieldAppView({
            model : currentMethod
        });
    }
    initFlag = true;
};
function updateField(currentMethod) {
    fieldInit();
    
    var methodId = currentMethod.get("id");
    $("#edit-field-dialog").dialog("open");
    $("#field_dialog_title").html(
            currentMethod.get("option")
            +" / "
            +currentMethod.get("name")
            +"--参数设置");
        fieldCollection.fetch({
        url : fieldCollection.url + "?methodId=" + methodId,
        reset:true
    });
    // TODO 绑定事件
};

$(function() {

    FieldModel = Backbone.Model.extend({
        defaults:{
            fieldName:"",
            request:0,
            regular:""
        },
        initialize : function() {
        },

        validate: function(attrs) {
            if (!attrs.fieldName) {
                return ["fieldName","isNull"];
            }
            if (!attrs.regular) {
                return ["regular","isNull"];
            }
        },
    });

    FieldView = Backbone.View.extend({
        tagName : "tr",
        fieldCtxTemplate : _.template($('#fieldCtx-template').html()),
        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events:{
            "dblclick td":"edit",
            "click .fieldSave":"saveField",
            "click .fieldDelete":"deleteField",
            "mousemove td":"flaunt",
            "mouseenter span":"flaunt",
            "mouseout td":"dim",
        },
        render : function() {
            var itemHtml = this.fieldCtxTemplate(this.model.toJSON());
            $(this.el).addClass("fieldView");
            $(this.el).html(itemHtml);
            return this;
        },
        flaunt:function(){
            this.$(".fieldDelete").show();
            $(this.el).addClass("flaunt");
        },
        dim:function(){
            this.$(".fieldDelete").hide();
            $(this.el).removeClass("flaunt");
        },
        edit:function(){
            this.$("span").hide();
            this.$("input").show();
            this.$("select").show();
            this.$("input[name='fieldName']").focus();
        },
        deleteField:function(){
            if(confirm("确认删除  [" + this.model.get('fieldName') + "] 字段吗?")){
                this.model.destroy();
            }
        },
        saveField:function(){
            var fieldName = $.trim(this.$("input[name='fieldName']").val());
            var request =  $.trim(this.$("select[name='request']").val());
            var regular =  $.trim(this.$("input[name='regular']").val());
            var bucket =  currentMethod.get("bucket");
            
            this.model.set({
                "fieldName":fieldName,
                "request":request,
                "regular":regular, 
                "bucket":bucket},
                {validate:true});
            if(this.model.validationError){
                var error = this.model.validationError;
                 jAlert(error,'提示');
                //alert(error);
                this.$("input[name='"+error[0]+"']").focus();
                return;
            }

            this.$("input").hide();
            this.$("select").hide();
            this.$("span").show();
            
            if(this.model.get("id")){
                this.model.save({}, {
                    error : function() {
                    	jAlert("更新失败",'提示');
                       // alert("更新失败");
                    },
                    success : function() {
                    	jAlert("更新成功",'提示');
                        //alert("更新成功");
//                        this.$("span[name='fieldName']").val(fieldName);
//                        this.$("span[name='request']").val(request);
//                        this.$("span[name='regular']").val(regular);
                    },
                });
                return ;
            }else{
                var  newField = this.model;
                this.model.destroy();
                fieldCollection.create(newField, {
                    error : function() {
                    	jAlert("新增字段失败",'提示');
                        //alert("新增字段失败");
                    },
                    success : function() {
                    	jAlert(newField.get("id")+"新增字段成功",'提示');
                        //alert(newField.get("id")+"新增字段成功");
//                        this.$("span[name='fieldName']").val(fieldName);
//                        this.$("span[name='request']").val(request);
//                        this.$("span[name='regular']").val(regular);
                    },
                });
            }
        },
    });

    FieldCollection = Backbone.Collection.extend({
        url : restServerCtx + "/system/restFields/one",
        model : FieldModel,
    });
    fieldCollection = new FieldCollection();

    FieldAppView = Backbone.View.extend({
        el : $("#edit-field-dialog"),
        initialize : function() {
            this.listenTo(fieldCollection, 'reset', this.addAll);
            this.listenTo(fieldCollection, 'add', this.addOne);
            this.listenTo(fieldCollection, 'all', this.render);
        },
        events : {
            "click #add_params":"addField",
            "click #submit-save-field":"closeDialog",
        },
        parse:function(){
        },
        // TODO ...
        addOne : function(field) {
            var view = new FieldView({
                model : field
            });
            fieldViewArr.push(view);
            this.$(".edit-field-table").append(view.render().el);
        },
        addAll : function() {
            this.clear();
            fieldCollection.each(this.addOne, this);
        },
        clear : function() {
            _.each(fieldViewArr, function(fieldView) {
                fieldView.remove();
            });
        },
        addField: function(){
            var methodId = currentMethod.get("id");
            var newField = new FieldModel({"methodId":methodId});
            var view = new FieldView({model:newField });
            fieldViewArr.push(view);
            this.$(".edit-field-table").append(view.render().el);
            view.edit();
        },
        closeDialog:function(){
            var haveUnSaved= false;
            var saveBtns = this.$("input[class='fieldSave']");
            _.each(saveBtns,function(saveBtn){
                if($(saveBtn).is(":visible")){
                    haveUnSaved=true;
                    return;
                }
            });
            if(!haveUnSaved){
                $("#edit-field-dialog").dialog("close");
                return;
            }
            if(confirm("有未保存字段,你确定放弃保存并退出吗?")){
                $("#edit-field-dialog").dialog("close");
            }
        }
    });

});
