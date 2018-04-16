/// <reference path="http://localhost:8000/BasePlus/MISPTModule/Mobile/JS/Common.js" />
/// <reference path="http://localhost:8000/Base/Mobile/JS/LeadingCloud.js" />
/// <reference path="http://localhost:8000/Components/Mobile/mui/js/mui.js" />
/*********************************************************
 * 创建者：lz-ljy
 * 描述：任务加人-移动端邀请处理
 * 维护：
 * *******************************************************/
(function () {
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
                document.getElementById("txt_user").value = paramsData.UserName;
                document.getElementById("Title").value = paramsData.Title;
                document.getElementById("teamdate").value = paramsData.date;
                var _LoginUserInfo = LeadingCloud.User.loginInfo();
               
               var  _LzWebApi = new lzm.WebApi();
                 
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
                
                //                          初始化组织机构信息
                
                for (var i = 0; i < tmpOrgs.length; i++) {
                    var item = tmpOrgs[i];
                    if (paramsData.oid == item.value)
                    {
                       
                        document.getElementById("txt_orgName2Accept").value = item.text;
                    }
                }
            },
            function () {
                alert("获取当前登录用户企业信息失败");
                go2Back();
            });
            }
            catch (ex) {
                alert("JSON序列化报错：" + ex.message);
                go2Back();
            }
        }
        //              初始化数据到页面上
        var initData2View = function () {
            document.getElementById("div_Cotent").style.display = "";
            document.getElementById("txt_user").value = _FormData.invitationuser;
            document.getElementById("teamname").value = _FormData.projectname;
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
                document.getElementById("div_finishmessage").style.display = "";
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