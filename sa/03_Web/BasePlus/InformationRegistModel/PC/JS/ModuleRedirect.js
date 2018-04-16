/*********************************************************
 * 创建者：wjs
 * 创建日期：2016-12-06
 * 描述：mispt任务跳转页Js）
 * 
 * 
 * *******************************************************/
; (function (window, angular, undefined, $) {
    'use strict'
    app.register.controller('lzMispt_IRM_RedirectController', ['$scope', "$stateParams", "$state", "$q", 'lzMisptRouter', 'lzMisptWebAPI', '$log', function ($scope, $stateParams, $state, $q, lzMisptRouter, lzMisptWebAPI, $log) {
        $scope._serachKey = 'CtmModuleRedirect';
        var appCode, businessModuleId, sceneCode, moduleid;
        if ($stateParams.moduleid) {
            //添加appcode和businessModuleId和scenecode
            appCode = $scope.AppCode;
            businessModuleId = $scope.BusinessModuleId;
            sceneCode = $scope.SceneCode;
            moduleid = $stateParams.moduleid;
        }

        lzMisptWebAPI.get("api/" + appCode + "/GetBusinessModuleSceneInfo/" + businessModuleId + "/" + sceneCode, appCode).then(function (data) {
            
            $scope.runtimeContext = {
                //模块信息
                moduleInfo: {
                    //模块名称
                    name: data.businessModuleName,
                    //应用编码
                    appCode: appCode,
                    //业务模块ID
                    businessModuleId: businessModuleId,
                },
                //场景信息
                sceneInfo: {
                    sceneCode: sceneCode,
                    sceneName: data.sceneName,
                    sceneAppCode: appCode,
                    //当前场景的组织机构ID
                    sceneOrganizationId: data.sceneOrganizationId
                },
                //任务信息
                taskInfo: {},
                //用户信息
                userInfo: {
                    userId: app.session.user.uid,
                    userName: app.session.user.username,
                    orgId: app.session.user.selectorg.oid,
                    orgName: app.session.user.selectorg.name,
                }
            }
            //注册路由
            registerRouter();
        });

        function registerRouter() {
            var config = {
                MyTask: {
                    "HTML": "/BasePlus/InformationRegistModel/PC/View/List.html",
                    "SyncJS": "/BasePlus/InformationRegistModel/PC/JS/List.js"
                }
            };
            var curStatueName = $state.current.name;
            var resolve = [];
            if (!config.MyTask) {
                console.error('未找到对应的路由配置');
            } 
            resolve = config.MyTask.SyncJS && config.MyTask.SyncJS.split(',');
            var routerName = 'CtmModule';
            var routerConfig = {
                stateName: routerName,
                url: "/" + routerName,
                templateUrl: (config.MyTask && config.MyTask.HTML),
                resolve: resolve,
                paramCount: 0
            };
            $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $log.error('An error occurred while changing states: ' + error);
                $log.debug('event', event);
                $log.debug('toState', toState);
                $log.debug('toParams', toParams);
                $log.debug('fromState', fromState);
                $log.debug('fromParams', fromParams);
            });

            routerConfig = lzMisptRouter.registerRouter($scope, [routerConfig], true, routerName);
        }
    }]);

})(window, angular, undefined, angular.element);
