"use strict";
(function (window, angular, define, app) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================

            /**
             * 新增页面 标题说明扩展字符串二次开发接口
             * 
             * @param {Object} $scope 当前页面$scope
             * @param {Object} $injector 当前模块注入服务
             * @returns {String} 返回自定义的标题说明字符串
             */
            getTitleDescription: function ($scope, $injector) {
                return "这是标题的说明";
            },
             /**
             * 新增页面 标题的二次开发示例
             * 
             * @param {Object} $scope 当前页面$scope
             * @param {Object} $injector 当前模块注入服务
             * @returns {String} 返回自定义的标题说明字符串
             */
            getTitle: function ($scope, $injector) {
                return "要二次开发的标题";
            },
            pageLoad: function ($scope, $injector) {
            }

        }
    });
})(window, angular, define, app);

