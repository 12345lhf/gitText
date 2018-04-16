/// <reference path="../IRMControlModel.js" />
"use strict";
(function (window, angular, define) {
    /*定义模块*/
    define(function () {
        return {
            initControlConfig: function (app, $scope, $injector, cType) {
                //同步加载 angular模板
                //初始化控件配置
                cType.isShowList = true;
                cType.isSupportSort = false;
                cType.isSupportSearch = false;
            }
        }
    });
})(window, angular, define);