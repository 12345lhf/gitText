/*********************************************************
 * 描述：Demo展示入口
 * 维护：
 * *******************************************************/

app.register.controller("IRM_Test_MainController", function ($scope, lzMisptRouter, $state, lzMisptWebAPI) {
    //运行时上下文信息
    $scope.runtimeContext = {
        //模块信息
        moduleInfo: {
            //模块名称
            name: '',
            //应用编码
            appCode: 'InformationRegistModelTest',
            //业务模块ID
            businessModuleId: '',
        },
        //场景信息
        sceneInfo: {
            sceneCode: '118598604959911936',
            sceneName: '',
            sceneAppCode: 'InformationRegistModelTest',
            //当前场景的组织机构ID
            sceneOrganizationId: app.session.user.selectorg.oid
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


    // #region 模拟模板管理上下问
    $scope.AppCode = $scope.runtimeContext.moduleInfo.appCode;
    $scope.SceneCode = $scope.runtimeContext.sceneInfo.sceneCode;
    $scope.BusinessModuleId = $scope.runtimeContext.moduleInfo.businessModuleId;
    $scope.AppModules = [];
    // #endregion

    //模拟获取设计时模块列表
    $scope.modules = [];
    $scope.isShowTable = true;


    lzMisptWebAPI.get("api/appmodule/getappmodulebyappaode/InformationRegistModelTest").then(function (data) {
        if (data && data.length) {
            $scope.AppModules = data;
        }
    });

    $scope.goModel = function (model) {
        $scope.runtimeContext.moduleInfo.name = model.name;
        $scope.runtimeContext.moduleInfo.businessModuleId = model.businessguid;
        $scope.isShowTable = false;
        //注册路由，跳转
        lzMisptRouter.registerRouter($scope, [{
            stateName: "TaskModel",
            url: "/TaskModel",
            templateUrl: "/BasePlus/InformationRegistModel/PC/View/List.html",
            resolve: ['/BasePlus/InformationRegistModel/PC/JS/List.js'],
            paramCount: 0
        }
        ]);
        $scope.initStates = [];//解决模块列表直接进详情页的问题
        $state.go('.TaskModel')
    }
    $scope.goModelManager = function (model) {
        $scope.runtimeContext.moduleInfo.name = model.name;
        $scope.runtimeContext.moduleInfo.businessModuleId = model.businessguid;
        $scope.isShowTable = false;
        //      从这里进去以后，需要做一下处理
        $scope.NeedInformationRegisterModel = true;
        //注册路由，跳转
        lzMisptRouter.registerRouter($scope, [{
            stateName: "ModelManager",
            url: "/ModelManager",
            templateUrl: "/BasePlus/MISPTModule/PC/View/ProjectTemplateConfig/ProjectTemplateConfig.html",
            resolve: ['/BasePlus/MISPTModule/PC/JS/ProjectTemplateConfig/ProjectTemplateConfig.js'],
            paramCount: 0
        }
        ]);
        $scope.initStates = [];//解决模块列表直接进详情页的问题
        $state.go('.ModelManager')
    }
    $scope.goUserField = function (model) {
        //opacityAlert("暂时不可用！", "glyphicon glyphicon-remove-sign");
        //return;
        $scope.runtimeContext.moduleInfo.name = model.name;
        $scope.runtimeContext.moduleInfo.businessModuleId = model.businessguid;
        $scope.isShowTable = false;
        //注册路由，跳转
        lzMisptRouter.registerRouter($scope, [{
            stateName: "UserField",
            url: "/UserField",
            templateUrl: "/BasePlus/InformationRegistModel/PC/View/UserField/List.html",
            resolve: ['/BasePlus/InformationRegistModel/PC/JS/UserField/List.js'],
            paramCount: 0
        }
        ]);
        $scope.initStates = [];//解决模块列表直接进详情页的问题
        $state.go('.UserField')
    }
})