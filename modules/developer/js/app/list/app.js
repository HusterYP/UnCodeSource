Array.prototype.insertAt = function(a, c) {
    var d = this.slice(0, a);
    var b = this.slice(a);
    d.push(c);
    return (d.concat(b))
};
Array.prototype.removeAt = function(a) {
    var c = this.slice(0, a);
    var b = this.slice(a);
    c.pop();
    return (c.concat(b))
};
Array.prototype.max = function() {
    return Math.max.apply({}, this)
};
Array.prototype.min = function() {
    return Math.min.apply({}, this)
};
date_obj_time = (function(a) {
    return (function(b, c) {
        return "" + ("0" + ((b % 24) || 12)).replace(/.*(\d\d)$/, "$1") + ":" + ("0" + c).replace(/.*(\d\d)$/, "$1")
    })(a.getHours(), a.getMinutes())
})(new Date());
String.prototype.isJSON = function() {
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(this.replace(/"(\\.|[^"\\])*"/g, "")))
};
function locate(a) {
    window.location.href = a
}
function html_encode(a) {
    var b = document.createElement("div");
    b.appendChild(document.createTextNode(a));
    return b.innerHTML
}
function html_decode(a) {
    var b = document.createElement("div");
    b.innerHTML = a;
    return b.innerHTML
}
function fade(dom, msg) {
    if ("none" != $(dom).css("display")) {
        $(dom).hide();
    }
    if (msg) {
        $(dom).html(msg).show();
    }
}
function checkCellData(type, value) {
    var info = document.getElementById("info_error");
    var regFloat = /^-?([1-9]\d*.?\d*|0.\d*[1-9]\d*|0?.0+|0)$/i;
    if (value == undefined) {
        return false
    } else {
        if (value.replace(/(^\s*)|(\s*$)/g, "") == "") {
            return false
        } else {
            if ("number" == type) {
                if (!regFloat.test(value)) {
                    fade(info, "\u5fc5\u987b\u4e3aNumber\u578b");
                    return false
                }
            } else {
                if ("array" == type) {
                    try {
                        var valArr = eval(value);
                        if (valArr instanceof Array) {
                        } else {
                            fade(info, "\u5fc5\u987b\u4e3aArray\u578b");
                            return false
                        }
                    } catch (e) {
                        fade(info, "\u5fc5\u987b\u4e3aArray\u578b");
                        return false
                    }
                } else {
                    if ("geopoint" == type) {
                        var geoarr = value.split(",");
                        if (geoarr.length != 2) {
                            fade(info, "\u8bf7\u6309\u683c\u5f0f\u8f93\u5165:\u7ecf\u5ea6\u503c,\u7eac\u5ea6\u503c");
                            return false
                        }
                        var longitude = geoarr[0];
                        var latitude = geoarr[1];
                        if (!(regFloat.test(latitude) && regFloat.test(longitude))) {
                            fade(info, "\u8bf7\u6309\u683c\u5f0f\u8f93\u5165:\u7ecf\u5ea6\u503c,\u7eac\u5ea6\u503c");
                            return false
                        } else {
                            if (latitude > 90 || latitude < -90) {
                                fade(info, "\u7eac\u5ea6\u503c\u8303\u56f4\u4e3a\uff1a-90\uff0d90");
                                return false
                            } else {
                                if (longitude > 180 || longitude < -180) {
                                    fade(info, "\u7ecf\u5ea6\u503c\u8303\u56f4\u4e3a\uff1a-180\uff0d180");
                                    return false
                                }
                            }
                        }
                    } else {
                        if ("object" == type) {
                            if (!value.isJSON()) {
                                fade(info, "\u5fc5\u987b\u4e3aObject\u578b");
                                return false
                            }
                        } else {
                            if ("email" == type) {
                                if (!checkEmail(value)) {
                                    fade(info, "\u90ae\u7bb1\u5730\u5740\u4e0d\u6b63\u786e");
                                    return false
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return value
}
function editApp(b, a) {
    if (("name" == b || "cat_id" == b || "desc" == b || "status" == b || "android_url" == b || "ios_url" == b)
            && undefined != a) {
        $.ajax({
            type : "POST",
            url : BmobNamespace.editAppUrl,
            data : {
                field : b,
                value : a
            },
            dataType : "html",
            success : function(c) {
                if ("success" == c) {
                    fade($("#msg_success"), "\u66f4\u65b0\u6210\u529f")
                } else {
                    fade($("#msg_error"), c)
                }
            }
        })
    }
}
function editDoc(b, a) {
    if (("verify_on" == b || "verify_msg" == b) && undefined != a) {
        $.ajax({
            type : "POST",
            url : BmobNamespace.editDocUrl,
            data : {
                field : b,
                value : a
            },
            dataType : "html",
            success : function(c) {
                if ("success" == c) {
                    fade($("#info_success"), "\u66f4\u65b0\u6210\u529f")
                } else {
                    fade($("#info_error"), c)
                }
            }
        })
    }
}
function delApp(d, b) {
    var a = document.getElementById("msg-dialog");
    var c = document.getElementById("confirm-dialog");
    $(c).html(
            '<div class="confirm_msg"><img src="' + BmobNamespace.themeUrl
                    + '/images/question.jpg" />\u786e\u5b9a\u5220\u9664 "' + b + '"\u5417\uff1f</div>');
    $(c).dialog({
        title : "\u786e\u8ba4\u5220\u9664",
        buttons : {
            "\u786e\u5b9a" : function() {
                $(this).dialog("close");
                $.ajax({
                    type : "GET",
                    url : BmobNamespace.delAppUrl,
                    data : "id=" + d,
                    dataType : "html",
                    async : false,
                    success : function(e) {
                        if ("success" == e) {
                            locate(BmobNamespace.listAppUrl)
                        } else {
                            $(a).html(e);
                            $(a).dialog({
                                title : "\u5220\u9664\u5931\u8d25"
                            }).dialog("open");
                            setTimeout("$('#msg-dialog').dialog({ hide: 'slide' }).dialog('close')", 3000)
                        }
                    }
                })
            },
            "\u53d6\u6d88" : function() {
                $(this).dialog("close");
            }
        }
    }).dialog("open");
}

function uploadInit() {
    $("#add_market").on("click", function() {
        $("#m_list").append($(".cl").clone(true).removeClass().show())
    });
    var c = $("#msg_error");
    var b = $("#msg_success");
    var a = $("#confirm-dialog");
    $("#m_list tr").each(function() {
        $(this).find("input[type=text]").on("change", function() {
            var g = $(this).parent().parent();
            var h = g.find("input[type=hidden]").val();
            var e = g.find(".cname").val();
            var d = g.find(".curl").val();
            var f = /^(ftp|http|https):\/\/(.*?)$/i;
            if (e && d) {
                if (d && !f.test(d)) {
                    d = "http://" + d;
                    $(this).val(d)
                }
                $.ajax({
                    type : "POST",
                    url : BmobNamespace.editAppMarketUrl,
                    data : {
                        name : e,
                        url : d,
                        mid : h
                    },
                    dataType : "html",
                    success : function(i) {
                        if ("success" == i) {
                            fade(b, "\u66f4\u65b0\u6210\u529f")
                        } else {
                            if (checkNumber(i)) {
                                fade(b, "\u6dfb\u52a0\u6210\u529f");
                                g.find("input[type=hidden]").val(i)
                            } else {
                                fade(c, i)
                            }
                        }
                    }
                })
            }
        });
        $(this).find("a").on("click", function() {
            var d = $(this).parent().parent();
            var e = d.find("input[type=hidden]").val();
            if (e) {
                $(a).html("\u4f60\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u5e02\u573a\u4fe1\u606f\u5417\uff1f");
                $(a).dialog({
                    title : "\u786e\u8ba4\u64cd\u4f5c",
                    buttons : {
                        "\u786e\u5b9a" : function() {
                            $(this).dialog("close");
                            $.ajax({
                                type : "POST",
                                url : BmobNamespace.deleteAppMarketUrl,
                                data : {
                                    mid : e
                                },
                                dataType : "html",
                                success : function(f) {
                                    if ("success" == f) {
                                        fade(b, "\u5220\u9664\u6210\u529f");
                                        d.remove()
                                    } else {
                                        fade(c, f)
                                    }
                                }
                            })
                        },
                        "\u53d6\u6d88" : function() {
                            $(this).dialog("close")
                        }
                    }
                }).dialog("open")
            } else {
                d.remove()
            }
        })
    });
    $("#file_upload_apk")
            .uploadify(
                    {
                        auto : true,
                        queueSizeLimit : 1,
                        multi : false,
                        removeTimeout : 5,
                        fileSizeLimit : "100MB",
                        fileTypeDesc : "Apk Files",
                        fileTypeExts : "*.apk",
                        buttonText : "\u6d4f\u89c8\u6587\u4ef6",
                        swf : BmobNamespace.uploadSwf,
                        uploader : BmobNamespace.uploadFile,
                        formData : {
                            f : "app"
                        },
                        onUploadError : function(d, g, f, e) {
                            $("#file_msg_apk").attr("class", "alert alert-error")
                                    .html("\u4e0a\u4f20\u5931\u8d25\uff01")
                        },
                        onSelectError : function(d, g, f) {
                            var e = this.settings;
                            if ($.inArray("onSelectError", e.overrideEvents) < 0) {
                                switch (g) {
                                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                                    if (e.queueSizeLimit > f) {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the remaining upload limit ("
                                                + f + ")."
                                    } else {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the queue size limit ("
                                                + e.queueSizeLimit + ")."
                                    }
                                    break;
                                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d: "' + d.name
                                            + '" \u8d85\u8fc7\u63a7\u5236\u5927\u5c0f (' + e.fileSizeLimit + ").";
                                    break;
                                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + d.name + '" \u4e3a\u7a7a.';
                                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + d.name
                                            + '" \u4e0d\u662f\u6b63\u786e\u7684\u6587\u4ef6\u7c7b\u578b.'
                                }
                            }
                        },
                        onCancel : function(d) {
                            $("#file_apk").val("");
                            $("#file_msg_apk").attr("class", "alert alert-error").html(
                                    "\u4e0a\u4f20\u88ab\u53d6\u6d88\uff01")
                        },
                        onUploadSuccess : function(e, f, d) {
                            if (f == "-1") {
                                $("#file_msg_apk")
                                        .attr("class", "alert alert-error")
                                        .html(
                                                "\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                            } else {
                                if (f == "-2") {
                                    $("#file_msg_apk").attr("class", "alert alert-error")
                                            .html(
                                                    "\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7"
                                                            + BmobNamespace.limit_size
                                                            + "\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                                } else {
                                    if (f) {
                                        var e = jQuery.parseJSON(f);
                                        editApp("android_url", e.filepath);
                                        $("#file_msg_apk").attr("class", "alert alert-success").html(
                                                "\u4e0a\u4f20\u6210\u529f:" + e.filename)
                                    } else {
                                        $("#file_msg_apk").attr("class", "alert alert-error").html(
                                                "\u4e0a\u4f20\u5931\u8d25\uff01")
                                    }
                                }
                            }
                        }
                    });
    $("#file_upload_ipa")
            .uploadify(
                    {
                        auto : true,
                        queueSizeLimit : 1,
                        multi : false,
                        removeTimeout : 5,
                        fileSizeLimit : "100MB",
                        fileTypeDesc : "ipa Files",
                        fileTypeExts : "*.ipa",
                        buttonText : "\u6d4f\u89c8\u6587\u4ef6",
                        swf : BmobNamespace.uploadSwf,
                        uploader : BmobNamespace.uploadFile,
                        formData : {
                            f : "app"
                        },
                        onUploadError : function(d, g, f, e) {
                            $("#file_msg_ipa").attr("class", "alert alert-error")
                                    .html("\u4e0a\u4f20\u5931\u8d25\uff01")
                        },
                        onSelectError : function(d, g, f) {
                            var e = this.settings;
                            if ($.inArray("onSelectError", e.overrideEvents) < 0) {
                                switch (g) {
                                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                                    if (e.queueSizeLimit > f) {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the remaining upload limit ("
                                                + f + ")."
                                    } else {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the queue size limit ("
                                                + e.queueSizeLimit + ")."
                                    }
                                    break;
                                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d: "' + d.name
                                            + '" \u8d85\u8fc7\u63a7\u5236\u5927\u5c0f (' + e.fileSizeLimit + ").";
                                    break;
                                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + d.name + '" \u4e3a\u7a7a.';
                                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + d.name
                                            + '" \u4e0d\u662f\u6b63\u786e\u7684\u6587\u4ef6\u7c7b\u578b.'
                                }
                            }
                        },
                        onCancel : function(d) {
                            $("#file_msg_ipa").attr("class", "alert alert-error").html(
                                    "\u4e0a\u4f20\u88ab\u53d6\u6d88\uff01")
                        },
                        onUploadSuccess : function(e, f, d) {
                            if (f == "-1") {
                                $("#file_msg_ipa")
                                        .attr("class", "alert alert-error")
                                        .html(
                                                "\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                            } else {
                                if (f == "-2") {
                                    $("#file_msg_ipa").attr("class", "alert alert-error")
                                            .html(
                                                    "\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7"
                                                            + BmobNamespace.limit_size
                                                            + "\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                                } else {
                                    if (f) {
                                        var e = jQuery.parseJSON(f);
                                        editApp("ios_url", e.filepath);
                                        $("#file_msg_ipa").attr("class", "alert alert-success").html(
                                                "\u4e0a\u4f20\u6210\u529f:" + e.filename)
                                    } else {
                                        $("#file_msg_ipa").attr("class", "alert alert-error").html(
                                                "\u4e0a\u4f20\u5931\u8d25\uff01")
                                    }
                                }
                            }
                        }
                    })
}
function verifyInit() {
    $("#add_verify").on("click", function() {
        $("#verify_list").append($(".cl").clone(true).removeClass().show())
    });
    var c = $("#info_error");
    var b = $("#info_success");
    var a = $("#confirm-dialog");
    $(".v_date").datepicker({
        dateFormat : $.datepicker.W3C,
        changeMonth : true,
        changeYear : true,
        onSelect : function(f) {
            var j = new Date();
            var i = j.getHours();
            i = i < 9 ? "0" + i : i;
            var e = j.getMinutes();
            e = e < 9 ? "0" + e : e;
            var g = j.getSeconds();
            g = g < 9 ? "0" + g : g;
            f = f + " " + i + ":" + e + ":" + g;
            $(".v_date").val(f)
        }
    });
    $("#switch span").toggle(function() {
        editDoc("verify_on", 0);
        $(".ydjy .switch span").removeClass().addClass("turnoff")
    }, function() {
        editDoc("verify_on", 1);
        $(".ydjy .switch span").removeClass().addClass("turnon")
    });
    $("#verify_msg").on("change", function() {
        var d = $(this).val();
        if (d.length > 40) {
            fade(c, "\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc740\u4e2a\u5b57\u7b26");
            return false
        } else {
            if (d.length) {
                editDoc("verify_msg", d)
            }
        }
    }).on("keydown", function() {
        $(".textnum em").html($(this).val().length)
    });
    $(".rule_type p").click(function() {
        $(".rule_type p").next("ul").slideUp("fast");
        var d = $(this).next("ul");
        if (d.css("display") == "none") {
            d.slideDown("fast")
        } else {
            d.slideUp("fast")
        }
    });
    $(".vali_rule_select p").click(function() {
        $(".vali_rule_select p").next("ul").slideUp("fast");
        var d = $(this).next("ul");
        if (d.css("display") == "none") {
            d.slideDown("fast")
        } else {
            d.slideUp("fast")
        }
    });
    $(".rule_type ul li a").click(function() {
        var d = $(this).text();
        var g = $(this).parent().parent().parent();
        g.find("p").html(d);
        var f = $(this).attr("rel");
        var e = $(this).attr("type");
        g.next("select").find("option").html(d);
        g.next("select").find("option").val(f);
        $(".vali_rule_select ul").hide();
        g.parent().next().find(".vali_rule_select p").html("\u8bf7\u9009\u62e9\u4e00\u4e2a\u89c4\u5219");
        g.parent().next().find(".vali_rule_select ul").replaceWith($("#rule_select .type_" + e).clone(true));
        g.parent().next().next().find(".vali_value").replaceWith($("#rule_input .v_" + e).clone(true));
        g.find("ul").hide()
    });
    $(".vali_rule_select ul li a").click(function() {
        var d = $(this).text();
        var f = $(this).parent().parent().parent();
        f.find("p").html(d);
        var e = $(this).attr("rel");
        f.next("select").find("option").html(d);
        f.next("select").find("option").val(e);
        f.find("ul").hide()
    });
    $("#verify_list tr").each(function() {
        $(this).find(".save_verify").on("click", function() {
            var g = $(this).parent().parent();
            var i = g.find("input[type=hidden]").val();
            var d = g.find(".v_field").val();
            var f = g.find(".v_field option:selected").html();
            var e = g.find(".v_rule").val();
            var h = g.find(".vali_value").val();
            if ("" != h && d && e && f) {
                $.ajax({
                    type : "POST",
                    url : BmobNamespace.editVerificationUrl,
                    data : {
                        field_id : d,
                        field_name : f,
                        rule_id : e,
                        val : h,
                        vid : i
                    },
                    dataType : "html",
                    success : function(j) {
                        if ("success" == j) {
                            fade(b, "\u66f4\u65b0\u6210\u529f")
                        } else {
                            if (checkNumber(j)) {
                                fade(b, "\u6dfb\u52a0\u6210\u529f");
                                g.find("input[type=hidden]").val(j)
                            } else {
                                fade(c, j)
                            }
                        }
                    }
                })
            }
        });
        $(this).find("a.del_verify").on("click", function() {
            var d = $(this).parent().parent();
            var e = d.find("input[type=hidden]").val();
            if (e) {
                $(a).html("\u4f60\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u89c4\u5219\u4fe1\u606f\u5417\uff1f");
                $(a).dialog({
                    title : "\u786e\u8ba4\u64cd\u4f5c",
                    buttons : {
                        "\u786e\u5b9a" : function() {
                            $(this).dialog("close");
                            $.ajax({
                                type : "POST",
                                url : BmobNamespace.deleteVerificationUrl,
                                data : {
                                    vid : e
                                },
                                dataType : "html",
                                success : function(f) {
                                    if ("success" == f) {
                                        fade(b, "\u5220\u9664\u6210\u529f");
                                        d.remove()
                                    } else {
                                        fade(c, f)
                                    }
                                }
                            })
                        },
                        "\u53d6\u6d88" : function() {
                            $(this).dialog("close")
                        }
                    }
                }).dialog("open")
            } else {
                d.remove()
            }
        })
    })
}
function browserInit() {
    var a = $("#msg-dialog");
    var e = $("#confirm-dialog");
    jQuery("#new-table-dialog").dialog({
        title : '\u6dfb\u52a0\u65b0\u7684\u8868<span id="dialog_loading"></span>',
        autoOpen : false,
        height : 310,
        width : 660,
        modal : true
    });
    jQuery("#new-column-dialog").dialog({
        title : '\u6dfb\u52a0\u65b0\u7684\u8868\u5b57\u6bb5<span id="dialog_loading"></span>',
        autoOpen : false,
        height : 310,
        width : 510,
        modal : true
    });
    jQuery("#rule-dialog").dialog({
        title : '\u6570\u636e\u8868\u6743\u9650\u8bbe\u7f6e<span id="dialog_loading"></span>',
        autoOpen : false,
        height : 320,
        width : 500,
        modal : true
    });
    jQuery("#delcol-dialog").dialog({
        title : '\u5220\u9664\u4e00\u5217<span id="dialog_loading"></span>',
        autoOpen : false,
        height : 250,
        width : 450,
        modal : true
    });
    jQuery("#import-dialog").dialog({
        title : '\u5bfc\u5165\u6570\u636e<span id="dialog_loading"></span>',
        autoOpen : false,
        height : 490,
        width : 550
    });
    var f = window.location.hash.substring(1);
    if (f.indexOf("relation=") != -1) {
        f = f.split("&");
        var d = f[0].split("=");
        var c = f[1].split("=");
        var b = '<li class="relation_table"><a class="sjb" href="' + window.location.href + '">' + d[1] + "</a></li>";
        $("#table_list li").each(function() {
            if ($(this).find(".name").data("tableid") == c[1]) {
                $(this).after(b);
                $("#table_list li").removeClass("on")
            }
        })
    }
    $("#new_table").click(function() {
        $("#new-table-dialog").dialog("open")
    });
    $("#new-table-dialog-cancel").click(function() {
        $("#new-table-dialog").dialog("close")
    });
    $("#new-column-dialog #type").change(
            function() {
                if ($.trim($(this).find("option:selected").text()) == "Pointer"
                        || $.trim($(this).find("option:selected").text()) == "Relation") {
                    $("#new-column-dialog").parent().width(660);
                    $("#relation_table_name_dropdown").show()
                } else {
                    $("#new-column-dialog").parent().width(510);
                    $("#relation_table_name_dropdown").hide()
                }
            });
    $("#submit-save-table")
            .click(
                    function() {
                        var g = $("#table_name").val().replace(/(^\s*)|(\s*$)/g, "");
                        var i = /^[A-Za-z0-9]{1}[-A-Za-z0-9_]*$/i;
                        var h = document.getElementById("table_msg");
                        if (!g) {
                            fade(h, "\u8bf7\u586b\u5199\u8868\u540d");
                            return false
                        } else {
                            if (!i.test(g) && g != "_Installation" && g != "_Role") {
                                fade(
                                        h,
                                        "\u8868\u540d\u7531\u5b57\u6bcd\u3001\u6570\u5b57\u6216\u5b57\u5212\u7ebf\u7ec4\u6210\uff0c\u4e14\u4e0d\u80fd\u4ee5\u4e0b\u5212\u7ebf\u5f00\u5934");
                                return false
                            } else {
                                $.ajax({
                                    type : "POST",
                                    url : BmobNamespace.newTableUrl,
                                    data : {
                                        name : g
                                    },
                                    dataType : "json",
                                    async : false,
                                    beforeSend : function() {
                                        $("#dialog_loading").html(
                                                '<img src="' + BmobNamespace.themeUrl
                                                        + '/images/loading.gif" alt="loading..." />')
                                    },
                                    success : function(j) {
                                        $("#dialog_loading").html("");
                                        if ("success" == j.msg) {
                                            window.location.href = j.url;
                                            return true
                                        } else {
                                            fade(h, j.msg);
                                            return false
                                        }
                                    }
                                })
                            }
                        }
                        return false
                    });
    $("#new_column").click(function() {
        $("#new-column-dialog").dialog("open");
        if ($("#relation_table_name_dropdown").is(":visible")) {
            $("#new-column-dialog").parent().width(660)
        }
    });
    $("#new-column-dialog-cancel").click(function() {
        $("#new-column-dialog").dialog("close")
    });
    $("#submit-save-col")
            .click(
                    function() {
                        var g = $("#name").val().replace(/(^\s*)|(\s*$)/g, "");
                        var j = $("#type").val();
                        if ($("#relation_table_name_dropdown").is(":visible") && (j == 8 || j == 9)) {
                            var i = $("#relation_table_name_dropdown select").val()
                        } else {
                            var i = ""
                        }
                        var k = /^[A-Za-z0-9]{1}[-A-Za-z0-9_]*$/i;
                        var h = document.getElementById("column_msg");
                        if (!g) {
                            fade(h, "\u5e26*\u53f7\u7684\u5fc5\u586b\u9879\u4e0d\u80fd\u4e3a\u7a7a");
                            return false
                        } else {
                            if (!k.test(g)) {
                                fade(
                                        h,
                                        "\u5b57\u6bb5\u540d\u7531\u5b57\u6bcd\u3001\u6570\u5b57\u6216\u5b57\u5212\u7ebf\u7ec4\u6210\uff0c\u4e14\u4e0d\u80fd\u4ee5\u4e0b\u5212\u7ebf\u5f00\u5934");
                                return false
                            } else {
                                if ("objectId" == g || "createdAt" == g || "updatedAt" == g || "ACL" == g) {
                                    fade(h, "\u5b57\u6bb5\u540d\u5df2\u7ecf\u5b58\u5728");
                                    return false
                                } else {
                                    if ("_User" == BmobNamespace.docname
                                            && ("username" == g || "password" == g || "emailVerified" == g || "email" == g)) {
                                        fade(h, "\u5b57\u6bb5\u540d\u5df2\u7ecf\u5b58\u5728");
                                        return false
                                    } else {
                                        $.ajax({
                                            type : "POST",
                                            url : BmobNamespace.newColUrl,
                                            data : {
                                                id : BmobNamespace.appid,
                                                tid : BmobNamespace.docid,
                                                name : g,
                                                type : j,
                                                rtable : i
                                            },
                                            dataType : "html",
                                            async : false,
                                            beforeSend : function() {
                                                $("#dialog_loading").html(
                                                        '<img src="' + BmobNamespace.themeUrl
                                                                + '/images/loading.gif" alt="loading..." />')
                                            },
                                            success : function(l) {
                                                $("#dialog_loading").html("");
                                                if ("success" == l) {
                                                    window.location.href = BmobNamespace.browserUrl
                                                            + "/s/\u6dfb\u52a0\u5217\u6210\u529f";
                                                    return true
                                                } else {
                                                    fade(h, l);
                                                    return false
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        }
                        return false
                    });
    $("#drop_column").click(function() {
        if (!$(this).hasClass("disabled")) {
            $("#delcol-dialog").dialog("open")
        }
    });
    $("#delcol-dialog-cancel").click(function() {
        $("#delcol-dialog").dialog("close")
    });
    $("#submit-delcol").click(
            function() {
                var g = $("#cid").val();
                if (g) {
                    $.ajax({
                        type : "GET",
                        url : BmobNamespace.delColUrl,
                        data : "id=" + BmobNamespace.appid + "&tid=" + BmobNamespace.docid + "&cid=" + g,
                        dataType : "html",
                        async : false,
                        beforeSend : function() {
                            $("#dialog_loading").html(
                                    '<img src="' + BmobNamespace.themeUrl + '/images/loading.gif" alt="loading..." />')
                        },
                        success : function(h) {
                            $("#dialog_loading").html("");
                            if ("success" == h) {
                                $("#delcol-dialog").dialog("close");
                                window.location.href = BmobNamespace.browserUrl + "/s/\u5220\u9664\u5217\u6210\u529f"
                            } else {
                                $("#delcol-dialog").dialog("close");
                                window.location.href = BmobNamespace.browserUrl + "/\uff45/" + h
                            }
                            return true
                        }
                    })
                }
                return false
            });
    $("#rule").click(function() {
        $("#rule-dialog").dialog("open")
    });
    $("#rule-dialog-cancel").click(function() {
        $("#rule-dialog").dialog("close")
    });
    $("#submit-rule").click(
            function() {
                var g = parseInt($("#rule_value").find("a.on").attr("rel"));
                if (g == 0 || g == 1) {
                    $("#rule-dialog").dialog("close");
                    $.ajax({
                        type : "POST",
                        url : BmobNamespace.editTableUrl,
                        data : {
                            read : g
                        },
                        dataType : "json",
                        beforeSend : function() {
                            $("#dialog_loading").html(
                                    '<img src="' + BmobNamespace.themeUrl + '/images/loading.gif" alt="loading..." />')
                        },
                        success : function(h) {
                            $("#dialog_loading").html("");
                            $("#rule-dialog").dialog("close");
                            if ("success" == h.msg) {
                                fade($("#info_success"), "\u66f4\u65b0\u8868\u6743\u9650\u6210\u529f")
                            } else {
                                fade($("#info_error"), h.msg)
                            }
                            return false
                        }
                    })
                }
                return false
            });
    $("#import_file").click(function() {
        $("#import-dialog").dialog("open")
    });
    $("#import-dialog-cancel").click(function() {
        $("#import-dialog").dialog("close")
    });
    $("#submit-import").click(function() {
        var g = $("#import_filepath").val();
        if (g) {
            $.ajax({
                type : "POST",
                url : BmobNamespace.importFileUrl,
                data : {
                    file : g
                },
                dataType : "json",
                success : function(h) {
                    if ("success" == h.msg) {
                        locate(h.url)
                    } else {
                        $("#file_msg_imp").attr("class", "alert alert-error").html(h.msg)
                    }
                }
            })
        } else {
            $("#file_msg_imp").attr("class", "alert alert-error").html("\u8bf7\u5148\u4e0a\u4f20\u6587\u4ef6")
        }
    });
    $("#import_file_upload")
            .uploadify(
                    {
                        auto : true,
                        queueSizeLimit : 1,
                        multi : false,
                        removeTimeout : 5,
                        fileSizeLimit : "50MB",
                        fileTypeDesc : "CSV Files",
                        fileTypeExts : "*.csv",
                        buttonText : "\u6d4f\u89c8\u6587\u4ef6",
                        swf : BmobNamespace.uploadSwf,
                        uploader : BmobNamespace.uploadFile,
                        formData : {
                            f : "csv",
                            t : 1
                        },
                        onUploadError : function(g, j, i, h) {
                            $("#file_msg_imp").attr("class", "alert alert-error")
                                    .html("\u4e0a\u4f20\u5931\u8d25\uff01")
                        },
                        onSelectError : function(g, j, i) {
                            var h = this.settings;
                            if ($.inArray("onSelectError", h.overrideEvents) < 0) {
                                switch (j) {
                                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                                    if (h.queueSizeLimit > i) {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the remaining upload limit ("
                                                + i + ")."
                                    } else {
                                        this.queueData.errorMsg = "\nThe number of files selected exceeds the queue size limit ("
                                                + h.queueSizeLimit + ")."
                                    }
                                    break;
                                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d: "' + g.name
                                            + '" \u8d85\u8fc7\u63a7\u5236\u5927\u5c0f (' + h.fileSizeLimit + ").";
                                    break;
                                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + g.name + '" \u4e3a\u7a7a.';
                                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                                    this.queueData.errorMsg = '\n\u6587\u4ef6\u540d "' + g.name
                                            + '" \u4e0d\u662f\u6b63\u786e\u7684\u6587\u4ef6\u7c7b\u578b.'
                                }
                            }
                        },
                        onCancel : function(g) {
                            $("#import_filename").val("");
                            $("#import_filepath").val("");
                            $("#file_msg_imp").attr("class", "alert alert-error").html(
                                    "\u4e0a\u4f20\u88ab\u53d6\u6d88\uff01")
                        },
                        onUploadSuccess : function(h, i, g) {
                            if (i == "-1") {
                                $("#file_msg_imp")
                                        .attr("class", "alert alert-error")
                                        .html(
                                                "\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                            } else {
                                if (i == "-2") {
                                    $("#file_msg_imp").attr("class", "alert alert-error")
                                            .html(
                                                    "\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7"
                                                            + BmobNamespace.limit_size
                                                            + "\uff0c\u4e0a\u4f20\u5931\u8d25\uff01")
                                } else {
                                    if (i) {
                                        var h = jQuery.parseJSON(i);
                                        $("#import_filepath").val(h.filepath);
                                        $("#file_msg_imp").attr("class", "alert alert-success").html(
                                                "\u4e0a\u4f20\u6210\u529f:" + h.filename)
                                    } else {
                                        $("#file_msg_imp").attr("class", "alert alert-error").html(
                                                "\u4e0a\u4f20\u5931\u8d25\uff01")
                                    }
                                }
                            }
                        }
                    })
}
function appendRelationBtn() {
    var b = new Array();
    var d = new Array();
    var e = new Array();
    var a = $("#table_list li.on .name").data("tableid");
    var c = $("#table_list").data("appid");
    $("#gbox_grid").find("th .fh").each(
            function() {
                if ($.trim($(this).html()).indexOf("Relation") != -1) {
                    d.push($(this).data("field"));
                    b.push($(this).parent().parent().index());
                    e.push($(this).data("relationtableid"));
                    $("#grid tr:not(:first)").each(
                            function() {
                                var f = $.trim($(this).find("td").eq(1).html());
                                for ( var g in b) {
                                    $(this).find("td").eq(b[g]).removeAttr("title").html(
                                            '<a class="link_column" href="/app/browser/' + c + "/" + e[g] + "/oid/" + f
                                                    + "/stid/" + a + "/relation/" + d[g] + "#relation=" + d[g]
                                                    + "&stid=" + a + '">\u5173\u8054\u5173\u7cfb</a>')
                                }
                            })
                }
            })
}
function browserGridInit() {
    var a = document.getElementById("grid");
    var m = document.getElementById("info_success");
    var g = document.getElementById("info_error");
    var e = $("#msg-dialog");
    var f = $("#confirm-dialog");
    var b = "";
    var l = new Array();
    var k = 1;
    var c;
    l.push({
        name : "objectId",
        index : "_id",
        width : 100
    });
    if ("_User" == BmobNamespace.docname) {
        l.push({
            name : "username",
            index : "username",
            width : 180,
            editable : true
        });
        l.push({
            name : "password",
            index : "password",
            width : "180",
            editable : true,
            edittype : "password"
        });
        l.push({
            name : "emailVerified",
            index : "emailVerified",
            wdith : 100,
            editable : false,
            align : "center",
            edittype : "checkbox",
            formatter : "checkbox",
            editoptions : {
                value : "true:false"
            }
        });
        l.push({
            name : "email",
            index : "email",
            title : "String",
            width : 180,
            editable : true
        });
        k = 5
    }
    if ("_Installation" == BmobNamespace.docname) {
        l.push({
            name : "badge",
            index : "badge",
            width : 180,
            editable : true
        });
        l.push({
            name : "channels",
            index : "channels",
            width : "180",
            editable : true
        });
        l.push({
            name : "timeZone",
            index : "timeZone",
            width : "180",
            editable : true
        });
        l.push({
            name : "deviceType",
            index : "deviceType",
            width : "180",
            editable : true
        });
        l.push({
            name : "installationId",
            index : "installationId",
            width : "180",
            editable : true
        });
        l.push({
            name : "deviceToken",
            index : "deviceToken",
            width : "180",
            editable : true
        });
        k = 5
    }
    if ("_Role" == BmobNamespace.docname) {
        l.push({
            name : "name",
            index : "name",
            width : "180",
            editable : true
        });
        l.push({
            name : "roles",
            index : "roles",
            width : "180",
            editable : true
        });
        l.push({
            name : "users",
            index : "users",
            width : "180",
            editable : true
        });
        k = 5
    }
    l.push({
        name : "createdAt",
        index : "createdAt",
        width : 190
    });
    l.push({
        name : "updatedAt",
        index : "updatedAt",
        width : 190
    });
    l.push({
        name : "ACL",
        index : "ACL",
        width : 180,
        editable : true
    });
    for (var h = 0, j = BmobNamespace.colList.length; h < j; h++) {
        l = l.insertAt(k, BmobNamespace.colList[h])
    }
    var d = jQuery(a)
            .jqGrid(
                    {
                        url : BmobNamespace.listRowUrl,
                        mtype : "post",
                        datatype : "json",
                        colModel : l,
                        rowNum : 20,
                        rowList : [ 10, 20, 50 ],
                        pager : "#gridpager",
                        sortname : "updatedAt",
                        viewrecords : true,
                        sortorder : "desc",
                        recordtext : "{0}-{1} of {2}",
                        caption : "",
                        width : "99%",
                        height : "525",
                        shrinkToFit : false,
                        multiselect : true,
                        multiselectWidth : 32,
                        cellEdit : true,
                        cellsubmit : "clientArray",
                        jsonReader : {
                            root : "invdata",
                            page : "currpage",
                            total : "totalpages",
                            records : "totalrecords",
                            repeatitems : false,
                            id : "id"
                        },
                        beforeEditCell : function(o, n, q, p, i) {
                            jQuery(a).find("tr").each(function() {
                                if ($(this).attr("id") != o) {
                                    $(this).find("td").removeClass("dirty-cell edit-cell ui-state-highlight")
                                }
                                $(this).find("td.invalid").removeClass("invalid")
                            });
                            $("#cell-upload").remove();
                            $("input.cell-file").remove()
                        },
                        afterEditCell : function(o, i, p, q, s) {
                            c = p;
                            if (BmobNamespace.colTypeList[i] == "date") {
                                jQuery("#" + q + "_" + i, "#grid").datepicker({
                                    dateFormat : $.datepicker.W3C + " " + date_obj_time,
                                    changeMonth : true,
                                    changeYear : true
                                })
                            } else {
                                if (BmobNamespace.colTypeList[i] == "file") {
                                    jQuery("#" + q + "_" + i, "#grid")
                                            .addClass("cell-file")
                                            .before(
                                                    '<a href="javascript: void(0)" class="cell-upload" id="cell-upload">Upload File</a>');
                                    var t = $(this).jqGrid("getCell", o, "objectId");
                                    jQuery("#" + q + "_" + i, "#grid").bind(
                                            "change",
                                            function(v) {
                                                $("#loadupload").fileupload(
                                                        "add",
                                                        {
                                                            files : v.target.files || [ {
                                                                name : this.value
                                                            } ],
                                                            fileInput : $(this),
                                                            url : "/app/cellfile/id/" + BmobNamespace.appid + "/tid/"
                                                                    + BmobNamespace.docid + "/objid/" + t + "/name/"
                                                                    + i
                                                        })
                                            })
                                } else {
                                    if (BmobNamespace.colTypeList[i].indexOf("pointer") != -1) {
                                        var n = /<a\s.*?href=\"([^\"]+)\"[^>]*>(.*?)<\/a>/;
                                        var u = n.exec(c);
                                        var r = u[2];
                                        $("#" + q + "_" + i, "#grid").val(r)
                                    }
                                }
                            }
                        },
                        beforeSubmitCell : function(o, n, r, p, s) {
                            var q = "email" == n ? "email" : ("ACL" == n ? "object" : BmobNamespace.colTypeList[n]);
                            var u = new Object();
                            u[n] = c;
                            if ("file" == q) {
                                return
                            }
                            if (c != "" && r == "") {
                                var i = true
                            } else {
                                r = checkCellData(q, r);
                                var i = r
                            }
                            if (i) {
                                var t = $(this).jqGrid("getCell", o, "objectId");
                                $.ajax({
                                    type : "POST",
                                    url : BmobNamespace.editRowUrl,
                                    data : {
                                        objid : t,
                                        name : n,
                                        value : r
                                    },
                                    dataType : "json",
                                    success : function(v) {
                                        if ("success" == v.msg) {
                                            var w = t ? "\u7f16\u8f91\u6210\u529f" : "\u6dfb\u52a0\u6210\u529f";
                                            jQuery(a).jqGrid("setRowData", o, v.data);
                                            appendRelationBtn();
                                            if (jQuery("#del_all").hasClass("disabled")) {
                                                jQuery("#del_all").removeClass("disabled")
                                            }
                                            fade(m, w)
                                        } else {
                                            jQuery(".edit-cell").addClass("invalid");
                                            fade(g, v.msg)
                                        }
                                    }
                                })
                            } else {
                                jQuery(".edit-cell").text(c).addClass("invalid");
                                return
                            }
                        },
                        onSelectRow : function(p, n) {
                            var o = jQuery(a).jqGrid("getGridParam", "selarrrow");
                            var i = o.length;
                            if (n) {
                                jQuery("#bulk_del").removeClass("disabled");
                                jQuery("#bulk_del").find("span").text(i)
                            } else {
                                jQuery("#bulk_del").find("span").text(i)
                            }
                            if (i == 0) {
                                jQuery("#bulk_del").addClass("disabled")
                            }
                        },
                        onSelectAll : function(o, n) {
                            var p = jQuery(a).jqGrid("getGridParam", "selarrrow");
                            var i = p.length;
                            if (n) {
                                jQuery("#bulk_del").removeClass("disabled");
                                jQuery("#bulk_del").find("span").text(i)
                            } else {
                                jQuery("#bulk_del").find("span").text(i)
                            }
                            if (i == 0) {
                                jQuery("#bulk_del").addClass("disabled")
                            }
                        },
                        loadComplete : function(t) {
                            dySetGridHeight();
                            var s = parseInt($(this).jqGrid("getGridParam", "records"), 10);
                            if (s <= 0) {
                                $("#norecords").show();
                                jQuery("#del_all").addClass("disabled")
                            } else {
                                jQuery(a).find("td").each(function() {
                                    if ($(this).find("a").hasClass("mfile")) {
                                        $(this).addClass("not-editable-cell");
                                        $(this).bind("hover", function() {
                                            $(this).find("a.delcellfile").toggle()
                                        })
                                    }
                                });
                                $("#norecords").hide()
                            }
                            jQuery("#jqgh_grid_objectId .fh").remove();
                            jQuery("#jqgh_grid_objectId .s-ico").before("<span class='fh'>String</span>");
                            if ("_User" == BmobNamespace.docname) {
                                jQuery("#jqgh_grid_username .fh").remove();
                                jQuery("#jqgh_grid_username .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_password .fh").remove();
                                jQuery("#jqgh_grid_password .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_emailVerified .fh").remove();
                                jQuery("#jqgh_grid_emailVerified .s-ico").before("<span class='fh'>Boolean</span>");
                                jQuery("#jqgh_grid_email .fh").remove();
                                jQuery("#jqgh_grid_email .s-ico").before("<span class='fh'>String</span>")
                            }
                            if ("_Installation" == BmobNamespace.docname) {
                                jQuery("#jqgh_grid_badge .fh").remove();
                                jQuery("#jqgh_grid_badge .s-ico").before("<span class='fh'>Number</span>");
                                jQuery("#jqgh_grid_channels .fh").remove();
                                jQuery("#jqgh_grid_channels .s-ico").before("<span class='fh'>Array</span>");
                                jQuery("#jqgh_grid_timeZone .fh").remove();
                                jQuery("#jqgh_grid_timeZone .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_deviceType .fh").remove();
                                jQuery("#jqgh_grid_deviceType .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_installationId .fh").remove();
                                jQuery("#jqgh_grid_installationId .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_deviceToken .fh").remove();
                                jQuery("#jqgh_grid_deviceToken .s-ico").before("<span class='fh'>String</span>")
                            }
                            if ("_Role" == BmobNamespace.docname) {
                                var r = $(".role_icon").parent().data("tableid");
                                var n = $(".user_icon").parent().data("tableid");
                                jQuery("#jqgh_grid_name .fh").remove();
                                jQuery("#jqgh_grid_name .s-ico").before("<span class='fh'>String</span>");
                                jQuery("#jqgh_grid_roles .fh").remove();
                                jQuery("#jqgh_grid_roles .s-ico").before(
                                        "<span class='fh' data-relationtableid='" + r
                                                + "' data-field='roles'>Relation &lt;_Role&gt;</span>");
                                jQuery("#jqgh_grid_users .fh").remove();
                                jQuery("#jqgh_grid_users .s-ico").before(
                                        "<span class='fh' data-relationtableid='" + n
                                                + "' data-field='users'>Relation &lt;_User&gt;</span>")
                            }
                            jQuery("#jqgh_grid_createdAt .fh").remove();
                            jQuery("#jqgh_grid_createdAt .s-ico").before("<span class='fh'>Date</span>");
                            jQuery("#jqgh_grid_updatedAt .fh").remove();
                            jQuery("#jqgh_grid_updatedAt .s-ico").before("<span class='fh'>Date</span>");
                            jQuery("#jqgh_grid_ACL .fh").remove();
                            jQuery("#jqgh_grid_ACL .s-ico").before("<span class='fh'>ACL</span>");
                            if (BmobNamespace.colList.length > 0) {
                                for ( var p in BmobNamespace.colTypeList) {
                                    jQuery("#jqgh_grid_" + p + " .fh").remove();
                                    var i = BmobNamespace.colTypeList[p].substring(0, 1).toUpperCase()
                                            + BmobNamespace.colTypeList[p].substring(1);
                                    if ("geopoint" == BmobNamespace.colTypeList[p]) {
                                        i = "GeoPoint"
                                    }
                                    var q = i.replace(/.*\&lt;(.*)\&gt;$/, "$1");
                                    var o = "";
                                    $("#table_list .name").each(function() {
                                        if ($(this).data("table") == q) {
                                            o = $(this).data("tableid")
                                        }
                                    });
                                    jQuery("#jqgh_grid_" + p + " .s-ico").before(
                                            "<span class='fh' data-field='" + p + "' data-relationtableid='" + o + "'>"
                                                    + i + "</span>")
                                }
                            }
                            appendRelationBtn()
                        }
                    }).jqGrid("navGrid", "#gridpager", {
                search : false,
                edit : false,
                add : false,
                del : false
            });
    $("#field_search").on("submit", function() {
        var o = $("#field_name").val();
        var n = $("#field_value").val();
        if (n == $("#field_value").attr("placeholder")) {
            n = ""
        }
        var i = BmobNamespace.listRowUrl + "/f/" + o + "/s/" + n;
        if (o && n) {
            d.setGridParam({
                url : i,
                page : 1
            }).trigger("reloadGrid")
        }
        return false
    });
    jQuery("#add").click(function() {
        var n = {};
        var i = jQuery(a).jqGrid("getDataIDs");
        var o = i.max();
        o = o > 0 ? o : 0;
        if (0 == o) {
            jQuery("#norecords").hide()
        }
        jQuery(a).jqGrid("addRowData", o + 1, n, "first");
        dySetGridHeight();
        jQuery(a).find("tr").each(function(p) {
            if ($(this).attr("id")) {
                $(this).attr("id", p);
                $(this).find(".cbox").attr("id", "jqg_grid_" + p)
            }
        })
    });
    jQuery("#bulk_del").click(function() {
        if ($(this).hasClass("disabled")) {
            return false
        }
        var i = jQuery(a).jqGrid("getGridParam", "selarrrow");
        if (!i) {
            return false
        }
        $(f).html("\u4f60\u786e\u5b9a\u5220\u9664\u9009\u62e9\u7684\u884c\u5417\uff1f");
        $(f).dialog({
            title : "\u786e\u8ba4\u64cd\u4f5c",
            buttons : {
                "\u786e\u5b9a" : function() {
                    $(this).dialog("close");
                    delRows(i)
                },
                "\u53d6\u6d88" : function() {
                    $(this).dialog("close")
                }
            }
        }).dialog("open")
    });
    jQuery("#del_all")
            .click(
                    function() {
                        if ($(this).hasClass("disabled")) {
                            return false
                        }
                        if (!(BmobNamespace.docid && BmobNamespace.docname)) {
                            fade(info, "\u8bf7\u6307\u5b9a\u8981\u5220\u9664\u7684\u8868");
                            return false
                        }
                        $(f)
                                .html(
                                        '<div class="confirm_msg"><img src="'
                                                + BmobNamespace.themeUrl
                                                + '/images/question.jpg" />\u786e\u5b9a\u5220\u9664"'
                                                + BmobNamespace.docname
                                                + '"\u8868\u4e2d\u6240\u6709\u6570\u636e\u5417\uff1f\u8be5\u64cd\u4f5c\u5c06\u65e0\u6cd5\u64a4\u6d88\u3002</div>');
                        $(f).dialog({
                            title : "\u786e\u8ba4\u5220\u9664",
                            height : "210",
                            buttons : {
                                "\u786e\u5b9a" : function() {
                                    $(this).dialog("close");
                                    $.ajax({
                                        type : "GET",
                                        url : BmobNamespace.delAllRowUrl,
                                        data : "id=" + BmobNamespace.appid + "&tid=" + BmobNamespace.docid,
                                        dataType : "html",
                                        async : false,
                                        success : function(i) {
                                            if ("success" == i) {
                                                fade(m, "\u5220\u9664\u6210\u529f");
                                                jQuery(a).trigger("reloadGrid")
                                            } else {
                                                fade(g, i)
                                            }
                                        }
                                    })
                                },
                                "\u53d6\u6d88" : function() {
                                    $(this).dialog("close")
                                }
                            }
                        }).dialog("open")
                    });
    jQuery("#del_table")
            .click(
                    function() {
                        if (!(BmobNamespace.docid && BmobNamespace.docname)) {
                            fade(g, "\u8bf7\u6307\u5b9a\u8981\u5220\u9664\u7684\u8868");
                            return false
                        }
                        if ("_User" == BmobNamespace.docname) {
                            return false
                        }
                        $(f)
                                .html(
                                        '<div class="confirm_msg"><img src="'
                                                + BmobNamespace.themeUrl
                                                + '/images/question.jpg" />\u786e\u5b9a\u5220\u9664"'
                                                + BmobNamespace.docname
                                                + '"\u8868\u5417\uff1f\u5c06\u5220\u9664\u8868\u4e2d\u6240\u6709\u6570\u636e\u4e14\u65e0\u6cd5\u64a4\u6d88\u3002</div>');
                        $(f).dialog({
                            title : "\u786e\u8ba4\u5220\u9664",
                            height : "210",
                            buttons : {
                                "\u786e\u5b9a" : function() {
                                    $(this).dialog("close");
                                    $.ajax({
                                        type : "GET",
                                        url : BmobNamespace.delTableUrl,
                                        data : "id=" + BmobNamespace.appid + "&tid=" + BmobNamespace.docid,
                                        dataType : "html",
                                        async : false,
                                        success : function(i) {
                                            if ("success" == i) {
                                                fade(m, "\u5220\u9664\u6210\u529f");
                                                window.location.href = BmobNamespace.browserUrl2
                                            } else {
                                                fade(g, i)
                                            }
                                        }
                                    })
                                },
                                "\u53d6\u6d88" : function() {
                                    $(this).dialog("close")
                                }
                            }
                        }).dialog("open")
                    });
    jQuery("#loadupload").fileupload(
            {
                dataType : "json",
                beforeSend : function() {
                    jQuery(m).html("\u4e0a\u4f20\u4e2d,\u8bf7\u7a0d\u5019...").css({
                        opacity : 1
                    }).fadeIn("fast")
                },
                done : function(p, o) {
                    var q = o.result.msg;
                    var n = o.result.name;
                    var i = o.result.objid;
                    if ("success" == q) {
                        b = '<a href="' + o.result.url + '" class="mfile" target="_blank">' + o.result.filename
                                + '</a><a class="delcellfile" id="' + n + i + '" onClick="delCellFile(\'' + i + "','"
                                + n + '\')" alt="\u5220\u9664\u6587\u4ef6" title="\u5220\u9664\u6587\u4ef6"></a>';
                        fade(m, "\u4e0a\u4f20\u6210\u529f");
                        jQuery(a).trigger("reloadGrid")
                    } else {
                        fade(g, q)
                    }
                }
            })
}
function dySetGridHeight() {
    var b = 925, c = 525;
    var a = parseInt(jQuery(".ui-jqgrid-btable").css("height")) + 30;
    a = a < c ? c : a;
    jQuery("#grid").jqGrid("setGridHeight", Math.min(b, a))
}
function delRows(e) {
    var d = document.getElementById("grid");
    var b = [];
    for (var c = 0, a = e.length; c < a; c++) {
        var f = jQuery(d).jqGrid("getCell", e[c], "objectId");
        if (f) {
            b.push(f)
        }
    }
    if (b) {
        $.ajax({
            type : "POST",
            url : BmobNamespace.delRowUrl,
            data : {
                "objid[]" : b
            },
            dataType : "html",
            async : false,
            success : function(g) {
                if ("success" == g) {
                    fade(info_error, "\u5220\u9664\u6210\u529f");
                    window.location.href = BmobNamespace.browserUrl
                } else {
                    fade(info_error, g)
                }
            }
        })
    } else {
        fade(info, "\u4e0d\u5728\u5217\u8868\u4e2d\u6216\u5df2\u7ecf\u5220\u9664")
    }
}
function delCellFile(a, b) {
    var c = $("#confirm-dialog");
    if (a) {
        $(c).html("\u4f60\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u6587\u4ef6\u5417\uff1f");
        $(c).dialog(
                {
                    title : "\u786e\u8ba4\u64cd\u4f5c",
                    buttons : {
                        "\u786e\u5b9a" : function() {
                            $(this).dialog("close");
                            $.ajax({
                                type : "GET",
                                url : "/app/delcellfile/id/" + BmobNamespace.appid + "/tid/" + BmobNamespace.docid
                                        + "/objid/" + a + "/name/" + b,
                                dataType : "html",
                                async : false,
                                success : function(d) {
                                    if ("success" == d) {
                                        fade(info_success, "\u5220\u9664\u6210\u529f");
                                        jQuery("#grid").trigger("reloadGrid")
                                    } else {
                                        fade(info_error, d)
                                    }
                                }
                            })
                        },
                        "\u53d6\u6d88" : function() {
                            $(this).dialog("close")
                        }
                    }
                }).dialog("open")
    }
};
