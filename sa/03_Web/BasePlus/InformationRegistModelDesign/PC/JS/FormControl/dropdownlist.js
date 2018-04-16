/// <reference path="../IRMControlModel.js" />
"use strict";
(function (window, angular, define) {
    /*定义模块*/
    define(function () {
        return {
            initControlLogic: function (app, $scope,$injector) {
                var $modal = $injector.get('$modal');
                return {
                    add: function (fieldItem, e) {
                        var tempInput = e.target.previousElementSibling;
                        if (!tempInput.value) {
                            lzMisptAlertDailog($scope, $modal, "提示", "选项不能为空!");
                            return false;
                        }
                        if (fieldItem.controlConfig.Options.indexOf(tempInput.value) < 0) {
                            fieldItem.controlConfig.Options.push(tempInput.value);
                        }
                        else {
                            lzMisptAlertDailog($scope, $modal, "提示", "您已添加该选项!");
                        }
                        tempInput.value = "";
                    },
                    edit: function (fieldItem) {
                        var tempOptions = fieldItem.controlConfig.Options.join("\n");
                        lzMisptTextBoxDailog($scope, $modal, "编辑选项", "textarea", tempOptions, "此处可输入多个选项，一行即为一项，以回车分隔", function (tempValue) {
                            fieldItem.controlConfig.Options = [];
                            if (tempValue.trim()) {
                                var tempArray = tempValue.trim().replace(/\n\n*/g, '\n').split("\n");
                                for (var i = 0; i < tempArray.length; i++) {
                                    if (fieldItem.controlConfig.Options.indexOf(tempArray[i]) < 0) {
                                        fieldItem.controlConfig.Options.push(tempArray[i]);
                                    }
                                }
                            }
                        });
                    }
                };
            },
            initControlConfig: function (app, $scope, $injector, cType) {
                //同步加载 angular模板

                //初始化控件配置
                cType.config = new IrmControlConfigList();
                cType.tpl = "irm-control-config-dropdownlist";
                cType.isShowList = true;
                cType.isSupportSort = true;
                cType.isSupportSearch = true;
            }
        }
    });
})(window, angular, define);