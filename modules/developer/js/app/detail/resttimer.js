var TimerView;
var timername="";
var tierid;
var RestmethodListView;
/***Begin**/
$(function() {
var TimerModel = Backbone.Model.extend({
	defaults: function() {
		return {
			name: '',
			type: '',
			day: '',
			week: '',
			hour: '',
			minutes: '',
			methodId: '',
			time: '',
			bucket: '',
		};
	},
});
var TimerModelView = Backbone.View.extend({
	tagName: 'li',
	timerItmeTemp: _.template($('#restTimer-template').html()),
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	events: {
		"click .resttime_lib": "Gettimer",
		"click #tab_timer": "tabtimer",
		"click .timer_delete": "deltimer",
	},
	Gettimer: function() {
		alert("查看暂未开放");
	},
	tabtimer: function() {
		$("#Timerlists >li").removeClass("on");
		$(this.el).addClass("on");
		timername = this.model.get("name");
		tierid=this.model.get("id");
	},
	deltimer: function(event) {
		var currm = this.model;
		console.log(currm);
		if (confirm("确认删除  [" + this.model.get('name') + "] 计划吗?")) {
			this.model.destroy({
				success: function(model, response) {
					jAlert("删除成功", '提示');
				},
				error: function(model, response) {
					jAlert("删除失败", '提示');
				}
			});
		}
		event.stopPropagation();
	},
	render: function() {
		var itemHtml = this.timerItmeTemp(this.model.toJSON());
		$(this.el).html(itemHtml);
		$(this.el).addClass("tabLi");
		return this;
	},
});
TimerView = Backbone.View.extend({
	el: $(".timer_left"),
	initialize: function() {
		this.listenTo(timerCollection, 'reset', this.addAll);
		this.listenTo(timerCollection, 'add', this.addOne);
		this.listenTo(timerCollection, 'all', this.render);
		timerCollection.fetch({
			url: timerCollection.url + '?bucket=' + bucketdate
		});
	},
	events: {
		"click #add_resttimer": "Addtimer",
	},
	Addtimer: function() {
		$('#timerList').val('');
		$("#new-resttimer-dialog").dialog("open");
		$("#submit-save-resttimer").click(function() {
			var name = $.trim($('#timerList').val());
			if (!name) {
				jAlert('请输入计划名！', '提示');
				return;
			} else {
				var timer = new TimerModel();
				timer.set({
						"bucket": bucketdate,
						"name": name
					}),
					timerCollection.create(timer, {
						error: function() {
							jAlert('创建失败！', '提示');
						},
						success: function() {
							$("#new-resttimer-dialog").dialog("close");
							jAlert('创建成功', '提示');
						}
					});
			}
		});
		$("#new-resttimer-cancel").click(function() {
			$("#new-resttimer-dialog").dialog("close");
		});
	},
	addOne: function(itme) {
		var view = new TimerModelView({
			model: itme
		});
		this.$('#Timerlists').append(view.render().el);
	},
	addAll: function() {
		timerCollection.each(this.addOne, this);
	},
});
/*********************************/

var methodModel = Backbone.Model.extend({});
//var RestmethodList = Backbone.Collection.extend({
//	url: restServerCtx + "/system/restMethods/one",
//	model: methodModel,
//});
//var methodList = new RestmethodList();
// ====method View=========
var RestmethodView1 = Backbone.View.extend({
	tagName: "label",
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	methodTemplate: _.template($('#timermeth-template').html()),
	render: function() {
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
		return this;
	}
});

RestmethodListView = Backbone.View.extend({
	el: $(".select_func"),
	initialize: function() {
		this.listenTo(methodList, 'reset', this.addAll);
		this.listenTo(methodList, 'add', this.addOne);
		methodList.fetch({
			url : methodList.url+"?bucket=system",
			reset: true
		});
	},
	events: {
			"click #timer_save": "timersave"
		},
			timersave:function() {
	var timertab = $('.rwdd .work_tab a.active').index();//重复OR仅一次
	var methlist = {};//选择的云方法
	var methlist2=[];
//	var methlist = new Array();
//      $('input:checkbox[name=cloudId]:checked').each(function () {
//          methlist.push($(this).val())
//      });
        $('input:checkbox[name=cloudId]').each(function (i, dom) {
        	if (dom.checked) {
                    methlist2.push(dom.value);
                }
        });
    methlist = methlist2.join(',');
    if(timername.length<=0){
			jAlert('还没有选计划哦', '提示');
			return ;
    }
	if(methlist.length<=0){
			jAlert('还没有选择云方法哦', '提示');
			return ;
	}
	var time;
	var timerdatalist={};
	timerdatalist.url=restServerCtx+"/system/restTimer/one/"+tierid;
	timerdatalist.contentType="application/json;charset=UTF-8";
	timerdatalist.type='PUT';
	timerdatalist.success=function(data){jAlert('成功了', '提示')};
	timerdatalist.error=function (XMLHttpRequest, textStatus, errorThrown) {
    		jAlert("添加失败，详情请查看控制台(F12)","提示");
            console.log('-------ERROR-----');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            console.log('-------ERROR-End----');
	};
	if (timertab == 1) {
		time = $.trim($('#time').val());
		if (!time) {
			jAlert('还没有选择时间哦', '提示');
			return;
		}
		var timerdata={
			bucket:bucketdate,
			name:timername,
			type:timertab,
			time:time,
            methodId:methlist,
		};
		timerdatalist.data=JSON.stringify(timerdata);
		$.ajax(timerdatalist);
	}else{
			var gap = $('select[name=gap] option:first').val();
            var week = $('select[name=week] option:first').val();
            var day = $('select[name=day] option:first').val();
            var hour = $('select[name=hour] option:first').val();
            var minutes = $('select[name=minute] option:first').val();
            alert("gap:"+gap+"week:"+week+"day:"+day+"hour"+hour+"minutes"+minutes);
            var timerdata2={
			bucket:bucketdate,
            name:timername,
			type:timertab,
			time:time,
			hour:hour,
            minutes:minutes,
         	gap:gap,
            week:week,
            day: day,
            methodId: methlist,
		};
		timerdatalist.data=JSON.stringify(timerdata2);
		$.ajax(timerdatalist);
	}
},
    addOne: function (itme) {
            var view = new RestmethodView1({
                model: itme
            });
            this.$('#timer_tab').append(view.render().el);
        },
	addAll: function() {
		methodList.each(this.addOne, this);
	},
});
});





$(function() {
	$('#time').datetimepicker({
		dayOfWeekStart: 1,
		format: 'Y-m-d H:i',
		minTime: '0',
		minDate: '0',
		lang: 'zh',
		i18n: {
			zh: {
				months: [
					'一月', '二月', '三月', '四月', '五月', '六月',
					'七月', '八月', '九月', '十月', '十一月', '十二月'
				],
				dayOfWeek: [
					"周日", "周一", "周二", "周三", "周四", "周五", "周六"
				]
			}
		}
	});
});
$('#rwddTimeSel1 ul li a').click(function() {
	var c = $(this).attr('rel');
	var d = $('.select_field table tr');
	console.log(c);
	console.log(d);
	if (3 == c) {
		d.show();
		d.eq(4).hide();
	}
	if (4 == c) {
		d.show().eq(1).hide();
		d.eq(4).hide();
	}
	if (5 == c) {
		d.show();
		d.eq(1).hide();
		d.eq(2).hide()
		d.eq(4).hide();
	}if(6==c){
		d.show().eq(1).hide();
	}
});
jQuery('#new-resttimer-dialog').dialog({
	title: '添加新计划<span id="dialog_loading"></span>',
	autoOpen: false,
	height: 310,
	width: 510,
	modal: true
});