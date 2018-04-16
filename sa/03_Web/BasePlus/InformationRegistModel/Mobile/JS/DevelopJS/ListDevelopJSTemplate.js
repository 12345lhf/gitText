/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-05-04 09:18:48
 * 描述：列表页面二次开发js示例
 * 维护：
 * *******************************************************/
"use strict";
; (function (window, $, define) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================
            /**
            * 列表页面 初始化二次开发接口
            * 
            * @param {object} config 当前新建页面需要的配置对象
            */
            openAddPage: function (config) {
                //alert("走二次开发配置");
                LeadingCloud.Navigation.goto("TaskAdd.html", config.runtimeContext);
            }
            //=================定义标准的接口 begin=================
        }
    });
})(window, mui, define);