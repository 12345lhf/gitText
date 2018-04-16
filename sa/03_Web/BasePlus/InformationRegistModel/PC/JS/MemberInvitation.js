//          成员接受邀请的控制器
(function () {
    'use strict';
    app.register.controller("TaskMemberInvitationController", function ($scope,lzMisptWebAPI, $modal, lzMisptProjectTeam, $state, $location) {
        //          适配一下传入的参数类型
        var paramsData = $scope["lzParams"] || null;
        if (!paramsData) {
            alert("paramsData数据为空");
            return;
        }
        //          找出我们需要的数据
        paramsData = {
            "AppCode": paramsData["AppCode"] || null,
            "SceneCode": paramsData["SceneCode"] || null,
            "TaskId": paramsData["TaskId"] || null,
            "Title": paramsData["Title"] || null,
            "UserName": paramsData["UserName"] || null,
            "UserId": paramsData["UserId"] || null,
            "date": paramsData["date"] || null,
            "maintitle": paramsData["maintitle"] || null,
             "BusinessModuleId": paramsData["BusinessModuleId"] || null,
        };
        //显示提示信息的通用方法
        var _ShowMessage = function (message) { opacityAlert(message, "glyphicon glyphicon-remove-sign"); }
        $scope.maintitle = paramsData["maintitle"];
        //           去任务中的成员状态：发生错误，则直接关闭窗口；否则进行处理；
        lzMisptWebAPI.get("api/Runtime/Business/Load/" + paramsData["BusinessModuleId"] + "/" + paramsData["SceneCode"] + "/" + paramsData["TaskId"], "InformationRegistModel").then(function (data) {
            var taskdetail = JSON.parse(data);
            var memberList = taskdetail.Members;
            $scope.isintask = false;
            //判断当前任务的状态
            var state = taskdetail.State;
            if (state == 2) {
                //判断现有的人员是否在当前任务中
                angular.forEach(memberList, function (item, k) {
                    if (app.session.user.uid == item.UserId) {
                        $scope.isintask = true;
                        //判断当前用户的状态
                        if (item.IsValid) {
                            //已接受邀请，显示已同意的界面
                            $scope.formData["isaccepted"] = true;
                            $scope.formData.isignoreinvitation = false
                            angular.forEach(app.session.user.orgsbyuser, function (orgitem, k) {
                                if (orgitem.oid == item.OrganizationId) {
                                    $scope.formData["orgname"] = orgitem.name;
                                }
                            });

                        } else {
                            //未接受邀请
                            //判断用户的isignore是否为true，为true的话表示已忽略，空或者false的话表示未忽略
                            if (item.isignore == "true") {
                                //表示已经忽略，显示以忽略的界面
                                //$scope.formData["isaccepted"] = true;
                                $scope.formData["isignoreinvitation"] = true;
                            } else {
                                //未忽略，显示同意和忽略的界面，
                                $scope.formData["isaccepted"] = false;
                                $scope.formData["isignoreinvitation"] = false;
                            }
                        }
                    }
                })
                if (!$scope.isintask) {
                    $scope.formData["Invalid"] = true;
                   // setTimeout($scope.closeDivDialog, 1000);
                }
                } else {
                    $scope.formData["Invalid"] = true;
                    //setTimeout($scope.closeDivDialog, 1000);
                }
        });
        $scope.formData = {};
       $scope. formData.isignoreinvitation=false
        $scope.formData["dataloaded"] = true;
        $scope.formData["invitationuser"] = paramsData["UserName"];
        $scope.formData["taskname"] = paramsData["Title"];
        $scope.formData["allorgs"] = app.session.user.orgsbyuser;
        $scope.formData["date"] = paramsData["date"];
        $scope.formData.orgname = app.session.user.selectorg.name;
        $scope.formData.orgid = app.session.user.selectorg.oid;
        //事件处理isignoreinvitation
        //组织项被点击的时候
        $scope.onMyOrgSelected = function (org) {
            $scope.formData.orgname = org.shortname;
            $scope.formData.orgid = org.oid;
            //                  如果用户没有修改过单位名称，那么保持联动切换
            if ($scope.formData.companynamemodify != true) {
                $scope.formData.companyname = org.shortname;
               // $scope.onCompanyNameChanged();
            }
        };
        //                  接受邀请的时候
        $scope.onAcceptInvitation = function () {
            var formData = $scope.formData;
            //          必须选择参与身份
            if ((formData.orgid || "") == "") {
                _ShowMessage("请先选择参与身份");
                return;
            }
            var msg = "您当前参与身份为：" + formData.orgname;
      
            msg += "。是否接受邀请？";
            lzConfirmDailog($scope, $modal, "是否同意邀请", msg, function (isok, e) {
                if (isok == false) return;

                //                  发送API，确认邀请获取选中的组织机构的id，组装数据并发送api，修改组织机构，并将用户是否可用设置为可用
                //将该成员设置为可用

                lzMisptWebAPI.get("api/Runtime/Business/Member/ValidMemberAndAddcooperation/" + paramsData['BusinessModuleId'] + "/" + paramsData['SceneCode'] + "/" + paramsData['TaskId'] + "/" + app.session.user.uid + "/" + formData.orgid, "InformationRegistModel"
                ).then(function (data) {
                    $scope.formData["isaccepted"] = true;
                     setTimeout($scope.closeDivDialog, 1000);
                });
               
            });
        };
        //                  忽略邀请的时候
        $scope.onIgnoreInvitation = function () {
            lzConfirmDailog($scope, $modal, "确认提示", "是否忽略任务邀请？", function (isok, e) {
                if (isok == false) return;
                //我要忽略邀请了
                //将该成员字段的isignore字段设置为true，成功的话将页面设置为以忽略页面
                $scope.isIgnore = true;
                lzMisptWebAPI.get("api/Runtime/Business/UpdateIgnore/" + paramsData['BusinessModuleId'] + "/" + paramsData['SceneCode'] + "/" + paramsData['TaskId'] + "/" + app.session.user.uid + "/" + $scope.isIgnore, "InformationRegistModel"
                ).then(function (data) {
                    $scope.formData.isaccepted == false;
                    $scope.formData["isignoreinvitation"] = true;
                    setTimeout($scope.closeDivDialog, 1000);
                });

            });
        };
    });
})();