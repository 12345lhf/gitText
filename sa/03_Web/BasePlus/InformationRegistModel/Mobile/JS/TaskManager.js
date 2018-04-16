/// <reference path="../../Common/JS/IRM_Common.js" />
/// <reference path="http://localhost:8000/Base/Mobile/JS/LeadingCloud.js" />
/// <reference path="FormManager.js" />
/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-03-01 14:18:48
 * 描述：协作任务模型通用js
 * 维护：
 * *******************************************************/
/**
 * 用于PC端模拟移动端测试【临时使用】
 * 
 */
if (navigator.platform.toLocaleLowerCase().indexOf("win") == 0) {
    "use strict";
    sessionStorage.setItem('lcm.appinfo', JSON.stringify({
        "default": { "webapi": "http://" + location.hostname + ":8400" },
        "file": { "webapi": "http://192.168.11.51:8600" },
        "MISPTServer": { "webapi": "http://" + location.hostname + ":8413" },
        "InformationRegistModel": { "webapi": "http://" + location.hostname + ":8426" },
        "DesignInstituteCollaboration": { "webapi": "http://" + location.hostname + ":8416" },
        "ConstructionSiteCollaboration": { "webapi": "http://" + location.hostname + ":8418" },
        "PreBuildOwnersCollaboration": { "webapi": "http://" + location.hostname + ":8417" }
    }));
    var userInfo = JSON.parse(localStorage.getItem('session'));
    if (userInfo != null) {
        sessionStorage.setItem("lcm.userinfo",
            '{ "userId": "' + userInfo.user.uid +
            '","userName": "' + userInfo.user.username +
            '","face":"' + userInfo.user.face +
            '","oid":"' + JSON.parse(userInfo.user.notificaton).selectoid +
            '", "tokenId": "' + JSON.parse(localStorage.getItem('session')).tokenid + '"}');
        window.dispatchEvent(new Event("LCMAppInfo"));
    }
}

/**
 * 基础方法事件
 */  //,mispt   mispt.base.js
