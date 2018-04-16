"use strict";
; (function () {
    app.register.controller("InformationRegistModel_UserField_Container", function ($scope, $state, $stateParams, $modal, $location, $filter, $injector, taskModal, lzMisptRouter, lzMisptWebAPI) {
        //被选中的中的模块
        var selectedModule = $scope.appModuleManager.selectedModule;
        if (!selectedModule) {
            return;
        }
        //获取GUID
        var getGUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16).toUpperCase();
            });
        }
        //初始化要保存的用户扩展信息
        var initModel = {
            businessModuleId: selectedModule.businessguid,
            sceneCode: selectedModule.appcode,
            sceneOrgId: app.session.user.selectorg.oid,
            formConfig: {
                fields: [],
            },
        };
        //用户扩展初始化模块
        var userExtendModule = {
            businessModuleId: selectedModule.businessguid,
            sceneCode: $scope.SceneCode,
            sceneOrgId: app.session.user.selectorg.oid,
            formConfig: {
                fields: [],
            },
        }
        //编辑用的多行文本框
        var lzTextBoxDailog = function ($scope, $modal, title, textOrTextarea, initValue, placeholder, callback) {
            $scope.lzTextBoxDailogTitle = (title && title != "") ? title : "";
            $scope.lzTextBoxDailogText = { value: initValue, type: textOrTextarea, placeholder: placeholder }
            $scope.lzTextBoxDailogBtnClick = function (result) {
                if (result && typeof (callback) === "function") {
                    callback($scope.lzTextBoxDailogText.value);
                }
                textBoxDailog.hide();
            }
            var textBoxDailog = $modal({ scope: $scope, animation: "am-fade-and-scale", placement: "center", templateUrl: "/BasePlus/InformationRegistModel/PC/View/UserField/Containers/UserFieldTextAreaDialo.html", show: false, backdrop: "static" });
            textBoxDailog.$promise.then(textBoxDailog.show);
        }
        //实例化配置对象
        var configManager = new ConfigManager1();//为了把首字母转化为小写而初始化js
        configManager.initirm();//初始化
        //控件列表字典--内置属性
        $scope.controlTypesObj = {};
        $scope.controlTypesList = [];
        //控件列表字段--自定义属性
        $scope.userControlTypesObj = {};
        $scope.userControlTypesList = [];
        //自定义属性需要的控件
        $scope.userExtendNeedControl = ["text", "textarea", "radiolist", "dropdownlist", "date"];
        //内置属性的折叠状态
        $scope.inlineattrActive = false;
        //自定义属性的折叠状态
        $scope.customerattrActive = true;
        //折叠控制
        $scope.active = {
            inlineattr: function () {
                $scope.inlineattrActive = !$scope.inlineattrActive;
            },
            customerattr: function () {
                $scope.customerattrActive = !$scope.customerattrActive;
            }
        }
        //遮罩
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
                    //$scope.modelListManager.load();
                }
            }
        }
        //内置属性相关操作
        $scope.oldModuleManager = {
            initConttolType: {
                code: "",//控件编码（唯一），例如：text
                text: "", //控件名称，例如：单行文本框
                width: 2, //如果该控件可以显示在列表中，所占列宽
                tpl: "", //控件ng-template模板的ID
                config: {}, //控件配置类，例如：CtmControlConfigText
                isFieldOrTab: false, //是否既现在在表中又可以现在标签页（详情页中）中，例如：文件
                isPersonnel: false, //是否是人员指令
                isShowList: false, //是否允许显示在列表上
                isSupportSort: false, //如果该控件可以显示在列表中，是否支持排序
                isSupportSearch: false, //如果该控件可以显示在列表中，是否支持过滤
            },
            newModule: null,
            server2ViewModel: function (serverModel) {
                var _this = this;
                _this.newModule = null;
                //var temp = new IrmModelConfig(serverModel);
                //temp.controlTypeToObj($scope.controlTypesObj);
                var temp = new ModelEntity1(serverModel);
                angular.forEach(temp.formConfig.fields, function (i, v) {
                    i.controlType = $scope.controlTypesObj[i.controlType];
                })
                _this.newModule = temp;
            },
            open: function (module) {
                var _this = this;
                _this.server2ViewModel(module);
                if (this.newModule.formConfig) {
                    if (this.newModule.formConfig.fields) {
                        var _this = this;
                        //angular.forEach(this.newModule.formConfig.fields, function (item, k) {
                        //    item.controlType = $filter("filter")($scope.controlTypesList, { code: item.controlType }, true)[0];
                        //    if (item.fieldCode === "Conclusion") {
                        //        _this.newModule.formConfig.fields.splice(k, 1);
                        //    }
                        //});
                        for (var i = 0; i < _this.newModule.formConfig.fields.length;) {
                            if (_this.newModule.formConfig.fields[i].fieldCode.toLowerCase() === "conclusion") {
                                _this.newModule.formConfig.fields.splice(i, 1);
                            } else i++;
                        }
                    }
                }
                $scope.coverScreenManager.show("stepper-nav-tpl");
            },
            load: function (selectedModule) {
                var apiUrl = "api/" + $scope.selectedApp.appCode + "/Control/GetAllList";
                this.loadControlList(selectedModule, apiUrl);
            },
            loadControlList: function (selectedModule, apiUrl) {
                var that = this;
                lzMisptWebAPI.get(apiUrl, $scope.selectedApp.appCode).then(function (controlData) {
                    //控制用户可用的控件/用户控件/用户自定义控件
                    angular.forEach(controlData, function (item, v) {
                        //var tempControlType = new IrmControlType(item);
                        var tempControlType = angular.copy($scope.oldModuleManager.initConttolType);
                        tempControlType.text = item.Name;
                        tempControlType.code = item.Code;
                        tempControlType.isPersonnel = item.ControlType == "2";
                        $scope.controlTypesObj[item.Code] = tempControlType;
                        $scope.controlTypesList.push(tempControlType);
                        //用户所使用的控件
                        if ($scope.userExtendNeedControl.indexOf(item.Code) > -1) {
                            //防止引用类型错误
                            var tempUserControlType = angular.copy(tempControlType);
                            $scope.userControlTypesObj[item.Code] = tempUserControlType;
                            $scope.userControlTypesList.push(tempUserControlType);
                        }
                        //Todo 暂时不用了
                        //if (item.DesignJS) {
                        //    require(item.DesignJS.split(","), function (obj) {
                        //        if (obj.initControlLogic && typeof (obj.initControlLogic) == "function") {
                        //            $scope[item.Code] = obj.initControlLogic(app, $scope, $injector);
                        //        }
                        //        obj.initControlConfig(app, $scope, $injector, tempControlType);
                        //    });
                        //}
                    });
                    //加载完成之后要把用户扩展字段的tpl换成需要的.
                    that.loadAttr(selectedModule)
                }, function () { })
            },
            loadAttr: function (selectedModule) {
                lzMisptWebAPI.get("api/Runtime/ModelInfo/NoUserField/" + selectedModule.appcode + "/" + selectedModule.businessguid + "/" + selectedModule.appcode, $scope.selectedApp.appCode).then(function (moduleData) {
                    if (moduleData) {
                        moduleData = JSON.parse(moduleData);
                        if (moduleData.FormConfig) {
                            angular.forEach(moduleData.FormConfig.Fields, function (fieldItem, k) {
                                fieldItem.ControlConfig = JSON.parse(fieldItem.ControlConfig);
                                //fieldItem.ControlConfig = eval("(" + fieldItem.ControlConfig + ")");
                            });
                        }
                        //moduleData = configManager.firstCharToLowerCaseForAll(moduleData)
                        //处理一下。config属性。否则会在后面报错
                        angular.forEach(moduleData.FormConfig.Fields, function (i, v) {
                            var temp = JSON.stringify(i.ControlConfig);
                            i.ControlConfig = temp;
                        })
                        $scope.oldModuleManager.open(moduleData);
                        //获取用户扩展配置
                        lzMisptWebAPI.get("api/Runtime/UserField/GatData/" + selectedModule.businessguid + "/" + $scope.SceneCode + "/" + app.session.user.selectorg.oid, $scope.selectedApp.appCode).then(function (userData) {
                            if (userData) {
                                if (userData.FormConfig) {
                                    if (userData.FormConfig.Fields) {
                                        angular.forEach(userData.FormConfig.Fields, function (fieldItem, k) {
                                            fieldItem.ControlConfig = JSON.parse(fieldItem.ControlConfig);
                                            //fieldItem.ControlConfig = eval("(" + fieldItem.ControlConfig + ")");
                                        });
                                    }
                                }
                                $scope.coverScreenManager.close(true);
                            } else {
                                console.log("该场景跟模块下没有用户扩展配置,新建一个用户扩展配置")
                            }
                            $scope.newModelMananer.open(userData)
                        })
                    }
                })
            },
            formManager: {
                isNotAllowNextStepper: false,
                //默认数据
                fieldConfing: {
                    text: function () {
                        return new Object({
                            IsRequired: false,
                            IsReadOnly: false,
                            Length: 0
                        })
                    },
                    textarea: function () {
                        return this.text();
                    },
                    radiolist: function () {
                        return new Object({
                            IsCustomized: false,
                            Options: []
                        });
                    },
                    dropdownlist: function () {
                        return this.radiolist();
                    },
                    fileDirective: function () {
                        return new Object({
                            Folders: [],
                            IsShowTab: true
                        });
                    },
                    date: function () {
                        return new Object({
                            IsRequired: false,
                            IsReadOnly: false,
                            DateType: "yyyy年MM月dd日"
                        });
                    },
                },
                //添加属性下拉框中的内容
                fieldTypes: [
                    { code: "text", type: "单行文本框", width: 2, tpl: "field-item-textOrTextarea-old" },
                    { code: "textarea", type: "多行文本框", width: 2, tpl: "field-item-textOrTextarea-old" },
                    { code: "projectName", type: "项目", width: 2, tpl: "field-item-default-old" },
                    { code: "radiolist", type: "单选框", width: 2, tpl: "field-item-radiolistOrSelect-old" },
                    { code: "dropdownlist", type: "下拉框", width: 2, tpl: "field-item-radiolistOrSelect-old" },
                    { code: "fileDirective", type: "文件", tpl: "field-item-filedirective-old" },
                    { code: "date", type: "日期", width: 2, tpl: "field-item-date-old" },
                    { code: "picture", type: "图片", tpl: "field-item-default-old" },
                    { code: "organizationPersonnel", type: "组织机构人员选择", tpl: "field-item-default-old" },
                    { code: "projectTeamPersonnel", type: "项目团队人员选择", tpl: "field-item-default-old" },
                    { code: "projectInnerTeamPersonnel", type: "项目内部团队人员选择", tpl: "field-item-default-old" },
                    { code: "principal", type: "负责人", width: 2, tpl: "field-item-default-old" },
                    { code: "recording", type: "录音", tpl: "field-item-default-old" },
                ],
                //判断
                forEachFields: function () {
                    this.isNotAllowNextStepper = false;
                    var _this = this;
                    angular.forEach($scope.newModuleManager.newModule.formConfig.fields, function (fieldItem, k) {
                        if (!fieldItem.fieldName) {
                            _this.isNotAllowNextStepper = true;

                        }
                    });
                },
                //指定的属性（字段）的控件类型 发生改变
                fieldTypeSelectChanged: function (fieldItem) {
                    var tempHiddenFieldTypeCode = document.getElementById("hidTempCode-" + fieldItem.fieldCode).value;

                    if ($scope.controlTypesObj[fieldItem.controlType.code]) {
                        fieldItem.controlConfig = angular.copy($scope.controlTypesObj[fieldItem.controlType.code].config);
                    }
                    else {
                        fieldItem.controlConfig = {};
                    }
                },
                //下拉框/单选框—相关操作
                radiolistOrSelectManager: {
                    add: function (fieldItem) {
                        var tempText = fieldItem.tempClientView.radioOrSelect.text.trim();
                        if (!tempText) {
                            opacityAlert("选项不能为空!!", "glyphicon glyphicon-exclamation-sign");
                            return false;
                        }
                        if (fieldItem.controlConfig.Options.indexOf(tempText) < 0) {
                            fieldItem.controlConfig.Options.push(tempText);
                        }
                        else {
                            opacityAlert("您已添加该选项!!", "glyphicon glyphicon-exclamation-sign");
                        }
                        fieldItem.tempClientView.radioOrSelect.text = "";
                    },
                    edit: function (fieldItem) {
                        var tempOptions = fieldItem.controlConfig.Options.join("\n");
                        lzTextBoxDailog($scope, $modal, "编辑选项", "textarea", tempOptions, "此处可输入多个选项，一行即为一项，以回车分隔", function (tempValue) {
                            fieldItem.controlConfig.Options = [];
                            if (tempValue.trim()) {
                                var tempArray = tempValue.trim().replace(/\n\n*/g, '\n').split("\n");
                                for (var i = 0; i < tempArray.length; i++) {
                                    if (fieldItem.controlConfig.Options.indexOf(tempArray[i]) < 0) {
                                        fieldItem.controlConfig.Options.push(tempArray[i]);
                                    }
                                }
                            }
                        });
                    }
                },
                fileDirectiveManager: {
                    showAdd: function (fieldItem) {
                        fieldItem.tempClientView.fileDirective.isShowAdd = true;
                    },
                    save: function (fieldItem) {
                        if (!$filter("filter")(fieldItem.controlConfig.Folders, { name: fieldItem.tempClientView.fileDirective.folderName }, true)[0]) {
                            fieldItem.controlConfig.Folders.push({
                                Name: fieldItem.tempClientView.fileDirective.folderName,
                                Children: [],
                                Resourcemodels: []
                            });
                            this.cancel(fieldItem);
                        }
                    },
                    del: function (folder, fieldItem) {
                        fieldItem.controlConfig.Folders.splice(fieldItem.controlConfig.Folders.indexOf(folder), 1);
                    },
                    cancel: function (fieldItem) {
                        fieldItem.tempClientView.fileDirective.isShowAdd = false;
                        fieldItem.tempClientView.fileDirective.folderName = "";
                    }
                },
            },
            baseInfoManager: {
                isInvalidModuleName: false,
            },

        }
        //用户自定义属性转化为服务端的对象
        var convertModelManager = {
            view2ServerModel: function (viewModel) {
                var temp = {
                    Id: viewModel.id,
                    BusinessModuleId: viewModel.businessModuleId,
                    SceneCode: viewModel.sceneCode,
                    SceneOrgId: viewModel.sceneOrgId,
                    FormConfig: {
                        Fields: []
                    },
                };
                if (viewModel.formConfig) {
                    if (viewModel.formConfig.fields) {
                        angular.forEach(viewModel.formConfig.fields, function (item, k) {
                            temp.FormConfig.Fields.push({
                                FieldCode: item.fieldCode,
                                FieldName: item.fieldName,
                                ControlType: item.controlType.code,
                                ControlConfig: JSON.stringify(item.controlConfig),
                            });
                        });
                    }
                }
                return temp;
            }
        };
        //自定义属性
        $scope.newModelMananer = {
            newModel: null,
            canNotSave: false,//保存按钮状态
            open: function (model) {
                model = configManager.firstCharToLowerCaseForAll(model)//将数据库获取的数据的首字母转化成小写
                this.newModel = model ? angular.copy(model) : angular.copy(userExtendModule);
                if (this.newModel.formConfig) {
                    if (this.newModel.formConfig.fields) {
                        var _this = this;
                        angular.forEach(this.newModel.formConfig.fields, function (item, k) {
                            item.controlType = $filter("filter")($scope.userControlTypesList, { code: item.controlType }, true)[0];
                            item.isSelectDisable = true;
                        });
                    }
                } else {
                    this.newModel.formConfig = { fields: [] };
                }
                //更换用户扩展配置需要的tpl
                angular.forEach($scope.userControlTypesList, function (i, v) {
                    i.tpl = $scope.newModelMananer.formManager.fieldTypes[i.code];
                })
                $scope.coverScreenManager.show("stepper-nav-tpl");
            },
            formManager: {
                //默认数据
                fieldConfing: {
                    text: function () {
                        return new Object({
                            isRequired: false,
                        })
                    },
                    textarea: function () {
                        return this.text();
                    },
                    radiolist: function () {
                        return new Object({
                            options: []
                        });
                    },
                    dropdownlist: function () {
                        return this.radiolist();
                    },
                    date: function () {
                        return new Object({
                            isRequired: false,
                            isReadOnly: false,
                            dateType: "yyyy年MM月dd日"
                        });
                    },
                },
                //用到的下拉框中的选项
                fieldTypes: {
                    //{ code: "text", type: "单行文本框", width: 2, tpl: "field-item-textOrTextarea" },
                    //{ code: "textarea", type: "多行文本框", width: 2, tpl: "field-item-textOrTextarea" },
                    //{ code: "radiolist", type: "单选框", width: 2, tpl: "field-item-radiolistOrSelect" },
                    //{ code: "dropdownlist", type: "下拉框", width: 2, tpl: "field-item-radiolistOrSelect" },
                    //{ code: "date", type: "日期", width: 2, tpl: "field-item-date" },
                    text: "field-item-textOrTextarea",
                    textarea: "field-item-textOrTextarea",
                    radiolist: "field-item-radiolistOrSelect",
                    dropdownlist: "field-item-radiolistOrSelect",
                    date: "field-item-date"
                },
                //添加一个属性（字段）
                addField: function () {
                    $scope.newModelMananer.canNotSave = true;
                    $scope.customerattrActive = true;
                    //var tempFieldType = this.fieldTypes[0];
                    var tempFieldType = $scope.userControlTypesList[0];
                    var temp = {
                        fieldCode: getGUID(),
                        fieldName: "",
                        controlType: tempFieldType,
                        controlConfig: {},
                        isSelectDisable: false
                    }
                    if (this.fieldConfing[tempFieldType.code]) {
                        temp.controlConfig = this.fieldConfing[tempFieldType.code]();
                    }
                    temp = configManager.firstCharToLowerCaseForAll(temp)
                    $scope.newModelMananer.newModel.formConfig.fields.push(temp);
                    setTimeout(function () {
                        var tempScrollYDiv = document.querySelector("#mispt-ufl-customattr");//document.querySelector("div[name='customaFields'] #mispt-ufl-customattr-container>div");
                        if (tempScrollYDiv) {
                            tempScrollYDiv.scrollTop = tempScrollYDiv.scrollHeight;
                        }
                    }, 0);
                },
                //添加一个属性
                delField: function (item) {
                    var _this = this;
                    lzConfirmDailog($scope, $modal, "提示", "您确定要删除该属性吗？", function (result) {
                        if (result) {
                            $scope.newModelMananer.newModel.formConfig.fields.splice($scope.newModelMananer.newModel.formConfig.fields.indexOf(item), 1);
                            //$scope.newModelMananer.listManager.save();
                            //$scope.newModelMananer.canNotSave = false;
                            if ($scope.newModelMananer.newModel.formConfig.fields.length <= 0) {
                                $scope.newModelMananer.canNotSave = false
                                return;
                            }
                            var breakout = false;
                            angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (item, k) {
                                if (!breakout) {
                                    if (!item.fieldName) {
                                        $scope.newModelMananer.canNotSave = true;
                                        breakout = true;
                                    } else {
                                        $scope.newModelMananer.canNotSave = false;
                                    }
                                }
                            });
                        }
                    });
                },
                //属性名称change事件
                fieldTextChanged: function (fieldItem) {
                    if (fieldItem.fieldName) {
                        $scope.newModelMananer.canNotSave = false;
                        angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (item, k) {
                            if (!item.fieldName) {
                                $scope.newModelMananer.canNotSave = true
                            }
                        });
                    } else {
                        $scope.newModelMananer.canNotSave = true;
                    }
                },
                //指定的属性（字段）的控件类型 发生改变
                fieldTypeSelectChanged: function (fieldItem) {
                    var tempHiddenFieldTypeCode = document.getElementById("hidTempCode-" + fieldItem.fieldCode).value;
                    if (this.fieldConfing[fieldItem.controlType.code]) {
                        fieldItem.controlConfig = this.fieldConfing[fieldItem.controlType.code]();
                        if (fieldItem.controlType.code == "radiolist" || fieldItem.controlType.code == "dropdownlist") {
                            fieldItem.tempClientView = { radioOrSelect: { text: "" } };
                        }
                    }
                    else {
                        fieldItem.controlConfig = {};
                    }
                },
                //下拉框/单选框—相关操作-用户扩展
                radiolistOrSelectManager: {
                    add: function (fieldItem) {
                        if (!fieldItem.tempClientView.radioOrSelect.text) {
                            opacityAlert("选项不能为空!", "glyphicon glyphicon-exclamation-sign");
                            return false;
                        }
                        fieldItem = configManager.firstCharToLowerCaseForAll(fieldItem);
                        var tempText = fieldItem.tempClientView.radioOrSelect.text.trim();
                        if (fieldItem.controlConfig.options.indexOf(tempText) < 0) {
                            fieldItem.controlConfig.options.push(tempText);
                        }
                        else {
                            opacityAlert("您已添加该选项!", "glyphicon glyphicon-exclamation-sign");
                        }
                        fieldItem.tempClientView.radioOrSelect.text = "";
                    },
                    edit: function (fieldItem) {
                        fieldItem = configManager.firstCharToLowerCaseForAll(fieldItem);
                        var tempOptions = fieldItem.controlConfig.options.join("\n");
                        lzTextBoxDailog($scope, $modal, "编辑选项", "textarea", tempOptions, "此处可输入多个选项，一行即为一项，以回车分隔", function (tempValue) {
                            fieldItem.controlConfig.options = [];
                            if (tempValue.trim()) {
                                var tempArray = tempValue.trim().replace(/\n\n*/g, '\n').split("\n");
                                for (var i = 0; i < tempArray.length; i++) {
                                    if (fieldItem.controlConfig.options.indexOf(tempArray[i]) < 0) {
                                        fieldItem.controlConfig.options.push(tempArray[i]);
                                    }
                                }
                            }
                        });
                    }
                },
            },
            listManager: {
                save: function () {
                    var url = "api/Runtime/UserField/SaveModel";
                    $scope.newModelMananer.postData(url, $scope.newModelMananer.newModel, function (data, $scope) {
                        $scope.newModelMananer.newModel.id = data.Id;
                        angular.forEach($scope.newModelMananer.newModel.formConfig.fields, function (item, i) {
                            item.isSelectDisable = true;
                        });
                        opacityAlert("保存成功!", "glyphicon glyphicon-ok-sign");
                    }, function (error) { }, $scope);
                },
            },
            postData: function (url, clientModel, callBack, callErrorBack, $scope) {
                //处理结论相关
                angular.forEach(clientModel.formConfig.fields, function (item, k) {
                    if (item.fieldCode === "Conclusion") {
                        clientModel.formConfig.fields.splice(k, 1);
                    }
                });
                var postModel = convertModelManager.view2ServerModel(clientModel);
                lzMisptWebAPI.post(url, postModel, $scope.selectedApp.appCode).then(function (data) {
                    if (data) {
                        callBack(data, $scope);
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
        $scope.oldModuleManager.load(selectedModule);
    });
})();