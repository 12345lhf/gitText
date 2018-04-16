/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-05-04 09:18:48
 * 描述：新建页面二次开发js示例
 * 维护：
 * *******************************************************/
"use strict";
(function (window, $, define) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================
            /**
            * 初始化控件配置
            * 目前支持修改标签页相关的配置，当文件页签的isShowTab属性修改为false后，文件将显示到基本信息页中。
            * 
            * @param {Array} formControls 当前页面所有字段配置
            *                                                      EQ:[{ "fieldCode": "Title", "fieldName": "主题", "isDefaultField": true, "isHiddenField": false, "controlType": "text", "controlConfig": { "isRequired": true, "isReadOnly": false, "length": 200 } }]
            */
            initConfig: function (formControls) {
                //设置标题控件默认隐藏
                //formControls["Title"] && (formControls["Title"]._client_isShow = false);
            },
            /**
            * 控件二次开发
            * @param {Object} config 当前页面所有字段配置
            *                       Eq：  config = {
                                                                //表单
                                                                form: {
                                                                    //字段配置
                                                                    fields: {},
                                                                    //按照字段Id分类的控件对象
                                                                    formControls: {
                                                                        //控件id
                                                                        "0499C530-A98D-4CC7-9192-60248894431B": {
                                                                            //初始化方法
                                                                            init: function () { },
                                                                            //获取数据方法
                                                                            getValue: function () { },
                                                                            //设置只读/可写方法
                                                                            setReadOnly: function (flag) { },
                                                                            //设置控件值方法
                                                                            setValue: function (fieldData, entity) { },
                                                                            //切换控件显示隐藏方法
                                                                            _ToggleShow: function (flag) { },
                                                                        }
                                                                    },
                                                                    //按照控件类型分类的控件对象
                                                                    controlTypes: {},
                                                                },
                                                                //上下文对象
                                                                runtimeContext: {},
                                                                //api访问接口
                                                                webApiManager: {
                                                                }
                                                            }
            */
            formControls: function (config) {
                //监听表单控件改变事件
                addEventListener("CTM_FormControlValueChange", function (e) {
                    console.log("触发了CTM_FormControlValueChange");
                    //{"fieldCode":"Title","oldValue":"","newValue":"阿斯达岁的"}
                    //console.log(e.detail);
                });
            }
            //=================定义标准的接口 begin=================
        }
    });
})(window, mui, define);

