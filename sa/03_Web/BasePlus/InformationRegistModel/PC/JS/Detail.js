"use strict"
; (function () {
    app.register.controller("InformationRegistModel_Detail", function ($scope,lzMisptWebAPI,lzMisptSearchScope,$q) {
        //在这个页面先获取页面的配置信息，然后获取页面的业务数据信息，
         app.event.register("event-irm-detail-form-change");
        //实例化配置对象
        //必填的相关字段集合
        $scope.Requiredcode = [];
         //只读相关字段的集合
        $scope.isReadOnlycode = [];
         //长度验证
        $scope.lengthcode = [];
        //选人字段的赋值
        $scope.timecode = [];
           //项目团队选人
        $scope.userManager = {
            selectedUsers: [],
            relateid: [],
            getPersonHave: function () {
                return $scope.userManager.selectedUsers;
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
        $scope.InformationRegistModel_DetailScope = "InformationRegistModel_DetailScope";
        //获取列表页面选中的任务id，查找列表页面的scope，获取选中的任务id
        var pScope = lzMisptSearchScope.findUp($scope, 'InformationRegistModelListManagerScope', 'InformationRegistModellistscope');

        $scope.taskId = pScope.selectTaskId;
        var configManager = new ConfigManager1();
        $scope.ctmRuntimeDetailManager = {
            loadConfig: function () {
                var _this = this;
                var url = "api/Runtime/ModelInfo";
                url += "/" + $scope.runtimeContext.moduleInfo.appCode;
                url += "/" + $scope.runtimeContext.moduleInfo.businessModuleId;
                url += "/" + $scope.runtimeContext.sceneInfo.sceneCode;
                url += "/" + $scope.runtimeContext.sceneInfo.sceneOrganizationId;
                var promiseConfig = lzMisptWebAPI.get(url, "InformationRegistModel").then(function (data) {
                    return _this.loadControls(JSON.parse(data));
                }, function (data, status, headers, config) {
                    //错误提示
                    console.log(data.DataContext);
                });
                return promiseConfig;
            },
            loadControls: function (serverConfigModel) {
                var temp = {}
                serverConfigModel.FormConfig.Fields.forEach(function (item) {
                    temp[item.ControlType] = item.ControlType;
                });
                var _this = this;
                var postModel = { "": Object.getOwnPropertyNames(temp) };
                var promiseControls = lzMisptWebAPI.post("api/InformationRegistModel/Control/LoadByCodes", postModel, "InformationRegistModel").then(function (data) {
                
                    var controls = {};
                    if (data) {
                        data.forEach(function (control) {
                            control = new ControlConfigEntity1(control);
                            controls[control.code] = control;
                        });
                        return _this.asyncJS(serverConfigModel, controls);
                    }
                }, function (data, status, headers, config) {
                    //错误提示
                    console.log(data.DataContext);
                });
                return promiseControls;
            },

            asyncJS: function (serverConfigModel, controls) {
          
                var tempExtendJSConfig = serverConfigModel.ExtendConfig.ExtendJSConfig;

                var defer = $q.defer();
                if (tempExtendJSConfig && tempExtendJSConfig.Web && tempExtendJSConfig.Web.Detail) {
                    require(tempExtendJSConfig.Web.Detail, function (obj) {
                        defer.resolve && defer.resolve({ serverConfigModel: serverConfigModel, userDefaultObj: obj, controls: controls });//执行成功

                    });
                } else {
                    defer.resolve && defer.resolve({ serverConfigModel: serverConfigModel, userDefaultObj: null, controls:controls });//执行成功           

                }
                return defer.promise;
            },

            //注册配置信息中的事件
            eventRegister: function (modelInfo) {
           
                angular.forEach(modelInfo.extendConfig.extendToolBarConfig.detail, function (btn,k) {
                    if (btn.isSupportPC) {
                        app.event.register(btn.targetEvent);
                    }
                });
            }

        }
        ///////////////获取当前任务的业务数据//////////////////////
        $scope.ctmrdTaskManager = {
            loadTask: function () {
                //调用API接口
                var url = "api/Runtime/Business/Load";
                url += "/" + $scope.runtimeContext.moduleInfo.businessModuleId;
                url += "/" + $scope.runtimeContext.sceneInfo.sceneCode;
                url += "/" + $scope.taskId;
                var promiseTask = lzMisptWebAPI.get(url, "InformationRegistModel").then(function (data) {
                    
                    return data;
                }, function (data) {
                      //错误提示
                    console.log(data.DataContext);
                });
                return promiseTask;
            }
        }
     
        //////按钮的点击事件/////////
        $scope.InformationRegistModelManager = {
            IRMClickTemp: function (state, safeClose) {
                app.event.trigger($scope, state[1].targetEvent, { "close": safeClose });
            },
            //取消的事件
            cancel: function (state, safeClose) {
                 safeClose();
            },
            //校验文本框是否为空
            checkInput:function(){
                var isOk = true;
               
                if ($scope.Requiredcode.length != 0) {
                    //循环必填的字段
                    angular.forEach($scope.Requiredcode, function (item, k) {
                        //开始判断是否为空
                        if ($scope.viewPostData[item] == '' || $scope.viewPostData[item] == null) {
                            $scope.isRequired[item] = true;
                            isOk = false;
                        } else {
                            $scope.isRequired[item] = false;
                        }
                    });

                } else {
                }
                 return isOk;
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
            //保存的事件
            save: function (state, safeClose)
            {
                //去除成员类的字段，
                //字段检查
                //校验表单的必填项目，如果是必填的话，执行为true
                if (!this.checkInput()) return;
                if (!this.checkLength()) return;
                //将首字母转换为小写
                $scope.viewPostData=configManager.firstCharToLowerCaseForAll($scope.viewPostData)
                angular.forEach(Object.getOwnPropertyNames($scope.viewPostData), function (item, k) {
                    $scope.taskInfo[item] = $scope.viewPostData[item];
                });
                console.log($scope.taskInfo);
                 $scope.taskInfo.Members = [];
                //将首字母转成大写
                $scope.taskInfo = configManager.firstCharToUpperCase($scope.taskInfo);
                //完成和新建页面一致的相关校验
                //执行业务数据跟新接口，如果更新成功，则关闭弹窗，并且更新列表的数据，如果不成功，则弹出提示信息
                //api/Runtime/Business/Update/{businessModelId}/{sceneCode}
                lzMisptWebAPI.post("api/Runtime/Business/Update/" + $scope.runtimeContext.moduleInfo.businessModuleId + "/" + $scope.runtimeContext.sceneInfo.sceneCode,{ "": JSON.stringify( $scope.taskInfo) }, "InformationRegistModel").then(function (data) {
                    //成功则关闭弹窗，并且更新列表的数据，
                    //发送时间更新列表的数据（先在列表上）
                     // $scope.$parent.newTaskAddToList($scope.taskInfo);
                    app.event.trigger($scope, "event-irm-detail-from-change-tolist", {
                        value: $scope.viewPostData,
                        id: $scope.taskInfo._id
                    });
                    //关闭弹窗
                    safeClose();
                }, function (data) {
                    
                })
            },
            Delete: function (taskid, safeClose) {
                //执行删除的api操作，删除成功的话关闭弹窗，并且发送事件删除列表的数据，如果删除失败，则提示出错误
                //api/Runtime/Business/Delete/{businessModelId}/{sceneCode}/{id}
                lzMisptWebAPI.get("api/Runtime/Business/Delete/" + $scope.runtimeContext.moduleInfo.businessModuleId + "/" + $scope.runtimeContext.sceneInfo.sceneCode + "/" + taskid,"InformationRegistModel").then(function (data) {
             
                    if (data == true)
                    {
                        //发送事件
                        app.event.trigger($scope, "event-iim-detail-toolbar-deleteflush", {  id: taskid});
                        //关闭弹窗
                        safeClose();
                       
                    }
                }, function (data) {
                    alert("删除失败")
                })
               
            }
        }
       
        var promiseAll=$q.all([$scope.ctmRuntimeDetailManager.loadConfig(),$scope.ctmrdTaskManager.loadTask()])
        promiseAll.then(function (res) {
            var isInTaskInfoMembers = false;
            //转为客户端实体模型
            $scope.ctmConfigModel = new window.ModelEntity1(res[0].serverConfigModel);
            //未处理配置数据是的数据
            $scope.oldctmConfigModel = new window.ModelEntity1(res[0].serverConfigModel);
            //先执行二次开发事件
            if (res[0].controls) {
                $scope.ctmrdTaskControls = res[0].controls;
            }
            //组装业务数据
            if (res[1]) {
                $scope.taskInfo = configManager.firstCharToLowerCaseForAll(JSON.parse(res[1]));

            }
            //注册事件
            $scope.ctmRuntimeDetailManager.eventRegister($scope.ctmConfigModel);
            if (res[0].userDefaultObj) {
                //添加第三方——工具条添加监听事件
                res[0].userDefaultObj.pageLoad($scope, $injector);
                //添加第三方——标签页配置信息
                res[0].userDefaultObj.initConfig($scope, $injector);
            }
           
            if ($scope.taskInfo.members && angular.isArray($scope.taskInfo.members)) {
                //取出管理员
                $scope.taskInfo.admin = $scope.taskInfo.members.find(function (item) {
                    return item.memberType == 1;
                });
                //判断当前登录用户是否是管理员
                if ($scope.taskInfo.admin) {
                    $scope.taskInfo.isAdmin = $scope.taskInfo.admin.userId == app.session.user.uid;
                }
                // 人员指令参数配置
                $scope.ctmrdTaskManager.memberConfig = {
                    tid: $scope.taskId,// 例:任务id
                    businessModuleId: $scope.taskInfo.businessModuleId,
                    sceneCode: $scope.runtimeContext.sceneInfo.sceneCode,
                    appcode: $scope.runtimeContext.sceneInfo.sceneAppCode,
                    state: $scope.taskInfo.state,
                    members: [],
                    taskTitle: $scope.taskInfo.title,
                };
                //循环去掉负责人
                //angular.forEach($scope.taskInfo.members, function (item, k) {
                //    if (item.userId == $scope.taskInfo.admin.userId)
                //    {
                //        $scope.taskInfo.members.splice(k, 1);
                //    }
                //})
                $scope.taskInfo.members.map(function (item) {
                    $scope.ctmrdTaskManager.memberConfig.members.push({
                        face: item.userFaceId,
                        isvalid: item.isValid,
                        oid: item.organizationId,
                        uid: item.userId,
                        utype: item.memberType,
                        isignore: item.isignore,
                    });
                    if (item.userId === app.session.user.uid) {
                        isInTaskInfoMembers = true;
                    }
                });
                //只读处理
                //if ($scope.Authority == "ReadAuthority") {
                //    $scope.taskInfo.isReadOnly = true;
                //    $scope.isObserver = true;
                //}
                //else {
                //    $scope.taskInfo.isReadOnly =  (!$scope.taskInfo.isAdmin) || (!isInTaskInfoMembers);
                //}
                //$scope.taskInfo.isReadOnly = true;
                ////如果是只读，隐藏按钮的div
                //if ($scope.taskInfo.isReadOnly)
                //{
                //    //debugger
                //    var pScope = lzMisptSearchScope.findUp($scope, 'modaltest', 'modaltest1111');

                //    pScope.showFooter = false;
                //    $scope.bottom = {
                //        'padding':'20px',
                //    }
                //}
                //人员指令（组织机构人员选择,项目团队人员选择,项目内部团队人员选择 三选一）
                angular.forEach($scope.ctmConfigModel.formConfig.fields, function (field, k) {
                    if (/organizationPersonnel|projectTeamPersonnel|projectInnerTeamPersonnel/g.test(field.controlType)) {
                        $scope.ctmRuntimeDetailManager.selectPersonType = field.controlType;
                    }
                });
            }



            $scope.page = "detail";
            $scope.rpid = $scope.taskInfo.resoucePoolId;
            $scope.projectName = $scope.runtimeContext.sceneInfo.sceneName;
            $scope.appCode = $scope.taskInfo.appCode;
            $scope.sceneCode = $scope.taskInfo.sceneCode;
            $scope.businessModuleId = $scope.taskInfo.businessModuleId;
            $scope.id = $scope.taskInfo._id,
            $scope.name = $scope.taskInfo.title,
            $scope.state = $scope.taskInfo.state,
            $scope.controls = $scope.ctmrdTaskControls;

            var formConfig = $scope.ctmConfigModel.formConfig;
           
            //循环组装数据
            ////////////
         
            $scope.formcon = formConfig.fields;
            //循环扩展字段将其添加到展现实体中
            angular.forEach(formConfig.userExtendFields, function (item, k) {
                $scope.formcon.push(item);
            });
            //循环组装post数据的同时//循环组装只读和必填验证
            //必填实体的构建
            var isRequired = {
            };
            //只读实体的构建
            var isReadOnly = {};
            var isShowData = {};
            //保存实体的构建
            var postData = {};
            angular.forEach($scope.formcon, function (item, k) {
                postData[item.fieldCode] = $scope.taskInfo[item.fieldCode[0].toLowerCase() + item.fieldCode.substring(1)];
                isRequired[item.fieldCode] = "";
                isReadOnly[item.fieldCode] = $scope.taskInfo.isReadOnly;
                isShowData[item.fieldCode] = true;
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
            });
            isShowData["Conclusion"] = $scope.taskInfo["conclusion"] ? true : false;
            ////////////
            $scope.viewPostData = postData;
            $scope.isRequired = isRequired;
            $scope.isReadOnly = isReadOnly;
            $scope.isShowData = isShowData;


            $scope.isshow = true;
















            //内置的按钮监听事件
            //保存的事件
            app.event.bind($scope, "event-irm-toolbar-detail-save", function (e, obj) {
                $scope.InformationRegistModelManager.save("", obj.data.close);

            });

            //删除的事件
            app.event.bind($scope, "event-irm-toolbar-detail-delete", function (e, obj) {
                $scope.InformationRegistModelManager.Delete($scope.taskId, obj.data.close);

            });
            //取消的事件
            app.event.bind($scope, "event-iim-detail-toolbar-detail-cancel", function (e, obj) {
               
                $scope.InformationRegistModelManager.cancel("", obj.data.close);

            });
            app.event.bind($scope, "event-irm-detail-form-change", function (e, obj) {
                //将获取到的消息保存到数据库，主要是用于资源类保存文件夹id
               
                 var url = "api/Runtime/Business/SingleModified";
                url += "/" + $scope.taskInfo.businessModuleId;
                url += "/" + $scope.taskInfo.sceneCode;
                url += "/" + $scope.taskInfo._id;
                var postEntity = {};
                postEntity[obj.data.code] = obj.data.value;
                lzMisptWebAPI.post(url, { '': JSON.stringify(postEntity) }, "InformationRegistModel").then(function (data) {
                    
                    if (data) {
                      
                    }
                    else {
                      
                    }
                }, function (data, status, headers, config) {
                    callBackErrorHandler(data);
                });
             

            });
        });


    });
   

})();