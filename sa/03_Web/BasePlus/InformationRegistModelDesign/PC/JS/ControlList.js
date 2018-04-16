'use strict';
; (function (angular, app) {
    'use strict';
    app.register.controller('InformationRegistModelControlListController', function ($scope, $state, $filter, $modal, lzMisptRouter, misptModal, lzMisptWebAPI) {
        $scope._searchKey = 'InformationRegistModelControlListController';
        $scope.apiServer = 'InformationRegistModel';
        $scope.activeControl;
        $scope.UIMethods = {
            //添加控件
            openAddControl: function () {
                $scope.activeControl = null;
                var temp = {
                    ismask: true,
                    title: "新建控件",
                    isScrollable: true,
                    showHeader: true,
                    showFooter: true,
                    footerButtonConfig: [
                       {
                           "text": "保存",
                           "class": "btn btn-long btn-primary",
                           'key': '_searchKey',
                           'value': 'CooperationTaskControlInfoScope',
                           'methodName': 'UIMethods.save',
                           'params': [1]
                       }
                    ],
                    width: "900px",
                    height: "745px",
                    templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ControlInfo.html"
                };
                misptModal.LzMisModal($scope, temp);
            },
            //编辑控件
            openDetailControl: function (control) {
                $scope.activeControl = control;
                var temp = {
                    ismask: true,
                    title: "编辑控件",
                    isScrollable: true,
                    showHeader: true,
                    showFooter: true,
                    footerButtonConfig: [
                       {
                           "text": "保存",
                           "class": "btn btn-long btn-primary",
                           'key': '_searchKey',
                           'value': 'CooperationTaskControlInfoScope',
                           'methodName': 'UIMethods.save',
                           'params': [1]
                       }
                    ],
                    width: "900px",
                    height: "745px",
                    templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ControlInfo.html"
                };
                misptModal.LzMisModal($scope, temp);
            },
            //查看控件
            openReadControl: function (control) {
                $scope.activeControl = control;
                var temp = {
                    ismask: true,
                    title: "查看控件",
                    isScrollable: true,
                    showHeader: true,
                    showFooter: true,
                    footerButtonConfig: [
                       {
                           "text": "关闭",
                           "class": "btn btn-long btn-primary",
                           'key': '_searchKey',
                           'value': 'CooperationTaskControlInfoScope',
                           'methodName': 'UIMethods.close',
                           'params': [1]
                       }
                    ],
                    width: "900px",
                    height: "745px",
                    templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/ControlInfo.html"
                };
                misptModal.LzMisModal($scope, temp);
            },
            //删除控件
            removeControl: function (id, $index) {
                lzConfirmDailog($scope, $modal, '确认删除', '是否确认删除控件？', function (isOK) {
                    if (isOK) {
                        $scope.WebAPI.removeControl(id);
                        $scope.UIData.controls = $scope.UIData.controls.filter(function (m) { return m.id != id });
                    }
                })
            },
        }

        $scope.UIData = {
            controls: []
        }

        $scope.WebAPI = {
            getControls: function () {
                lzMisptWebAPI.get('api/InformationRegistModel/Control/GetList', $scope.apiServer).then(function (data) {
                    if (data) {
                        data.forEach(function (item) {
                            $scope.UIData.controls.push(CommonTools.firstCharToLowerCaseForAll(item));
                        });
                    }
                }, function (error) {
                    opacityAlert(error, "glyphicon glyphicon-error-sign");
                });
            },
            removeControl: function (id) {
                lzMisptWebAPI.get('api/InformationRegistModel/Control/Delete/' + id, $scope.apiServer).then(function (data) {
                    if (data) {
                        opacityAlert('删除成功', "glyphicon glyphicon-error-sign");
                    } else {
                        opacityAlert('删除失败', "glyphicon glyphicon-error-sign");
                    }
                }, function (error) {
                    opacityAlert(error, "glyphicon glyphicon-error-sign");
                })
            }
        }

        //初始化获取数据
        $scope.WebAPI.getControls();
    })
})(angular, app);

