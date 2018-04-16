"use strict";
(function (window, angular, define, app) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================
            /**
            * 初始化控件配置
            * 目前支持修改标签页相关的配置，当文件页签的isShowTab属性修改为false后，文件将显示到基本信息页中。
            * 
            *  @param {Array} tabsConfig 当前页面$scope
            * @returns {Array} 返回修改后的配置
            */
            initConfig: function (modelConfig, $scope) {
                //示例：将第三个页签的isShowTab属性改为false
                if (modelConfig && modelConfig.formConfig && angular.isArray(modelConfig.formConfig.fields) && modelConfig.formConfig.fields.length) {
                    modelConfig.formConfig.fields.forEach(function (item, index, arr) {
                        if (item.controlType === "fileDirective") {
                            item.controlConfig.isShowTab = false;
                        }
                    });
                };
                return modelConfig;
            },
            /**
             * 详情页面 初始化二次开发接口
             * 
             * 这个函数中可做一些监听事件之类的事情
             */
            pageLoad: function ($scope, $injector) {
                //监听标题变化示例
                //event-irm-detail-toolbar-title-change 监听的事件名
                app.event.bind($scope, "event-irm-detail-toolbar-title-change", function (e, obj) {
                    //此处模拟使用注入器获取服务
                    //var lzMisptRouter = $injector.get('lzMisptRouter');
                });

                //...
            }
            //=================定义标准的接口 begin=================
        }
    });
})(window, angular, define, app);

