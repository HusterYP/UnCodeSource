$(function() {		//滑动 隐藏/显示 并为框填制
    function f(i) {
        $(i + " p").click(function() {
            var j = $(i + " ul");
            if (j.css("display") == "none") {
                $(".select ul").hide();
                j.slideDown("fast")
            } else {
                j.slideUp("fast")
            }
        });
        $(i + " ul li a").click(function() {
            var j = $(this).text();
            $(i + " p").html(j);
            var k = $(this).attr("rel");
            $(i).next("select").find("option").html(j);
            $(i).next("select").find("option").val(k);
            $(i + " ul").hide();
            if (i == "#yylb") {
                editApp("cat_id", k)
            }
        })
    }
    $(".selectdown").each(function() {
        var i = $(this).attr("id");
        f("#" + i)
    });
    f("#yyfxsel1");
    f("#yyfxsel2");
    f("#yyfxsel3");
    f("#yylb");
    f("#broswer_data_value");
    f("#plat_sel");
    f("#time_sel");
    f("#send_time_now");
    f("#send_time_past");
    f("#rwddTimeSel1");//定时任务下重复选项
    f("#rwddTimeSel2");
    f("#rwddTimeSel3");
    f("#rwddTimeSel4");
    f("#rwddTimeSel5");
    f("#thumbnails_select_format");
    $(".common_select").each(function() {
        $(this).find("p").click(function() {
            var j = $(this).parent().find("ul");
            if (j.is(":hidden")) {
                j.slideDown("fast")
            } else {
                j.slideUp("fast")
            }
        });
        var i = $(this);
        $(this).find("a").click(function() {
            var j = $(this).text();
            var k = $(this).attr("val");
            i.find("p").html(j);
            i.find("ul").hide();
            i.next().val(k)
        })
    });
    $("#tabs ul li").click(function() {
        var i = $("#tabs ul li").index(this);
        $("#tabs ul li a").removeClass("on");
        $(this).find("a").addClass("on");
        $(".tabdiv").hide();
        $(".tabdiv").eq(i).show()
    });
    function c(j) {
        if ($(j).css("padding-top")) {
            var i = $(j).css("padding-top").substring(0, $(j).css("padding-top").length - 2)
        } else {
            var i = 0
        }
        return i
    }
    function a(j, n, o) {
        var m = window.location.href.split("/");
        if ("browser" == m[4]) {
            var k = $(window).height() - 5
        } else {
            var k = $(document).height()
        }
        var l = k - n;
        var i = c(j);
        $(j).height(l - i);
        if (arguments.length == 3) {
            $(o).each(function() {
                var p = c(this);
                $(this).height(l - p)
            })
        }
    }
    var d = $("#top").height() - c("#top");
    a(".yymblb", d, ".yymbxq,.yymbxq_left,.yymbxq_right");
    a(".sy_left", d);
    a(".wdxx_left", d);
    a(".content_sidebar", d);
    a(".side_content_main", d);
    a(".content_wrap", d);
    function h(j, i) {
        function k() {
            $(j).toggle(function() {
                $(i).show()
            }, function() {
                $(i).hide()
            })
        }
        k();
        $(i).children().click(function() {
            $(i).hide();
            $(j).unbind();
            k()
        });
        $("body").not(i).not(j).click(function() {
            $(i).hide();
            $(j).unbind();
            k()
        })
    }
    h("#select span", "#top .option");
    h(".sdiv .last", ".sdiv .gddiv");
    h("#broswer_data_value p", "#broswer_data_value ul");
    $("#select .option a").click(function() {
        $("#select span").html($(this).html());
        $("#select .option").hide()
    });
    $(".bdiv .ts").click(function() {
        $(".bdiv .fydiv").show()
    });
    $(".bdiv .fydiv a").click(function() {
        $(".bdiv .ts").html($(this).html());
        $(".bdiv .fydiv").hide()
    });
    $(".bannerclose").click(function() {
        $(".bannertips").fadeOut()
    });
    $(".tablebg table tr th input").click(function() {
        if ($(this).is(":checked")) {
            $(".tablebg table tr td input").each(function() {
                $(this).attr("checked", "true")
            })
        } else {
            $(".tablebg table tr td input").removeAttr("checked");
            $(this).removeAttr("checked")
        }
    });
    function e(j, i) {
        $.fn.wresize = function(m) {
            version = "1.1";
            wresize = {
                fired : false,
                width : 0
            };
            function l() {
                if ($.browser.msie) {
                    if (!wresize.fired) {
                        wresize.fired = true
                    } else {
                        var o = parseInt($.browser.version, 10);
                        wresize.fired = false;
                        if (o < 7) {
                            return false
                        } else {
                            if (o == 7) {
                                var p = $(window).width();
                                if (p != wresize.width) {
                                    wresize.width = p;
                                    return false
                                }
                            }
                        }
                    }
                }
                return true
            }
            function n(o) {
                if (l()) {
                    return m.apply(this, [ o ])
                }
            }
            this.each(function() {
                if (this == window) {
                    $(this).resize(n)
                } else {
                    $(this).resize(m)
                }
            });
            return this
        };
        function k(n, m) {
            var o = $(window).width();
            var l = o - m;
            $(n).width(l)
        }
        $(window).wresize(function() {
            k(j, i)
        });
        k(j, i)
    }
    e(".wdxx_right", $(".wdxx_left").width() + 10);
    e(".yymbxq_right", $(".yymblb").width() + $(".yymbxq_left").width());
    e(".yymbxq", $(".yymblb").width());
    e(".tablebg", $(".yymblb").width() + $(".yymbxq_left").width() + 60);
    e(".side_content_main", $(".yymblb").width() + $(".content_sidebar").width());
    e(".content_wrap", 0);
    function g(j, i) {
        $(window).wresize(function() {
            $(j).width($(i).width())
        });
        $(j).width($(i).width())
    }
    g("#gbox_grid", ".tablebg");
    g("#gview_grid", "#gbox_grid");
    g("#gridpager", "#gbox_grid");
    $("#rule-dialog .dialog_cont .p_2 a").click(function() {
        $("#rule-dialog .dialog_cont .p_2 a").removeClass("on");
        $(this).addClass("on");
        var j = $(this).index();
        $(".p_3").hide();
        $("#pp" + j).show()
    });
    if ($(".yymbxq_right .tablebg #gview_grid .ui-jqgrid-hdiv").width() < $(".tablebg").width()) {
        $(".yymbxq_right .tablebg #gview_grid .ui-jqgrid-hdiv").width("100%")
    }
    $("a.del_verify").hide();
    $("table#verify_list tr").each(function() {
        $(this).mouseover(function() {
            $(this).find(".del_verify").show()
        });
        $(this).mouseleave(function() {
            $(this).find(".del_verify").hide()
        })
    });
    $("a.del_market").hide();
    $("#m_list tr").each(function() {
        $(this).mouseover(function() {
            $(this).find(".del_market").show()
        });
        $(this).mouseleave(function() {
            $(this).find(".del_market").hide()
        })
    });
    function b(k, i, j) {
        $(k).focus(function() {
            $(this).css("border", j)
        });
        $(k).blur(function() {
            $(this).css("border", i)
        })
    }
    b("#user-form table tr td input[type='text'],#user-form table tr td input[type='password']", "1px solid #bdbdbd",
            "1px solid #56baee");
    b("#m_list tr td input[type='text']", "1px solid #bdbdbd", "1px solid #56baee");
    $(".rwdd .work_tab a").eq(0).click(function() {
        $(".time_field").hide();
        $(".select_field").show();
        $(".rwdd .work_tab a").removeClass("active");
        $(this).addClass("active")
    });
    $(".rwdd .work_tab a").eq(1).click(function() {
        $(".time_field").show();
        $(".select_field").hide();
        $(".rwdd .work_tab a").removeClass("active");
        $(this).addClass("active")
    })
});
