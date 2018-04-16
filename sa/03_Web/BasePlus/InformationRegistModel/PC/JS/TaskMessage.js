(function () {
    'use strict';
    app.register.controller("LZCTMtaskMessageController", function ($scope, $modal, $state, $location) {
          //          适配一下传入的参数类型
        var paramsData = $scope["lzParams"] || null;
        $scope.maintitle = paramsData.maintitle;
        $scope.Title = paramsData.Title;
        $scope.date = paramsData.date;
        $scope.UserName = paramsData.UserName;
        angular.forEach(app.session.user.orgsbyuser, function (item, k) {
            if (paramsData.oid == item.oid)
            {
                $scope.orgname = item.shortname;
            }
        });
    });
})();