/// <reference path="TaskManager.js" />
/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-03-01 14:18:48
 * 描述：协作模型【详情】页面逻辑控制器
 * 维护：
 * *******************************************************/
; (function ($) {
    //监听任务状态发生变化
    addEventListener("TaskStateChange", function () {
        var data = sessionStorage.getItem("lcm.jsnotice.TaskStateChange");
        TaskManager.runtimeContext.taskInfo["State"] = data;
        //设置表单只读
        if (data == 3 || data == 4) {
            TaskManager.form.setFormReadOnly(true);
            document.querySelector("#form-save").classList.add("lzm-display-none");
            document.querySelector("#form-conclusion").classList.add("lzm-display-none");
            lzm.PickerPersonHide();
        }
    });

    //配置数据加载完成事件
    addEventListener("TaskConifgFinish", function (e) {
        var config = e.detail,
            taskInfo = TaskManager.runtimeContext.taskInfo,
            taskInfo = JSON.parse(JSON.stringify(taskInfo).replace(/㈱№々/g, '\\n').replace(/<br\/>/g, '\\n')),
            isShowConclusion = [].filter.call(config.modelInfo.detailConfig.toolBarsConfig, function (item) {
                //只是单独为了适配结论
                return (item.buttonCode || "").toLocaleLowerCase() == "conclusion" && item.isSupportMobile
            }).length > 0;
        if (navigator.platform.toLocaleLowerCase().indexOf("win") == 0) {
            TaskManager.webApiManager.get(lzm.String.format("api/Runtime/Business/Load/{0}/{1}/{2}", TaskManager.runtimeContext.moduleInfo.businessModuleId, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext["businessid"] || TaskManager.runtimeContext.taskInfo["_id"]), function (taskData) {
                taskInfo = taskData;
                config.form.setFormData(taskData);
                config.form.formControls["Conclusion"]._ToggleShow(true);
                //显示保存
                document.querySelector("#form-save").classList.remove("lzm-display-none");
                if ([].filter.call(config.modelInfo.detailConfig.toolBarsConfig, function (item) {
                    //只是单独为了适配结论
                     return (item.buttonCode || "").toLocaleLowerCase() == "conclusion" && item.isSupportMobile
                }).length > 0) {
                    //显示结论 按钮
                    document.querySelector("#form-conclusion").classList.remove("lzm-display-none");
                }
            });
        } else {
            config.form.setFormData(taskInfo);
        }

        addEventListener("CTM_FormControlValueChange", function (e) {
            var saveCtlException = /^(RECORDING)$/;
            if (saveCtlException.test((config.form.fields[e.detail.fieldCode].controlType || "").toLocaleUpperCase())) {
                var result = {}, fieldCode = e.detail.fieldCode, fieldValue = JSON.stringify(e.detail.newValue);
                result[fieldCode] = fieldValue;
                config.webApiManager.post(lzm.String.format("api/Runtime/Business/SingleModified/{0}/{1}/{2}", TaskManager.runtimeContext.moduleInfo.businessModuleId, TaskManager.runtimeContext.sceneInfo.sceneCode, TaskManager.runtimeContext.taskInfo["_id"]),
                {
                    '': JSON.stringify(result)
                },
                        function (data) {
                            config.form.formControls[e.detail.fieldCode].setValue({ fieldId: e.detail.fieldCode, value: data[e.detail.fieldCode] }, data);
                        }, function (data) {
                            lzm.JSNCHelper.showTip(3, "更新录音数据失败！");
                        });
            }
        });

        //显示结论 文本框
        if (isShowConclusion && taskInfo["Conclusion"] && taskInfo["Conclusion"].length > 0) {
            config.form.formControls["Conclusion"]._ToggleShow(true)
        }
        //设置表单只读
        if (taskInfo["State"] == 3 || taskInfo["State"] == 4 || taskInfo["_client_admin"] != TaskManager.runtimeContext.userInfo.userId) {
            TaskManager.form.setFormReadOnly(true);
            if (taskInfo["State"] != 3 && taskInfo["State"] != 4) {
                for (var i in TaskManager.form.controlTypes['PROJECTTEAMPERSONNEL']) {
                    TaskManager.form.formControls[i].setReadOnly(false);
                }
                for (var i in TaskManager.form.controlTypes['ORGANIZATIONPERSONNEL']) {
                    TaskManager.form.formControls[i].setReadOnly(false);
                }
            }
        };
        if (taskInfo["State"] != 3 && taskInfo["State"] != 4 && taskInfo["_client_admin"] == TaskManager.runtimeContext.userInfo.userId) {
            //显示保存
            document.querySelector("#form-save").classList.remove("lzm-display-none");
            //显示结论 按钮
            if (isShowConclusion) document.querySelector("#form-conclusion").classList.remove("lzm-display-none");
        };

        //保存按钮
        document.querySelector("#form-save").addEventListener("tap", function () {
            lzm.JSNCHelper.hideKeyboard(function () {
                if (!TaskManager.form.getFromData()) return;
                var _Entity = taskInfo;
                _Entity["State"] = Number(TaskManager.runtimeContext.taskInfo["State"]);
                try {
                    lzm.extend(_Entity, TaskManager.form.getFromData());
                    //实体转换
                    _Entity = TaskManager.configManager.firstCharToUpperCase(_Entity);
                    //删除人员对象
                    try { delete _Entity.Members; } catch (e) { };
                    //执行API
                    TaskManager.webApiManager.post(lzm.String.format('api/Runtime/Business/Update/{0}/{1}', _Entity.BusinessModuleId, _Entity.SceneCode), {
                        "": JSON.stringify(_Entity)
                    }, function (data) {
                        lzm.JSNCHelper.showTip(2, "保存成功");
                    }, function (data) {
                        lzm.JSNCHelper.showTip(3, data.Message);
                    })
                } catch (e) {
                    alert(JSON.stringify(e))
                }
            })
        });
        //结论按钮
        document.querySelector("#form-conclusion").addEventListener("tap", function () {
            lzm.JSNCHelper.hideKeyboard(function () {
                lzm.JSNCHelper.openDialogEditor("结论", config.form.formControls["Conclusion"].getValue(), function (result) {
                    result = lzm.String.trim(result, " ");
                    if (result == config.form.formControls["Conclusion"].getValue()) {
                        lzm.JSNCHelper.closeDialog();
                    } else {
                        lzm.JSNCHelper.hideKeyboard(function () {
                            try {
                                TaskManager.webApiManager.post(lzm.String.format('api/Runtime/Business/SingleModified/{0}/{1}/{2}', TaskManager.runtimeContext.taskInfo.BusinessModuleId, TaskManager.runtimeContext.taskInfo.SceneCode, TaskManager.runtimeContext.taskInfo._id), {
                                    '': JSON.stringify({
                                        Conclusion: result,
                                    })
                                }, function (data) {
                                    config.form.formControls["Conclusion"]._ToggleShow(result && result.length > 0 ? true : false);
                                    config.form.formControls["Conclusion"].setValue({ fieldId: "Conclusion", value: result }, data);
                                    lzm.JSNCHelper.closeDialog();
                                }, function (data) {
                                    lzm.JSNCHelper.showTip(3, data.Message);
                                });
                            } catch (e) {
                                lzm.JSNCHelper.showTip(3, e.message);
                            };
                        });
                    }
                }, 3.5);
            });
        });
    })
})(mui);