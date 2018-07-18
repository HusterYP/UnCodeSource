
/*调用
    var broswer = broswer();
    console.info("broswer.version: ", Broswer.version);
    console.info("broswer.msie is ", Broswer.msie);
    console.info("broswer.safari is ", Broswer.safari);
    console.info("broswer.opera is ", Broswer.opera);
    console.info("broswer.mozilla is ", Broswer.mozilla);
    console.info("broswer.chrome is ", Broswer.chrome);
    console.info("broswer.konqueror is ", Broswer.konqueror);
 */


var broswerBuild = function() {
    var _broswer={};
    var sUserAgent = navigator.userAgent;
    console.info("useragent: ", sUserAgent);
    var isOpera = sUserAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //首先检测Opera是否进行了伪装
        if (navigator.appName == 'Opera') {
            //如果没有进行伪装，则直接后去版本号
            _broswer.version = parseFloat(navigator.appVersion);
        } else {
            var reOperaVersion = new RegExp("Opera (\\d+.\\d+)");
            //使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
            reOperaVersion.test(sUserAgent);
            _broswer .version = parseFloat(RegExp['$1']);
        }
        _broswer.opera = true;
    }
    var isChrome = sUserAgent.indexOf("Chrome") > -1;
    if (isChrome) {
        var reChorme = new RegExp("Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?");
        reChorme.test(sUserAgent);
        _broswer .version = parseFloat(RegExp['$1']);
        _broswer .chrome = true;
    }
    //排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
    var isKHTML = (sUserAgent.indexOf("KHTML") > -1
            || sUserAgent.indexOf("Konqueror") > -1 || sUserAgent
            .indexOf("AppleWebKit") > -1)
            && !isChrome;
    if (isKHTML) {//判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
        var isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
        var isKonq = sUserAgent.indexOf("Konqueror") > -1;
        if (isSafari) {
            var reAppleWebKit = new RegExp("Version/(\\d+(?:\\.\\d*)?)");
            reAppleWebKit.test(sUserAgent);
            var fAppleWebKitVersion = parseFloat(RegExp["$1"]);
            _broswer .version = parseFloat(RegExp['$1']);
            _broswer .safari = true;
        } else if (isKonq) {
            var reKong = new RegExp(
                    "Konqueror/(\\d+(?:\\.\\d+(?\\.\\d)?)?)");
            reKong.test(sUserAgent);
            _broswer .version = parseFloat(RegExp['$1']);
            _broswer .konqueror = true;
        }
    }
    // !isOpera 避免是由Opera伪装成的IE  
    var isIE = sUserAgent.indexOf("compatible") > -1
            && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(sUserAgent);
        _broswer .version = parseFloat(RegExp['$1']);
        _broswer .msie = true;
    }
    // 排除Chrome 及 Konqueror/Safari 的伪装
    var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isChrome && !isKHTML;
    if (isMoz) {
        var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
        reMoz.test(sUserAgent);
        _broswer .version = parseFloat(RegExp['$1']);
        _broswer .mozilla = true;
    }
    return _broswer ;
};
/**
 * 判断浏览器版本
 */
var Broswer =broswerBuild();

