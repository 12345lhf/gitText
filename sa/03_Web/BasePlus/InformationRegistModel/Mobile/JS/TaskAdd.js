/// <reference path="TaskManager.js" />
/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-03-01 14:18:48
 * 描述：协作模型【新建】页面逻辑控制器
 * 维护：
 * *******************************************************/
; (function ($) {
    //基础字段
    var _BaseFields = {
        Title: '',
        AppCode: null,
        SceneCode: null,
        CreateUserFaceId: null,
        Members: new Array(),
    },
    //实体对象
    _Entity = {};

    //监听事件
    addEventListener("CTM_FormControlValueChange", function (e) {
        console.log("触发了CTM_FormControlValueChange");
        console.log(e.detail);
    })

    //保存方法
    var _Save = function (actionType, callback, errorback) {
        var apiType = {
            save: "Add",
            publish: "AddAndPublish",
        };
        //实体转换
        _Entity = TaskManager.configManager.firstCharToUpperCase(_Entity);

        //项目团队
        for (var i in TaskManager.form.controlTypes["PROJECTTEAMPERSONNEL"]) {
            _Entity[i] = "";
            _Entity.Members = TaskManager.form.controlTypes["PROJECTTEAMPERSONNEL"][i].getValue();
        };
        //组织机构
        for (var i in TaskManager.form.controlTypes["ORGANIZATIONPERSONNEL"]) {
            _Entity[i] = "";
            _Entity.Members = TaskManager.form.controlTypes["ORGANIZATIONPERSONNEL"][i].getValue();
        };
        //执行API
        TaskManager.webApiManager.post(lzm.String.format('api/Runtime/Business/{0}/{1}/{2}/{3}', (apiType[actionType.toLocaleLowerCase()] || "Add"), _Entity.BusinessModuleId, _Entity.SceneCode, TaskManager.runtimeContext.sceneInfo.sceneOrganizationId), { "": JSON.stringify(_Entity) }, function (e) { callback(e); }, function (e) { errorback(e) })
    }

    //配置数据加载完成事件
    addEventListener("TaskConifgFinish", function (e) {
        //设置标题
        try {
            document.title = lzm.String.format("新建{0}", TaskManager.runtimeContext.moduleInfo.name);
            lzm.JSNCHelper.setPageTitle(document.title);
        } catch (e) {
        }
        var config = e.detail,
         webApiManager = config.webApiManager,
         form = config.form;
        //合并数据
        lzm.extend(_Entity, _BaseFields, {
            AppCode: TaskManager.runtimeContext.moduleInfo.appCode,
            SceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode,
            BusinessModuleId: TaskManager.runtimeContext.moduleInfo.businessModuleId,
            CreateUserFaceId: TaskManager.runtimeContext.userInfo.userFaceId,
        });
        //显示所有操作按钮
        document.querySelector("#operation-buttons").classList.remove("lzm-display-none");

        //保存按钮
        document.querySelector("#form-save").addEventListener("tap", function () {
            if (!TaskManager.form.getFromData()) return;
            lzm.extend(_Entity, TaskManager.form.getFromData());
            _Save("save", function (data) {
                lzm.JSNCHelper.showTip(2, "保存成功");
                TaskManager.runtimeContext.nowPage = "list";
                LeadingCloud.Navigation.back(1, TaskManager.runtimeContext);
            }, function (data) {
                lzm.JSNCHelper.showTip(3, data.Message);
            });
        });

        //发布按钮
        document.querySelector("#form-publish").addEventListener("tap", function () {
            if (!TaskManager.form.getFromData()) return;
            lzm.extend(_Entity, TaskManager.form.getFromData());
            _Save("publish", function (data) {
                lzm.JSNCHelper.showTip(2, "发布成功");
                TaskManager.runtimeContext.nowPage = "list";
                LeadingCloud.Navigation.back(1, TaskManager.runtimeContext);
            }, function (data) {
                lzm.JSNCHelper.showTip(3, data.Message);
            });
        });
    })
})(mui);