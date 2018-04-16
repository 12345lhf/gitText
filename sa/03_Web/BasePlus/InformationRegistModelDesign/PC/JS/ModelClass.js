/// <reference path="IRMControlModel.js" />
/// <reference path="../../../../Base/PC/JS/comdialog.js" />
'use strict';
; (function (angular, app) {
    app.register.controller('InformationRegistModelClassListController', function ($scope, $state, lzMisptRouter, $filter, $timeout, $window, $modal, lzMisptWebAPI, $injector, $q) {
        var cState = $state.current.name;
        //注册路由
        lzMisptRouter.registerRouter($scope, [{
            stateName: ".ModelList",
            url: "/ModelList/:classId",
            templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ModelList.html",
            resolve: ['/BasePlus/InformationRegistModelDesign/PC/JS/IRMControlModel.js', '/BasePlus/InformationRegistModelDesign/PC/JS/ModelList.js', '/BasePlus/MISPTFramework/PC/JS/MISPT_Dialog.js'],
            paramCount: 1
        }]);

        $scope.UIMethod = {
            //分类点击
            itemClick: function (item, $event) {
                $scope.UIData.activeItem = item;
                //跳转至列表页
                $state.go(cState + '.ModelList', { classId: item.id });
            },
            //添加分类
            addClass: function () {
                lzMisptTextBoxDailog($scope, $modal, "添加分类", "text", '', "请输入分类名称", function (tempValue, modelObj) {
                    if (!tempValue) {
                        opacityAlert("分类名称不能为空!", "glyphicon glyphicon-remove-sign");
                        return false;
                    }
                    //判断重名
                    if ($scope.UIData.allClass.findIndex(function (item) { return item.name == tempValue; }) > 0) {
                        opacityAlert("分类名称已经存在!", "glyphicon glyphicon-remove-sign");
                        return false;
                    }
                    $scope.callAPI.add(tempValue).then(function (data) {
                        $scope.UIData.allClass.push({ name: data.Name, id: data.Id })
                        var item = $scope.UIData.allClass.filter(function (temp) { return data.Id == temp.id; })
                        $scope.UIData.activeItem = item[0];
                        $scope.UIMethod.itemClick(item[0]);
                    })
                    return true;
                });

            },
            //删除分类
            delClass: function (item, index, $event) {
                var e = window.event || event;
                //阻止冒泡事件.防止点击删除按钮 调用路由跳转链接
                if (e && e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();//这一句管用
                } else {
                    //IE中阻止函数器默认动作的方式 
                    window.event.returnValue = false;
                }
                lzMisptConfirmDailog($scope, $modal, "提示", "只能删除没有模块的分类,确定要删除吗？", function (result) {
                    if (result) {
                        $scope.callAPI.del(item.id).then(function (data) {
                            if (data == true) {
                                $scope.UIData.allClass = $scope.UIData.allClass.filter(function (temp) { return item.id != temp.id; })
                                if (item.id == $scope.UIData.activeItem.id) {
                                    if ($scope.UIData.allClass.length > 0) {
                                        $scope.UIMethod.initClick();
                                    }
                                }
                            }
                        });
                        $event.stopPropagation();
                    }
                })
            },
            //分类重命名
            rename: function (item, index, $event) {
                var e = window.event || event;
                //阻止冒泡事件.防止点击删除按钮 调用路由跳转链接
                if (e && e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();//这一句管用
                } else {
                    //IE中阻止函数器默认动作的方式 
                    window.event.returnValue = false;
                }
                var tempItem = item;
                lzMisptTextBoxDailog($scope, $modal, "修改分类", "text", item.name, "请输入分类名称", function (tempValue, modelObj) {
                    if (!tempValue) {
                        opacityAlert("分类名称不能为空!", "glyphicon glyphicon-remove-sign");
                        return false;
                    }
                    //判断重名
                    if ($scope.UIData.allClass.findIndex(function (item) {
                        return (item.name == tempValue && tempValue != tempItem.name);
                    }) > 0) {
                        opacityAlert("分类名称已经存在!", "glyphicon glyphicon-remove-sign");
                        return false;
                    }
                    if (item.name != tempValue) {
                        $scope.callAPI.update(item.id, tempValue).then(function (data) {
                            $scope.UIData.allClass[index].name = tempValue;
                        })
                    }
                    return true;
                });
                $event.stopPropagation();
            },
            //加载分类
            loadClass: function () {
                $scope.callAPI.loadList().then(function (data) {
                    if (data) {
                        data.forEach(function (item) {
                            $scope.UIData.allClass.push(CommonTools.firstCharToLowerCaseForAll(item));
                        });
                        $scope.UIMethod.initClick();
                    }
                })
            },
            //初始化默认点击第一个分类
            initClick: function () {
                $scope.UIMethod.itemClick($scope.UIData.allClass[0]);
            }

        }

        $scope.context = {
            appCode: 'InformationRegistModel',
            apiServer: 'InformationRegistModel'
        }

        $scope.callAPI = {
            loadList: function () {
                var defer = $q.defer();
                lzMisptWebAPI.get("api/" + $scope.context.appCode + "/ModelClass/GetList", $scope.context.apiServer).then(function (data) {

                    defer.resolve(data);//执行成功
                }, function (error) {
                    opacityAlert(error, "glyphicon glyphicon-error-sign");
                    defer.reject && defer.reject(error);//执行失败
                });
                return defer.promise;
            },
            add: function (name) {
                var defer = $q.defer();
                lzMisptWebAPI.post("api/" + $scope.context.appCode + "/ModelClass/Add", { name: name }, $scope.context.apiServer).then(function (data) {
                    defer.resolve(data);//执行成功
                }, function (error) {
                    opacityAlert(error.ErrorCode.Message, "glyphicon glyphicon-error-sign");
                    defer.reject && defer.reject(error);//执行失败
                });
                return defer.promise;
            },
            update: function (id, name) {
                var defer = $q.defer();
                lzMisptWebAPI.post("api/" + $scope.context.appCode + "/ModelClass/Update", { id: id, name: name }, $scope.context.apiServer).then(function (data) {
                    defer.resolve(data);//执行成功
                }, function (error) {
                    opacityAlert(error.ErrorCode.Message, "glyphicon glyphicon-error-sign");
                    defer.reject && defer.reject(error);//执行失败
                });
                return defer.promise;
            },
            del: function (id) {
                var defer = $q.defer();
                lzMisptWebAPI.get("api/" + $scope.context.appCode + "/ModelClass/Delete/" + id, $scope.context.apiServer).then(function (data) {
                    defer.resolve(data);//执行成功
                }, function (error) {
                    opacityAlert(error.ErrorCode.Message, "glyphicon glyphicon-error-sign");
                    defer.reject && defer.reject(error);//执行失败
                });
                return defer.promise;
            }
        }
        $scope.UIData = {
            activeItem: {},
            allClass: []
        }
        $scope.UIMethod.loadClass();

    });

})(angular, app);