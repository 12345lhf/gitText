/// <reference path="../IRMControlModel.js" />
"use strict";
(function (window, angular, define) {
    /*定义模块*/
    define(function () {
        return {
            initControlLogic: function (app, $scope, $injector) {
                var $filter = $injector.get('$filter');
                var $modal = $injector.get('$modal');
                return {
                    showAdd: function (fieldItem, e) {
                        var rootFolderAddDiv = e.target.parentElement.parentElement.querySelector(".folder-item-root-add");
                        rootFolderAddDiv.style.display = "flex";
                    },
                    save: function (fieldItem,e) {
                        var tempInput = e.target.parentElement.parentElement.querySelector("input[type='text']");
                        if (tempInput.value) {
                            if (!$filter("filter")(fieldItem.controlConfig.Folders, { Name: tempInput.value }, true)[0]) {
                                fieldItem.controlConfig.Folders.push({
                                    Name: tempInput.value,
                                    Children: [],
                                    Resourcemodels: []
                                });
                                this.cancel(fieldItem, e);
                            }
                            else {
                                lzMisptAlertDailog($scope, $modal, "提示", "该目录【" + tempInput.value + "】已存在！");
                            }
                        }
                        else {
                            lzMisptAlertDailog($scope, $modal, "提示", "目录名称不能为空！");
                        }
                    },
                    cancel: function (fieldItem, e) {
                        var rootFolderAddDiv = e.target.parentElement.parentElement.querySelector(".folder-item-root-add");
                        rootFolderAddDiv.style.display = "none";
                        var tempInput = e.target.parentElement.parentElement.querySelector("input[type='text']");
                        tempInput.value = "";
                    },
                    folderOperation: {
                        add: {
                            start: function (folder) {
                                folder.newName = "";
                                folder.isShowAdd = true;
                            },
                            save: function (folder) {
                                if (folder.newName) {
                                    if (!$filter("filter")(folder.Children, { Name: folder.newName }, true)[0]) {
                                        folder.Children.push({
                                            Name: folder.newName,
                                            Children: [],
                                            Resourcemodels: []
                                        });
                                        folder.isShowAdd = false;
                                        folder.isShowChild = true;
                                    }
                                    else {
                                        lzMisptAlertDailog($scope, $modal, "提示", "该目录【" + folder.newName + "】已存在！");
                                    }
                                }
                                else {
                                    lzMisptAlertDailog($scope, $modal, "提示", "目录名称不能为空！");
                                }
                            },
                            cancel: function (folder) {
                                folder.isShowAdd = false;
                            }
                        },
                        edit: {
                            start: function (folder) {
                                folder.isShowEdit = true;
                            },
                            save: function (folder, parentChildren, e) {
                                if (!folder.Name) {
                                    folder.Name = e.target.parentElement.querySelector("input[type='hidden']").value;
                                    folder.isShowEdit = false;
                                }
                                else {
                                    if ($filter("filter")(parentChildren, { Name: folder.Name }, true).length > 1) {
                                        var tempFolderName = folder.Name;
                                        folder.Name = e.target.parentElement.querySelector("input[type='hidden']").value;
                                        lzMisptAlertDailog($scope, $modal, "提示", "该目录【" + tempFolderName + "】已存在！");
                                    }
                                    else {
                                        e.target.parentElement.querySelector("input[type='hidden']").value = folder.Name;
                                        folder.isShowEdit = false;
                                    }
                                }
                            },
                            cancel: function (folder, e) {
                                if (!folder.Name || folder.Name != e.target.parentElement.querySelector("input[type='hidden']").value) {
                                    folder.Name = e.target.parentElement.querySelector("input[type='hidden']").value;
                                }
                                folder.isShowEdit = false;
                            }
                        },
                        del: function (folder, parentChildren) {
                            parentChildren.splice(parentChildren.indexOf(folder), 1);
                        }
                    }
                };
            },
            initControlConfig: function (app, $scope, $injector, cType) {
                //同步加载 angular模板

                //初始化控件配置
                cType.config = new IrmControlConfigFile();
                cType.tpl = "irm-control-config-filedirective";
                cType.isFieldOrTab = true;
            }
        }
    });
})(window, angular, define);