if (typeof (lzm) == "undefined") {
    window.lzm = {};
    //扩展方法
    (function (lzm) {
        lzm.PromptBox = {
            loading: function (flag) {
                try {
                    if (flag == false) lzm.JSNCHelper.showTip(4);
                    else lzm.JSNCHelper.showTip(1);
                } catch (e) {
                    if (flag == false) console.log("加载完成")
                    else console.log("正在加载。。")
                }
            },
            error: function (message) {
                try {
                    lzm.JSNCHelper.showTip(3, message);
                } catch (e) {
                    console.error("【错误】:" + message);
                }
            }
        }
        //合并原有存在的
        lzm.extendInHere = function () {
            var target = arguments[0] || {},
                length = arguments.length,
                options, src, copy, name, deep,
                i = 1;

            if (typeof target === "boolean") {
                deep = target;
                target = arguments[i] || {};
                i++;
            }
            if (typeof target !== "object") target = {};
            for (; i < length; i++) {
                for (name in target) {
                    if (arguments[i].hasOwnProperty(name)) {
                        target[name] = arguments[i][name];
                    }
                }
            }
            return target;
        };
        //全部合并
        lzm.extend = function () {
            var target = arguments[0] || {},
                length = arguments.length,
                options, src, copy, name, deep,
                i = 1;

            if (typeof target === "boolean") {
                deep = target;
                target = arguments[i] || {};
                i++;
            }
            if (typeof target !== "object") target = {};

            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        target[name] = options[name];
                    }
                }
            }
            return target;
        };
    })(lzm);

    //类型判断
    (function (lzm) {
        lzm.Type = {
            //获取data的类型：返回data的typeof小写字符串
            get: function (data) {
                return (typeof (data)).toLowerCase();
            },
            //data是否是typeString类型：是返回true，否则返回false
            is: function (data, typeString) {
                var tempGet = lzm.Type.get;
                if (tempGet(typeString) == "string")
                    return tempGet(data) == typeString.toLowerCase();
                return false;
            },
            //data是否是字符串
            isString: function (data) {
                return lzm.Type.is(data, "string");
            },
            //data是否是方法
            isFunction: function (data) {
                return lzm.Type.is(data, "function");
            },
            //data是否是bool类型
            isBoolean: function (data) {
                return lzm.Type.is(data, "boolean");
            },
            //data是否是undefined类型
            isUndefined: function (data) {
                return lzm.Type.is(data, "undefined");
            },
            // data是否数值类型
            isNumber: function (data) {
                return !isNaN(data);
            },
            //data是否是HTML元素
            isHTMLElement: function (data) {
                try {//HTMLElement对象在IE5不支持，此时就判断data的节点类型和节点名称
                    if (HTMLElement) return (data instanceof HTMLElement);
                    else return (data.nodeType == 1) && lzm.Type.isString(data.nodeName);
                } catch (e) { }
                return false;
            },
            //data 判断object/json 是否为空
            isEmptyObject: function (data) {
                for (var i in data)
                    return !1;
                return !0
            }
        }
    })(lzm);

    //字符串
    (function (lzm) {
        //字符串（静态）
        lzm.String = {
            isString: lzm.Type.isString,
            //data是否是空或者空字符串
            isNullOrEmpty: function (data) {
                if (lzm.String.isString(data))
                    return data.length == 0;
                return true;
            },
            //将data按照指定格式生成新字符串，样式：lzm.String.format("wo shi  {0}=={1}", "测试代码","的");  返回:wo shi 测试代码==的
            format: function (data, params) {
                if (lzm.String.isNullOrEmpty(data)) return "";
                var args = Array.prototype.slice.call(arguments, 1);//获取参数
                return data.replace(/\{(\d+)\}/g, function (m, i) { return args[i]; });
            },
            //data是否以prefix字符串开头开头
            startWith: function (data, prefix) {
                var tempFunc = lzm.String.isString;
                if (tempFunc(data) && tempFunc(prefix)) {
                    var templen = prefix.length;
                    if (data.length >= templen)
                        return (data.substr(0, templen) == prefix);
                }
                return false;
            },
            //从data的开始位置去除prefix字符串（prefix默认空格）
            trimStart: function (data, prefix) {
                if (!lzm.String.isString(prefix)) prefix = " ";
                var templen = prefix.length;
                if (templen == 0) return data;// 如果传入空字符串，那么会导致死循环的，先判断一下
                var tempFunc = lzm.String.startWith;
                while (tempFunc(data, prefix)) {
                    data = data.substr(templen);
                }
                return data;
            },
            //data是否以suffix字符串结束
            endWith: function (data, suffix) {
                var tempFunc = lzm.String.isString;
                if (tempFunc(data) && tempFunc(suffix)) {
                    var templen = data.length - suffix.length;
                    if (templen >= 0)
                        return (data.substr(templen) == suffix);
                }
                return false;
            },
            //从data的结束位置去除suffix字符串（suffix默认空格）
            trimEnd: function (data, suffix) {
                if (!lzm.String.isString(suffix)) suffix = " ";
                var templen = suffix.length;
                if (templen == 0) return data;
                var tempFunc = lzm.String.endWith;
                while (tempFunc(data, suffix)) {
                    data = data.substr(0, data.length - templen);//这里的data.length不能缓存，只能每次获取
                }
                return data;
            },
            //从data的开始和技术位置去除str字符串（str默认空格）
            trim: function (data, str) {
                var tempFunc = lzm.String;
                data = tempFunc.trimStart(data, str);
                data = tempFunc.trimEnd(data, str);
                return data;
            },
            //DOM转换成字符串
            nodeToString: function (node) {
                var tmpNode = document.createElement("div");
                tmpNode.appendChild(node.cloneNode(true));
                var str = tmpNode.innerHTML;
                tmpNode = node = null; // prevent memory leaks in IE
                return str;
            },
        }
    })(lzm);

    //时间
    (function (lzm) {
        lzm.Date = {
            //日期格式化
            format: function (data, format, isData, isSubM) {
                var _Date = isData ? data : new Date(data);
                if (_Date == "Invalid Date") {
                    alert("日期验证失效")
                }
                var o = {
                    //month
                    "M+": (isSubM ? _Date.getMonth() : _Date.getMonth() + 1),
                    //day
                    "d+": _Date.getDate(),
                    //hour
                    //"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //时           
                    "H+": _Date.getHours(),
                    //minute
                    "m+": _Date.getMinutes(),
                    //second
                    "s+": _Date.getSeconds(),
                    //quarter
                    "q+": Math.floor((_Date.getMonth() + 3) / 3),
                    //millisecond
                    "S": _Date.getMilliseconds()
                }
                var week = {
                    "0": "\u65e5",
                    "1": "\u4e00",
                    "2": "\u4e8c",
                    "3": "\u4e09",
                    "4": "\u56db",
                    "5": "\u4e94",
                    "6": "\u516d"
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (_Date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(format)) {
                    format = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[_Date.getDay() + ""]);
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        var temp = (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length));
                        if (RegExp.$1 == "MM" && temp == "00")
                            temp = 12;
                        format = format.replace(RegExp.$1, temp);
                    }
                }
                return format;
            }
        }
    })(lzm);

    //数组
    (function (lzm) {
        lzm.Array = {
            // 判断对象是否是数组
            isArray: function () { return (this instanceof Array) },
            // 移除数组中重复的元素
            unique: function () {
                var res = [];
                var json = {};
                for (var i = 0; i < this.length; i++) {
                    if (!json[this[i]]) {
                        res.push(this[i]);
                        json[this[i]] = 1;
                    }
                }
                return res;
            }
        }
    })(lzm);

    //API相关
    (function (lzm) {
        var isShowTip = 0;
        lzm.WebApi = function (appCode) {
            //参数初始化
            var _DefaultCode = "default"
                , _AppCode = appCode || _DefaultCode
                , _FileCode = "FileServers";
            /**
             * 获取头像地址
             * @faceId {string} 头像id
             * @return {string} 头像地址
             */
            this.getFacePic = function (faceId) {
                if (lzm.Type.isString(faceId)) {
                    var src = RemotelyFileServerManager.GetImageUrl(faceId, "32X32", "icon");
                    if (/\/api\/fileserver/.test(src) && /\?/.test(src) == false) src += "?random" + Date.parse(new Date());
                    return src;
                } else {
                    return "/BasePlus/MISPTModule/Mobile/Images/defaltFace.gif";
                }
            }
            /**
             * 根据图片Id获取图片路径
             * @fileId {string} 文件id
             * @isRandom {boo} 是否每次获取最新
             * @defaultSrc {string} 默认图片地址
             * @return {string} 图片路径
             */
            this.getImgPath = function (fileId, isRandom, defaultSrc) {
                if (lzm.Type.isString(fileId)) {
                    var src = RemotelyFileServerManager.GetImageUrl(fileId, (whSize ? whSize : "400X300"), "thumbnail");
                    if (isRandom && /\/api\/fileserver/.test(src) && /\?/.test(src) == false) src += "?random" + Date.parse(new Date());
                    return src;
                } else {
                    return defaultSrc ? defaultSrc : "/BasePlus/MISPTModule/Common/Images/project-default.png";
                }
            }
            /**
            * 根据用户Id获取用户姓名
            * @userId {string} 用户ID
            * @callback {function} 参数为用户信息
            */
            this.getUserInfo = function (userId, callback) {
                LeadingCloud.App.get(_DefaultCode).http.post('api/user/loaduser', { "": userId }, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        callback(data.DataContext);
                    } else {
                        lzm.PromptBox.error("获取用户信息失败！")
                    }
                });
            };
            /**
             * 根据用户Id获取用户姓名
             * @userId {string} 用户ID
             * @callback {function} 参数为用户姓名
             */
            this.getUserName = function (userId, callback) {
                this.getUserInfo(userId, function (data) {
                    callback(data["username"]);
                })
            }

            /**
             * post 请求
             * @url {string} api地址
             * @data {object} 数据对象
             * @callback {function} 回调函数
             */
            this.post = function (url, data, callback, errorback, noloading, appcode) {
                if (!noloading) { try { isShowTip++; lzm.JSNCHelper.showTip(1); } catch (e) { console.log("正在加载。。。") } };
                LeadingCloud.App.get(appcode ? appcode : _AppCode).http.post(url, data, function (data) {
                    if (!noloading) {
                        isShowTip++; try {
                            if (isShowTip % 2 == 0) { lzm.JSNCHelper.showTip(); isShowTip = 0; }
                        } catch (e) {
                            console.log("加载完成。。。")
                        }
                    }
                    if (data.ErrorCode.Code === '0') {
                        if (data.DataContext && lzm.String.isString(data.DataContext))
                            try { data.DataContext = JSON.parse(data.DataContext) } catch (e) { };
                        callback(data.DataContext);
                    } else {
                        errorback(data.ErrorCode);
                    }
                }, errorback);
            }
            /**
             * get 请求
             * @url {string} api地址
             * @callback {function} 回调函数
             */
            this.get = function (url, callback, errorback, noloading, appcode) {
                if (!noloading) { try { isShowTip++; lzm.JSNCHelper.showTip(1); } catch (e) { console.log("正在加载。。。") } };
                LeadingCloud.App.get(appcode ? appcode : _AppCode).http.get(url, function (data) {
                    if (!noloading) {
                        isShowTip++; try {
                            if (isShowTip % 2 == 0) { lzm.JSNCHelper.showTip(); isShowTip = 0; }
                        } catch (e) {
                            console.log("加载完成。。。")
                        }
                    }
                    if (data.ErrorCode.Code === '0') {
                        if (data.DataContext && lzm.String.isString(data.DataContext))
                            try { data.DataContext = JSON.parse(data.DataContext) } catch (e) { };
                        callback(data.DataContext);
                    } else {
                        errorback(data.ErrorCode);
                    }
                }, errorback);
            }
        }
    })(lzm);

    //文件相关
    (function (lzm) {
        //参数初始化
        var _FileApiManager = new lzm.WebApi("file"), _WebApiManager = new lzm.WebApi("default"), _FileCode = "default";
        lzm.fileHelper = {
            /**
             * 添加文件
             * @param 资源池ID
             * @param 目录ID
             * @param 文件信息
             * @param 成功回调
             * @param 失败回调
             */
            addFile: function (rpId, folderId, fileInfo, successFunc, errorFunc) {
                var tempName = fileInfo.name.split('.');
                tempName.pop();
                var postData = {
                    rpid: rpId,
                    name: tempName.join(''),
                    exptype: fileInfo.exptype,
                    rtype: '1',
                    fileids: fileInfo.id,
                    partitiontype: '0',
                    classid: folderId,
                };
                LeadingCloud.App.get(_FileCode).http.post('api/resource/addresource', postData, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            successFunc(data);
                        } catch (e) {
                            errorFunc(data);
                        }
                    } else {
                        errorFunc(data);
                    }
                });
            },
            /**
             * 删除文件
             * @param 资源池ID
             * @param 目录ID
             * @param 文件ID集合
             * @param 成功回调
             * @param 失败回调
             */
            removeFiles: function (rpId, folderId, fileIds, successFunc, errorFunc) {
                LeadingCloud.App.get(_FileCode).http.post('api/Resource/DelBatchDelete', {
                    rpid: rpId,
                    partitiontype: "0",
                    resourceids: fileIds.join(','),
                }, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            successFunc(data);
                        } catch (e) {
                            errorFunc(data);
                        }
                    } else {
                        errorFunc(data);
                    }
                });
            },

            importFiles: function (rpid, folderId, fileids, successFunc, errorFunc) {
                _WebApiManager.post("api/resource/addresource", {
                    //资源池ID
                    rpid: rpid,
                    classid: folderId,
                    //服务器返回的上传文件的ID
                    fileids: fileids,
                    partitiontype: "0"
                }, successFunc, errorFunc);
            },

            /**
            * 创建文件夹
            */
            addfolders: function (rpId, folders, successFunc, errorFunc) {
                var postData = {
                    rpid: rpId,
                    folders: [],
                    partitiontype: "0",
                    savetype: "child"
                };
                [].map.call(folders, function (folderItem) {
                    postData.folders.push(folderItem);
                });
                LeadingCloud.App.get(_FileCode).http.post('api/resource/folder/import', postData, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            successFunc(data.DataContext);
                        } catch (e) {
                            errorFunc(data.ErrorCode);
                        }
                    } else {
                        errorFunc(data.ErrorCode);
                    }
                });
            },

            /**
             * 创建文件夹
             */
            addfolder: function (rpId, name, successFunc, errorFunc) {
                var postData = {
                    rpid: rpId,
                    name: name,
                    parentid: "",
                    partitiontype: "0",
                    description: ""
                };
                LeadingCloud.App.get(_FileCode).http.post('api/resource/folder/addfolder', postData, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            successFunc(data.DataContext);
                        } catch (e) {
                            errorFunc(data.ErrorCode);
                        }
                    } else {
                        errorFunc(data.ErrorCode);
                    }
                });
            },
            /**
             * 重命名文件目录
             */
            editFolderName: function (rpId, folderId, newName, successFunc, errorFunc) {
                var postData = {
                    id: folderId,
                    rpid: rpId,
                    name: newName,
                };
                LeadingCloud.App.get(_FileCode).http.post('api/resource/folder/editfolder', postData, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            successFunc(data);
                        } catch (e) {
                            errorFunc(data);
                        }
                    } else {
                        errorFunc(data);
                    }
                });
            },

            getFileInfo: function (fileId, successFunc, errorFunc, noloading) {
                _FileApiManager.get(lzm.String.format("api/fileserver/gallelryfilemodel/{0}", fileId), successFunc, errorFunc, noloading);
            },

            /**
             * 获取文件
             * @param 资源池ID
             * @param 目录ID
             * @param 成功回调
             * @param 失败回调
             */
            getFiles: function (rpId, folderId, successFunc, errorFunc) {
                LeadingCloud.App.get(_FileCode).http.get('api/resource/getfolder/' + rpId + "/0/" + folderId, function (data) {
                    if (data.ErrorCode.Code == "0") {
                        try {
                            data.DataContext = data.DataContext || { resourcemodels: [] };
                            //倒排文件，新的在后面
                            //使用sort会出现不排序问题，故直接反转
                            var temp = [];
                            for (var i = data.DataContext.resourcemodels.length - 1; i >= 0; i--) {
                                temp.push(data.DataContext.resourcemodels[i]);
                            }
                            data.DataContext.resourcemodels = temp;
                            successFunc(data.DataContext);
                        } catch (e) {
                            errorFunc(e);
                        }
                    } else {
                        errorFunc(data.ErrorCode.Message);
                    }
                });
            },
            /**
             * 获取文件地址（缩略图）
             * @param 文件id
             */
            getFilesUrl: function (fileId) {
                var src = RemotelyFileServerManager.GetImageUrl(fileId, "800X800", "thumbnail");
                if (/\/api\/fileserver/.test(src) && /\?/.test(src) == false) src += "?random" + Date.parse(new Date());
                return src; 
            },
            /**
             * 调用原生打开预览文件（资源方式）
             * @param 资源id
             * @param 资源版本
             */
            openFile: function (rid, version) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileScanFile");
                plugin.run("scanFile", { "resid": rid.toString(), "version": version.toString() }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 调用原生打开预览文件（文件）
             * @param 文件id
             * @param 文件名
             */
            openFileByFid: function (fid, name) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileScanFile");
                plugin.run("scanFile", { "expid": fid, "name": name }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });

            }
        };

    })(lzm);

    //原生调用接口
    (function (lzm) {
        var resubmitFlag = false;
        //原生调用接口（静态）
        lzm.JSNCHelper = {
            /**
             * 隐藏键盘
             * @callback {function} 回调函数
             */
            hideKeyboard: function (callback) {
                document.activeElement.blur();
                try {
                    var plugin = LeadingCloud.JSNC.getChannel("LZMobileWebView");
                    plugin.run("hiddenKeyBoard", null, function (resultType, resultData) {
                        if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); } else {
                            if (callback instanceof Function) callback();
                        }
                    });
                } catch (e) {
                    callback();
                }
            },
            /**
             * 打开项目-模块列表
             * @prid {string} 项目id
             */
            openProject: function (prid) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileProject");
                plugin.run("openProjectModules", {
                    "prid": prid
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 打开详情页面
             * @id {string} 任务id
             * @appcode {string} 应用编码
             * @moduleCode {string} 模块编码
             * @ttConfigCode {int}
             */
            openDetail: function (runtimeContext, moduleCode, ttConfigCode) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
                plugin.run("notificationBarVisible", {
                    "ttid": "165266724197634049",
                    "pagetransdata": JSON.stringify(runtimeContext || {})
                }, function (resultType, resultData) {
                });
                //if (resubmitFlag) return false;
                //else resubmitFlag = true;
                //LeadingCloud.App.get(appCode).http.get(lzm.String.format("api/{0}/AppConfig/GetTransactionTypeId/{1}/{2}", appCode, moduleCode, (ttConfigCode || 0)), function (data) {
                //    resubmitFlag = false;
                //    if (data.ErrorCode.Code == "0") {
                //        var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
                //        plugin.run("notificationBarVisible", {
                //            "ttid": data.DataContext.toString(),
                //            "pagetransdata": JSON.stringify({ "businessid": id })
                //        }, function (resultType, resultData) {
                //        });
                //    } else {
                //        alert("获取TTID失败！原因：" + data.ErrorCode.Message);
                //    }
                //});
            },
            /**
             * 设置tab页签协作文件页签是否发动态
             * @page {int} 页签索引 
             * @post {bool} 是否启用发动态 true-启用 ；false-禁用
             */
            setTabBarCooBaseFileDoPost: function (page, post) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
                plugin.run("refreshTabBar", {
                    "index": page,
                    "page": {
                        "ispost": post
                    }
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                })
            },
            /**
             * 设置右侧下拉按钮
             * @config {object} 按钮配置对象 {ButtonTitle:"按钮名称",ButtonIcon:"图片地址"}
             * @btnArray {array} 按钮配置数组  Eq:[  { "Name": "按钮名称", "Icon": "按钮图标", "click": function () {" 按钮点击事件" }]
             */
            setNavRightButton: function (config, extendBtnArray) {
                var defaultSingleBtnfun
                    , nofun = function () { alert("没有配置处理方法"); }
                    , defaults = {
                        "ButtonTitle": "新建",
                        "ButtonIcon": "LCM_Icon_24_Setting",
                        "PopupMenu": {
                            "ItemWidth": "135",
                            "ItemHeight": "44",
                            "Items": []
                        }
                    }
                if (("function" === typeof arguments[0]) && arguments.length == 1)
                    defaultSingleBtnfun = arguments[0];
                if (arguments[0] && ("object" === typeof arguments[0])) {
                    lzm.extendInHere(defaults, arguments[0]);
                    if (("function" === typeof arguments[1]))
                        defaultSingleBtnfun = arguments[1];
                    else if (!lzm.Array.isArray(arguments[1])) defaultSingleBtnfun = nofun;
                }
                if (extendBtnArray instanceof Array)
                    defaults['PopupMenu']['Items'] = extendBtnArray;
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
                plugin.run("setRightBatButton", defaults, function (resultType, resultData) {
                    if (defaultSingleBtnfun) defaultSingleBtnfun();
                    else if (resultType == 1) {
                        if (extendBtnArray[resultData]['click'] instanceof Function) extendBtnArray[resultData]['click']();
                        else alert("找不到按钮点击事件！");
                    }
                });
            },
            /**
             * 切换左侧按钮显示、隐藏
             * @isshow {bool} 设置隐藏， true-隐藏；false-显示
             */
            toggleNavLeftButtonShow: function (isshow) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
                plugin.run("setLeftBarButton", {
                    "Hidden": (isshow ? "true" : "false")
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });

            },
            /**
             * 隐藏右上角按钮
             */
            hideNavRightButton: function () {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
                plugin.run("setRightBatButton", {
                    "Hidden": "true"
                }, function (resultType, resultData) {
                    alert("隐藏按钮失败！" + resultData);
                });
            },
            /*
            *  设置导航按钮【btnIcon 和 btnTitle 不能同时为空】
            * @btnIcon {string}  图片地址或内置图片
            * @btnTitle {string}  任务对应的资源池ID
            * @clickfun {function}  按钮点击事件
            * @returns {unresolved}
            */
            setNavigationBtn: function (btnIcon, btnTitle, clickfun) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
                plugin.run("setRightBatButton", {
                    "ButtonTitle": btnTitle,
                    "ButtonIcon": ((btnIcon == 0 || !btnIcon) ? '' : btnIcon)
                }, function (resultType, resultData) {
                    clickfun();
                });
            },
            /*
            *  打开消息框【contactType 和 dialogId均非空】
            * @contactType {int} 
                        1：普通群聊天框
                        2：任务群、工作组、部门、企业等，非普通群的群聊天框,
            * @dialogId {int}  单人时为用户ID，群聊时为群ID
            * @returns {unresolved}
            */
            openMessage: function (contactType, dialogId) {
                lzm.JSNCHelper.hideKeyboard(function () {
                    var plugin = LeadingCloud.JSNC.getChannel("LZMobileChatView");
                    LeadingCloud.App.get("message").http.get(lzm.String.format('api/imgroup/getgroupinfobyrelateid/{0}', dialogId), function (data) {
                        if (data.ErrorCode.Code == "0") {
                            if (!data.DataContext) mui.toast("任务未发布，不能聊天，请先发布任务。");
                            else
                                plugin.run("openChatView", { "ContactType": contactType, "DialogID": data.DataContext['igid'] }, function (resultType, resultData) {

                                });
                        } else {
                            lzm.PromptBox.error("获取消息数据参数失败！")
                        }
                    });
                })
            },
            /**
             * 打开文件
             * 
             *  postConfig = {    //是否发动态，1：发动态 0：不发
                        "ispost": "",
                        //任务Id
                        "cid": "",
                        //应用appcode
                        "appcode": "",
                        // 动态类型 -使用AppCode
                        "posttype": "",
                        //扩展参数
                        "expanddata": '{"AppCode":"{0}","BusinessModuleId":"{1}","SceneCode":"{2}","TaskId":"{3}","Source":"CTM_Post_Source"}',
                    }
             */
            openFile: function (rpid, folderid, readOnly, title, postConfig) {
                var fileConfig = {
                    "pagename": "file",
                    "name": title || "文件",
                    "right": readOnly ? "1" : "0",
                    "protogenesis": true,
                    "rpid": rpid,
                    "folderid": folderid
                };
                if (postConfig) {
                    fileConfig = {
                        "pagename": "coobasefile",
                        //页签名称
                        "name": title || "文件",
                        //是否为原生页面 对应 true
                        "protogenesis": true,
                        //资源池ID
                        "rpid": rpid,
                        //特定文件夹id （定位到指定文件夹使用）
                        "folderid": folderid,
                        //是否发日志，1：发日志 0：不发
                        "islog": "1",
                        //读写权限（默认读写）1：只读0：读写
                        "right": "",
                        //是否发动态，1：发动态 0：不发
                        "ispost": "",
                        //任务Id
                        "cid": "",
                        //应用appcode
                        "appcode": "",
                        // 动态类型 -使用AppCode
                        "posttype": "",
                        //扩展参数
                        "expanddata": '{"AppCode":"{0}","BusinessModuleId":"{1}","SceneCode":"{2}","TaskId":"{3}","Source":"CTM_Post_Source"}',
                    }
                    lzm.extendInHere(fileConfig, postConfig);
                }
                var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
                plugin.run("openProtogenesisPage", fileConfig, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /*
            *  打开任务详情【taskid 和 taskName均非空】
            * @taskid {int}  任务ID
            * @taskName {string}  任务名称
            * @returns {unresolved}
            */
            openTaskDetail: function (taskid, taskName) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileCooperationTask");
                plugin.run("openTaskView", { "TaskID": taskid, "TaskName": taskName }, function (resultType, resultData) {
                });
            },
            /*
            *  88【taskid 和 rpid均非空】
            * @taskid {int}  任务ID
            * @rpid {int}  任务对应的资源池ID
            * @returns {unresolved}
            */
            openTaskFile: function (taskid, rpid) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileCooperationTask");
                plugin.run("openTaskFileView", { "TaskID": taskid, "RpID": rpid }, function (resultType, resultData) {

                })
            },
            /*
            *  打开选人界面 
            * @callback {function} 点击确定回调函数
            * @selectType {enum}  选择模式
                        0：多选
                        1：单选
            * @isEnableClickWhenZero {enum}  未选择人员时是否允许点击确定
                        0：不允许点击【默认】
                        1：允许
            * @isIncludeSelectImGroup {enum}  是否包括直接选择群组
                        0：不包括【默认】
                        1：包括
            * @disableSelectedUsers {array}  不可选人员数组
                        Eq：  ["18154001270863904","uid"]
            * @selectedUserModels {objectArray}  已选人员信息对象数组
                        Eq：  [
                                    { "uid": "17766310935033888", "username": "付智军测试", "face": "" },
                                    { "uid": "", "username": "", "face": "" }
                                    ] 
            * @returns {unresolved}
            */
            selectPersons: function (callback, selectType, isEnableClickWhenZero, isIncludeSelectImGroup, disableSelectedUsers, selectedUserModels) {
                if (typeof (callback) != "function")
                    alert("回调函数错误");
                var plugin = LeadingCloud.JSNC.getChannel("LZContactSelect");
                var parameters = {
                    "selectType": selectType || 0,// — 选择模式，0:多选, 1:单选 (默认0) 
                    "isEnableClickWhenZero": isEnableClickWhenZero || 0,// — 未选择人员时是否允许点击，0:不允许点击, 1:允许 (默认0)
                    "isIncludeSelectImGroup": isIncludeSelectImGroup || 0,// — 是否包括直接选择群组，0:不包括, 1:包括 (默认0)
                    "disableSelectedUsers": disableSelectedUsers || [],// — 不可选人员数组，参数为uid数组
                    "selectedUserModels": selectedUserModels || []// — 已选可修改的人员数组， 参数为UserModel数组
                };
                //插件运行结果和运行时参数【SelectedPersons】格式一致
                plugin.run("selectPerson", parameters, function (resultType, resultData) {
                    if (resultType == LeadingCloud.JSNC.RunResultType.Success) {
                        if (!(resultData instanceof Array)) resultData = new Array();
                        callback(resultData);
                    }
                    //if (resultType == LeadingCloud.JSNC.RunResultType.PluginNotRegist) {
                    //    mui.toast("插件未注册，详细信息：" + resultData);
                    //} else if (resultType == LeadingCloud.JSNC.RunResultType.MethodNotSupport) {
                    //    mui.toast("当前不支持此方法，详细信息：" + resultData);
                    //} else if (resultType == LeadingCloud.JSNC.RunResultType.Error) {
                    //    mui.toast("运行时发生错误，详细信息：" + resultData);
                    //}
                    //else if (resultType == LeadingCloud.JSNC.RunResultType.Success) {
                    //    mui.toast("运行成功，运行结果：" + resultData);
                    //}
                });
            },
            /**
             * 打开协作人员列表
             * @taskid {string} 
             */
            openMemberList: function (taskid, callback) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileCooperationTask");
                plugin.run("openTaskMembers", { "TaskID": taskid, "Type": "1" }, function (resultType, resultData) {
                    //callback(resultType, resultData);
                    alert(resultType + " === " + JSON.stringify(resultData));
                });
            },
            /**
             * 日期选择控件 【默认当前日期 "yyyy-MM-dd"】
             * yyyy-MM-dd、yyyy-MM-dd HH:mm、yyyy-MM-dd HH:mm:ss、HH:mm、HH:mm:ss
             * @format {string} 格式化方式 EQ："yyyy-MM-dd","yyyy-MM-dd hh:mm:ss"，"hh:mm"【可选参数 】
             * @title {string} 插件标题【可选参数】
             * @defaultvalue {string} 传入日期  EQ："2015-12-12"
             * @returns {string} 结果格式化日期
             */
            selectDate: function (callback, format, title, defaultvalue) {
                var formatEnum = {
                    "yyyy年MM月dd日": {
                        format: "yyyy-MM-dd",
                        getsouse: function (str) {
                            return lzm.Date.format(this.getDateSouse(str), this.format, true, true);
                        },
                        getDateSouse: function (str) {
                            return eval(lzm.String.format("new Date({0})", str.replace(/(\d{4}).(\d{2}).(\d{2})./g, '$1,$2,$3')));
                        },
                        getResultDate: function (str) {
                            return eval(lzm.String.format("new Date({0})", str.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1,$2,$3')));
                        }
                    },
                    "yyyy年MM月dd日 HH时mm分": {
                        format: "yyyy-MM-dd HH:mm",
                        getsouse: function (str) {
                            return lzm.Date.format(this.getDateSouse(str), this.format, true, true);
                        },
                        getDateSouse: function (str) {
                            return eval(lzm.String.format("new Date({0})", str.replace(/(\d{4}).(\d{2}).(\d{2}). (\d{2}).(\d{2})./g, '$1,$2,$3,$4,$5')));
                        },
                        getResultDate: function (str) {
                            return eval(lzm.String.format("new Date({0})", str.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g, '$1,$2,$3,$4,$5')));
                        }
                    },
                };
                var _TITLE = title || "日期选择";
                var _FORMAT = (formatEnum[format] ? formatEnum[format]["format"] : format) || "yyyy-MM-dd";
                var _DEFAULTVALUE = defaultvalue || lzm.Date.format(new Date(), _FORMAT, true);
                if (formatEnum[format]) {
                    _DEFAULTVALUE = formatEnum[format].getsouse(defaultvalue);
                }
                if (!(callback instanceof Function)) { alert("缺少回掉函数"); return; }
                lzm.JSNCHelper.hideKeyboard(function () {
                    if (!(callback instanceof Function)) { alert("缺少回掉函数"); } else {
                        var plugin = LeadingCloud.JSNC.getChannel("LZMobileDatePicker");
                        plugin.run("selectDateTime", { "format": _FORMAT, "title": _TITLE, "value": _DEFAULTVALUE }, function (resultType, resultData) {
                            if (resultType == LeadingCloud.JSNC.RunResultType.PluginNotRegist)
                                alert("插件未注册，详细信息：" + resultData);
                            else if (resultType == LeadingCloud.JSNC.RunResultType.MethodNotSupport)
                                alert("当前不支持此方法，详细信息：" + resultData);
                            else if (resultType == LeadingCloud.JSNC.RunResultType.Error)
                                alert("运行时发生错误，详细信息：" + resultData);
                            else if (resultType == LeadingCloud.JSNC.RunResultType.Success) {
                                if (formatEnum[format]) {
                                    callback(lzm.Date.format(formatEnum[format].getResultDate(resultData.result), format, true, true));
                                } else {
                                    callback(resultData.result);
                                }
                            }
                        });
                    }
                });
            },
            /**
            * 打开新的View 
            * @url {string} 页面地址
            * @data {jsonObj} 写入数据 
            * @callback {function} 回调函数 
            */
            openNewPage: function (url, data, callback) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileOpenNewPage");
                plugin.run("openNewWebPage", {
                    "html5": url,
                    "pagetransdata": JSON.stringify(data || {})
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); } else {
                        if (callback instanceof Function) callback();
                    }
                });
            },
            /**
             * 设置h5浏览器的标题名称
             * @title {string} 标题名称
             * @callback {function} 回调函数-基本没什么用
             */
            setPageTitle: function (title, callback) {
                var plugin = LeadingCloud.JSNC.getChannel('LZMobileNavigation');
                plugin.run('setTitleTxt', {
                    'title': (title || "标题").toString()
                }, function (resultType, resultData) {
                    if (resultType == LeadingCloud.JSNC.RunResultType.Success) {
                        callback(resultData);
                    } else {
                        alert(resultType + ' - ' + resultData);
                    }
                });
            },
            /**
             * 上传文件
             * @callback {function} 上传结果数据处理方法
             * @istempoarary {bool} 是否上传到临时区，对应的值为true或false，默认为true
             * @uploaditem {int} 选择图片时的最大数量；使用“从相册中选择”时用到，对应的值非1至9时，默认为9 
             * @maximagescount {array} 对应的值为数组，可选择项   1:拍照 2:从相册中选择 3:文件 4:拍视频
             */
            uploadFile: function (callback, istempoarary, uploaditem, maximagescount) {
                var maximagescount = (maximagescount || "").toString() || "9";
                var istempoarary = istempoarary ? true : false;
                var uploaditem = uploaditem || [1, 2, 3, 4];
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileFileUpload");
                plugin.run("fileUpload", { "uploaditem": uploaditem, "istempoarary": istempoarary, "maximagescount": maximagescount }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                    else {
                        callback(resultData);
                    }
                });
            },
            /**
             * 录音
             * @duration {int} 录音时间 秒
             * @timeReduce {bool} 是否是倒计时
             * @returns {object} 录音详情数据 EQ:
             */
            SoundRecording: function (callback, duration, timeReduce) {
                var dd = [{
                    fileid: "文件id", filesiz: "文件大小", showsize: "12.91KB", fileext: "mp3", filename: "新录音_201702313213", createdate: "创建时间", description: {
                        name: "",
                        size: 135612,
                        orginalform: "Pcm",
                        totaltime: 3.075,
                        samplerate: 11025,
                        bitspersample: 16,
                        areragebytespersecond: 44100,
                        blockalign: 4,
                        channels: 2
                    }
                }];

                if (isNaN(Number(duration))) { alert("录音时长不合法"); return; }
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileFileUpload");
                plugin.run("fileUpload", {
                    "uploaditem": [6],
                    "filetype": "file",
                    "itemproperty": {
                        "2": { "maximagescount": "9" },
                        "6": { "mode": (timeReduce ? "0" : "1"), "duration": Number(duration).toString() }
                    }
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                    else {
                        callback(resultData);
                    }
                });
            },
            /**
             * 打电话
             * @phoneNum {string} 电话号码
             */
            phone: function (phoneNum) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileOpenNewPage");
                plugin.run("openPhoneFunction", { "type": "tel", "value": phoneNum }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 发送短信
             * @phoneNum {string} 电话号码
             */
            phoneMessage: function (phoneNum) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileOpenNewPage");
                plugin.run("openPhoneFunction", { "type": "sms", "value": phoneNum }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 发送邮件
             * @email {string} 邮箱地址【不负责验证邮箱合法性】
             */
            sendMail: function (email) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileOpenNewPage");
                plugin.run("openPhoneFunction", { "type": "mail", "value": email }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 关闭页面
             * @type {string}   "back": webview回退, "close": 关闭当前窗口,"toroot": 返回到原生tab页签页面
             * @level {int} 返回层级【只有在type=close可用】
             */
            navBackAction: function (type, level) {
                var defaults = {
                    back: 'back',
                    close: 'close',
                    toroot: 'toroot'
                };
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
                if (!level) level = "1"; else level = level.toString();
                plugin.run("navigationBackAction", { "type": defaults[(type || "close").toLocaleLowerCase()], "level": level }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            },
            /**
             * 设置提示 【不传参数；默认执行隐藏进度提示】
             * @type {int} 提示框类型  
             *       eq: 1：进度提示框
             *             2：成功提示框
             *             3：失败提示框
             *             4：隐藏进度提示框
             * @message {string} 提示框消息【选填】
             */
            showTip: function (type, message, duration) {
                var obj = {
                    1: { type: "1", value: "正在加载...." },
                    2: { type: "2", value: "" },
                    3: { type: "3", value: "" },
                    4: { type: "4", value: "" }
                }
                var result = (obj[type] || { type: "4", value: "" });
                if (result.type == "2" || result.type == "3") lzm.JSNCHelper.showTip();
                var doaction = function (result, message) {
                    var plugin = LeadingCloud.JSNC.getChannel("LZMobileWebView");
                    plugin.run("showTipInfo", {
                        "type": result['type'], "value": (message || result['value'])
                    }, function (resultType, resultData) {
                        if (resultType != LeadingCloud.JSNC.RunResultType.Success) {
                            alert(resultData);
                        }
                    });
                }
                duration = 1000;
                if (duration) setTimeout(doaction(result, message), duration);
                else doaction(result, message);
            },
            /**
             * 从底部弹出
             * @operatearray {array}   操作对应数组 eq: [ {
                    //操作名称
                    name: null,
                    //操作对应处理方法
                    fun: function (index) {}
                   }]
             * @title {string} 标题【可选】
             */
            alertDialog: function (operatearray, title) {
                var _Config = function () {
                    return {
                        name: null,
                        funparam: null,
                        fun: function (index) {
                            alert(lzm.String.format("第{0}个操作没有配置处理事件"));
                        }
                    };
                };
                var _Operates = [];
                if (operatearray instanceof Array) {
                    _Operates = operatearray.map(function (item) {
                        return lzm.extend(_Config(), item);
                    });
                } else alert("没有操作按钮配置！");
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileAlert");
                plugin.run("createAlertDialog", {
                    "title": lzm.String.isString(title) ? title : "",
                    "items": _Operates
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); } else {
                        _Operates[resultData]['fun'](_Operates[resultData]['funparam']);
                    }
                });
            },
            /**
             * tab页签之间发送消息
             * @eventname {string} 触发的事件名称
             * @content {string} 传递过去的数据
             */
            sendNotice: function (eventname, content) {
                var _NoticePlugin = LeadingCloud.JSNC.getChannel("LZMobileJSNotice");
                _NoticePlugin.run("jsNoticeToOther", {
                    "eventname": eventname,
                    "data": content
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { addTip(resultData); }
                    else { addTip(resultData); }
                });
            },
            /**
            * 发消息给隐藏的WebView
            * @data {string} 数据字符串
            */
            SendHiddenViewMeg: function (data) {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileJSNotice");
                plugin.run("jsNoticeToOther", {
                    "eventname": "LCMPageTabItemShow",
                    "data": data,
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                })
            },
            /**
            * 打开多行输入框
            * @title {string} 标题
            * @content {string} 内容数据
            * @callback {function} 回调函数 callback("结果数据")
            * @rows {number} 行数
            */
            openDialogEditor: function (title, content, callback, rows) {
                if ("function" != typeof callback) { alert("缺少回调函数"); return; }
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileEdit");
                plugin.run("openDialogEditor", {
                    "title": title || "",
                    "defaulttip": "请输入",
                    "rows": isNaN(Number(rows)) ? "3.5" : rows.toString(),
                    "content": content || "",
                    "button": [{ "name": "保存", "action": "save" }, { "name": "取消", "action": "cancel" }]
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                    else {
                        lzm.JSNCHelper.hideKeyboard(function () {
                            /*
                               返回值： {"index":"0","action":"","content";""}
                            */
                            if (resultData.action == "save") {
                                callback(resultData.content);
                            }
                            if (resultData.action == "cancel") {
                                lzm.JSNCHelper.closeDialog();
                            }
                        })
                    }
                });
            },
            /**
             * 关闭多行输入框
             */
            closeDialog: function () {
                var plugin = LeadingCloud.JSNC.getChannel("LZMobileEdit");
                plugin.run("closeDialogEditor", {
                    "type": "close"
                }, function (resultType, resultData) {
                    if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
                });
            }
        }
    })(lzm);
};

