/// <reference path="TaskManager.js" />
/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-03-01 14:18:48
 * 描述：协作设置
 * 维护：
 * *******************************************************/
; (function ($) {
    "use strict"
    //状态枚举 
    var _StateEnum = {
        //未发布
        "1": "unpublished",/* 发布任务，删除任务 */
        //已发布
        "2": "published",/* 完成任务，废弃任务 */
        //已完成
        "3": null,
        //已废弃
        "4": null,
        //已暂停
        "5": "suspend"/* 恢复任务，完成任务，废弃任务  */
    }
    var _TaskInfo = {};

    var _ChangState = function (state) {
        [].map.call(document.querySelectorAll("#task_default_operation li"), function (e) { e.classList.add('lzm-display-none'); });
        if (_StateEnum[_TaskInfo.State] != null) {
            //发消息修改任务状态
            [].map.call(document.querySelectorAll('.' + _StateEnum[state]), function (e) {
                e.classList.remove('lzm-display-none');
            })
        }
        if (state == 3 || state == 4) document.querySelector("#task_default_operation").classList.add('lzm-display-none');
    }

    //JS扩展配置
    var lzmExtendConfig = function (toolBtnConfig, jsArray, callback) {
        //构建按钮
        var resultHTML = "",
            preventDefaultException = /^(conclusion)$/ig,
            tempHtml = '<li id="{0}" class="mui-table-view-cell mui-media suspend published">' +
                                   '    <a href="javascript:;" class="task-operation-content">' +
                                   '        <div class="mui-media-body">{1}</div>' +
                                   '    </a>' +
                                   '</li>';
        [].map.call(toolBtnConfig, function (item) {
            //item = {
            //    //按钮编码
            //    buttonCode: "conclusion",
            //    //按钮名称
            //    buttonName: "结论",
            //    //事件名称
            //    targetEvent: "event-irm-detail-toolbar-conclusion",
            //    //无用
            //    isValid: false,
            //    //支持pc
            //    isSupportPC: true,
            //    //支持移动
            //    isSupportMobile: true,
            //    //内置操作
            //    isDefault: true
            //};
            if (!preventDefaultException.test(item.buttonCode)) {
                if (item.isSupportMobile) {
                    resultHTML += lzm.String.format(tempHtml, item.targetEvent, item.buttonName);
                }
            }
        })
        document.querySelector("#task_extend_operation").innerHTML = resultHTML;
        if (resultHTML.length > 0) document.querySelector("#task_extend_operation").classList.remove('lzm-display-none');
        //引入绑定事件
        if ((jsArray instanceof Array) && jsArray.length > 0) {
            require(jsArray, function (obj) {
                if (!obj) { alert("加载二次开发js失败"); return; }
                if (!obj.pageLoad) { alert("二次开发js没有实现扩展按钮实现"); return; }
                try {
                    obj.pageLoad();
                    callback();
                } catch (e) {
                    alert("扩展按钮方法错误：" + e.message);
                }
            });
        } else callback();
    }
    //window挂在对象
    window.lzmToolBarsConfig = lzmExtendConfig;

    $.ready(function () {
        //内置修改任务状态事件
        $("#task_default_operation").on('tap', '.mui-table-view-cell', function () {
            var webAPI,
                id = TaskManager.runtimeContext.taskInfo._id,
                sceneCode = TaskManager.runtimeContext.sceneInfo.sceneCode,
                businessModelId = TaskManager.runtimeContext.moduleInfo.businessModuleId;
            switch (this["id"]) {
                case "task_publish":
                    //发布
                    TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Publish/{0}/{1}/{2}", businessModelId, sceneCode, id), function (data) {
                        //修改DOM显示
                        _ChangState(2);
                        //发消息修改任务状态
                        lzm.JSNCHelper.sendNotice("TaskStateChange", "2");
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, "发布失败");
                    });
                    break;
                case "task_delete":
                    //删除
                    TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Delete/{0}/{1}/{2}", businessModelId, sceneCode, id), function (data) {
                        //关闭页面
                        lzm.JSNCHelper.sendNotice("CloseDetail", "关闭详情页面");
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, "删除失败");
                    });
                    break;
                case "task_finish":
                    //完成
                    TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Finish/{0}/{1}/{2}", businessModelId, sceneCode, id), function (data) {
                        //修改DOM显示
                        _ChangState(3);
                        //发消息修改任务状态
                        lzm.JSNCHelper.sendNotice("TaskStateChange", "3");
                        //发消息所有都只读
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, "完成失败");
                    });
                    break;
                case "task_abandon":
                    //废弃
                    TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Discard/{0}/{1}/{2}", businessModelId, sceneCode, id), function (data) {
                        //修改DOM显示
                        _ChangState(4);
                        //发消息修改任务状态
                        lzm.JSNCHelper.sendNotice("TaskStateChange", "4");
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, "废弃失败");
                    });
                    break;
            }
        });

        //扩展按钮点击事件 
        $("#task_extend_operation").on('tap', '.mui-table-view-cell', function () {
            mui.trigger(this, this.id, TaskManager);
        });
    });
    //页面初始化数据加载
    addEventListener("TaskConifgFinish", function (e) {
        var config = e.detail,
         webApiManager = config.webApiManager,
         form = config.form;
        _TaskInfo = config.runtimeContext.taskInfo;
        //初始化默认按钮配置
        if (_TaskInfo["_client_admin"] == TaskManager.runtimeContext.userInfo.userId) {
            [].map.call(document.querySelectorAll('.' + _StateEnum[_TaskInfo.State]), function (e) {
                document.querySelector("#task_default_operation").classList.remove('lzm-display-none');
                e.classList.remove('lzm-display-none');
            })
        };
        //扩展按钮配置
        if (false) {
            document.querySelector("#task_extend_operation").classList.remove('lzm-display-none');
        };
    });
})(mui);