; (function (angular, app) {
    'use strict';
    app.register.controller('InformationRegistModelControlInfoController', function ($scope, $state, lzMisptWebAPI, lzMisptSearchScope) {
        $scope._searchKey = 'CooperationTaskControlInfoScope';
        $scope.apiServer = 'InformationRegistModel';
        var listScope = lzMisptSearchScope.findUp($scope, '_searchKey', 'InformationRegistModelControlListController');
        $scope.UIData = {
            clientEntity: {
                id: '',
                name: '',
                code: '',
                description: '',
                isDefault: false,
                webJS: '',
                webCSS: '',
                mobileJS: '',
                mobileCSS: '',
                designJS: '',
                designCSS: '',
                controlType: '普通',
                extendConfig: ''
            },
            controlTypes: [
                '普通',
                '资源',
                '人员'
            ],
            saveMode: 0,
            isInvite: false,
            isReadOnly: false,
            controlTypesValue: {
                '普通': 0,
                '资源': 1,
                '人员': 2,
                0: '普通',
                1: '资源',
                2: '人员'
            }
        }
        $scope.UIMethods = {
            isSaveFinish: true,
            isAdd: true,
            //输入检查
            checkInput: function () {
                var isOK = true;
                if ($scope.entityForm.name.$error.required || $scope.entityForm.code.$error.required) {
                    if ($scope.entityForm.name.$error.required) {
                        $scope.entityForm.name.$pristine = false;
                    }
                    if ($scope.entityForm.code.$error.required) {
                        $scope.entityForm.code.$pristine = false;
                    }
                    this.isSaveFinish = true;
                    isOK = false;
                }
                return isOK;
            },
            checkCodeRepeat: function () {
                var isOK = true;
                var list = listScope.UIData.controls;
                var _this = this;
                function editCheck(c) {
                    return (c.code.toLowerCase() == $scope.UIData.clientEntity.code.toLowerCase()) && (c.id.toLowerCase() != $scope.UIData.clientEntity.id.toLowerCase())
                }
                function addCheck(c) {
                    return c.code.toLowerCase() == $scope.UIData.clientEntity.code.toLowerCase();
                }

                lzMisptWebAPI.get('api/InformationRegistModel/Control/GetList', listScope.apiServer).then(function (data) {
                    if (data) {
                        debugger;
                        list = data;
                        data.forEach(function (item) {
                            list.push(CommonTools.firstCharToLowerCaseForAll(item));
                        });
                        if (list.findIndex((_this.isAdd ? addCheck : editCheck)) > -1) {
                            $scope.entityForm.code.$error.required = true;
                            $scope.entityForm.code.$pristine = false;
                            _this.isSaveFinish = true;
                            isOK = false;
                            opacityAlert('已经存在相同的编码了！', "glyphicon glyphicon-remove-sign");
                        }

                        return isOK;
                    }
                })
            },
            controlTyepChange: function () {

            },
            save: function (state, close) {
                var _this = this;
                if (!this.isSaveFinish) return;
                this.isSaveFinish = false;
                //字段检查、去重判断
                if (!this.checkInput()) return;
                //异步问题
                //if (!this.checkCodeRepeat()) return;
                var isOK = true;
                var list = null;
                function editCheck(c) {
                    return (c.code.toLowerCase() == $scope.UIData.clientEntity.code.toLowerCase()) && (c.id.toLowerCase() != $scope.UIData.clientEntity.id.toLowerCase())
                }
                function addCheck(c) {
                    return c.code.toLowerCase() == $scope.UIData.clientEntity.code.toLowerCase();
                }

                lzMisptWebAPI.get('api/InformationRegistModel/Control/GetAllList', listScope.apiServer).then(function (data) {
                    if (data) {
                        list = data;
                        data.forEach(function (item) {
                            list.push(CommonTools.firstCharToLowerCaseForAll(item));
                        });
                        if (list.findIndex((_this.isAdd ? addCheck : editCheck)) > -1) {
                            $scope.entityForm.code.$error.required = true;
                            $scope.entityForm.code.$pristine = false;
                            _this.isSaveFinish = true;
                            isOK = false;
                            opacityAlert('已经存在相同的编码了！', "glyphicon glyphicon-remove-sign");
                        }
                        if (isOK) {
                            var postEntity = CommonTools.firstCharToUpperCaseForAll(angular.copy($scope.UIData.clientEntity));
                            postEntity.ControlType = $scope.UIData.controlTypesValue[postEntity.ControlType];
                            postEntity.ExtendConfig = _this.getExtendConfig();
                            lzMisptWebAPI.post('api/InformationRegistModel/Control/Save', postEntity, $scope.apiServer).then(function (data) {
                                var findIndex = listScope.UIData.controls.findIndex(function (m) { return m.id == data.Id });
                                if (findIndex < 0) {
                                    listScope.UIData.controls.push(CommonTools.firstCharToLowerCaseForAll(data));
                                } else {
                                    listScope.UIData.controls[findIndex] = CommonTools.firstCharToLowerCaseForAll(data);
                                }
                                close();
                            }, function (error) {
                                opacityAlert("保存失败", "glyphicon glyphicon-error-sign");
                            })
                        }
                    }
                })
            },
            close: function (state, close) {
                close();
            },
            load: function (id) {
                if (id) {
                    $scope.UIMethods.isAdd = false;
                    lzMisptWebAPI.get('api/InformationRegistModel/Control/Load/' + id, $scope.apiServer).then(function (data) {
                        data.ControlType = $scope.UIData.controlTypesValue[data.ControlType];
                        $scope.UIData.clientEntity = CommonTools.firstCharToLowerCaseForAll(data);
                        if ($scope.UIData.clientEntity.extendConfig) {
                            var extend = JSON.parse($scope.UIData.clientEntity.extendConfig);
                            if (extend.SaveMode) {
                                $scope.UIData.saveMode = extend.SaveMode;
                            }
                            if (extend.IsInvite) {
                                $scope.UIData.isInvite = extend.IsInvite;
                            }
                        }

                        console.log($scope.UIData.clientEntity)
                    }, function (error) {
                        opacityAlert(error, "glyphicon glyphicon-error-sign");
                    })
                }
            },
            getExtendConfig: function () {
                if ($scope.UIData.clientEntity.controlType == '资源') {
                    return JSON.stringify({
                        SaveMode: $scope.UIData.saveMode
                    });
                } else if ($scope.UIData.clientEntity.controlType == '人员') {
                    return JSON.stringify({
                        IsInvite: $scope.UIData.isInvite
                    });
                }
                return "";
            },
            seletedSaveMode: function (value) {
                $scope.UIData.saveMode = value.toString();
            },
            seletedIsInvite: function (value) {
                $scope.UIData.isInvite = value;
            }
        }

        if (listScope && listScope.activeControl) {
            //$scope.UIData.clientEntity = listScope.activeControl;
            //重新加载防止脏读
            $scope.UIMethods.load(listScope.activeControl.id);
            $scope.UIData.isReadOnly = listScope.activeControl.isDefault === true;
        }
    });
})(angular, app);