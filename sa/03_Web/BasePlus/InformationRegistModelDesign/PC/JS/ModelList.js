/// <reference path="IRMControlModel.js" />
/// <reference path="../../../../Base/PC/JS/comdialog.js" />
; (function (angular, app) {
    'use strict';
    app.register.controller('InformationRegistModelListController', function ($scope, $state, $stateParams, $filter, $timeout, $window, $modal, lzMisptWebAPI, $injector) {
        //2017年6月28日10:32:11
        $scope.classId = $stateParams.classId;

        /*       
         * 是否显示表头的固定宽度
         * 列表中因出现滚动条而引起的表头错位问题
         */
        var isShowTableTheaderOffset = function (trContainerId, offsetId, objThis, attr) {
            $timeout(function () {
                var trContainer = document.getElementById(trContainerId);
                var offsetDiv = document.getElementById(offsetId);
                if (trContainer && offsetDiv) {
                    var tbody = trContainer.parentElement;
                    var trsH = trContainer.clientHeight;
                    var tbodyH = tbody.clientHeight;
                    var trsW = trContainer.offsetWidth;
                    var tbodyW = tbody.offsetWidth;
                    if (objThis) {
                        objThis[attr] = trsH > tbodyH;
                    }
                    if (trsH > tbodyH) {
                        offsetDiv.style.display = "block";
                    }
                    else {
                        offsetDiv.style.display = "none";
                    }
                    offsetDiv.style.width = tbodyW - trsW + "px";
                }
            }, 0);
        }
        $window.onresize = function () {
            isShowTableTheaderOffset("irm-model-table-tr-container", "irm-model-table-theader-offset");
            isShowTableTheaderOffset("irm-list-table-tr-container", "irm-list-table-theader-offset", $scope.newModelMananer.listManager, "isShowCtmListTableTheaderOffset");
            isShowTableTheaderOffset("irm-extend-tab-table-tr-container", "irm-extend-tab-table-theader-offset", $scope.extendConfigManager.toolbar, "isShowCtmExtendTabTableTheaderOffset");
        }
        //获取GUID
        var getGUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16).toUpperCase();
            });
        }
        //数组获取重复项
        function arrayGetRepeatItems(ar) {
            var tmp = {},
                ret = [];
            ar.forEach(function (v, i) {
                if (!tmp[v]) {
                    tmp[v] = 1;
                }
                else {
                    if (ret.indexOf(v) < 0) {
                        ret.push(v);
                    }
                }
            });
            return ret;
        }
        //控件列表字典
        $scope.controlTypesObj = {};
        $scope.controlTypesList = [];
        var getInitModel = function () {
            var cModel = new IrmModelConfig();
            return cModel;
        };
        //列表管理
        $scope.modelListManager = {
            models: [],
            server2ViewModel: function (serverModel) {
                var _this = this;
                _this.models = [];
                angular.forEach(serverModel, function (item, k) {
                    var temp = new IrmModelConfig(item);
                    temp.controlTypeToObj($scope.controlTypesObj);
                    _this.models.push(new IrmModelConfig(item));
                });
            },
            del: function (model) {
                var _this = this;
                lzMisptConfirmDailog($scope, $modal, "提示", "您确定要删除模块【" + model.name + "】吗？", function (result) {
                    if (result) {
                        var url = "api/InformationRegistModel/Design/DeleteModel/";
                        url += model.id;
                        lzMisptWebAPI.get(url, "InformationRegistModel").then(function (data) {
                            _this.models.splice(_this.models.indexOf(model), 1);
                            isShowTableTheaderOffset("irm-model-table-tr-container", "irm-model-table-theader-offset");
                        }, function (data) {
                            console.log(data);
                        });
                    }
                });
            },
            publish: function (model) {
                var url = "api/InformationRegistModel/Design/PublishModel";
                callApiManager.loadModelById(model.id, function (data) {
                    var postModel = new IrmModelConfig(data);
                    postModel.controlTypeToObj($scope.controlTypesObj);
                    $scope.newModelMananer.postData(url, postModel, function (data) {
                        //$scope.modelListManager.load();
                        $scope.toolsBar.filterManager.searchData();
                    }, function (error) { }, "OtherList");
                });
            },
            load: function () {
                var _this = this;
                lzMisptWebAPI.get("api/InformationRegistModel/Design/GetDesignDataListByUserAndClass/" + $scope.classId, "InformationRegistModel").then(function (data) {
                    if (data && data.length) {
                        _this.server2ViewModel(data);
                        isShowTableTheaderOffset("irm-model-table-tr-container", "irm-model-table-theader-offset");
                    }
                }, function (error1, error2, error3, error4) {
                });
            },
            loadControls: function () {
                var _this = this;
                lzMisptWebAPI.get('api/InformationRegistModel/Control/GetList', "InformationRegistModel").then(function (data) {
                    if (data) {
                        $scope.controlTypesList = [];
                        data.forEach(function (item) {
                            var tempControlType = new IrmControlType(item);
                            tempControlType.isPersonnel = item.ControlType == "2";
                            $scope.controlTypesObj[item.Code] = tempControlType;
                            $scope.controlTypesList.push(tempControlType);
                            if (item.DesignJS) {
                                require(item.DesignJS.split(","), function (obj) {
                                    if (obj.initControlLogic && typeof (obj.initControlLogic) == "function") {
                                        $scope[item.Code] = obj.initControlLogic(app, $scope, $injector);
                                    }
                                    obj.initControlConfig(app, $scope, $injector, tempControlType);
                                });
                            }
                        });
                        _this.load();
                    }
                }, function (error) {
                    opacityAlert("获取列表失败", "glyphicon glyphicon-error-sign");
                });
            },
            changgeClass: function (module) {
                lzMisptSelectBoxDailog($scope, $modal, "选择分类", $scope.$parent.UIData.allClass, function (SelectItem, modelObj) {
                    if (!SelectItem.id) {
                        opacityAlert("请选择分类", "glyphicon glyphicon-error-sign");
                        return;
                    }
                    if (SelectItem.id == module.classId) {
                        return;
                    }
                    lzMisptWebAPI.get("api/InformationRegistModel/Design/ResetModelClass/" + module.id + "/" + SelectItem.id, "InformationRegistModel").then(function (data) {
                        if (data) {
                            $scope.modelListManager.models = $scope.modelListManager.models.filter(function (item) {
                                return item.id != module.id;
                            });
                        }
                    }, function (error) {
                        opacityAlert("选择分类失败", "glyphicon glyphicon-error-sign");
                    });
                    return true;
                })
            }
        };
        $scope.modelListManager.loadControls();

        //CoverScreen 遮盖全屏管理
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
                    //改为查询结果不重新加载
                    //$scope.modelListManager.load();
                    $scope.toolsBar.filterManager.searchData();
                }
            }
        }

        //Stepper导航管理
        $scope.stepperManager = {
            steppers: [
                {
                    index: 1,
                    text: "基本信息",
                    bodyTpl: "model-config-baseinfo-body",
                    footerTpl: "model-config-baseinfo-footer",
                    isAllow: true
                },
                {
                    index: 2,
                    text: "属性配置",
                    bodyTpl: "model-config-property-body",
                    footerTpl: "model-config-property-footer",
                    isAllow: false
                },
                {
                    index: 3,
                    text: "登记单配置",
                    bodyTpl: "model-config-form-body",
                    footerTpl: "model-config-form-footer",
                    isAllow: false
                },
                {
                    index: 4,
                    text: "列表配置",
                    bodyTpl: "model-config-list-body",
                    footerTpl: "model-config-list-footer",
                    isAllow: false
                }
            ],
            selectedStepper: null,
            getStepperImg: function (stepper) {
                var retStr = "";
                //如果是新建模快就按照原來的頁面顯示如果不是就全部是亮的
                if ($scope.newModelMananer.isCreateNewModel) {
                    if (this.selectedStepper.index < stepper.index) {
                        retStr = "/BasePlus/InformationRegistModelDesign/PC/Images/stepper" + stepper.index + ".png";
                    }
                    else if (this.selectedStepper.index > stepper.index) {
                        retStr = "/BasePlus/InformationRegistModelDesign/PC/Images/stepper" + stepper.index + "-selected.png";
                    }
                    else {
                        retStr = "/BasePlus/InformationRegistModelDesign/PC/Images/stepper-active.png";
                    }
                } else {
                    if (this.selectedStepper.index != stepper.index) {
                        retStr = "/BasePlus/InformationRegistModelDesign/PC/Images/stepper" + stepper.index + "-selected.png";
                    }
                    else {
                        retStr = "/BasePlus/InformationRegistModelDesign/PC/Images/stepper-active.png";
                    }
                }
                return retStr;
            },
            stepperClick: function (item) {
                var _this = this;
                if (!item.isAllow) {
                    if (Math.abs(item.index - _this.selectedStepper.index) > 1) {
                        return;
                    }
                }
                //如果直接点击列表页则要设置列表显示项
                if (item.index == 4) {
                    $scope.newModelMananer.formManager.setShowList();
                }
                if (this.selectedStepper.index > item.index) {
                    this.selectedStepper = item;
                } else {
                    var _this = this;
                    //验证现在活动页面是否允许离开
                    if ($scope.pagesValid.activePageValid()) {
                        this.selectedStepper = item;
                    }
                }
            }
        };

        //API管理
        var callApiManager = {
            loadModelById: function (id, callback) {
                var url = "api/InformationRegistModel/Design/GetModel";
                url += "/" + id;
                lzMisptWebAPI.get(url, "InformationRegistModel").then(function (data) {
                    if (data) {
                        callback(data);
                    }
                }, function (error1, error2, error3, error4) {
                });
            }
        };

        //搜索列表数据
        var searchData = function (isScrollLoadData) {
            //是否是滚动加载
            if (!isScrollLoadData) {
                $scope.loadOper.init();
            }
            //选中排序项
            var sortItem = $scope.searchOrderParams.sortItem;
            //选中过滤项
            var filterItem = $scope.searchOrderParams.filterItem;
            //选中任务状态
            //var taskTypeItem = $scope.searchOrderParams.taskTypeItem
            //查询实体(默认查询实体)
            var searchModel = {
                'AppCode': $scope.appCode,
                'BusinessModuleId': $scope.businessModuleId,
                'SceneCode': $scope.sceneCode,
                'SceneOrgId': $scope.sceneOrganizationId,
                //ListType: taskTypeItem.index,//任务状态,例如我参与的...
                Filter: [],//过滤条件
                Sorts: [],//排序 默认按照 发布时间 降序
                StartIndex: isScrollLoadData ? $scope.table.trs.length : 0,
                Length: 20
            };
            //填充过滤条件
            if (filterItem.filterCode != "none") {
                if (filterItem.inputValue) {
                    searchModel.Filter.push({
                        field: filterItem.filterCode,
                        value: filterItem.inputValue,
                        filterType: "Like"
                    });
                }
            }
            //判断是否是搜索状态
            if (searchModel.Filter.length) {
                $scope.misptTableStatus = "search";
            } else {
                $scope.misptTableStatus = null;
            }
            //覆盖 排序项目
            //searchModel.Sort = sortItem;
            if (sortItem.rankCode != "") {
                searchModel.Sorts.push({
                    Field: sortItem.rankCode,
                    //true：升序；false：降序
                    IsASC: !sortItem.isdesc,
                });
            } else {
                searchModel.Sorts = null;
            }

            //发送请求
            lzMisptWebAPI.post('api/Runtime/Business/GetCTMMonitorModuleList', searchModel, 'CooperationTaskModel').then(function (data) {
                data = configManager.firstCharToLowerCaseForAll(JSON.parse(data)).list;
                var tempUidface = {};
                angular.forEach($scope.principalcode, function (codeitem, m) {
                    codeitem = firstLowerCase(codeitem);
                    tempUidface[codeitem] = [];
                });
                angular.forEach(data, function (item, k) {
                    if ($scope.timecode.length != 0) {
                        angular.forEach($scope.timecode, function (codeitem, m) {
                            codeitem = firstLowerCase(codeitem);
                            if (codeitem == "createTime") {
                                item.createTime = new Date(item.createTime.$date);
                            } else {
                                item[codeitem] = $filter('date')(item[codeitem], "yyyy年MM月dd日");
                            }
                        });
                    }
                    //循环字段如果是负责人的话
                    angular.forEach($scope.principalcode, function (codeitem, m) {
                        codeitem = firstLowerCase(codeitem);
                        if (item[codeitem]) {
                            tempUidface[codeitem].push({ uid: item[codeitem] });
                        }
                    });
                    angular.forEach($scope.codetemp, function (codeitem, m) {
                        if ($.inArray(codeitem, $scope.timecode) == -1) {
                            codeitem = firstLowerCase(codeitem);
                            item[codeitem + 't'] = item[codeitem];
                            if (item[codeitem]) {
                                item[codeitem] = item[codeitem].split('\n')[0];
                            }
                        }
                    });
                });
                //判断是否是滚动加载
                if (isScrollLoadData) {
                } else {
                    $scope.table.trs = [];
                }
                if (data != null && data.length) {
                    angular.forEach(data, function (item, k) {
                        $scope.table.trs.push(item);
                    })
                    //根据成员的集合查询人员信息
                    angular.forEach($scope.principalcode, function (codeitem, m) {
                        codeitem = firstLowerCase(codeitem);
                        if (tempUidface[codeitem].length > 0) {
                            lzMisptWebAPI.post('api/user/getuserbatchbyuefilter', { "": tempUidface[codeitem] }, '').then(function (userdata) {
                                var Uidname = {};
                                angular.forEach(userdata, function (item, k) {
                                    Uidname[item.uid] = item.username;
                                });
                                angular.forEach($scope.table.trs, function (item, k) {
                                    angular.forEach($scope.principalcode, function (codeitem, m) {
                                        codeitem = firstLowerCase(codeitem);
                                        if (Uidname[item[codeitem]]) {
                                            item[codeitem] = Uidname[item[codeitem]]
                                        }
                                    });
                                })
                            });
                        };
                    });
                } else if (data.length == 0) {
                    $scope.loadOper.isSearchFinish = true;
                }
                $scope.loadOper.scrollFlag = true;
                //给列表内容赋值
            }, function (error) {
                opacityAlert("获取列表失败!", "glyphicon glyphicon-remove-sign");
            })
        };

        //滚动加载
        $scope.loadOper = {
            //滚动加载标识，在滚动加载时，直到返回结果之后才可以发送下次请求
            scrollFlag: true,
            //判断是不是加载完成，依据是第一次出现返回0条记录时（如果想刷新新增的记录，可以点击刷新按钮）
            isSearchFinish: false,
            //滚动加载的控制逻辑
            nowPage: 1,
            loadData: function () {
                //先不加滚动加载
                return;
                var _this = this;
                if ($scope.loadOper.scrollFlag) {
                    $scope.loadOper.scrollFlag = false;
                    if (!$scope.loadOper.isSearchFinish) {
                        $scope.toolsBar.filterManager.searchData()
                        _this.nowPage++;
                    }
                }
            },
            //初始化滚动加载配置
            init: function () {
                //滚动加载 初始值
                $scope.loadOper.scrollFlag = true;
                $scope.loadOper.isSearchFinish = false;
                $scope.loadOper.nowPage = 1;
            }
        };

        //所有页面的验证
        $scope.pagesValid = {
            allPagesValided: false,
            activePageValid: function () {
                var item = $scope.stepperManager.selectedStepper;
                switch (item.index) {
                    case 1:
                        return $scope.newModelMananer.baseInfoManager.selectThisPage();
                        break;
                    case 2:
                        return $scope.newModelMananer.propertyManager.selectThisPage();
                        break;
                    case 3:
                        return $scope.newModelMananer.formManager.selectThisPage();
                        break;
                    case 4:
                        $scope.newModelMananer.formManager.setShowList();
                        return true
                    default:
                        break;
                }
            }
        }

        //新建模块管理
        $scope.newModelMananer = {
            newModel: null,
            isCreateNewModel: false,
            defaultExtendBtn: {
                add: [{
                    btnCode: "",
                    btnName: "保存",
                    btnEvent: "event-irm-toolbar-add-save",
                    isDefault: true,
                    isValid: true,
                    isSupportPC: true,
                    isSupportMobile: true
                }, {
                    btnCode: "",
                    btnName: "取消",
                    btnEvent: "event-irm-toolbar-add-cancel",
                    isDefault: true,
                    isValid: true,
                    isSupportPC: true,
                    isSupportMobile: true
                }],
                detail: [{
                    btnCode: "",
                    btnName: "保存",
                    btnEvent: "event-irm-toolbar-detail-save",
                    isDefault: true,
                    isValid: true,
                    isSupportPC: true,
                    isSupportMobile: true
                }, {
                    btnCode: "",
                    btnName: "删除",
                    btnEvent: "event-irm-toolbar-detail-delete",
                    isDefault: true,
                    isValid: true,
                    isSupportPC: true,
                    isSupportMobile: true
                }],
                list: [{
                    btnCode: "",
                    btnName: "登记",
                    btnEvent: "event-irm-toolbar-list-register",
                    isDefault: true,
                    isValid: true,
                    isSupportPC: true,
                    isSupportMobile: true
                }]
            },
            open: function (model) {
                var _this = this;
                $scope.attrListManager.attrList = [];
                if (model) {
                    $scope.publishModel = model;
                    _this.isCreateNewModel = false;
                    callApiManager.loadModelById(model.id, function (data) {
                        _this.newModel = new IrmModelConfig(data);
                        _this.newModel.controlTypeToObj($scope.controlTypesObj);
                        _this.isCreateNewModel = false;
                        angular.forEach($scope.stepperManager.steppers, function (i, v) {
                            i.isAllow = true;
                        });
                        $scope.attrListManager.getAttrPageData();
                        $scope.newModelMananer.baseInfoManager.fieldTextChanged();
                        //获取的list页的filed数据js认为是相同的.执行一次form页的nextStrpper方法
                        //_this.formManager.nextStepper();
                        $scope.coverScreenManager.show("stepper-nav-tpl");
                    });
                }
                else {
                    _this.newModel = getInitModel();
                    _this.isCreateNewModel = true;
                    angular.forEach($scope.stepperManager.steppers, function (i, v) {
                        i.isAllow = false;
                    });
                    //设置扩展配置的内置按钮
                    $scope.newModelMananer.newModel.extendConfig.extendToolBar.add = _this.defaultExtendBtn.add;
                    $scope.newModelMananer.newModel.extendConfig.extendToolBar.detail = _this.defaultExtendBtn.detail;
                    $scope.newModelMananer.newModel.extendConfig.extendToolBar.list = _this.defaultExtendBtn.list;
                    //$scope.newModelMananer.baseInfoManager.fieldTextChanged();
                    $scope.coverScreenManager.show("stepper-nav-tpl");
                }
            },
            //基本信息页签 
            baseInfoManager: {
                isInvalidModuleName: true,
                fieldTextChanged: function () {
                    var _this = this;
                    if ($scope.newModelMananer.newModel.name) {
                        _this.isInvalidModuleName = true;
                        $scope.stepperManager.steppers[1].isAllow = true;
                    } else {
                        _this.isInvalidModuleName = false;
                    }
                },
                nextStepper: function () {
                    var _this = this;
                    _this.fieldTextChanged();
                    if (!_this.isInvalidModuleName) {
                        return;
                    }
                    if (_this.isInvalidModuleName) {
                        $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[1];
                    }
                },
                selectThisPage: function () {
                    //验证本页面
                    var _this = this;
                    _this.fieldTextChanged();
                    if (_this.isInvalidModuleName) {
                        return true;
                    } else {
                        return false;
                    }
                },
            },
            //属性页签
            propertyManager: {
                isNotAllowNextStepper: true,
                //添加一个属性（字段）
                addField: function () {
                    var temp = angular.copy($scope.attrListManager.newAttr)
                    temp.model.attrCode = getGUID();
                    if ($scope.attrListManager.attrList.length > 0) {
                        $scope.pagesValid.activePageValid();
                        if (!$scope.attrListManager.attrListValid) {
                            $scope.attrListManager.attrList.push(temp);
                            $scope.attrListManager.attrListValid = true;
                        }
                    } else {
                        $scope.attrListManager.attrList.push(temp);
                        $scope.attrListManager.attrListValid = true;
                    }
                    setTimeout(function () {
                        var tempScrollYDiv = document.querySelector("form[name='fieldsForm'] .form-body");
                        if (tempScrollYDiv) {
                            tempScrollYDiv.scrollTop = tempScrollYDiv.scrollHeight;
                        }
                    }, 0);
                },
                delField: function (attrItem) {
                    var index = 0;
                    angular.forEach($scope.attrListManager.attrList, function (i, v) {
                        if (attrItem.$$hashKey == i.$$hashKey) {
                            index = v;
                        }
                    });
                    //如果没有填写名称直接删除就好了
                    if (!attrItem.model.attrName) {
                        $scope.attrListManager.attrList.splice(index, 1);
                    } else {
                        //删除登记单使用这个名字的配置
                        var tempForm = null, tempList = null;
                        angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (i, v) {
                            if (i.fieldName == attrItem.model.attrName) {
                                tempForm = i;
                            }
                        })
                        //删除列表的该属性
                        angular.forEach($scope.newModelMananer.newModel.listConfig.fields, function (i, v) {
                            if (i.fieldName == attrItem.model.attrName) {
                                tempList = i;
                            }
                        })
                        if (tempForm) {
                            lzMisptConfirmDailog($scope, $modal, "提示", "该属性已被使用,确定要删除吗？", function (result) {
                                if (result) {
                                    $scope.newModelMananer.newModel.formConfig.fields.splice($scope.newModelMananer.newModel.formConfig.fields.indexOf(tempForm), 1);
                                    //同步删除列表页信息
                                    $scope.newModelMananer.newModel.listConfig.fields.splice($scope.newModelMananer.newModel.listConfig.fields.indexOf(tempList), 1);
                                    $scope.newModelMananer.formManager.forEachFields();
                                    $scope.attrListManager.attrList.splice(index, 1);
                                }
                            })
                        } else {
                            $scope.attrListManager.attrList.splice(index, 1);
                            //同步删除列表页信息
                            $scope.newModelMananer.newModel.listConfig.fields.splice($scope.newModelMananer.newModel.listConfig.fields.indexOf(tempList), 1);
                        }
                    }
                    $scope.pagesValid.activePageValid();
                },
                preStepper: function () {
                    $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[0];
                },
                nextStepper: function (callback) {
                    if ($scope.attrListManager.attrList.length == 0) {
                        opacityAlert("属性名不能为空!", "glyphicon glyphicon-remove-sign");
                        return
                    }
                    var _this = this;
                    $scope.pagesValid.activePageValid();
                    if (!_this.isNotAllowNextStepper) {
                        $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[2];
                        isShowTableTheaderOffset("irm-list-table-tr-container", "irm-list-table-theader-offset", $scope.newModelMananer.listManager, "isShowCtmListTableTheaderOffset");
                    }
                },
                forEachFields: function () {
                    var _this = this;
                    _this.isNotAllowNextStepper = true;
                    if ($scope.attrListManager.attrList.length > 0) {
                        angular.forEach($scope.attrListManager.attrList, function (i, v) {
                            $scope.attrListManager.attrValid(i);
                        })
                        _this.isNotAllowNextStepper = !$scope.attrListValid;
                        if (!_this.isNotAllowNextStepper) {
                            $scope.stepperManager.steppers[2].isAllow = true;
                        }
                    } else {
                        opacityAlert("属性配置不能为空!", "glyphicon glyphicon-remove-sign");
                    }
                },
                selectThisPage: function () {
                    var _this = this;
                    _this.forEachFields();
                    if (_this.isNotAllowNextStepper) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            //登记单页签
            formManager: {
                isNotAllowNextStepper: false,
                //添加一个属性（字段）
                addField: function () {
                    var _this = this;
                    _this.forEachFields();
                    if (_this.isNotAllowNextStepper) {
                        return;
                    }
                    var tempNewField = new IrmFieldBase();
                    tempNewField.fieldCode = "";
                    tempNewField.controlType = $scope.controlTypesObj["text"];
                    tempNewField.controlConfig = new IrmControlConfigText();
                    tempNewField.controlNormal = $scope.controlTypesObj["text"].controlConfig;
                    $scope.newModelMananer.baseInfoManager.fieldTextChanged();
                    $scope.newModelMananer.newModel.formConfig.fields.push(tempNewField);
                    _this.isNotAllowNextStepper = true;
                    setTimeout(function () {
                        var tempScrollYDiv = document.querySelector("form[name='fieldsForm'] .form-body>div");
                        if (tempScrollYDiv) {
                            tempScrollYDiv.scrollTop = tempScrollYDiv.scrollHeight;
                        }
                    }, 0);
                },
                //删除一个属性字段
                delField: function (item) {
                    var _this = this;
                    lzMisptConfirmDailog($scope, $modal, "提示", "您确定要删除该属性吗？", function (result) {
                        if (result) {
                            //if (item.controlType && item.controlType.isFieldOrTab) {
                            //    for (var i = 0; i < $scope.newModelMananer.newModel.extendConfig.tabs.length;) {
                            //        var tab = $scope.newModelMananer.newModel.extendConfig.tabs[i];
                            //        if (tab.tabCode === item.fieldCode) {
                            //            $scope.newModelMananer.newModel.extendConfig.tabs.splice(i, 1);
                            //        } else i++;
                            //    }
                            //}
                            $scope.newModelMananer.newModel.formConfig.fields.splice($scope.newModelMananer.newModel.formConfig.fields.indexOf(item), 1);
                            _this.forEachFields();
                        }
                    });
                },
                //属性名称change事件
                fieldTextChanged: function (fieldItem, index) {
                    //获取选中的select
                    var index = $("#" + index + "-model-config-form-body-select").val();
                    var selectControl = $scope.attrListManager.attrList[index];
                    if (selectControl.model.attrCode) {
                        fieldItem.fieldCode = selectControl.model.attrCode;
                    }
                    else {//正式以后可能用不到..
                        fieldItem.fieldCode = ""
                    }
                    var tempModel = $filter("filter")($scope.modelListManager.models, { id: $scope.newModelMananer.newModel.id }, true)[0];
                    if (tempModel) {
                        var tempFieldItem = $filter("filter")(tempModel.formConfig.fields, { fieldCode: fieldItem.fieldCode }, true)[0];
                        if (tempFieldItem) {
                            //如果是被选择的字段名称在之前已使用过.则把原来的属性类型赋值过来
                            fieldItem.controlType = $scope.controlTypesObj[tempFieldItem.controlType];
                            fieldItem.controlConfig = tempFieldItem.controlConfig;
                            fieldItem.controlNormal = tempFieldItem.controlNormal;
                        }
                    }
                    if (!fieldItem.fieldName) {
                        fieldItem.isNotAllow = true;
                        this.isNotAllowNextStepper = true;
                        $scope.stepperManager.steppers[3].isAllow = false;
                    }
                    else {
                        //属性名重复验证
                        var nameArry = [];
                        angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (i, v) {
                            nameArry.push(i.fieldName);
                        })
                        var tempStr = nameArry.join(",") + ",";
                        if (tempStr.replace(fieldItem.fieldName + ",").indexOf(fieldItem.fieldName + ",") > -1) {
                            fieldItem.isNotAllow = true;
                            opacityAlert("属性名称重复!", "glyphicon glyphicon-remove-sign");
                        } else {
                            fieldItem.isNotAllow = false;
                        }
                        if (!fieldItem.isNotAllow) {
                            if (fieldItem.controlType.isFieldOrTab) {
                                for (var i = 0; i < $scope.newModelMananer.newModel.extendConfig.tabs.length; i++) {
                                    var tab = $scope.newModelMananer.newModel.extendConfig.tabs[i];
                                    if (tab.tabCode === fieldItem.fieldCode) {
                                        tab.tabName = fieldItem.fieldName;
                                        break;
                                    }
                                }
                            }
                            this.forEachFields();
                        }
                    }
                },
                forEachFields: function () {
                    this.isNotAllowNextStepper = false;
                    var _this = this;
                    angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (fieldItem, k) {
                        if (!fieldItem.fieldName) {
                            fieldItem.isNotAllow = true
                            _this.isNotAllowNextStepper = true;
                            opacityAlert("属性名称不能为空!", "glyphicon glyphicon-ok-sign");
                        } else {
                            fieldItem.isNotAllow = false;//去掉红框
                        }
                    });
                    if (!_this.isNotAllowNextStepper) {
                        $scope.stepperManager.steppers[3].isAllow = true;
                    }
                    //$scope.stepperManager.steppers[3].isAllow = !_this.isNotAllowNextStepper;
                },
                //指定的属性（字段）的控件类型 发生改变
                fieldTypeSelectChanged: function (fieldItem) {
                    var tempHiddenFieldTypeCode = document.getElementById("hidTempCode-" + fieldItem.fieldCode).value;
                    //可以添加多个人员属性:组织机构和登记人
                    //var countFlag = 0;
                    //if (fieldItem.controlType.isPersonnel) {
                    //    angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (formField, k) {
                    //        if (formField.controlType.isPersonnel) {
                    //            countFlag++;
                    //        }
                    //    });
                    //    if (countFlag > 1) {
                    //        fieldItem.controlType = $scope.controlTypesObj[tempHiddenFieldTypeCode];
                    //        lzMisptAlertDailog($scope, $modal, "提示", "只能选择一个人员属性！");
                    //        return;
                    //    }
                    //}
                    if ($scope.controlTypesObj[fieldItem.controlType.code]) {
                        fieldItem.controlConfig = angular.copy($scope.controlTypesObj[fieldItem.controlType.code].config);
                    }
                    else {
                        fieldItem.controlConfig = {};
                    }
                },
                getFieldTypeIsDisabled: function (fieldItem) {
                    if (fieldItem.isDefault) { return true };
                    var tempModel = $filter("filter")($scope.modelListManager.models, { id: $scope.newModelMananer.newModel.id }, true)[0];
                    if (tempModel) {
                        var tempFieldItem = $filter("filter")(tempModel.formConfig.fields, { fieldCode: fieldItem.fieldCode }, true)[0];
                        if (($scope.newModelMananer.newModel.state === 1 || $scope.newModelMananer.newModel.state === 2) && tempFieldItem) {
                            return true
                        };
                    }
                },
                preStepper: function () {
                    $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[1];
                },
                nextStepper: function () {
                    var _this = this;
                    _this.setShowList()
                    if (!_this.isNotAllowNextStepper) {
                        $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[3];
                        isShowTableTheaderOffset("irm-list-table-tr-container", "irm-list-table-theader-offset", $scope.newModelMananer.listManager, "isShowCtmListTableTheaderOffset");
                    }
                },
                setShowList: function () {
                    var _this = this;
                    _this.forEachFields();
                    //$scope.pagesValid.activePageValid();
                    var tempFieldNames = [];
                    angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (formField, k) {
                        tempFieldNames.push("【" + formField.fieldName + "】");
                    });
                    //清空list防止删除的数据依然出现
                    //$scope.newModelMananer.newModel.listConfig.fields = [];
                    //获取到属性列表
                    angular.forEach($scope.attrListManager.attrList, function (i, v) {
                        var temp = {
                            fieldName: i.model.attrName,
                            fieldCode: i.model.attrCode,
                            isListValid: false,
                            isSupportSearch: false,
                            isSupportSort: false,
                            width: 0,
                        }
                        var tempField = $filter("filter")($scope.newModelMananer.newModel.formConfig.fields, { fieldCode: i.model.attrCode }, true)[0]
                        var listField = $filter("filter")($scope.newModelMananer.newModel.listConfig.fields, { fieldCode: i.model.attrCode }, true)[0]
                        if (tempField) {
                            if (listField) {
                                listField.fieldName = i.model.attrName;
                            } else {
                                if (tempField.controlType) {
                                    //列表中使用则不显示资源类
                                    if (!tempField.isHidden && tempField.controlType.isShowList) {
                                        temp.isSupportSearch = tempField.isSupportSearch;
                                        temp.isSupportSort = tempField.isSupportSort;
                                        $scope.newModelMananer.newModel.listConfig.fields.push(temp);
                                    }
                                }
                            }
                        } else if (!tempField & !listField) {
                            $scope.newModelMananer.newModel.listConfig.fields.push(temp);
                        }
                    });
                    var reArr = arrayGetRepeatItems(tempFieldNames);
                    if (reArr.length > 0) {
                        var tempLast = reArr.pop();
                        var tempMsg = "属性名称不能重复，重复的名称为";
                        if (reArr.length) {
                            tempMsg += reArr.join("、") + "和";
                        }
                        tempMsg += tempLast + "！";
                        lzMisptAlertDailog($scope, $modal, "提示", tempMsg);
                        return false;
                    }
                },
                selectThisPage: function () {
                    var _this = this;
                    _this.forEachFields();
                    if (_this.isNotAllowNextStepper) {
                        return false;
                    } else {
                        return true;;
                    }
                }
            },
            //列表配置页签
            listManager: {
                isShowCtmListTableTheaderOffset: false,
                isValidClick: function (field) {
                    //TODO 验证暂时不用了
                    return;
                    var countWidth = 0;
                    angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (formField, k) {
                        if (formField.isListValid) {
                            countWidth += formField.width;
                        }
                    });
                    if (countWidth > 10) {
                        if (field.isListValid) {
                            field.isListValid = false;
                        }
                        lzMisptAlertDailog($scope, $modal, "提示", "您最多可以启用4列！");
                    }
                    else {
                        field.isSupportSort = field.controlType.isSupportSort ? field.isListValid : false;
                        field.isSupportSearch = field.controlType.isSupportSearch ? field.isListValid : false;
                    }
                },
                preStepper: function () {
                    $scope.stepperManager.selectedStepper = $scope.stepperManager.steppers[2];
                },
                save: function () {
                    var url = "api/InformationRegistModel/Design/SaveModel";
                    var saveType = $scope.newModelMananer.newModel.id ? "modify" : "add";
                    //添加分类ID
                    $scope.newModelMananer.newModel.classId = $stateParams.classId;
                    $scope.newModelMananer.postData(url, $scope.newModelMananer.newModel, function (data) {
                        opacityAlert("保存成功!", "glyphicon glyphicon-ok-sign");
                    }, function (error) { });
                },
                publish: function () {
                    var url = "api/InformationRegistModel/Design/PublishModel";
                    //发布时如果没有分类则添加分类ID
                    if (!$scope.newModelMananer.newModel.classId) {
                        $scope.newModelMananer.newModel.classId = $stateParams.classId;
                    }
                    $scope.newModelMananer.postData(url, $scope.newModelMananer.newModel, function (data) {
                        opacityAlert("发布成功!", "glyphicon glyphicon-ok-sign");
                        $scope.coverScreenManager.close(true);
                    }, function (error) { });
                },
                forEachPages: function () {
                    var page = $scope.newModelMananer;
                    if (page.baseInfoManager.isInvalidModuleName && !page.propertyManager.isNotAllowNextStepper && !page.formManager.isNotAllowNextStepper) {
                        $scope.pagesValid.allPagesValided = true;
                    } else {
                        $scope.pagesValid.allPagesValided = false;
                    }
                },
                verifyWidthText: function (field) {
                    var reg = new RegExp("^[0-9]*$");
                    if (!reg.test(field.width)) {
                        field.width = field.width.replace(/[^\d]/g, "");
                    }
                },
                verifyBlur: function (field) {
                    if (field) {
                        field.width = 0;
                    }
                }
            },
            postData: function (url, clientModel, callBack, callErrorBack, ifModelList) {
                //检查数据
                //获取属性数据
                if (ifModelList === "OtherList") {
                    //要是来自模块列表的发布则不进行操作propertys清空操作
                } else {
                    clientModel.propertys = [];
                    angular.forEach($scope.attrListManager.attrList, function (i, v) {
                        var temp = { fieldCode: '', fieldName: '' };
                        temp.fieldCode = i.model.attrCode;
                        temp.fieldName = i.model.attrName;
                        clientModel.propertys.push(temp);
                    })
                }
                //处理结论相关
                for (var i = 0; i < clientModel.formConfig.fields.length;) {
                    if (clientModel.formConfig.fields[i].fieldCode.toLowerCase() === "conclusion") {
                        clientModel.formConfig.fields.splice(i, 1);
                    } else i++;
                }
                var serverModel = new IrmServerModelConfig(clientModel)
                lzMisptWebAPI.post(url, serverModel, "InformationRegistModel").then(function (data) {
                    if (data) {
                        callBack(data);
                    }
                    else {
                        callErrorBack(data);
                    }
                }, function (data) {
                    callErrorBack(data);
                    console.log(data);
                });
            }
        };

        //开发扩展配置管理
        $scope.extendConfigManager = {
            isAllowSavePublish: true,
            init: function () {
                angular.forEach(this.tabs, function (tab, k) {
                    tab.selected = false;
                });
                this.tabs[0].selected = true;
                this.toolbar.initDefaultBtn();
                this.toolbar.initNewBtn();
                this.toolbar.initTempBtn();
            },
            open: function (model) {
                var _this = this;
                callApiManager.loadModelById(model.id, function (data) {
                    _this.isAllowSavePublish = true;
                    $scope.newModelMananer.newModel = new IrmModelConfig(data);
                    $scope.newModelMananer.newModel.controlTypeToObj($scope.controlTypesObj);
                    _this.selectedTab = _this.tabs[0];
                    _this.init();
                    $scope.coverScreenManager.show("model-extend-config-tab");
                    isShowTableTheaderOffset("irm-extend-tab-table-tr-container", "irm-extend-tab-table-theader-offset", $scope.extendConfigManager.toolbar, "isShowCtmExtendTabTableTheaderOffset");
                });
            },
            tabs: [
                //下面加上page为了区分都是用toolbar的不用页面
                {
                    text: "登记页面工具条配置",
                    tpl: "model-extend-config-tab-toolbar",
                    page: "add",
                    selected: true
                },
                {
                    text: "编辑页面工具条配置",
                    tpl: "model-extend-config-tab-toolbar",
                    page: "detail",
                    selected: false
                },
                {
                    text: "列表页面工具条配置",
                    tpl: "model-extend-config-tab-toolbar",
                    page: "list",
                    selected: false
                },
                {
                    text: "扩展JS配置",
                    tpl: "model-extend-config-tab-extendJS",
                    page: "extendJS",
                    selected: false
                }
            ],
            selectedTab: null,
            tabClick: function (tab) {
                var _this = this;
                for (var i = 0; i < this.tabs.length; i++) {
                    this.tabs[i].selected = false;
                }
                var selectedPage = $scope.extendConfigManager.selectedTab.page;
                //更换页签之前先把当前页签的按钮属性保存;
                _this.toolbar.tempBtn[selectedPage] = null;
                _this.toolbar.tempBtn[selectedPage] = angular.copy(_this.toolbar.newBtn);
                tab.selected = true;
                this.selectedTab = tab;
                this.toolbar.initDefaultBtn();
            },
            toolbar: {
                isShowCtmExtendTabTableTheaderOffset: false,
                newBtn: null,
                tempBtn: {
                    add: null,
                    detail: null,
                    list: null,
                },
                pageExtendBtn: [],
                initDefaultBtn: function () {
                    var _this = this;
                    var selectedPage = $scope.extendConfigManager.selectedTab.page
                    switch (selectedPage) {
                        case "add":
                            $scope.extendConfigManager.toolbar.pageExtendBtn = [];//每次初始化一下,为了换标签页
                            $scope.extendConfigManager.toolbar.pageExtendBtn = $scope.newModelMananer.newModel.extendConfig.extendToolBar.add;
                            break;
                        case "detail":
                            $scope.extendConfigManager.toolbar.pageExtendBtn = [];//每次初始化一下,为了换标签页
                            $scope.extendConfigManager.toolbar.pageExtendBtn = $scope.newModelMananer.newModel.extendConfig.extendToolBar.detail;
                            break;
                        case "list":
                            $scope.extendConfigManager.toolbar.pageExtendBtn = [];//每次初始化一下,为了换标签页
                            $scope.extendConfigManager.toolbar.pageExtendBtn = $scope.newModelMananer.newModel.extendConfig.extendToolBar.list;
                            break
                        default:
                            break;
                    }
                    //如果选中的页签有临时按钮属性则赋值 没有则重新初始化
                    if (_this.tempBtn[selectedPage]) {
                        _this.newBtn = angular.extend({}, _this.tempBtn[selectedPage]);
                    } else {
                        _this.initNewBtn();
                    }
                },//设置默认的内置按钮
                initNewBtn: function () {
                    this.newBtn = {
                        model: {
                            btnCode: "",
                            btnName: "",
                            btnEvent: "",
                            isDefault: false,
                            isValid: false,
                            isSupportPC: false,
                            isSupportMobile: false
                        },
                        verification: {
                            saveError: true,
                            btnNameError: false,
                            btnEventError: false
                        }
                    };

                },
                initTempBtn: function () {
                    var _this = this;
                    _this.tempBtn.add = null;
                    _this.tempBtn.detail = null;
                    _this.tempBtn.list = null;
                },
                del: function (btn) {
                    var page = $scope.extendConfigManager.selectedTab.page;
                    lzMisptConfirmDailog($scope, $modal, "提示", "您确定要删除按钮【" + btn.btnName + "】吗？", function (result) {
                        if (result) {
                            $scope.newModelMananer.newModel.extendConfig.extendToolBar[page].splice($scope.newModelMananer.newModel.extendConfig.extendToolBar[page].indexOf(btn), 1);
                            isShowTableTheaderOffset("irm-extend-tab-table-tr-container", "irm-extend-tab-table-theader-offset", $scope.extendConfigManager.toolbar, "isShowCtmExtendTabTableTheaderOffset");
                        }
                    });
                },
                add: function () {
                    var page = $scope.extendConfigManager.selectedTab.page;
                    $scope.newModelMananer.newModel.extendConfig.extendToolBar[page].push(angular.extend({}, this.newBtn.model));
                    this.initNewBtn();
                    isShowTableTheaderOffset("irm-extend-tab-table-tr-container", "irm-extend-tab-table-theader-offset", $scope.extendConfigManager.toolbar, "isShowCtmExtendTabTableTheaderOffset");
                    setTimeout(function () {
                        var tempScrollYDiv = document.querySelector("#irm-extend-tab-table-tr-container").parentElement;
                        if (tempScrollYDiv) {
                            tempScrollYDiv.scrollTop = tempScrollYDiv.scrollHeight;
                        }
                    }, 0);
                },
                checkAllNotNull: function () {//全不为空返回true,
                    var retBool = false;
                    if (this.newBtn.model.btnName && this.newBtn.model.btnEvent && !this.newBtn.verification.btnNameError && !this.newBtn.verification.btnEventError) {
                        return true;
                    }
                    return retBool;
                },
                checkAllNull: function () {//全为空返回true
                    var retBool = false;
                    if ((!this.newBtn.model.btnName) && (!this.newBtn.model.btnEvent)) {
                        return true;
                    }
                    return retBool;
                },
                checkError: function () {
                    if (!this.newBtn.model.btnName) {
                        this.newBtn.verification.btnNameError = true;
                    }
                    if (!this.newBtn.model.btnEvent) {
                        this.newBtn.verification.btnEventError = true;
                    }
                },
                btnNameBlur: function (btn, e) {
                    if (!btn.btnName) {
                        btn.btnName = e.target.nextElementSibling.value;
                    }
                    else {
                        e.target.nextElementSibling.value = btn.btnName;
                    }
                },
                btnEventBlur: function (btn, e) {
                    if (!btn.btnEvent) {
                        btn.btnEvent = e.target.nextElementSibling.value;
                    }
                    else {
                        e.target.nextElementSibling.value = btn.btnEvent;
                    }
                },
                //添加按钮-名称改变
                btnNameChange: function () {
                    var page = $scope.extendConfigManager.selectedTab.page;
                    var notNullName = this.newBtn.model.btnName ? false : true;
                    //var tempArry = [], tempStr = "";
                    ////名称去重
                    //angular.forEach($scope.newModelMananer.newModel.extendConfig.extendToolBar[page], function (i, v) {
                    //    tempArry.push(i.btnName);
                    //})
                    //tempStr = tempArry.join(",") + "," + this.newBtn.model.btnName + ",";
                    //if (tempStr.replace(this.newBtn.model.btnName + ",").indexOf(this.newBtn.model.btnName + ",") > -1 || notNullName) {
                    //    this.newBtn.verification.btnNameError = true;
                    //} else {
                    //    this.newBtn.verification.btnNameError = false
                    //}
                    if (notNullName) {
                        this.newBtn.verification.btnNameError = true;
                    } else {
                        this.newBtn.verification.btnNameError = false
                    }
                    this.newBtn.verification.saveError = !this.checkAllNotNull();
                },
                //添加按钮-事件改变
                btnEventChange: function () {
                    var page = $scope.extendConfigManager.selectedTab.page;
                    var notNullEvent = this.newBtn.model.btnEvent ? false : true;
                    ////事件名去重
                    //var tempArry = [], tempStr = "";
                    //angular.forEach($scope.newModelMananer.newModel.extendConfig.extendToolBar[page], function (i, v) {
                    //    tempArry.push(i.btnEvent);
                    //})
                    //tempStr = tempArry.join(",") + "," + this.newBtn.model.btnEvent + ",";
                    //if (tempStr.replace(this.newBtn.model.btnEvent + ",").indexOf(this.newBtn.model.btnEvent + ",") > -1 || notNullEvent) {
                    //    this.newBtn.verification.btnEventError = true;
                    //} else {
                    //    this.newBtn.verification.btnEventError = false;
                    //}
                    if (notNullEvent) {
                        this.newBtn.verification.btnEventError = true;
                    } else {
                        this.newBtn.verification.btnEventError = false;
                    }
                    this.newBtn.verification.saveError = !this.checkAllNotNull();
                },
            },
            tabPage: {
                add: function () {
                    $scope.extendConfigManager.isAllowSavePublish = false;
                    var tempTab = new IrmTabConfig();
                    tempTab.tabCode = getGUID();
                    $scope.newModelMananer.newModel.extendConfig.tabs.push(tempTab);
                    setTimeout(function () {
                        var tempScrollYDiv = document.querySelector(".irm-ec-tab-tabpage .form-container");
                        if (tempScrollYDiv) {
                            tempScrollYDiv.scrollTop = tempScrollYDiv.scrollHeight;
                        }
                    }, 0);
                },
                tabNameChange: function (tab) {
                    $scope.extendConfigManager.isAllowSavePublish = true;
                    angular.forEach($scope.newModelMananer.newModel.extendConfig.tabs, function (item, k) {
                        if (!item.tabName) {
                            if (tab === item) {
                                item.hasError = true;
                            }
                            $scope.extendConfigManager.isAllowSavePublish = false;
                        }
                        else {
                            item.hasError = false;
                        }
                    });
                },
                del: function (tab) {
                    var _this = this;
                    lzMisptConfirmDailog($scope, $modal, "提示", "您确定要删除该标签页吗？", function (result) {
                        if (result) {
                            $scope.newModelMananer.newModel.extendConfig.tabs.splice($scope.newModelMananer.newModel.extendConfig.tabs.indexOf(tab), 1);
                            _this.tabNameChange();
                            if (!$filter("filter")($scope.newModelMananer.newModel.extendConfig.tabs, { isSelected: true }, true)[0]) {
                                $filter("filter")($scope.newModelMananer.newModel.extendConfig.tabs, { tabCode: "Detail" }, true)[0].isSelected = true;
                            }
                        }
                    });
                },
                handleDefaultSelect: function (tab, e) {
                    if (tab.isSelected) {
                        for (var i = 0; i < $scope.newModelMananer.newModel.extendConfig.tabs.length; i++) {
                            $scope.newModelMananer.newModel.extendConfig.tabs[i].isSelected = false;
                        }
                    }
                    tab.isSelected = true;
                },
                isFileTab: function (tab) {
                    var tempField = $filter("filter")($scope.newModelMananer.newModel.formConfig.fields, { fieldCode: tab.tabCode }, true)[0];
                    if (tempField && ((tempField.controlType instanceof Object && tempField.controlType.code === "fileDirective") || tempField.controlType === "fileDirective")) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            preSaveOrPublish: function () {
                var _this = this;
                //处理工具条逻辑
                this.toolbar.checkError();
                if (!(this.toolbar.checkAllNull() || this.toolbar.checkAllNotNull())) {
                    return false;
                };
                if (this.toolbar.checkAllNotNull()) {
                    $scope.newModelMananer.newModel.extendConfig.extendToolBar[_this.selectedTab.page].push(angular.extend({}, this.toolbar.newBtn.model));
                    isShowTableTheaderOffset("irm-extend-tab-table-tr-container", "irm-extend-tab-table-theader-offset", $scope.extendConfigManager.toolbar, "isShowCtmExtendTabTableTheaderOffset");
                }
                this.toolbar.initNewBtn();
                //处理标签页逻辑
                var tempTabNames = [];
                angular.forEach($scope.newModelMananer.newModel.extendConfig.tabs, function (item, k) {
                    tempTabNames.push("【" + item.tabName + "】");
                });
                tempTabNames = arrayGetRepeatItems(tempTabNames);
                if (tempTabNames.length > 0) {
                    var tempLast = tempTabNames.pop();
                    var tempMsg = "页签名称不能重复，重复的名称为";
                    if (tempTabNames.length) {
                        tempMsg += tempTabNames.join("、") + "和";
                    }
                    tempMsg += tempLast + "！";
                    lzMisptAlertDailog($scope, $modal, "提示", tempMsg);
                    return false;
                }
                return true;
            },
            save: function () {
                if (!this.preSaveOrPublish()) {
                    return false;
                }
                var url = "api/InformationRegistModel/Design/SaveModel";
                $scope.newModelMananer.postData(url, $scope.newModelMananer.newModel, function (data) {
                    $scope.newModelMananer.newModel = new IrmModelConfig(data);
                    $scope.newModelMananer.newModel.controlTypeToObj($scope.controlTypesObj);
                    $scope.extendConfigManager.tabClick($scope.extendConfigManager.selectedTab);
                    opacityAlert("保存成功!", "glyphicon glyphicon-ok-sign");
                }, function (error) { }, "OtherList");
            },
            publish: function () {
                if (!this.preSaveOrPublish()) {
                    return false;
                }
                var url = "api/InformationRegistModel/Design/PublishModel";
                $scope.newModelMananer.postData(url, $scope.newModelMananer.newModel, function (data) {
                    opacityAlert("发布成功!", "glyphicon glyphicon-ok-sign");
                    $scope.coverScreenManager.close(true);
                }, function (error) { }, "OtherList");
            }
        }

        //下拉过滤(暂时不用了) 
        $scope.toolsBar = {
            filterManager: {
                //1>> 初始化过滤类型
                initData: [
                    { filterCode: "none", filterValue: "过滤", placeholder: "", classValue: "", inputType: "", inputValue: "" },
                    { filterCode: "1", filterValue: "模块名称", placeholder: "请输入模块名称", classValue: "", inputType: "text", inputValue: "" },
                    { filterCode: "2", filterValue: "模块描述", placeholder: "请输入模块描述", classValue: "", inputType: "text", inputValue: "" },
                    { filterCode: "3", filterValue: "状态", placeholder: "请输入状态", classValue: "", inputType: "text", inputValue: "" },
                ],
                //2>>过滤类型点击事件
                filterItemClick: function (item) {
                    //首先清空 查询条件的值
                    angular.forEach($scope.toolsBar.filterManager.initData, function (item, k) {
                        item.inputValue = "";
                    });
                    $scope.toolsBar.filterManager.selectFilterItem = item;
                    $scope.searchOrderParams.filterItem = item;
                    switch (item.filterCode) {
                        case "none": {
                            //重新加载数据
                            $scope.modelListManager.load();
                            //searchData();
                            break;
                        }
                    }

                },

                //3 按回车相应查询事件
                searchByKeyup: function (e) {
                    var value = jQuery.trim(e.target.value);
                    var _this = this;
                    var keycode = e.keyCode || e.which;
                    if (keycode == 13) {
                        _this.searchData();
                    }
                },

                //4>> 查询按钮事件
                searchByBtnClick: function (e) {
                    //searchData();
                    var _this = this;
                    _this.searchData();

                },
                selectFilterItem: { filterCode: "none", filterValue: "过滤", placeholder: "", classValue: "", inputType: "", inputValue: "" },
                searchData: function () {
                    var modelName = $scope.toolsBar.filterManager.selectFilterItem.inputValue;
                    //如果查询条件为空时就刷新
                    if (!modelName) {
                        $scope.toolsBar.refreshManager.refreshClick();
                        return;
                    }
                    //查询实体
                    var serviceSearchModel = {
                        SelectFields: null,//null为返回所有字段
                        WhereCondition: [{
                            FieldCondition: [
                                {
                                    Name: "ClassId",
                                    QueryType: 20,//10是like
                                    Value: $scope.classId,
                                    DataType: 10,//10是字符串
                                    IsAnd2PreField: true
                                },
                                {
                                    Name: "Name",
                                    QueryType: 10,//10是like
                                    Value: modelName,
                                    DataType: 10,//10是字符串
                                    IsAnd2PreField: true
                                }],
                            IsAnd2PreGroup: true
                        }],
                        OrderSetting: [{
                            Name: "AddTime",
                            IsASC: false
                        }],
                        //StartIndex: ($scope.loadOper.nowPage - 1) * 20,
                        //Limit: ($scope.loadOper.nowPage - 1) * 20 + 20,
                    }
                    lzMisptWebAPI.post("api/InformationRegistModel/Design/GetDesignDataListByQuery/" + $scope.classId, serviceSearchModel, "InformationRegistModel").then(function (data) {
                        if (data && data.length) {
                            $scope.modelListManager.server2ViewModel(data);
                        } else {
                            $scope.modelListManager.models = [];
                        }
                    }, function (error1, error2, error3, error4) {
                    });
                }
            },
            //刷新管理
            refreshManager: {
                //1>> 刷新按钮事件
                refreshClick: function () {
                    //初始化被选中的过滤条件
                    $scope.searchEventManager.searchInit()
                    //重新请求数据
                    //$scope.modelListManager.load();
                    $scope.modelListManager.loadControls();
                }
            },
        }

        //查询过滤参数对象
        $scope.searchOrderParams = {
            //选中的任务状态项
            taskTypeItem: null,
            //选中的排序项
            sortItem: null,
            //选中的过滤项
            filterItem: null
        }

        //查询事件管理
        $scope.searchEventManager = {
            searchInit: function () {
                //$scope.toolsBar.filterManager.selectFilterItem = $scope.toolsBar.filterManager.initData[0];
                $scope.toolsBar.filterManager.selectFilterItem.inputValue = "";
            },
            //后面的不用了
            searchData: function () {
                //TODO 根据选中selectFilterItem的请求API返回数据
            }
        }

        //属性列表
        $scope.attrListManager = {
            newAttr: {
                model: {
                    attrCode: '',
                    attrName: ""
                },
                valid: {
                    attrIsHas: false,
                    attrNoName: false,
                    hasFocus: false,
                    verification: false
                }
            },
            attrList: [],
            attrListValid: false,
            attrValid: function (attrItem) {
                var _this = this;

                //属性名非空验证
                if (!attrItem.model.attrName) {
                    attrItem.valid.attrNoName = true;
                    $scope.attrListValid = false;
                } else {
                    attrItem.valid.attrNoName = false;
                    $scope.attrListValid = true;
                }
                //属性名不为空的时候验证属性名重复
                if (!attrItem.valid.attrNoName) {
                    //属性名重复验证
                    var nameArry = [];
                    angular.forEach($scope.attrListManager.attrList, function (i, v) {
                        nameArry.push(i.model.attrName);
                    })
                    //按照数组查询.要是字符串A和AA是重复的
                    nameArry.splice(nameArry.indexOf(attrItem.model.attrName), 1);
                    if (nameArry.indexOf(attrItem.model.attrName) > -1) {
                        attrItem.valid.attrIsHas = true;
                        $scope.attrListValid = false;
                    } else {
                        attrItem.valid.attrIsHas = false;
                        $scope.attrListValid = true;
                    }
                }

                //红色框的提示
                if (attrItem.valid.attrNoName || attrItem.valid.attrIsHas) {
                    _this.attrListValid = true;
                    attrItem.valid.verification = true;
                    $scope.stepperManager.steppers[2].isAllow = false;
                } else {
                    attrItem.valid.verification = false;
                    _this.attrListValid = false;
                    $scope.stepperManager.steppers[2].isAllow = true;
                }
                //如果通过了验证则给后面登记单使用的该属性改名
                if ($scope.attrListValid) {
                    if ($filter("filter")($scope.newModelMananer.newModel.formConfig.fields, { fieldCode: attrItem.model.attrCode }, true)[0]) {
                        $filter("filter")($scope.newModelMananer.newModel.formConfig.fields, { fieldCode: attrItem.model.attrCode }, true)[0].fieldName = attrItem.model.attrName
                    }
                }
            },
            //获得属性页面的
            getAttrPageData: function () {
                var _this = this;
                _this.attrList = [];
                angular.forEach($scope.newModelMananer.newModel.propertys, function (i, v) {
                    var temp = angular.copy(_this.newAttr);
                    temp.model.attrCode = i.fieldCode;
                    temp.model.attrName = i.fieldName;
                    _this.attrList.push(temp);
                })
            }
        }

        //排序相关
        $scope.sortableOptions = {
            handle: ".irm-attrList-drag"
        };
    });


    var lzMisptSelectBoxDailog = function ($scope, $modal, title, items, callback) {
        $scope.lzSelectBoxDailog = {
            selectdItem: {}
        }
        $scope.lzSelectBoxDailogTitle = (title && title != "") ? title : "";
        $scope.lzSelectBoxDailogdData = { items: items }
        $scope.selectHandler = function (item) {
            $scope.lzSelectBoxDailog.selectdItem = item;
        };
        $scope.lzSelectBoxDailogBtnClick = function (result) {
            var isClose = true;
            if (result && typeof (callback) === "function") {
                isClose = callback($scope.lzSelectBoxDailog.selectdItem, selectBoxDailog);
            }
            if (isClose !== false) {
                selectBoxDailog.hide();
            }

        }
        var selectBoxDailog = $modal({
            scope: $scope,
            animation: "am-fade-and-scale",
            placement: "center",
            templateUrl: "/BasePlus/InformationRegistModelDesign/PC/View/Template/IRM_SeleteBoxDailog.html",
            show: false,
            backdrop: "static",
        });
        selectBoxDailog.$promise.then(selectBoxDailog.show);
    }
})(angular, app);