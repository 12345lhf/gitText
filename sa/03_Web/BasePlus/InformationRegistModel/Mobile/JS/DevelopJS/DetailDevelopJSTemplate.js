/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-05-04 14:18:48
 * 描述：详情页面二次开发js示例
 * 维护：
 * *******************************************************/
"use strict";
; (function (window, $, define) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================
            /**
            * 初始化控件配置
            * 目前支持修改标签页相关的配置，当文件页签的isShowTab属性修改为false后，文件将显示到基本信息页中。
            * 
            * @param {Array} formControls 当前页面
            */
            initConfig: function (formControls) {
                //示例：将文件控件的isShowTab属性改为false
                [].map.call(formControls, function (item) {
                    //设置 fieldCode == "1F3951A8-8AA5-4070-AEAD-633282359EF9" 文件页签不显示，在表单显示
                    if (item.controlType == "fileDirective" && item.fieldCode == "1F3951A8-8AA5-4070-AEAD-633282359EF9")
                        item.controlConfig.isShowTab = false;
                });
            },
            /**
            * 初始化页详情页面 页签配置
            * 目前支持修改标签页相关的配置
            * 1.当页签的isSelected属性修改为true后，默认选中当前页签 第一个isSelected属性为true 有效。
            * 2.当页签的tabName属性修改之后，页签显示名称项应修改。
            * 3.当页签的顺序调整之后，实际显示页签顺序相应显示。
            * 4.当页签的数量发生变化后，实际显示数量相应变化。
            * 
            * 
            * 动态页签
            * {
                    "tabCode": "post",
                    "tabName": "",//二次开发修改名称
                    "isSelected": false,//二次开发修改选中 默认选中页签 支取第一个
                    "isDefault": true,
                };
            * 
            * @param {Array} tabsConfig 页签配置数组
            */
            initTabConfig: function (tabsConfig) {
                //二次开发方法实现 修改tabsConfig 参数即可
            },
            /**
             * 详情页面 初始化二次开发接口
             * 
             * 这个函数中可做一些监听事件之类的事情
             */
            pageLoad: function (config) {
                //监听标题变化示例
                //btn1 监听的事件名
                addEventListener("btn1", function (e) {
                    console.log("触发事件btn1")
                    console.log(JSON.stringify(e.detail))
                });
            },

            /**
             * 控件二次开发
             * @param {Object} config 当前页面
             */
            formControls: function (config) {

            }
            //=================定义标准的接口 begin=================
        }
    });
})(window, mui, define);