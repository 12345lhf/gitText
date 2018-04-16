/*********************************************************
 * 创建者：lz-zyf
 * 创建日期：2017-05-04 09:18:48
 * 描述：表单控件js开发示例
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
            */
            initControls: function (config) {
                //控件名称全部大写
                $['ZYF-DD'] = function (parentElement, dataConfig) {
                    var controlDom = $.createElement('div')
                    var lable = $.createElement('label')
                    lable.innerText = dataConfig.fieldName;
                    var inputBox = $.createElement('div');
                    inputBox.classList.add('lzm-form-item-content');
                    inputBox.classList.add('dd-color');
                    var input = $.createElement('input');
                    input.attr("type", "text");
                    if ("add" == dataConfig._client_nowPage) {
                        input.attr("placeholder", lzm.String.format("dd控件 请输入{0}", (dataConfig.controlConfig.isRequired ? "(必填)" : "")));
                        input.classList.add('mui-input-clear');
                    }
                    var method = {
                        init: function () {
                        },
                        setValue: function (value) {
                            if (value) {
                                input.value = value;
                                return input.value;
                            }
                        },
                        getValue: function () {
                            return $.validate(dataConfig, input.value);
                        },
                        setReadOnly: function (flag) {
                            if (flag) {
                                input.readOnly = true;
                                input.classList.add("lzm-default-value");
                            } else {
                                input.readOnly = false;
                                input.classList.remove("lzm-default-value");
                            }
                        }
                    };
                    var _value = "";
                    input.onfocus = function () {
                        _value = this.value;
                        console.log(_value)
                    }
                    input.onblur = function () {
                        if (_value != this.value) {
                            $.trigger(input, "CTM_FormControlValueChange", { fieldCode: dataConfig.fieldCode, oldValue: _value, newValue: this.value });
                        }
                    }
                    inputBox.appendChild(input);
                    controlDom.appendChild(lable);
                    controlDom.appendChild(inputBox);
                    parentElement.appendChild(controlDom);
                    return method;

                    ////控件内部必须实现方法
                    //var method = {
                    //    //初始化控件
                    //    init: function () {

                    //    },
                    //    //设置控件值
                    //    setValue: function (value) {
                    //        if (value) {
                    //            input.value = value;
                    //            return input.value;
                    //        }
                    //    },
                    //    //获取控件有效值【注意：返回值经过自己内部验证之后有效值】
                    //    getValue: function () {
                    //        return $.validate(dataConfig, input.value);
                    //    },
                    //    //设置控件只读状态
                    //    setReadOnly: function (flag) {
                    //        if (flag) {
                    //            input.readOnly = true;
                    //            input.classList.add("lzm-default-value");
                    //        } else {
                    //            input.readOnly = false;
                    //            input.classList.remove("lzm-default-value");
                    //        }
                    //    }
                    //};

                    ////将控件添加到指定DOM中
                    //parentElement.appendChild(controlDom);
                    //return method;
                }
            },
            //=================定义标准的接口 begin=================
        }
    });
})(window, formControl, define);