/// <reference path="http://localhost:8000/BasePlus/MISPTModule/Mobile/JS/Common.js" />
/// <reference path="http://localhost:8000/Base/Mobile/JS/LeadingCloud.js" />
/// <reference path="http://localhost:8000/Components/Mobile/mui/js/mui.js" />
/*********************************************************
 * 创建者：lz-fzj
 * 描述：项目团队-移动端项目团队邀请处理
 * 维护：
 * *******************************************************/
(function () {
    //          MUI组件初始化
    mui.init();
  
  
    //          全局变量
    var _AppCode = null;//                                                        项目团队所属的应用编码
    var _FormData = null;//                                                       当前页面所需的表单数据对象
    var _LzWebApi = null;//                                                       API调用对象
    var _LoginUserInfo = null;//                                                当前登录用户信息
    var _Picker2SelectOrgs = null;//                                          选择组织机构用的弹出框
    var _Picker2SelectCompany = null;//                                  当前选择组织机构用的弹出框
    var _CurOrgInfo = null;//                                                     当前选择的组织机构信息
    var taskinfo = null;
    _FormData = { invitationuser: null, projectname: null, allorgs: null, scenecode: null, teamid: null, isaccepted: null, isignoreinvitation: null, needselectcompany: null, isprojectmanager: null, optiontreenodes: null, orgid: null, orgname: null, companyid: null, companyname: null, companynamemodify: false };
    //          返回上一页
    var go2Back = function () {
        var plugin = LeadingCloud.JSNC.getChannel("LZMobileNavigation");
        plugin.run("navigationBackAction", { "type": "close" }, function (resultType, resultData) {
            if (resultType != LeadingCloud.JSNC.RunResultType.Success) { alert(resultData); }
        });
    }
    //          处理组织机构选择事件
    var onDealOrgSelectItem = function (items) {
        if (items instanceof Array) {
            var item = items[0];
            _FormData.orgid = item.value;
            _FormData.orgname = item.text;
            document.getElementById("span_orgName").innerText = _FormData.orgname;
            if (_FormData.companynamemodify == true) return;
        }
    };
    //          单位名称文本框值改变时
    var onTxtCompanyChanged = function () {
        _FormData.companyid = null;
        _FormData.companyname = document.getElementById("txt_company").value;
        //              遍历可选树节点，如果当前输入的文本在这节点中，则将单位id置为此值
        if ((_FormData.optiontreenodes instanceof Array) && _FormData.optiontreenodes.length > 0) {
            for (var i = 0; i < _FormData.optiontreenodes.length; i++) {
                var item = _FormData.optiontreenodes[i];
                if (item.text == _FormData.companyname) {
                    _FormData.companyid = item.value;
                    break;
                }
            }
        }
    };
    //          处理参与单位的节点点击事件
    var onDealCompanySelectItem = function (items) {
        _FormData.companynamemodify = true;
        var item = items[0];
        _FormData.companyid = item.value;
        _FormData.companyname = item.text;
        document.getElementById("txt_company").value = _FormData.companyname;
    };
    //          接受邀请的按钮事件处理
    var onAcceptButtonClick = function () {
        //              验证【参与人单位】
        if ((_FormData.orgid || "") == "") {
            mui.alert("请先选择参与身份");
            return;
        }
        var msg = "您当前参与身份为：" + _FormData.orgname;
        ////              验证【参与单位】
        //if (_FormData.isprojectmanager == true && _FormData.needselectcompany == true) {
        //    if ((_FormData.companyname || "") == "") {
        //        mui.alert("请选择或者输入项目团队中单位");
        //        return;
        //    }
        //    msg += "；项目团队中单位为：" + _FormData.companyname;
        //}
        msg += "。是否接受邀请？";
        mui.confirm(msg, "确认邀请", ["取消", "确认"], function (args) {
            if (args.index != 1) return;
            lzm.PromptBox.loading(true);
            //                  发送API
            try {
                var api = "api/Runtime/Business/Member/ValidMemberAndAddcooperation/" + taskinfo['BusinessModuleId'] + "/" + taskinfo['SceneCode'] + "/" + taskinfo['TaskId'] + "/" + _LoginUserInfo.userId + "/" + _FormData.orgid
                //var postData = {
                //    SceneCode: _FormData.scenecode, TeamId: _FormData.teamid, OrganizationId: _FormData.orgid,
                //    CompanyId: _FormData.companyid, NewCompanyName: _FormData.companyname
                //};
                _LzWebApi.get(api, function (data) {
                    lzm.PromptBox.loading(false);
                    if (data.ErrorCode && data.ErrorCode.Code == "0") {
                        mui.toast("操作成功");
                        setTimeout(go2Back, 500);
                        return;
                    }
                    mui.alert(data.ErrorCode.Message);
                }, function (data) {
                    lzm.PromptBox.loading(false);
                });
            } catch (e) {
               
                alert(e.message);
            }
        }, "div");
    };
    //          忽略邀请的按钮事件处理
    var onIgnoreButtonClick = function () {
        mui.confirm("是否忽略任务邀请？", "确认提示", ["取消", "确认"], function (args) {
            if (args.index != 1) return;
            lzm.PromptBox.loading(true);
            //                  发送API
            try {
                var isIgnore=true;
               // var api = "api/" + _AppCode + "/ProjectTeam/UserIgnoreInvitation/" + _FormData.teamid;
                var api = "api/Runtime/Business/UpdateIgnore/" + taskinfo['BusinessModuleId'] + "/" + taskinfo['SceneCode'] + "/" + taskinfo['TaskId'] + "/" + _LoginUserInfo.userId + "/" + isIgnore;
                _LzWebApi.get(api, function (data) {
                    lzm.PromptBox.loading(false);
                    if (data.ErrorCode && data.ErrorCode.Code == "0") {
                        mui.toast("操作成功");
                        setTimeout(go2Back, 500);
                        return;
                    }
                    mui.alert(data.ErrorCode.Message);
                }, function (data) {
                    lzm.PromptBox.loading(false);
                });
            } catch (e) {
                alert(e.message);
            }
        }, "div");
    };

    //          页面加载完成之后的事件处理
    LeadingCloud.onPageLoaded = function () {
        //              初始化数据
        var initDataFunc = function () {
            //                      从SessionStorage去数据，进行序列化处理
            try {
                //                              取出我们传给【我的任务】中的扩展数据
                var paramsData = sessionStorage.getItem("lcm.instancedata");
                paramsData = JSON.parse(paramsData);
               
                //                                  判断是从哪里过来的
                var lcmModule = paramsData["lcmmodule"] || "";
                 
                if (lcmModule == "lcm_transaction") paramsData = paramsData["paramsdata"] || "{}";
                else if (lcmModule == "lcm_chat") paramsData = paramsData;
                else {
                    alert("无效的打开方式，无法处理请求");
                    go2Back();
                    return;
                }
                if (typeof (paramsData) == "string") paramsData = JSON.parse(paramsData);
                //                              初始化全局变量
               
                _AppCode = paramsData["AppCode"] || null;
                taskinfo = paramsData;
                var params = {
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
                
                
            }
            catch (ex) {
                alert("JSON序列化报错：" + ex.message);
                go2Back();
            }
             //document.getElementById("teamdate").value = paramsData.date;
            //                      去底层平台获取当前登录用户信息和企业信息
            _LzWebApi = new lzm.WebApi();
            _LoginUserInfo = LeadingCloud.User.loginInfo();
            
            //                      取当前所有所有的企业信息
            lzm.PromptBox.loading(true);
            _LzWebApi.post("api/organization/getbasicbyentersuser", {
                "": _LoginUserInfo.userId
            }, function (data) {
                lzm.PromptBox.loading(false);
                var errorCode = ((data || {})["ErrorCode"] || {});
                if (errorCode["Code"] != "0") {
                    alert(errorCode["Message"] || "获取当前用户的企业信息失败");
                    go2Back();
                    return;
                }
                var tmpArray = (data || {})["DataContext"] || null;
                var tmpOrgs = [{ "value": _LoginUserInfo.userId, "text": "己方" }];
                if (tmpArray instanceof Array) {
                    for (var i = 0; i < tmpArray.length; i++) {
                        var item = tmpArray[i];
                        tmpOrgs.push({ "value": item["eid"], "text": item["shortname"] });
                    }
                }
                //                          获取当前登录用户在该任务的信息
                _LzWebApi = new lzm.WebApi("InformationRegistModel");
                getMyMemberInvitation();
                //                          初始化组织机构信息
                _FormData.allorgs = tmpOrgs;
                _FormData.orgid = _LoginUserInfo.oid;
            },
            function () {
                alert("获取当前登录用户企业信息失败");
                go2Back();
            });
            //                      获取当前登录用户的邀请信息
            var getMyMemberInvitation = function () {
               var api= "api/Runtime/Business/Load/" + paramsData["BusinessModuleId"] + "/" + paramsData["SceneCode"] + "/" + paramsData["TaskId"]
               //  = "/api/" + _AppCode + "/ProjectTeam/GetMyMemberInvitationInfo/" + _FormData.teamid;
                try {
                    _LzWebApi.get(api, function (data) {
                       
                        var errorCode = ((data || {})["ErrorCode"] || {});
                        if (errorCode["Code"] != "0") {
                            mui.alert(errorCode["Message"] || "获取当前用户的邀请信息失败", go2Back);
                            return;
                        }
                        data = (data || {})["DataContext"] || null;
                        if (data == null) {
                            mui.alert("此邀请已经失效", go2Back);
                            return;
                        }
                        //                  将用户信息初始化到表单上
                         var taskdetail = JSON.parse(data);
                         var memberList = taskdetail.Members;
                         var isintask = false;
                        //判断当前任务的状态
                         var state = taskdetail.State;
                         if (state == 2) {
                             //判断现有的人员是否在当前任务中
                             for (var i = 0; i < memberList.length; i++) {
                                 if (_LoginUserInfo.userId == memberList[i].UserId) {
                                     isintask = true;
                                     //判断当前用户的状态
                                     if (memberList[i].IsValid) {
                                         //已接受邀请，显示已同意的界面
                                         _FormData["isaccepted"] = true;
                                         for (var j = 0; j < _FormData.allorgs.length; j++) {
                                             if (_FormData.allorgs[j].oid == memberList[i].OrganizationId) {
                                                 _FormData["orgname"] = _FormData.allorgs[j].name;
                                             }
                                         };




                                     } else {
                                         //未接受邀请
                                         //判断用户的isignore是否为true，为true的话表示已忽略，空或者false的话表示未忽略
                                         if (memberList[i].isignore == "true") {
                                             //表示已经忽略，显示以忽略的界面
                                             //$scope.formData["isaccepted"] = true;
                                             _FormData["isignoreinvitation"] = true;
                                         } else {
                                             //未忽略，显示同意和忽略的界面，
                                             _FormData["isaccepted"] = false;
                                             _FormData["isignoreinvitation"] = false;
                                         }


                                     }
                                 }
                             }

                             if (!isintask) {

                                 mui.alert("此邀请已经失效", go2Back);
                             }
                         } else {

                             mui.alert("此邀请已经失效", go2Back);
                         }
                     
                        //                  初始化单位名称
                        if (_FormData.isaccepted == true && _FormData.orgid != "") {
                            for (var i = 0; i < _FormData.allorgs.length; i++) {
                                if (_FormData.allorgs[i].value == _FormData.orgid) {
                                    _FormData.orgname = _FormData.allorgs[i].text;
                                    break;
                                }
                            }
                        }
                        //                  处理单位节点信息
                        var tmpNodes = data["OptionTreeNodes"] || null;
                        if (tmpNodes instanceof Array) {
                            var tmpCompanies = [];
                            for (var i = 0; i < tmpNodes.length; i++) {
                                var item = tmpNodes[i];
                                tmpCompanies.push({ "value": item["Id"], "text": item["NodeName"] });
                            }
                            _FormData["optiontreenodes"] = tmpCompanies;
                        }
                        //                  处理完了，初始化视图
                      
                        setTimeout(initData2View, 0);
                    });
                } catch (e) {
                    alert(e.message);
                    go2Back();
                }
            };
        }
        //              初始化数据到页面上
        var initData2View = function () {

            document.getElementById("div_Cotent").style.display = "";
            document.getElementById("txt_user").value = taskinfo["UserName"];
            document.getElementById("teamdate").value = taskinfo["date"];
            document.getElementById("taskname").value = taskinfo["Title"];
            //          如果是已忽略的邀请，后面的就不处理了
          
            if (_FormData.isignoreinvitation == true) {
                document.getElementById("div_tipbutton").style.display = "";
                document.getElementById("btn_isIgnored").style.display = "";
                return;
            }
            var tmpInputBlur = false;
            //          根据状态控制显隐
              
            if (_FormData.isaccepted) {
                document.getElementById("div_tipbutton").style.display = "";
                document.getElementById("btn_isAccepted").style.display = "";
                //              接受完邀请以后的身份信息
                document.getElementById("txt_orgName2Accept").value = _FormData.orgname;
                document.getElementById("div_orgInfo2Accept").style.display = "";
                //              接受完邀请以后的提示消息：如果组织机构id和已选组织机构id相同；则不提示切换组织了
               // document.getElementById("div_finishmessage").style.display = "";
                var tmpMsgTip = "1、切换当前身份到<b>&nbsp;" + _FormData.orgname + "&nbsp;</b>；<br />" +
                    "2、在<b>应用</b>中点击<b>&nbsp;" + _FormData.appname + "&nbsp;</b>即可查看项目；您也可以在<b>&nbsp;协作&nbsp;</b>中，点击<b>&nbsp;项目&nbsp;</b>查看。";;
                if (_LoginUserInfo["oid"] == _FormData.orgid) tmpMsgTip = "在<b>应用</b>中点击<b>&nbsp;" + _FormData.appname + "&nbsp;</b>即可查看项目；您也可以在<b>&nbsp;协作&nbsp;</b>中，点击<b>&nbsp;项目&nbsp;</b>查看。";
                document.getElementById("div_showTipMsg2Accept").innerHTML = tmpMsgTip
                return;
            }
            document.getElementById("btn_accept").onclick = onAcceptButtonClick;
            document.getElementById("btn_ignore").onclick = onIgnoreButtonClick;
            //          初始化【选择企业】：默认单位为当前登录用户
            document.getElementById("div_selectorg").onclick = function () {
                lzm.PromptBox.hideKeyboard(function () {
                    setTimeout(function () {
                        _Picker2SelectOrgs.pickers[0].setSelectedValue(_FormData.orgid);
                        _Picker2SelectOrgs.show(onDealOrgSelectItem);
                    }, tmpInputBlur == true ? 500 : 0);
                });
            };
         
            _Picker2SelectOrgs = new mui.PopPicker();
            _Picker2SelectOrgs.setData(_FormData.allorgs);
              //alert(_Picker2SelectOrgs.getSelectedItems())
            _Picker2SelectOrgs.pickers[0].setSelectedValue(_LoginUserInfo["oid"]);
           
            onDealOrgSelectItem(_Picker2SelectOrgs.getSelectedItems());
           
            document.getElementById("div_orgName").style.display = "";
            //          初始化【选择单位】
             
            if (_FormData.needselectcompany == true && _FormData.isprojectmanager == true) {
                document.getElementById("div_joinCompany").style.display = "";
                if (_FormData.optiontreenodes != null && _FormData.optiontreenodes.length > 0) {
                    //          显示选择单位的箭头，并设置事件响应
                    document.getElementById("btn_SelectCompany").style.display = "";
                    document.getElementById("btn_SelectCompany").onclick = function () {
                        lzm.PromptBox.hideKeyboard(function () {
                            //          重置一下选择的单位
                            setTimeout(function () {
                                try { _Picker2SelectCompany.pickers[0].setSelectedValue(_FormData.companyid); }
                                catch (e) { _Picker2SelectCompany.pickers[0].setSelectedIndex(0); }
                                _Picker2SelectCompany.show(onDealCompanySelectItem);
                            }, tmpInputBlur == true ? 500 : 0);
                        });
                    };
                    _Picker2SelectCompany = new mui.PopPicker();
                    _Picker2SelectCompany.setData(_FormData.optiontreenodes);
                    try { _Picker2SelectCompany.pickers[0].setSelectedText(_FormData.orgname); } catch (e) { }
                    onDealCompanySelectItem(_Picker2SelectCompany.getSelectedItems());
                    _FormData.companynamemodify = false;
                }
                var txtElement = document.getElementById("txt_company");
                txtElement.onblur = function () {
                    tmpInputBlur = true;
                    setTimeout(function () { tmpInputBlur = false; }, 1000);
                    if (_FormData.companyname == this.value) return;
                    _FormData.companynamemodify = true;
                    onTxtCompanyChanged();
                };
                txtElement.value = _FormData.orgname;
                onTxtCompanyChanged();
            }
            //          显示[接受邀请]按钮
            document.getElementById("div_button").style.display = "";
        };
        //              执行初始化方法
        setTimeout(function () {
            initDataFunc();
            //              事件授权
        }, 0);
    }
})();