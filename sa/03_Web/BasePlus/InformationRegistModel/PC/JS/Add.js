"use strict"
; (function () {
    app.register.controller("InformationRegistModel_Add", function ($scope, $q, $filter, lzMisptWebAPI, lzMisptSearchScope, misptModal, lzMisptUploadService, $injector) {
        //详情页表单修改事件

        var configManager = new ConfigManager1();
        $scope.baseconfig = $scope.runtimeContext;
        $scope.InformationRegistModelManagerScope = 'InformationRegistModelscope';
        $scope.appCode = $scope.baseconfig.moduleInfo.appCode;

        $scope.sceneAppCode = $scope.baseconfig.sceneInfo.sceneAppCode;
        $scope.sceneOrganizationId = $scope.baseconfig.sceneInfo.sceneOrganizationId
        //增加项目名称
        $scope.projectName = $scope.baseconfig.sceneInfo.sceneName;
        $scope.businessModuleId = $scope.baseconfig.moduleInfo.businessModuleId;
        $scope.sceneCode = $scope.baseconfig.sceneInfo.sceneCode;
        $scope.postModal = {
            "AppCode": $scope.appCode,
            "SceneCode": $scope.sceneCode,
            "CreateUserFaceId": $scope.user.face,
            "Members": [
            ],
        }
        //项目团队选人
        $scope.userManager = {
            selectedUsers: [],
            relateid: [],
            getPersonHave: function () {
                var args = [];
                for (var i = $scope.userManager.selectedUsers.length - 1; i >= 0; i--) {
                    args.push({
                        uid: $scope.userManager.selectedUsers[i].uid,
                        face: $scope.userManager.selectedUsers[i].face,
                        username: $scope.userManager.selectedUsers[i].user.username,
                        type: "user",
                    });
                }
                return args;
            },
            dealMember: function (member) {
                $scope.userManager.selectedUsers = member;
            }
        };
        //组织机构选人
        $scope.orguserManager = {
            selectedUsers: [],
            relateid: [],
            getPersonHave: function () {
                return $scope.orguserManager.selectedUsers;
            },
            dealMember: function (member) {
                $scope.orguserManager.selectedUsers = member;
            },
            onDealSelectedUser: function (arg) {
                $scope.orguserManager.selectedUsers = arg;
            }
        };
        //获取列表页面取得的配置数据
        var taskPageScope = lzMisptSearchScope.findUp($scope, 'InformationRegistModelListManagerScope', "InformationRegistModellistscope");
        var formConfig = taskPageScope.modelInfo.formConfig;
        $scope.modelInfo = taskPageScope.modelInfo;
        $scope.controls = taskPageScope.controls;
        //根据相关的配置注册相关的事件
        $scope.IRMlistMansge = {
            eventRegister: function () {
                angular.forEach($scope.modelInfo.extendConfig.extendToolBarConfig.add, function (btn, k) {
                    if (btn.isSupportPC) {
                        app.event.register(btn.targetEvent);
                    }
                });
            },
        }
        $scope.IRMlistMansge.eventRegister();
        //循环组装数据
        $scope.formcon = formConfig.fields;
        //循环扩展字段将其添加到展现实体中
        angular.forEach(formConfig.userExtendFields, function (item, k) {
            $scope.formcon.push(item);
        });
        //循环组装post数据的同时//循环组装只读和必填验证
        //必填实体的构建
        $scope.isRequired = {};
        //只读实体的构建
        $scope.isReadOnly = {};
        //保存实体的构建
        $scope.viewPostData = {};
        //是否显示该字段的实体
        $scope.isShowData = {};
        //文件相关的字段集合
        $scope.filecode = [];
        //必填的相关字段集合
        $scope.Requiredcode = [];
        //只读相关字段的集合
        $scope.isReadOnlycode = [];
        //长度验证
        $scope.lengthcode = [];
        //选人字段的赋值
        $scope.timecode = [];
        $scope.peoplechange = "";
        var tempfile = [];
        angular.forEach($scope.controls, function (item, k) {
            if (item.controlType == 1) {
                tempfile.push(item.code)
            }
        });
        angular.forEach($scope.formcon, function (item, k) {
            if (configManager.isDateTimeField(item.fieldCode)) {
                $scope.timecode.push({
                    code: item.fieldCode,
                    type: item.controlConfig.dateType
                });
            }

            if (tempfile.indexOf(item.controlType) != "-1") {
                $scope.filecode.push(item.fieldCode);
            }
            if (item.controlType == "projectTeamPersonnel") {
                $scope.peoplechange = "projectTeamPersonnel";
            } else if (item.controlType == "organizationPersonnel") {
                $scope.peoplechange = "organizationPersonnel";
            }
            $scope.viewPostData[item.fieldCode] = "";
            //判断是否是必填，如果是必填的话将其加入到必填字段数组中
            if (item.controlConfig) {
                if (item.controlConfig.isRequired == true) {
                    $scope.Requiredcode.push(item.fieldCode);
                }
                if (item.controlConfig.isReadOnly == true) {
                    $scope.isReadOnlycode.push(item.filecode);
                    $scope.isReadOnly[item.fieldCode] = true;
                }
                //判断是否有长度字段
                if (item.controlConfig.length && item.controlConfig.length != 0) {
                    $scope.lengthcode.push({
                        filename: item.fieldName,
                        filecode: item.fieldCode,
                        length: item.controlConfig.length,
                    });
                }
            }
            $scope.isRequired[item.fieldCode] = "";
            $scope.isShowData[item.fieldCode] = true;
        });
        $scope.InformationRegistModelManager = {
            //校验文本框是否为空
            checkInput: function () {
                var isOK = true;
                if ($scope.Requiredcode.length != 0) {
                    //循环必填的字段
                    angular.forEach($scope.Requiredcode, function (item, k) {
                        //开始判断是否为空
                        if ($scope.viewPostData[item] == '' || $scope.viewPostData[item] == null) {
                            $scope.isRequired[item] = true;
                            isOK = false;
                        }
                        else {
                            $scope.isRequired[item] = false;
                        }
                    })
                }
                //循环配置数据
                return isOK;
            },
            //校验字段的长度
            checkLength: function () {
                $scope.lengthProm = "";
                var isOk = true;
                if ($scope.lengthcode.length != 0) {
                    //循环具有长度的字段
                    angular.forEach($scope.lengthcode, function (item, k) {
                        //判断长度
                        if ($scope.viewPostData[item.filecode].length > item.length) {
                            //添加错误提示语
                            $scope.lengthProm += "【" + item.filename + "】长度不能超过" + item.length + "字";
                            isOk = false;
                        }
                    })
                }
                if (isOk == false) {
                    opacityAlert($scope.lengthProm, " glyphicon glyphicon-remove-sign");
                }
                return isOk;
            },
            save: function (state, safeClose) {

                $scope.postModal.Members = [];
                //校验相关的必填项
                //字段检查                $scope.isRequired['title'] = true;
                //检验表单的必填项目，如果是必填的话，执行为ture
                if (!this.checkInput()) return;
                if (!this.checkLength()) return;

                //添加选择的人员判断是组织机构选人还是项目团队选人
                if ($scope.peoplechange == "projectTeamPersonnel") {
                    angular.forEach($scope.userManager.selectedUsers, function (item, k) {
                        $scope.postModal.Members.push({
                            UserId: item.userid,
                            UserFaceId: item.faceid,
                            OrganizationId: item.organizationid,
                            ExtendData: item.companyid,
                        });
                    });
                } else {
                    angular.forEach($scope.orguserManager.selectedUsers, function (item, k) {
                        $scope.postModal.Members.push({
                            UserId: item.uid,
                            UserFaceId: item.face,
                            OrganizationId: "",
                            ExtendData: "",
                        });
                    });
                }
                //将实体赋值
                var modal = $.extend({}, angular.copy($scope.viewPostData), angular.copy($scope.postModal));
                angular.forEach($scope.timecode, function (item, k) {
                    modal[item.code] = $filter('date')(modal[item.code], item.type);
                });
                //lzMisptUploadService.getBatchUploadPostData($scope.misptUploadData)
                //查找文件字段进行转换
                //添加选择的人员
                //循环是文件的字段，给相应的字段赋值
                if ($scope.filecode.length != 0) {
                    angular.forEach($scope.filecode, function (item, k) {
                        if (modal[item] != "") {
                            modal[item] = lzMisptUploadService.getBatchUploadPostData(modal[item])
                        }
                    });
                }

                modal = configManager.firstCharToUpperCase(modal);
                lzMisptWebAPI.post('api/Runtime/Business/Add/' + $scope.businessModuleId + '/' + $scope.sceneCode + "/" + $scope.sceneOrganizationId, { "": JSON.stringify(modal) }, 'InformationRegistModel').then(function (data) {
                    //保存成功后应该执行的相关操作
                    if (data) {
                        //将字符串
                        var retTask = JSON.parse(data);
                        //在列表页面添加数据
                        $scope.$parent.newTaskAddToList(retTask);
                        opacityAlert("新建成功!", "glyphicon glyphicon-ok-sign");
                        safeClose();
                    }
                    else {
                        $scope.postModal.Members = [];
                        opacityAlert("新建" + taskPageScope.modelInfo.name + "失败!", " glyphicon glyphicon-remove-sign");
                    }
                    safeClose();
                }, function (error) {
                    $scope.postModal.Members = [];
                    opacityAlert(error.ErrorCode.Message, " glyphicon glyphicon-remove-sign");
                })
            },
            close: function (state, safeClose) {
                safeClose();
            },
            IRMClickTemp: function (state, safeClose) {
                app.event.trigger($scope, state[1].targetEvent, { "close": safeClose });
            },

            //加载二次开发的js
            asyncJS: function () {

                var tempExtendJSConfig = $scope.modelInfo.extendConfig.extendJSConfig;
                var defer = $q.defer();
                if (tempExtendJSConfig && tempExtendJSConfig.web && tempExtendJSConfig.web.add.length != 0) {
                    require(tempExtendJSConfig.web.add, function (obj) {
                        defer.resolve && defer.resolve({ userDefaultObj: obj });//执行成功

                    });
                } else {
                    defer.resolve && defer.resolve({ serverConfigModel: "", userDefaultObj: null, controls: "" });//执行成功           

                }
                return defer.promise;
            }
        }

        app.event.bind($scope, "event-irm-toolbar-add-cancel", function (e, obj) {
            $scope.InformationRegistModelManager.close("", obj.data.close);
        });
        app.event.bind($scope, "event-irm-toolbar-add-save", function (e, obj) {
            $scope.InformationRegistModelManager.save("", obj.data.close);

        });


        //先加载二次开发的js，然后执行相关的方法
        var promiseAll = $q.all([$scope.InformationRegistModelManager.asyncJS()])
        promiseAll.then(function (res) {

            if (res[0].userDefaultObj) {
                //添加第三方——工具条添加监听事件
                res[0].userDefaultObj.pageLoad($scope, $injector);
                //添加第三方——标签页配置信息
                res[0].userDefaultObj.initConfig($scope, $injector);

            }

        });
    });


})();




