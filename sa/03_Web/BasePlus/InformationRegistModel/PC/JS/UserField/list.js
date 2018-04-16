"use strict";
; (function (angular, app) {
    app.register.controller("InformationRegistModel_UserField_List", function ($scope, $state, $stateParams, $filter, lzMisptRouter, lzMisptWebAPI) {
        //2017年6月28日09:26:45
        //注册路由
        var routeConfig = function (moduleid) {
            lzMisptRouter.registerRouter($scope, [{
                stateName: "Container" + moduleid,
                url: "/Container/:Moduleid",
                templateUrl: "/BasePlus/InformationRegistModel/PC/View/UserField/Containers/ListContainer.html",
                resolve: ['/BasePlus/InformationRegistModel/PC/JS/UserField/Containers/ListContainer.js'],
                paramCount: 1
            }]);
        }

        $scope.appModuleManager = {
            appModules: [],//获取的未验证的模块
            appModuleIds: [],//未验证的模块的id
            showMoudules: [],//验证后的模块
            getModules: function () {
                var that = this;
                var tempappcode = $scope.AppCode;
                angular.forEach($scope.AppModules, function (module, i) {
                    var tempModule = {
                        modid: module.businessguid,
                        name: module.name,
                        codeguid: module.codeguid,
                        businessguid: module.businessguid,
                        appcode: tempappcode
                    }
                    that.appModules.push(tempModule);
                    that.appModuleIds.push(module.codeguid);
                })
                var verifyData = {
                    modelIds: this.appModuleIds
                }
                this.verifyModules(verifyData)
            },
            verifyModules: function (verifyData) {
                var _this = this;
                //信息登记模型的和协作任务模型的分开
                if ($scope.selectedApp) {
                    var verifyUrl = $scope.selectedApp.verifyUrl;
                    var appCode = $scope.selectedApp.appCode;
                    if (appCode == "InformationRegistModel") {
                        _this.infoVerify(verifyUrl, appCode);
                    } else if (appCode == "CooperationTaskModel") {
                        _this.coopVerify(verifyUrl, appCode, verifyData);
                    }
                }
            },//验证模块
            infoVerify: function (verifyUrl, appCode) {
                //如果是信息登记模型
                lzMisptWebAPI.get(verifyUrl, appCode).then(function (data) {
                    if (data) {
                        var tempMoudiles = [];
                        angular.forEach($scope.appModuleManager.appModules, function (module, k) {
                            for (var i = 0; i < data.length; i++) {

                                if (module.modid == data[i].Id) {
                                    routeConfig(module.modid);
                                    tempMoudiles.push(module);
                                }
                            }
                        })
                        $scope.appModuleManager.showMoudules = [];
                        $scope.appModuleManager.showMoudules = tempMoudiles;
                        if ($scope.appModuleManager.showMoudules.length > 0) {
                            $scope.goConfigurationPage($scope.appModuleManager.showMoudules[0])
                        }
                    }
                }, function (errordata) {
                    if (errordata === "tokenid过期") {
                        $scope.loginManager.login && $scope.loginManager.login(true);
                    }
                });
            },
            coopVerify: function (verifyUrl, appCode, verifyData) {
                //如果是协作模型
                lzMisptWebAPI.post(verifyUrl, { "": JSON.stringify(verifyData) }, appCode).then(function (data) {
                    if (data) {
                        var tempMoudiles = [];
                        angular.forEach($scope.appModuleManager.appModules, function (module, k) {
                            for (var i = 0; i < data.length; i++) {
                                if (module.codeguid == data[i]) {
                                    tempMoudiles.push(module);
                                    routeConfig(module.modid);
                                }
                            }
                        })
                        $scope.appModuleManager.showMoudules = [];
                        $scope.appModuleManager.showMoudules = tempMoudiles;
                        if ($scope.appModuleManager.showMoudules.length > 0) {
                            $scope.goConfigurationPage($scope.appModuleManager.showMoudules[0])
                        }
                    }
                }, function (errordata) {
                    if (errordata === "tokenid过期") {
                        $scope.loginManager.login && $scope.loginManager.login(true);
                    }
                });
            }

        };
        $scope.appModuleManager.getModules();
        $scope.selectedId = 0;//选中的左侧列表的样式
        $scope.beSelectedModule = null;//定义被选中的模块给路由ListContainer用的
        var currentName = $state.current.name;

        $scope.coverScreenManager = {
            isShow: false,
            tpl: "",
            show: function (tpl) {
                this.tpl = tpl;
                this.isShow = true;
            },
            close: function (isRefresh) {
                this.tpl = "";
                this.isShow = false;
                if (isRefresh) {
                    $scope.modelListManager.load();
                }
            }
        }

        $scope.goConfigurationPage = function (module) {
            $scope.selectedId = module.modid;
            $scope.beSelectedModule = module;
            $state.go(currentName + ".Container" + module.modid, { "Moduleid": module.modid });
        };

    });
})(angular, app);