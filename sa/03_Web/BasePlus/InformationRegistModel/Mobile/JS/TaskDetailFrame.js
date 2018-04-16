/// <reference path="TaskManager.js" />
/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-03-01 14:18:48
 * 描述：详情
 * 维护：
 * *******************************************************/
; (function ($) {
    "use strict"
    var _ReadOnly = false, tabs = new Array();
    //类型页签位置收集器
    var _PageTypeCollect = {
        post: [],
        file: [],
        h5: [],
        init: function () {
            this.post = new Array();
            this.file = new Array();
            this.h5 = new Array();
        }
    };
    //H5页签配置模板
    var _H5PageTemplate = function () {
        return {
            //页签名称
            "name": "基本信息",
            //是否为原生页面 对应 false
            "protogenesis": false,
            //页面地址
            "html5": "",
            //传递过去的数据 （从sessionStorage的lcm.pagetransdata）中取出
            "pagetransdata": ""
        };
    };
    //动态页签配置模板
    var _PostTemplate = function () {
        return {
            //客户端原生动态页面标识
            "pagename": "post",
            //页签名称
            "name": "动态",
            //是否为原生页面 对应 true
            "protogenesis": true,
            //应用appcode
            "appcode": "",
            //任务id
            "rangevalue": "",
            //任务名称
            "rangevaluename": "",
            //管理员id (多个逗号分隔)
            "adminid": "",
            //关联的应用appcode 即 在那个应用下也能显示
            "relevanceappcode": "Cooperation",
            //动态类型code 使用AppCode
            "posttypecode": "",
            //资源池ID
            "rpid": "",
            //扩展参数，对应json格式字符串数据
            "expanddata": '{"AppCode":"{0}","BusinessModuleId":"{1}","SceneCode":"{2}","TaskId":"{3}","Source":"CTM_Post_Source"}'
        };
    };
    //文件页签配置模板
    var _FileTemplate = function () {
        return {
            //客户端原生文件页面标识
            //"pagename": "file",
            "pagename": "coobasefile",
            //任务Id
            "cid": "",
            //页签名称
            "name": "文件",
            //是否发日志，1：发日志 0：不发
            "islog": "1",
            //是否发动态，1：发动态 0：不发
            "ispost": "",
            //应用appcode
            "appcode": "",
            // 动态类型 -使用AppCode
            "posttype": "",
            //是否为原生页面 对应 true
            "protogenesis": true,
            //读写权限（默认读写）1：只读0：读写
            "right": "",
            //资源池ID
            "rpid": "",
            //特定文件夹id （定位到指定文件夹使用）
            "folderid": '',
            "expanddata": '{"AppCode":"{0}","BusinessModuleId":"{1}","SceneCode":"{2}","TaskId":"{3}","Source":"CTM_Post_Source"}'
        };
    };
    //构建页签
    var _BulidTab = function (tabsConfig, tabData, detailData) {
        tabs = new Array();
        var selectedTab, expandData = {
            AppCode: detailData.AppCode,
            BusinessModuleId: detailData.BusinessModuleId,
            SceneCode: detailData.SceneCode,
            TaskId: detailData._id,
            Source: "CTM_Post_Source"
        };
        [].map.call(tabsConfig, function (item, index, array) {
            //定位选中项
            if (selectedTab === undefined && item.isSelected) selectedTab = tabs.length.toString();
            switch (item["tabType"]) {
                case "file":
                    //文件页签
                    _PageTypeCollect['file'].push(index);
                    tabs.push(lzm.extendInHere(_FileTemplate(), tabData, { name: item.tabName }, { folderid: detailData[item["tabCode"]], expanddata: JSON.stringify(expandData) }));
                    break;
                case "h5":
                    //H5页签
                    _PageTypeCollect['h5'].push(index);
                    tabs.push(lzm.extendInHere(_H5PageTemplate(), tabData, { name: item.tabName, html5: item.router.mobile.template }));
                    break;
                case "post":
                    _PageTypeCollect['post'].push(index);
                    tabs.push(lzm.extendInHere(_PostTemplate(), tabData, { name: item.tabName || "动态", expanddata: JSON.stringify(expandData) }));
                    break;
            }
        });
        //展现页签
        var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
        plugin.run("resetTabBar", {
            "pages": tabs,
            "selected": selectedTab.toString()
        }, function (resultType, resultData) {
            alert(resultData);
        });
    }

    //设置文件也签只读
    var setFileReadOnly = function (page) {
        var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
        plugin.run("refreshTabBar", {
            "index": page.toString(),
            "page": {
                "right": "1"
            }
        }, function (resultType, resultData) {
            if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
        })
    }

    // #region *************   接收通知   *************
    //设置所有也签只读
    addEventListener("SetReadAllOnly", function () {
        var data = sessionStorage.getItem("lcm.jsnotice.SetReadAllOnly");
        alert("框架页面接收到修改状态值-" + data);
        //_SetState(data, function (data) {
        //    lzm.JSNCHelper.sendNotice("TaskStateChange", data);
        //}, function (data) {

        //});
    });
    //修改任务类型
    addEventListener("TaskStateChange", function () {
        var data = sessionStorage.getItem("lcm.jsnotice.TaskStateChange");
        TaskManager.runtimeContext.taskInfo["State"] = data;
        //设置表单只读
        if (data == 3 || data == 4) {
            _ReadOnly = true;
            [].map.call(_PageTypeCollect['file'], function (item, index) {
                setFileReadOnly(item);
            });
        }
        else _ReadOnly = false
        if (data == 2) {
            [].map.call(tabs, function (item, index) {
                lzm.JSNCHelper.setTabBarCooBaseFileDoPost(index.toString(), "1");
            })
        }
    });
    //关闭当前任务
    addEventListener("CloseDetail", function () {
        lzm.JSNCHelper.navBackAction("close", 2);
    });
    //设置页签禁止滑动
    var _TabConfig = new Object();
    addEventListener("LCMPageTabItemShow", function (data) {
        if (_ReadOnly) return;
        var tabIndex = JSON.parse(sessionStorage.getItem("lcm.jsnotice.currenttab")).currenttabindex;
        var data = sessionStorage.getItem('lcm.jsnotice.LCMPageTabItemShow') || 'null';
        sessionStorage.setItem('lcm.jsnotice.LCMPageTabItemShow', "null");
        if (data != "null") _TabConfig[tabIndex] = data;
        if (!_TabConfig[tabIndex]) _TabConfig[tabIndex] = data;
        var isscroll;
        if (_TabConfig[tabIndex] == "true" || _TabConfig[tabIndex] == "null") {
            isscroll = "true";
        } else {
            isscroll = "false";
        }
        var plugin = LeadingCloud.JSNC.getChannel("LZMobilePageTabBar");
        plugin.run("setTabBarScroll", { "isscroll": isscroll }, function (resultType, resultData) {
            if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
        });
    })
    // #endregion

    window.lzmDetail = function (config, configFields) {
        //默认配置
        var _Config = {
            extendJSConfig: null,
            tabsConfig: new Array(),
            toolBarsConfig: new Array()
        };
        lzm.extend(_Config, config);
        var bulid = function (_Config, taskData) {
            taskData = JSON.parse(JSON.stringify(taskData).replace(/\\n/g, '㈱№々'));
            if (taskData["Members"] instanceof Array) {
                taskData['_client_admin'] = [].filter.call(taskData["Members"], function (item) {
                    return item['MemberType'] == 1
                })[0]['UserId']
            }
            TaskManager.runtimeContext.taskInfo = taskData;
            //初始化页签类型汇总数据
            _PageTypeCollect.init();
            //构建页签
            _BulidTab(_Config.tabsConfig, {
                //页签名称
                //name: "",

                //h5
                html5: "/BasePlus/InformationRegistModel/Mobile/View/TaskDetail.html",
                pagetransdata: JSON.stringify(TaskManager.runtimeContext),
                //动态
                //appcode: taskData.AppCode,
                //rpid: taskData.ResoucePoolId,
                rangevalue: taskData._id,
                rangevaluename: taskData.Title,
                adminid: taskData.Members.map(function (item) { if (item.MemberType == 1) return item.UserId; })[0],
                posttypecode: "CTM_Post",
                //文件
                cid: taskData._id,
                ispost: ((taskData.State != 1) ? "1" : "0"),
                appcode: taskData.AppCode,
                posttype: "CTM_Post",
                right: ((taskData.State == 3 || taskData.State == 4) ? "1" : "0"),
                rpid: taskData.ResoucePoolId
            }, taskData)
            //设置页面标题
            lzm.JSNCHelper.setPageTitle(taskData.Title, function (e) {
                alert("设置页面标题" + e)
            });
            //设置右上角操作
            lzm.JSNCHelper.setNavRightButton(function () {
                //打开设置页面
                lzm.JSNCHelper.openNewPage(lzm.String.format("{0}/BasePlus/InformationRegistModel/Mobile/View/TaskDetailOperation.html", location.origin), TaskManager.runtimeContext);
            });
        }
        //获取详情数据
        var userInfo = LeadingCloud.User.loginInfo();
        TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Load/{0}/{1}/{2}", TaskManager.runtimeContext.moduleInfo.businessModuleId, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext["businessid"] || "179490731870654464"), function (taskData) {
            //详情数据中没哟匹配到数据的 配置控件 处理
            var preventResourceCtlException = /^(PICTURE|FILEDIRECTIVE|RECORDING)$/, needCreateFolder = new Array(), _RECORDING = new Array();
            [].map.call(configFields, function (item) {
                if (preventResourceCtlException.test((item.controlType || "").toLocaleUpperCase()) && !taskData[item.fieldCode]) {
                    //录音存储和普通文件不同-特殊处理
                    if ("RECORDING" === (item.controlType || "").toLocaleUpperCase()) _RECORDING.push(item.fieldCode);
                    needCreateFolder.push((item.controlConfig.folders && item.controlConfig.folders.length >= 0) ? { name: item.fieldCode, folders: item.controlConfig.folders } : { name: item.fieldCode });
                }
            })
            if (needCreateFolder.length > 0) {
                lzm.fileHelper.addfolders(taskData.ResoucePoolId, needCreateFolder, function (data) {
                    var updataDate = {};
                    [].map.call(data, function (folder) {
                        updataDate[folder.name] = taskData[folder.name] = _RECORDING.indexOf(folder.name) >= 0 ? JSON.stringify({ FloderId: folder.id, FileIds: [] }) : folder.id;
                    })
                    TaskManager.webApiManager.post(lzm.String.format("api/Runtime/Business/SingleModified/{0}/{1}/{2}", TaskManager.runtimeContext.moduleInfo.businessModuleId, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext["businessid"] || "179490731870654464"), { "": JSON.stringify(updataDate) }, function (data) {
                        bulid(_Config, taskData);
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, "更新新增控件失败！");
                    });
                }, function (data) {
                    lzm.JSNCHelper.showTip(3, "创建文件目录失败！");
                })
            } else {
                bulid(_Config, taskData);
            }
        }, function (data) {
            lzm.JSNCHelper.showTip(3, "获取详情数据失败！");
        });
    }
})(mui);