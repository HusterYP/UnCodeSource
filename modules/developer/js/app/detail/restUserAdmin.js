var addRolemodel;
var GroupRoleAclView;
var groupRoleAclview;
var GroupShowModelView;
var UsersetCollView;
var UserCollView;
var UserColl;
var useraclmodel;
var acldate; //从数据库里查询得出的用户所拥有的Groups、Roles,格式为：json
var GroupCollView;
var RoleCollView;
var UserGroupRoleAclView;
var userGroupRoleAclView;
var bucketdate1;
var groupRoleColl;
var usergroupColl;
var userroleColl;
var roless;
$(function () {
    //点击左侧栏：用户管理 事件
    GroupShowModelView = Backbone.View.extend({
        el: '#appDetail',
        initialize: function () {
            var bucket = 'test';
        },
        events: {
            'click #restUser_nav': 'showgr'
        },
        showgr: function () {
            $('.loaderBg').show();
            $('#shclDefault').shCircleLoader({
                color: '#fff'
            });
            $('#tab_side ul li a').removeClass('active');
            $('.sidebar_menu_list1').addClass('active');
            $('.side_content_main').hide();
            $('#rest_group_table').html('');
            document.getElementById('rest_group').style.display = 'block';
            $('#rest_group_table').append('<tr><th class="rest_tab_table_th">name</th><th class="rest_tab_table_th2">详情</th><th class="rest_tab_table_th3">操作</th></tr>');
            /*用户组管理 所加载*/
            var GroupColl = Backbone.Collection.extend({
                //url:restServerCtx + "/system/restGroup/one",
                //url:host+"/system/restGroup/one?bucket="+bucketdate,
                url: host + '/system/restGroup/one',
            });
            groupList = new GroupColl();
            if (groupCollView) {
                groupCollView.undelegateEvents();
            }
            groupCollView = new GroupCollView();
            /*用户组管理 所加载 End*/
        },
    });
    //用户组管理
    var GroupModel = Backbone.Model.extend({
        defaults: function () {
            return {
                bucket: '',
                name: '',
                desc: '',
            };
        },
    });
    var GroupModelView = Backbone.View.extend({
        tagName: 'tr',
        restGroupItmeTemp: _.template($('#rest_group_itmeTemp').html()),
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        GroupCtxTemplate: _.template($('#restGroupCtx-template').html()),
        events: {
            'click .rest-group-add': 'showAdd',
            'click .rest-group-delte': 'showDelte',
            'click .rest-group-modify': 'showModify',
            'click .rest-group-role': 'addRole'
        },
        render: function () {
            var itemHtml = this.restGroupItmeTemp(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        },
        addRole: function () {
            $('#rolesList').html('');
            var GroupRoleColl = Backbone.Collection.extend({
                url: host + '/system/restRole/one?bucket=' + bucketdate,
            });
            groupRoleColl = new GroupRoleColl();
            addRolemodel = this.model;
            groupRoleAclView = new GroupRoleAclView();
            groupRoleAclView.render(addRolemodel);
            $('#group-role-dialog').dialog('open');
        },
        showAdd: function () {
            var bucket = bucketdate;
            var newGroup = new GroupModel();
            var ctxHtml = this.GroupCtxTemplate(newGroup.toJSON());
            $('#new-user-dialog').html(ctxHtml);
            $('#user_dialog_title').html('新增用户组');
            $('#submit-user-app').val('确认创建');
            $('#new-user-dialog').dialog('open');
            $('#restuser-group-name').focus();
            $('#submit-user-app').bind('click', function () {
                var name = $.trim($('#restuser-group-name').val());
                var desc = $.trim($('#restuser-group-desc').val());
                newGroup.set({
                    'bucket': bucket,
                    'name': name,
                    'desc': desc
                });
                groupList.create(newGroup, {
                    error: function () {
                        jAlert('创建失败', '提示');
                    },
                    success: function () {
                        jAlert('创建成功', '提示');
                        $('#new-user-dialog').dialog('close');
                    },
                });
            });
            $('.btn.cancel').bind('click', function () {
                $('#new-user-dialog').dialog('close');
            });
        },
        showDelte: function (event) {
            if (confirm('警告！确认删除吗?,删除后不可恢复！！！！！')) {
                $('.loaderBg').show();
                $('#shclDefault').shCircleLoader({
                    color: '#fff'
                });
                this.model.destroy({
                    success: function (model, response) {
                        $('.loaderBg').hide();
                        $('#shclDefault').hide();
                        jAlert('删除成功', '提示');
                    },
                    error: function (model, response) {
                        jAlert('删除失败', '提示');
                    }
                });
            }
            event.stopPropagation();
        },
        showModify: function () {
            var bucket = bucketdate;
            var ctxHtml = this.GroupCtxTemplate(this.model.toJSON());
            var modifyGroup = this.model;
            $('#new-user-dialog').html(ctxHtml);
            $('#user_dialog_title').html('用户组更改');
            $('#submit-user-app').val('确认更改');
            $('#new-user-dialog').dialog('open');
            $('#restuser-group-name').focus();
            $('#submit-user-app').bind('click', function () {
                var name = $.trim($('#restuser-group-name').val());
                var desc = $.trim($('#restuser-group-desc').val());
                modifyGroup.set({
                    'name': name,
                    'bucket': bucket,
                    'desc': desc
                });
                modifyGroup.save({
                }, {
                    error: function () {
                        jAlert('保存失败', '提示');
                    },
                    success: function () {
                        jAlert(modifyGroup.get('name') + '保存成功.', '提示');
                        $('#new-user-dialog').dialog('close');
                    },
                });
            });
            $('.btn.cancel').bind('click', function () {
                $('#new-user-dialog').dialog('close');
            });
        }
    });
    //	var GroupColl = Backbone.Collection.extend({
    //		url:host+"/"+bucketdate+"/restGroup/one",
    //		//url:restServerCtx + "/system/restGroup/one",
    //	});
    //	var groupList = new GroupColl();
    GroupCollView = Backbone.View.extend({
        el: $('#rest_group'),
        initialize: function () {
            this.listenTo(groupList, 'reset', this.addAll);
            this.listenTo(groupList, 'add', this.addOne);
            this.listenTo(groupList, 'all', this.render);
            groupList.fetch({
                url: groupList.url + '?bucket=' + bucketdate,
                success: function (model, response) {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                },
                error: function () {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                    $('#rest_group_table').append('<labe style=\'color:red\'>暂无数据</labe>');
                }
            });
        },
        events: {
            'click .rest-group-add2': 'showAdd2'
        },
        showAdd2: function () {
            var bucket2 = bucketdate;
            console.log(bucket2);
            $('#rest_group_table').append('<tr><td><input id="restuser-group-name2" class="filedInput" maxlength="100"></td><td><input id="restuser-group-desc2" class="filedInput" maxlength="100"></td><td style="padding: 2px 5px;"><button id="submit-user-app2">提  交 </button><button id="submit-user-cancel2">取消</button></td></tr>');
            //$("#rest_group_table").append($(".addp").clone(true).removeClass().show());
            $('#restuser-group-name2').focus();
            $('#submit-user-app2').bind('click', function (e) {
                var name2 = $.trim($('#restuser-group-name2').val());
                var desc2 = $.trim($('#restuser-group-desc2').val());
                var newGroup2 = new GroupModel();
                ;
                var e = $(e.currentTarget).parent().parent();
                newGroup2.set({
                    'bucket': bucket2,
                    'name': name2,
                    'desc': desc2
                });
                groupList.create(newGroup2, {
                    error: function () {
                        jAlert('创建失败失败', '提示');
                    },
                    success: function () {
                        jAlert('创建成功', '提示');
                        e.remove();
                    }
                });
            });
            $('#submit-user-cancel2').bind('click', function (e) {
                var e = $(e.currentTarget).parent().parent();
                e.remove();
            });
        },
        addOne: function (itme) {
            var view = new GroupModelView({
                model: itme
            });
            this.$('#rest_group_table').append(view.render().el);
        },
        addAll: function () {
            groupList.each(this.addOne, this);
        },
    });
    //	var groupCollView = new GroupCollView();
    //角色管理
    var RoleModel = Backbone.Model.extend({
        defaults: function () {
            return {
                name: '',
                bucket: '',
                desc: '',
            };
        },
    });
    var RoleModelView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        restRoleItmeTemp: _.template($('#rest_role_itmeTemp').html()),
        RoleCtxTemplate: _.template($('#restRoleCtx-template').html()),
        events: {
            'click .rest-role-add': 'showAdd',
            'click .rest-role-delte': 'showDelte',
            'click .rest-role-modify': 'showModify',
        },
        render: function () {
            var itemHtml = this.restRoleItmeTemp(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        },
        showAdd: function () {
            var newRole = new RoleModel({
            });
            var ctxHtml = this.RoleCtxTemplate(newRole.toJSON());
            $('#new-user-dialog2').html(ctxHtml);
            $('#user_dialog_title2').html('新增用户组');
            $('#submit-user-app2').val('确认创建');
            $('#new-user-dialog2').dialog('open');
            $('#restuser-role-name').focus();
            $('#submit-user-app2').bind('click', function () {
                var name = $.trim($('#restuser-role-name').val());
                var desc = $.trim($('#restuser-role-desc').val());
                var bucket = bucketdate;
                //var roles=
                newRole.set({
                    'bucket': bucket,
                    'name': name,
                    'desc': desc
                });
                roleList.create(newRole, {
                    error: function () {
                        jAlert('创建失败', '提示');
                    },
                    success: function () {
                        jAlert('创建成功', '提示');
                        $('#new-user-dialog2').dialog('close');
                    },
                });
            });
            $('#new-user-dialog-cancel2').bind('click', function () {
                $('#new-user-dialog2').dialog('close');
            });
        },
        showDelte: function (event) {
            //删除Role
            if (confirm('警告！确认删除吗?,删除后不可恢复！！！！！')) {
                $('.loaderBg').show();
                $('#shclDefault').shCircleLoader({
                    color: '#fff'
                });
                this.model.destroy({
                    success: function (model, response) {
                        $('.loaderBg').hide();
                        $('#shclDefault').hide();
                        jAlert('删除成功', '提示');
                    },
                    error: function (model, response) {
                        jAlert('删除失败', '提示');
                    }
                });
            }
            event.stopPropagation();
        },
        showModify: function () {
            var bucket = bucketdate;
            var ctxHtml = this.RoleCtxTemplate(this.model.toJSON());
            var modifyRole = this.model;
            $('#new-user-dialog2').html(ctxHtml);
            $('#user_dialog_title2').html('用户组更改');
            $('#submit-user-app2').val('确认更改');
            $('#new-user-dialog2').dialog('open');
            $('#restuser-role-name').focus();
            $('#submit-user-app2').bind('click', function () {
                var name = $.trim($('#restuser-role-name').val());
                var desc = $.trim($('#restuser-role-desc').val());
                modifyRole.set({
                    'name': name,
                    'bucket': bucket,
                    'desc': desc
                });
                modifyRole.save({
                }, {
                    error: function () {
                        jAlert('保存失败', '提示');
                    },
                    success: function () {
                        jAlert(modifyRole.get('name') + '保存成功.', '提示');
                        $('#new-user-dialog2').dialog('close');
                    },
                });
            });
            $('#new-user-dialog-cancel2').bind('click', function () {
                $('#new-user-dialog2').dialog('close');
            });
        },
    });
    //	var RoleColl = Backbone.Collection.extend({
    //		url:host+"/"+bucketdate+"/restRole/one",
    //		//url:restServerCtx+"/system/restRole/one",
    //	});
    //	var roleList = new RoleColl();
    RoleCollView = Backbone.View.extend({
        el: $('#rest_role'),
        initialize: function () {
            this.listenTo(roleList, 'reset', this.addAll);
            this.listenTo(roleList, 'add', this.addOne);
            this.listenTo(roleList, 'all', this.render);
            roleList.fetch({
                url: roleList.url + '?bucket=' + bucketdate,
                success: function (model, response) {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                },
                error: function () {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                    $('#rest_role_table').append('<labe style=\'color:red\'>暂无数据</labe>');
                }
            });
        },
        events: {
            'click .rest-role-add2': 'showAdd2'
        },
        showAdd2: function () {
            var bucket = bucketdate;
            $('#rest_role_table').append('<tr><td><input id="restuser-role-name2" class="filedInput" maxlength="100"></td><td><input id="restuser-role-desc2" class="filedInput" maxlength="100"></td><td style="padding: 2px 5px;"><button id="submit-role-app2">提  交 </button><button id="submit-role-cancel2">取消</button></td></tr>');
            //$("#rest_group_table").append($(".addp").clone(true).removeClass().show());
            $('#restuser-role-name2').focus();
            $('#submit-role-app2').bind('click', function (e) {
                var name2 = $.trim($('#restuser-role-name2').val());
                var desc2 = $.trim($('#restuser-role-desc2').val());
                var newRole2 = new RoleModel();
                ;
                var e = $(e.currentTarget).parent().parent();
                newRole2.set({
                    'bucket': bucket,
                    'name': name2,
                    'desc': desc2
                });
                roleList.create(newRole2, {
                    error: function () {
                        jAlert('创建失败！', '提示');
                    },
                    success: function () {
                        jAlert('创建成功', '提示');
                        e.remove();
                    }
                });
            });
            $('#submit-role-cancel2').bind('click', function (e) {
                var e = $(e.currentTarget).parent().parent();
                e.remove();
            });
        },
        addOne: function (itme) {
            var view = new RoleModelView({
                model: itme
            });
            $('.loaderBg').show();
            $('#shclDefault').show();
            this.$('#rest_role_table').append(view.render().el);
            $('.loaderBg').hide();
            $('#shclDefault').hide();
        },
        addAll: function () {
            groupList.each(this.addOne, this);
        }
        //      ,
        //      render:function(){
        //      	$(".loaderBg").hide();
        //      }

    });
    //	var roleCollView = new RoleCollView();
    //用户管理
    var UserModel = Backbone.Model.extend({
    });
    var UserModelView = Backbone.View.extend({
        tagName: 'tr',
        restUserItmeTemp: _.template($('#rest_user_itmeTemp').html()),
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events: {
            'click .rest_user_delete': 'showDelte',
            'click .rest_user_modify': 'showModify',
            'click .rest_user_add': 'userAdd',
            'click .rest_user_grl': 'usergrl'
        },
        render: function () {
            var itemHtml = this.restUserItmeTemp(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        },
        showDetail: function () {
            jAlert('该功能暂不开放', '提示');
        },
        showDelte: function () {
            jAlert('该功能暂不开放', '提示');
        },
        showModify: function () {
            jAlert('该功能暂不开放', '提示');
        },
        userAdd: function () {
            jAlert('该功能暂不开放', '提示');
        },
        usergrl: function () {
            $('#groupsList2').html('');
            $('#rolesList2').html('');
            var UsergroupColl = Backbone.Collection.extend({
                url: host + '/system/restGroup/one?bucket=' + bucketdate,
            });
            usergroupColl = new UsergroupColl();
            var UserroleColl = Backbone.Collection.extend({
                url: host + '/system/restRole/one?bucket=' + bucketdate,
            });
            userroleColl = new UserroleColl();
            useraclmodel = this.model;
            var GroupRolebucket = {
                'bucket': bucketdate,
                'username': useraclmodel.attributes.username
            };
            GroupRolebucket = JSON.stringify(GroupRolebucket);
            $.ajax({
                type: 'get',
                dataType: 'json',
                data: GroupRolebucket,
                contentType: 'application/json;charset=UTF-8',
                //url:host+"/"+bucketdate+"/restuseracl2/one",//该接口提供  根据Bucket username进行匹配后得到的所选用户的Group Role
                url: host + '/system/restuseracl2/one',
                success: function (data) {
                    acldate = data;
                    userGroupRoleAclView = new UserGroupRoleAclView();
                    userGroupRoleAclView.render(acldate);
                    $('#user-grl-dialog').dialog('open');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('-------ERROR-----');
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log('-------ERROR-End----');
                    jAlert('获取用户权限时出错', '提示');
                }
            });
        }
    });
    //   在Tab.js 用户管理所加载	根据App来填充页面
    //	 var UserColl = Backbone.Collection.extend({
    //		  url:host+"/"+bucketdate+"/users",
    //	});
    //	var userList = new UserColl();
    UserCollView = Backbone.View.extend({
        el: $('#rest_user'),
        initialize: function () {
            this.listenTo(userList, 'reset', this.addAll);
            this.listenTo(userList, 'add', this.addOne);
            this.listenTo(userList, 'all', this.render);
            userList.fetch({
                success: function (model, response) {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                },
                error: function () {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                    $('#rest_user_table').append('<labe style=\'color:red\'>暂无数据</labe>');
                }
            });
        },
        events: {
            'click .rest-user-add2': 'showAdd2',
        },
        showAdd2: function () {
            jAlert('该功能暂不开放', '提示');
        },
        addOne: function (itme) {
            var view = new UserModelView({
                model: itme
            });
            this.$('#rest_user_table').append(view.render().el);
        },
        addAll: function () {
            userList.each(this.addOne, this);
        },
    });
    //用户表设置
    var RestsetModelView = Backbone.View.extend({
        el: '#rest_userCFG',
        restUserSetTemplate: _.template($('#restuserset-template').html()),
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events: {
            'click #usersetput': 'usersetModify',
        },
        usersetModify: function () {
            var userSetdate = this.model;
            var table_Name = $.trim($('#table_Name').val());
            var tablebucket = $.trim($('#tablebucket').val());
            var username_Field = $.trim($('#username_Field').val());
            var usersetbucket = $.trim($('#password_Field').val());
            var status_Field = $.trim($('#status_Field').val());
            var email_Auth = $.trim($('#email_Auth').val());
            var default_Group = $.trim($('#default_Group').val());
            var email_Field = $.trim($('#email_Field').val());
            var mobile_Field = $.trim($('#mobile_Field').val());
            if (!table_Name) {
                jAlert('请填写表名称', '提示');
                return;
            } else if (!usersetbucket) {
                jAlert('用户表标示未获取得到', '提示');
                return;
            }
            userSetdate.set({
                'bucket': tablebucket,
                'tableName': table_Name,
                'passwordField': usersetbucket,
                'usernameField': username_Field,
                'statusField': status_Field,
                'emailAuth': email_Auth,
                'defaultGroup': default_Group,
                'emailField': email_Field,
                'mobileField': mobile_Field
            });
            userSetdate.save(null, {
                success: function () {
                    $.ajax({
                        type: 'DELETE',
                        url: restServerCtx + '/cache/user/' + bucketdate,
                        success: function () {
                            console.log(this.url + '  \t  缓存已清除.');
                        },
                        error: function () {
                            console.log(this.url + '  \t   (/ □ \\)~ 清洁工罢工了！');
                        }
                    });
                    jAlert('更新成功', '提示');
                },
                error: function () {
                    jAlert('更新失败', '提示');
                }
            });
        },
        render: function () {
            var itemHtml = this.restUserSetTemplate(this.model.toJSON());
            $(this.el).html(itemHtml);
            return this;
        }
    });
    UsersetCollView = Backbone.View.extend({
        initialize: function () {
            this.listenTo(restsetList, 'reset', this.addAll);
            this.listenTo(restsetList, 'add', this.addOne);
            this.listenTo(restsetList, 'all', this.render);
            restsetList.fetch({
                url: restsetList.url + '?bucket=' + bucketdate,
                success: function (model, response) {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                },
                error: function () {
                    $('.loaderBg').hide();
                    $('#shclDefault').hide();
                }
            });
        },
        addOne: function (itme) {
            var view = new RestsetModelView({
                model: itme
            });
            this.$('#rest_userCFG').append(view.render().el);
            $('.loaderBg').hide();
            $('#shclDefault').hide();
        },
        addAll: function () {
            groupList.each(this.addOne, this);
        },
    });
});
////////////////////////////
/*=======用户组的Role，用以展示============*/
var RestRoleView = Backbone.View.extend({
    tagName: 'label',
    grouproleTemplate: _.template($('#groupRole-template').html()),
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () {
        var itemHtml = this.grouproleTemplate(this.model.toJSON());
        $(this.el).html(itemHtml);
        $(this.el).attr('title', this.model.get('name') + '\n' + (this.model.get('desc') || ' '));
        return this;
    }
});
//  var GroupRoleColl  = Backbone.Collection.extend({
//  	//url:host+"/"+bucketdate+"/restRole/one",
//      //url : host + '/system/restRole/one',
//      url:host+'/system/restRole/one?bucket='+bucketdate,
//  });
//  var groupRoleColl = new GroupRoleColl();
var GroupRoleCollView = Backbone.View.extend({
    el: '#groupRole',
    initialize: function () {
        this.listenTo(groupRoleColl, 'reset', this.addAll);
        this.listenTo(groupRoleColl, 'add', this.addOne);
        this.listenTo(groupRoleColl, 'all', this.render);
        groupRoleColl.fetch();
    },
    addOne: function (restRole) {
        var view = new RestRoleView({
            model: restRole
        });
        $('td[data-aclType=\'Group_role\']').append(view.render().el);
    },
    addAll: function () {
        if (groupRoleColl.length == 0) {
            $('td[data-aclType=\'Group_role\']').html('NO DATE');
        }
        groupRoleColl.each(this.addOne, this);
    },
    render: function () {
        roless = addRolemodel.get('roles') || null;
        console.log(roless);
        this.adapt(roless);
    },
    //显示 Group所拥有 内容
    adapt: function (roless) {
        this.$('input[type=\'checkbox\']').attr('checked', false);
        if (!roless) {
            return;
        }
        var roless = roless.split(',');
        $.each(roless, function (acl_i, acl_v) {
            if (!acl_v) {
                return;
            }
            $.each($('#rolesList input[type=\'checkbox\']'), function (i, dom) {
                if (acl_v == dom.value) {
                    dom.checked = true;
                }
            });
        });
    },
});
/////////
/*============GroupRoleAclView=用以用户组添加Role===========*/
GroupRoleAclView = Backbone.View.extend({
    el: $('#group-role-dialog'),
    initialize: function () {
        $('#group-role-dialog').dialog({
            title: '<span id="group-role-dialog_title">Role设置</span>',
            autoOpen: false,
            width: 600,
            height: 476,
            modal: true,
            close: function () {
                $('#group-role-alert').hide();
                $('#new-user-dialog-cancel').html('取消');
            }
        });
        new GroupRoleCollView({
            model: this.model
        });
        $('#submit-group-role').bind('click', function () {
            var rolesares = {
            };
            var roleCnt = [
            ];
            $.each($('#rolesList input[type=\'checkbox\']'), function (i, dom) {
                if (dom.checked) {
                    roleCnt.push(dom.value);
                }
            });
            rolesares = roleCnt.join(',');
            console.log(rolesares);
            if (rolesares.length < 0) {
                jAlert('创建失败！', '提示');
            }
            addRolemodel.save('roles', rolesares, {
                wait: true,
                success: function () {
                    $('#group-role-alert').hide();
                    $('#group-role-alert').html('success');
                    $('#group-role-alert').attr('class', 'alert success');
                    $('#group-role-alert').fadeIn(500);
                    $('#group-role-alert').fadeOut(2500);
                    $('#new-user-dialog-cancel').html('完成');
                },
                error: function (err, resp) {
                    $('#group-role-alert').hide();
                    $('#group-role-alert').html('[' + resp.status + '] ' + resp.statusText + '!    \'F12\' 可以查看错误log.');
                    console.log('权限设置Error :' + resp.responseText);
                    $('#group-role-alert').attr('class', 'alert danger');
                    $('#group-role-alert').attr('title', 'F12 查看错误log');
                    $('#group-role-alert').fadeIn(500);
                    $('#group-role-alert').fadeOut(2500);
                }
            });
        });
        $('#new-user-dialog-cancel').bind('click', function () {
            $('#group-role-dialog').dialog('close');
        });
        $('#group-role-alert').hide();
    },
    render: function (addRolemodel) {
        console.log(addRolemodel);
        $('#group-role-dialog_title').html('权限设置-' + addRolemodel.get('name'));
    },
    // methodCtxTemplate : _.template($('#methodCtx-template').html()),
});
//  	var	groupRoleAclView= new GroupRoleAclView();
////////////////////////////
/*=======用户的Group、Role，用以展示============*/
////UserGroup
var UsergroupView = Backbone.View.extend({
    tagName: 'label',
    restgroupTemplate: _.template($('#userGroup-template').html()),
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () {
        var itemHtml = this.restgroupTemplate(this.model.toJSON());
        $(this.el).html(itemHtml);
        $(this.el).attr('title', this.model.get('name') + '\n' + (this.model.get('desc') || ' '));
        return this;
    }
});
//  var UsergroupColl  = Backbone.Collection.extend({
//  	//url:host+"/"+bucketdate+"/restGroup/one",
//      //url : host + '/system/restGroup/one',
//      url:host+'/system/restGroup/one/'+bucketdate,
//  });
//  var usergroupColl = new UsergroupColl();
var UsergroupCollView = Backbone.View.extend({
    el: '#userGroup',
    initialize: function () {
        this.listenTo(usergroupColl, 'reset', this.addAll);
        this.listenTo(usergroupColl, 'add', this.addOne);
        usergroupColl.fetch();
    },
    addOne: function (restGroup) {
        console.log('UsergroupCollView add one');
        var view = new UsergroupView({
            model: restGroup
        });
        $('td[data-aclType=\'user-group\']').append(view.render().el);
        this.showdate(acldate);
    },
    addAll: function () {
        $('td[data-aclType=\'user-group\']').html('');
        if (usergroupColl.length == 0) {
            $('td[data-aclType=\'user-group\']').html('无匹配用户组');
        }
        usergroupColl.each(this.addOne, this);
    },
    render: function (acldate) {
        console.log('UsergroupCollView render');
    },
    showdate: function (acldate) {
        this.$('input[type=\'checkbox\']').attr('checked', false);
        if (!acldate) {
            return;
        }
        $.each(acldate, function (acl_i, acl_v) {
            if (!acl_v) {
                return;
            }
            var aclArr = acl_v.split(',');
            $.each($('#' + acl_i + 'List2 input[type=\'checkbox\']'), function (i, dom) {
                for (g_i in aclArr) {
                    if (aclArr[g_i] == dom.value) {
                        dom.checked = true;
                    }
                }
            });
        });
    },
});
///////UserRole
var UserroleView = Backbone.View.extend({
    tagName: 'label',
    restroleTemplate: _.template($('#UserRole-template').html()),
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () {
        var itemHtml = this.restroleTemplate(this.model.toJSON());
        $(this.el).html(itemHtml);
        return this;
    }
});
//  var UserroleColl  = Backbone.Collection.extend({
//  	//url:host+"/"+bucketdate+"/restRole/one",
//      //url : host + '/system/restRole/one111',
//      url:host+'/system/restRole/one/'+bucketdate,
//  });
//  var userroleColl = new UserroleColl();
var UserroleCollview = Backbone.View.extend({
    el: '#userGroup',
    initialize: function () {
        this.listenTo(userroleColl, 'reset', this.addAll);
        this.listenTo(userroleColl, 'add', this.addOne);
        userroleColl.fetch();
    },
    addOne: function (restGroup) {
        console.log('UserroleCollview add one');
        var view = new UserroleView({
            model: restGroup
        });
        $('td[data-aclType=\'User_role\']').append(view.render().el);
        this.showdate(acldate);
    },
    addAll: function () {
        $('td[data-aclType=\'User_role\']').html('');
        userroleColl.each(this.addOne, this);
    },
    render: function () {
        console.log('UserroleCollview render');
    },
    //用来展示用户所拥有 的Group+Role
    showdate: function (acldate) {
        this.$('input[type=\'checkbox\']').attr('checked', false);
        if (!acldate) {
            return;
        }
        $.each(acldate, function (acl_i, acl_v) {
            if (!acl_v) {
                return;
            }
            var aclArr = acl_v.split(',');
            $.each($('#' + acl_i + 'List2 input[type=\'checkbox\']'), function (i, dom) {
                for (g_i in aclArr) {
                    if (aclArr[g_i] == dom.value) {
                        dom.checked = true;
                    }
                }
            });
        });
    },
});
/*============GroupRoleAclView=用以用户添加Role、Group===========*/
UserGroupRoleAclView = Backbone.View.extend({
    el: $('#user-grl-dialog'),
    initialize: function () {
        $('#user-grl-dialog').dialog({
            title: '<span id="user-group-role-dialog_title">用户权限设置</span>',
            autoOpen: false,
            width: 600,
            height: 476,
            modal: true,
            close: function () {
                $('#user-group-role-alert').hide();
                $('#new-user-dialog-cancel3').html('取消');
            }
        });
        new UsergroupCollView({
            model: this.model
        });
        new UserroleCollview({
            modell: this.model
        });
        $('#submit-user-group-role').bind('click', function () {
            //取出所选择的权限
            var GroupRolevalue = {
                'groups': '',
                'roles': ''
            };
            $.each(GroupRolevalue, function (acl_i, acl_v) {
                var GrRoval = [
                ];
                $.each($('#' + acl_i + 'List2 input[type=\'checkbox\']'), function (i, dom) {
                    if (dom.checked) {
                        GrRoval.push(dom.value);
                    }
                });
                GroupRolevalue[acl_i] = GrRoval.toString();
                if (!GroupRolevalue[acl_i]) {
                    delete GroupRolevalue[acl_i];
                }
            });
            GroupRolevalue.bucket = bucketdate;
            GroupRolevalue.username = useraclmodel.attributes.username;
            console.log('-------用户所获取的Group、Role值-----');
            console.log(GroupRolevalue);
            console.log('------------');
            //GroupRolevalue = JSON.parse(GroupRolevalue);
            //GroupRolevalue=eval("(" + GroupRolevalue + ")");
            GroupRolevalue = JSON.stringify(GroupRolevalue);
            console.log(GroupRolevalue);
            $.ajax({
                type: 'POST',
                //url:host+"/"+bucketdate+"/restuseracl/one",
                url: host + '/system/restuseracl/one',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                data: GroupRolevalue,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('-------ERROR-----');
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    console.log('-------ERROR-End----');
                    $('#user-group-role-alert').attr('class', 'alert danger');
                    $('#user-group-role-alert').attr('title', 'F12 查看错误log');
                    $('#user-group-role-alert').fadeIn(500);
                    $('#user-group-role-alert').fadeOut(2500);
                },
                success: function (msg) {
                    $('#user-group-role-alert').hide();
                    $('#user-group-role-alert').html('success');
                    $('#user-group-role-alert').attr('class', 'alert success');
                    $('#user-group-role-alert').fadeIn(500);
                    $('#user-group-role-alert').fadeOut(2500);
                    $('#new-user-dialog-cancel3').html('完成');
                    console.log(msg);
                },
            });
        });
        $('#new-user-dialog-cancel3').bind('click', function () {
            $('#user-grl-dialog').dialog('close');
        });
    },
    render: function (acldate) {
        $('#user-group-role-alert').hide();
        //      	console.log("----------方法权限------");
        //          console.log(acldate);
        //          console.log("----------方法权限-----End-");
        //this.showdate(acldate);
    },
});
//  	var	userGroupRoleAclView= new UserGroupRoleAclView();