; (function ($) {
    window.TaskManager = {
        configManager: null,
        webApiManager: null,
        //运行时配置数据
        runtimeContext: {
            //模块信息
            moduleInfo: {
                //模块名称
                name: '测试模块名称',
                //应用编码
                appCode: 'ConstructionSiteCollaboration',
                //业务模块ID
                businessModuleId: 'ace74597-f7ac-428c-89da-fdf943dfb741',
            },
            //场景信息
            sceneInfo: {
                sceneCode: '145775501084987392',
                sceneName: '测试项目名称',
                sceneAppCode: 'ConstructionSiteCollaboration',
                //当前场景的组织机构ID
                sceneOrganizationId: ""
            },
            //任务信息
            taskInfo: {
                _id: "184148823367487488"
            },
            //用户信息
            userInfo: {
                userId: "",
                userFaceId: "",
                userName: "",
                orgId: "",
                orgName: "",
            },
            nowPage: "detail"
        },
        form: {},
        list: {},
        detail: {}
    }
    mui.init({
        gestureConfig: {
            tap: true, //默认为true
            doubletap: true, //默认为false
            longtap: true, //默认为false
            swipe: true, //默认为true
            drag: true, //默认为true
            hold: false,//默认为false，不监听
            release: false//默认为false，不监听
        }
    });
    $.ready(function () {

    });
    var pageInint = function () {
    }

    //页面可见事件
    LeadingCloud.onPageWillAppear = function () {

    };

    //初始化字段对象
    var initConfigFields = function () {
        /*
        //0.整理配置
        var fields = new Array();
        var fileTabCode = {},
        isShowConclusion = [].filter.call(modelInfo.detailConfig.toolBarsConfig, function (item) {
            //只是单独为了适配结论
            return (item.buttonCode || "").toLocaleLowerCase() == "conclusion" && item.isSupportMobile
        }).length > 0;
        //1.加载二次开发js
        //需要加载js
        
        var requireJSArray = new Array();
        switch (TaskManager.runtimeContext.nowPage) {
            case "add":
                requireJSArray = "";
                break;
            case "list":
                requireJSArray = "";
                break;
            case "detail":
                requireJSArray = "";
                break;
            case "detailoperation":
                requireJSArray = "";
                break;
        }
        //2.字段过滤

        //3.创建场景实例 

        */
    }

    //页面加载事件
    var loadConfig = function () {
        //var dd = "";
        //for (var i in sessionStorage) {
        //    dd += i + "\n";
        //}
        //alert(dd);
        //alert(sessionStorage.getItem("lcm.pagetransdata"));
        var appInfo = sessionStorage.getItem("lcm.appinfo");
        appInfo = JSON.parse(appInfo);
        if ("lizhengyun.com" === location.hostname.split('.').splice(1, 2).join('.')) {
            appInfo["MISPTServer"] = { "webapi": lzm.String.format("{0}//lzfw0001.lizhengyun.com{1}", location.protocol, "https:" === location.protocol ? ":443" : "") };
            appInfo["InformationRegistModel"] = { "webapi": lzm.String.format("{0}//lzfw0002.lizhengyun.com{1}", location.protocol, "https:" === location.protocol ? ":443" : "") };
            appInfo["ConstructionSiteCollaboration"] = { "webapi": lzm.String.format("{0}//lzcp0003.lizhengyun.com{1}", location.protocol, "https:" === location.protocol ? ":443" : "") };
            appInfo["DesignInstituteCollaboration"] = { "webapi": lzm.String.format("{0}//lzcp0004.lizhengyun.com{1}", location.protocol, "https:" === location.protocol ? ":443" : "") };
            appInfo["PreBuildOwnersCollaboration"] = { "webapi": lzm.String.format("{0}//lzcp0005.lizhengyun.com{1}", location.protocol, "https:" === location.protocol ? ":443" : "") };
        } else {
            appInfo["MISPTServer"] = { "webapi": lzm.String.format("{0}//{1}{2}", location.protocol, location.hostname, "http:" === location.protocol ? ":8413" : ":9413") };
            appInfo["InformationRegistModel"] = { "webapi": lzm.String.format("{0}//{1}{2}", location.protocol, location.hostname, "http:" === location.protocol ? ":8426" : ":9426") };
            appInfo["ConstructionSiteCollaboration"] = { "webapi": lzm.String.format("{0}//{1}{2}", location.protocol, location.hostname, "http:" === location.protocol ? ":8418" : ":9418") };
            appInfo["DesignInstituteCollaboration"] = { "webapi": lzm.String.format("{0}//{1}{2}", location.protocol, location.hostname, "http:" === location.protocol ? ":8416" : ":9416") };
            appInfo["PreBuildOwnersCollaboration"] = { "webapi": lzm.String.format("{0}//{1}{2}", location.protocol, location.hostname, "http:" === location.protocol ? ":8417" : ":9417") };
        }
        appInfo = JSON.stringify(appInfo);
        sessionStorage.setItem("lcm.appinfo", appInfo);
        var tmpEvt = document.createEvent('HTMLEvents'); tmpEvt.initEvent('LCMAppInfo'); window.dispatchEvent(tmpEvt);

        var data = LeadingCloud.Navigation.data();
        if (null == data) {
            var fromModel = JSON.parse(sessionStorage.getItem("lcm.instancedata") || "{}"),
                sessionData = sessionStorage.getItem("lcm.pagetransdata");
            if (fromModel.BusinessModuleId) {
                //从原生任务模块列表页面进入
                //fromModel.AppCode
                //fromModel.SceneCode
                //fromModel.BusinessModuleId
                data = {
                    //模块信息
                    moduleInfo: {
                        //模块名称
                        name: "模块-名称",
                        //应用编码
                        appCode: fromModel.AppCode,
                        //业务模块ID
                        businessModuleId: fromModel.BusinessModuleId
                    },
                    //场景信息
                    sceneInfo: {
                        sceneCode: fromModel.SceneCode,
                        sceneName: "场景信息-名称",
                        sceneAppCode: fromModel.AppCode
                    },
                    nowPage: "list"
                };
            } else {
                data = JSON.parse(sessionData);
            }
        }
        if (data) {
            //我的任务进来
            if (data["paramsdata"]) {
                data["paramsdata"] = JSON.parse(data["paramsdata"]);
                TaskManager.runtimeContext = {
                    //模块信息
                    moduleInfo: {
                        //模块名称
                        name: data["paramsdata"]["name"],
                        //应用编码
                        appCode: data["paramsdata"]["appcode"],
                        //业务模块ID
                        businessModuleId: data["paramsdata"]["businessmoduleid"],
                    },
                    //场景信息
                    sceneInfo: {
                        sceneCode: data["paramsdata"]["scenecode"],
                        sceneName: data["paramsdata"]["name"],
                        sceneAppCode: data["paramsdata"]["appcode"]
                    },
                    businessid: data["paramsdata"]["id"]
                };
                //data["paramsdata"]["appcode"]
                //data["paramsdata"]["businessmoduleid"]
                //data["paramsdata"]["scenecode"]
                //data["paramsdata"]["id"]   //data["paramsdata"]["businessid"] 和  data["paramsdata"]["id"] 相同
                //data["paramsdata"]["name"]
            }
            else if (data["expanddata"]) {
                data["expanddata"] = JSON.parse(data["expanddata"]);
                //从动态进来
                TaskManager.runtimeContext = {
                    //模块信息
                    moduleInfo: {
                        //模块名称
                        name: "nameZYF",
                        //应用编码
                        appCode: data["expanddata"]["AppCode"],
                        //业务模块ID
                        businessModuleId: data["expanddata"]["BusinessModuleId"],
                    },
                    //场景信息
                    sceneInfo: {
                        sceneCode: data["expanddata"]["SceneCode"],
                        sceneName: "sceneNameZYF",
                        sceneAppCode: data["expanddata"]["AppCode"]
                    },
                    businessid: data["expanddata"]["TaskId"]
                };
            }
            else {
                lzm.extend(TaskManager.runtimeContext, data);
            }
        }
        else {
            mui.toast("没有获取到全局配置数据！");
            lzm.extend(TaskManager.runtimeContext, {
                "moduleInfo": {
                    "businessModuleId": "7fc1cad7-9911-474d-b109-c0c0a19370dd",
                    "name": "演示配置",
                    "appCode": "ConstructionSiteCollaboration"
                }
            });
        }
        //给全局配置UserInfo赋值
        var userinfo = LeadingCloud.User.loginInfo();
        TaskManager.runtimeContext.userInfo = {
            userId: userinfo.userId,
            userName: userinfo.userName,
            userFaceId: userinfo.face,
            orgId: userinfo.oid,
            orgName: ""
        }

        var _initConfig = function (manager) {
            //初始化配置信息
            manager.init({
                appCode: TaskManager.runtimeContext.moduleInfo.appCode,
                sceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode,
                businessModuleId: TaskManager.runtimeContext.moduleInfo.businessModuleId,//'f6efaa73-07c5-4751-8c7e-f7512f322712',//模块Id，用于取设计时配置
                sceneOrganizationId: TaskManager.runtimeContext.sceneInfo.sceneOrganizationId,
                $http: {
                    get: function (webapi, apiServer, success, error) {
                        if (!TaskManager.webApiManager) TaskManager.webApiManager = new lzm.WebApi(apiServer);
                        TaskManager.webApiManager.get(webapi, success, error);
                    },
                    post: function (webapi, postData, apiServer, success, error) {
                        if (!TaskManager.webApiManager) TaskManager.webApiManager = new lzm.WebApi(apiServer);
                        TaskManager.webApiManager.post(webapi, postData, success, error);
                    }
                },
                initSuccess: function (modelInfo, controls) {
                    TaskManager.modelInfo = modelInfo;
                    TaskManager.controls = controls;
                    var fields = new Array();
                    var fileTabCode = {},
                        isShowConclusion = [].filter.call(modelInfo.detailConfig.toolBarsConfig, function (item) {
                            //只是单独为了适配结论
                            return (item.buttonCode || "").toLocaleLowerCase() == "conclusion" && item.isSupportMobile
                        }).length > 0;
                    var initFieldsAndPages = function (TaskManager, modelInfo, fields, fileTabCode, funcFormControls) {
                        modelInfo.formConfig.fields = modelInfo.formConfig.fields.concat(modelInfo.formConfig.userExtendFields);
                        [].map.call(modelInfo.formConfig.fields, function (item) {
                            //每个字段只显示4个字
                            if (/^(DROPDOWNLIST|DATE|RADIOLIST)$/.test((item.controlType || "").toLocaleUpperCase())) item.fieldName = (item.fieldName || "").substr(0, 7);
                            else item.fieldName = (item.fieldName || "").substr(0, 4);
                            if (!item.hasOwnProperty('_client_isShow')) item["_client_isShow"] = true;
                            item["_client_nowPage"] = TaskManager.runtimeContext.nowPage;
                            if ("fileDirective" === item["controlType"]) {
                                if (item.controlConfig.isShowTab) {
                                    item["_client_isShow"] = false;
                                } else {
                                    var tabHideArray = [].filter.call(modelInfo.detailConfig.tabsConfig, function (tabItem) {
                                        return tabItem.tabCode == item.fieldCode
                                    });
                                    modelInfo.detailConfig.tabsConfig.splice(modelInfo.detailConfig.tabsConfig.indexOf(tabHideArray[0]), 1)
                                }
                            }
                            if ("add" === TaskManager.runtimeContext.nowPage) {
                                if ("conclusion" === item.fieldCode.toLocaleLowerCase() || "fileDirective" === item["controlType"]) item["_client_isShow"] = false;
                            } else {
                                if ("conclusion" === item.fieldCode.toLocaleLowerCase()) {
                                    item["_client_isShow"] = false;
                                }
                            }
                            if (TaskManager.runtimeContext.nowPage == "detail" && ("projectTeamPersonnel" === item["controlType"] || "organizationPersonnel" === item["controlType"])) { fields.unshift(item); } else { fields.push(item); }
                            if (item["controlType"] == "fileDirective") fileTabCode[item["fieldCode"].toLocaleLowerCase()] = true;
                        });
                        var _TaskConifgFinish = function () {
                            //初始化所有控件
                            if (!lzm.Type.isEmptyObject(TaskManager.form)) {
                                var _InitCpmtrols = {
                                    "PROJECTNAME": function (callback, fieldData) {
                                        //项目
                                        fieldData.value = TaskManager.runtimeContext.sceneInfo.sceneName;
                                        if ("function" == typeof callback) callback(fieldData);
                                        else alert("设置默认值错误");
                                    },
                                    "PRINCIPAL": function (callback, fieldData) {
                                        //负责人 
                                        if ("function" == typeof callback) {
                                            fieldData.value = fieldData.value || TaskManager.runtimeContext.userInfo.userId;
                                            new lzm.WebApi().getUserInfo(fieldData.value, function (data) {
                                                fieldData.value = {
                                                    userId: data.uid,
                                                    userName: data.username,
                                                    userFaceId: data.face
                                                };
                                                callback(fieldData);
                                            })
                                        }
                                        else alert("设置默认值错误");
                                    },
                                    //"PROJECTTEAMPERSONNEL": function (callback) {
                                    //    //项目团队选人
                                    //    if ("function" == typeof callback) callback(TaskManager.runtimeContext.taskInfo.Members);
                                    //    else alert("设置默认值错误");
                                    //}
                                };
                                //初始化方法
                                for (var i in TaskManager.form.controlTypes) {
                                    if (_InitCpmtrols[i]) {
                                        for (var ctl in TaskManager.form.controlTypes[i]) {
                                            _InitCpmtrols[i].call(this, TaskManager.form.controlTypes[i][ctl].setValue, { fieldId: ctl, value: TaskManager.runtimeContext.taskInfo[ctl] });
                                        }
                                    }
                                }
                            }
                            if ("function" == typeof funcFormControls) funcFormControls(TaskManager);
                            $.trigger(window, "TaskConifgFinish", TaskManager);
                        };
                        //表单构建
                        if ("function" == typeof lzmForm) {
                            TaskManager.form = new lzmForm(document.querySelector("form"), fields, controls, _TaskConifgFinish);
                        }
                        //详情页面
                        if ("function" == typeof lzmDetail) {
                            [].map.call(modelInfo.detailConfig.tabsConfig, function (item) {
                                if (item.tabCode == "post") item["tabType"] = "post"
                                else fileTabCode[item.tabCode.toLocaleLowerCase()] == true ? item["tabType"] = "file" : item["tabType"] = "h5";
                            });
                            TaskManager.detail = new lzmDetail(modelInfo.detailConfig, modelInfo.formConfig.fields);
                        }
                        //列表构建
                        if ("function" == typeof lzmList) {
                            TaskManager.list = new lzmList(modelInfo.listConfig, modelInfo.detailConfig.extendJSConfig && modelInfo.detailConfig.extendJSConfig.mobile && modelInfo.detailConfig.extendJSConfig.mobile.list);
                        }
                        //详情 - 设置页面
                        if ("function" == typeof lzmToolBarsConfig) {
                            lzmToolBarsConfig(modelInfo.detailConfig.toolBarsConfig, modelInfo.detailConfig.extendJSConfig && modelInfo.detailConfig.extendJSConfig.mobile && modelInfo.detailConfig.extendJSConfig.mobile.detail, function () {
                                $.trigger(window, "TaskConifgFinish", TaskManager);
                            });
                        }
                    }
                    var extendJSInitConfig = modelInfo.detailConfig.extendJSConfig && modelInfo.detailConfig.extendJSConfig.mobile && modelInfo.detailConfig.extendJSConfig.mobile.detail;
                    if (TaskManager.runtimeContext.nowPage == "add") extendJSInitConfig = modelInfo.detailConfig.extendJSConfig && modelInfo.detailConfig.extendJSConfig.mobile && modelInfo.detailConfig.extendJSConfig.mobile.add;
                    var tabConfig_Post = {
                        "tabCode": "post",
                        "tabName": "",
                        "isSelected": false,
                        "isDefault": true,
                    }, tabConfig_detail = [""], tabIndex = -1;
                    Object.defineProperty(tabConfig_Post, "tabCode", { value: "post", writable: false });
                    Object.defineProperty(tabConfig_Post, "isDefault", { value: true, writable: false });
                    if (modelInfo.detailConfig.tabsConfig instanceof Array) {
                        tabConfig_detail = [].filter.call(modelInfo.detailConfig.tabsConfig, function (item) {
                            return item.tabCode.toLocaleLowerCase() == "detail"
                        })
                        tabIndex = modelInfo.detailConfig.tabsConfig.indexOf(tabConfig_detail[0])
                        if (tabIndex >= 0) modelInfo.detailConfig.tabsConfig.splice(tabIndex + 1, 0, tabConfig_Post);
                    }
                    if ((extendJSInitConfig instanceof Array) && extendJSInitConfig.length > 0) {
                        require(extendJSInitConfig, function (obj) {
                            if (!obj) { alert("加载初始化配置二次开发js失败"); return; }
                            if ("function" == typeof obj.initConfig) obj.initConfig(modelInfo.formConfig.fields);
                            if ("function" == typeof obj.initTabConfig) {
                                obj.initTabConfig(modelInfo.detailConfig.tabsConfig);
                            };
                            initFieldsAndPages(TaskManager, modelInfo, fields, fileTabCode, obj.formControls);
                        });
                    } else {
                        initFieldsAndPages(TaskManager, modelInfo, fields, fileTabCode);
                    }
                },
                initError: function (error) {
                    console.log(error)
                },
                sourceType: 'mobile'
            });
        }

        var _GetSceneInfo = function (callback, appCode, sceneCode, businessModuleId) {
            if (!appCode || !sceneCode) lzm.PromptBox.error("未获取到应用编码！");
            try {
                lzm.JSNCHelper.showTip(1);
            } catch (e) {
                console.log("正在加载....")
            }
            LeadingCloud.App.get(appCode).http.get(lzm.String.format('api/{0}/GetBusinessModuleSceneInfo/{1}/{2}', appCode, businessModuleId, sceneCode), function (pdata) {
                if (pdata.ErrorCode.Code == "0") {
                    callback(pdata.DataContext);
                    ////var dd = pdata.DataContext["sceneCode"] //场景编码
                    ////var dd = pdata.DataContext["sceneName"]//场景名称
                    ////var dd = pdata.DataContext["sceneAppCode"]//场景应用编码（如无特殊需求则为当前应用编码即可
                    ////var dd = pdata.DataContext["businessModuleId"]//业务模块ID
                    ////var dd = pdata.DataContext["businessModuleName"]//业务模块名称
                    ////var dd = pdata.DataContext["businessModuleCode"]//业务模块code（对应技术模块ID）
                    ////var dd = pdata.DataContext["sceneOrganizationId"]//当前场景的组织机构ID
                } else {
                    try {
                        lzm.JSNCHelper.showTip(3, "获取项目信息失败！");
                    } catch (e) {
                        console.log("获取项目信息失败！")
                    }
                    //测试使用
                    callback({ ProjectName: "未知项目", ModuleName: "未知模块" })
                }
            });
        }
        //api/appmodule/getappmodulebyappaode/{appcode}/{tokenId}  appcode  获取模块 
        //api/appmodule/getappmodulebybussguid/{bussguid}/{tokenId}  业务id获取模块 
        //api/appmodule/getappfunbybusguid/{busguid}/{tokenId}  业务id获取功能 
        //获取项目信息
        if (navigator.platform.toLocaleLowerCase().indexOf("win") == 0) {
            _GetSceneInfo(function (data) {
                //项目名称
                TaskManager.runtimeContext.sceneInfo.sceneName = data["sceneName"]
                //模块名称
                TaskManager.runtimeContext.moduleInfo.name = data["businessModuleName"]
                //当前场景的组织机构ID
                TaskManager.runtimeContext.sceneInfo.sceneOrganizationId = data["sceneOrganizationId"]
                //实例化配置方法
                var configManager = new ConfigManager();
                TaskManager.configManager = configManager;
                _initConfig(configManager);
            }, TaskManager.runtimeContext.moduleInfo.appCode, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext.moduleInfo.businessModuleId);
        } else {
            _GetSceneInfo(function (data) {
                //项目名称
                TaskManager.runtimeContext.sceneInfo.sceneName = data["sceneName"]
                //模块名称
                TaskManager.runtimeContext.moduleInfo.name = data["businessModuleName"]
                //当前场景的组织机构ID
                TaskManager.runtimeContext.sceneInfo.sceneOrganizationId = data["sceneOrganizationId"]
                //实例化配置方法
                var configManager = new ConfigManager();
                TaskManager.configManager = configManager;
                _initConfig(configManager);
            }, TaskManager.runtimeContext.moduleInfo.appCode, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext.moduleInfo.businessModuleId);
        }
    }
    addEventListener("LCMPageLoaded", loadConfig);

    if (navigator.platform.toLocaleLowerCase().indexOf("win") == 0) {
        loadConfig();
    }
})(mui);