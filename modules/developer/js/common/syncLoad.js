var SyncLoad={};

/**
 * 动态加载 文件[s]
 * @param path 路径 
 * @param file [ ] 文件或数组
 */
SyncLoad.includeFile=function(includePath,file,callBack){
    var includeCount =0;
    var files = typeof file == "string" ? [ file ] : file;
    for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, "");
        var att = name.split('.');
        var ext = att[att.length - 1].toLowerCase();
        var isCSS = ext == "css";
        var tag = isCSS ? "link" : "script";
        var newDom = document.createElement(tag);
        includePath=SyncLoad.getAbsoluteUrl(includePath);
        newDom.setAttribute('data-loadtype','sync');
        if(isCSS){
            newDom.setAttribute("type", 'text/css') ;
            newDom.setAttribute("rel", 'stylesheet') ;
            newDom.setAttribute("href", includePath + name) ;
        }else {
            newDom.setAttribute("type", 'text/javascript') ;
            newDom.setAttribute("language", 'javascript') ;
            newDom.setAttribute("src", includePath + name) ;
        }
        var link = (isCSS ? "href" : "src") + "='" + includePath + name + "'";
        if ($(tag + "[" + link + "]").length == 0){
            $("html")[0].appendChild(newDom);
            newDom.onload=function(){
                includeCount++; 
                if(includeCount==files.length && callBack){
                    callBack();
                }
            }; 
        }
    }
};

/**
 * 查找加载的文件
 */
SyncLoad.findFile=function(filePath){
    // 相对路径转 绝对路径
    var filePath = SyncLoad.getAbsoluteUrl(filePath);
    
    var att = filePath.split('.');
    var ext = att[att.length - 1].toLowerCase();
    var tag = (ext == "css") ? "link" : "script";
    var attr = (ext == "css") ? "href" : "src";
    var result ;
    $(tag+"[data-loadtype='sync']").each(function(el){
//        console.log(this[attr]);
        if( this[attr] ==filePath){
            return result = this;
        }
    });
    return result ;
};

/**
 * 获取绝对路径
 */
SyncLoad.getAbsoluteUrl = function(url){
    var a = document.createElement("a");
    a.href = url;  //  
    url = a.href;  // 此时相对路径已经变成绝对路径
    return url;
};

/**
 * 运行动态加载的js文件中的的方法
 */
SyncLoad.run=function(updateField,currentMethod) {
    if ("undefined" == typeof (updateField)) {
        setTimeout('SyncLoad.run(updateField,currentMethod)', 333); //每333 毫秒检测一次
        console.log("SyncLoad.run(updateField,currentMethod)---");
        return;
    }
    
    window[updateField](currentMethod);
};

