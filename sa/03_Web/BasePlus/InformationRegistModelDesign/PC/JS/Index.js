; (function (angular, app) {
    'use strict';
    app.register.controller('InformationRegistModelDesignIndexController', function ($scope, $state, lzMisptRouter) {
        //注册路由
        lzMisptRouter.registerRouter($scope, [{
            stateName: ".ModelClass",
            url: "/ModelClass",
            templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ModelClass.html",
            resolve: ['/BasePlus/InformationRegistModelDesign/PC/JS/ModelClass.js'],
            paramCount: 0
        }, {
            stateName: ".ControlList",
            url: "/ControlList",
            templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ControlList.html",
            resolve: ['/BasePlus/InformationRegistModelDesign/PC/JS/ControlList.js'],
            paramCount: 0
        }]);
        var cState = $state.current.name;
        $scope.showbtnindex = 1;
        $scope.goModuleList = function ($event) {
            if ($scope.showbtnindex == 1) {
                return;
            }
            //跳转至列表页
            $state.go(cState + '.ModelClass');

            $scope.showbtnindex = 1;
        }

        $scope.goControlList = function () {
            if ($scope.showbtnindex == 2) {
                return;
            }
            $scope.showbtnindex = 2;
            //跳转至列表页
            $state.go(cState + '.ControlList');
        }

        //跳转至列表页
        $state.go(cState + '.ModelClass');
    });
})(angular, app);