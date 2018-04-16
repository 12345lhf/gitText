"use strict";
(function (window,angular,define) {
    /*定义模块*/
    define(function () {
        return {
            //=================定义标准的接口 begin=================

            /**
             * 控件加载的html对象测试
             */

            gethtmlconfig: function () {
                var typemodal = {
                    //单行文本框
                    text: {
                        buildControl: function ($scope,controlType,index,pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                htmltext = "<div ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'  style='min-width:140px'><div class='pull-right' style='display: flex;'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-text config='formcon[" + index + "]' is-read-only=isReadOnly['" + controlType.fieldCode + "'] is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";

                                // htmltext = " <div ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display: flex;'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-text is-required=isRequired['" + controlType.fieldCode + "'] is-read-only=isReadOnly['" + controlType.fieldCode + "'] timely-blur=timelyBlur page='page' config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            } else {
                                htmltext = "<div ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'  style='min-width:140px'><div class='pull-right' style='display: flex;'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-text config='formcon[" + index + "]' is-read-only=isReadOnly['" + controlType.fieldCode + "'] is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //时间
                    date: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            //时间的样式在新建和详情页面不同，所以将表单全部放到指令中
                            var htmltext = "";
                            if (pagesign == "detail") {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "']  irm-detaildate page='page' config='formcon[" + index + "]' is-read-only=isReadOnly['" + controlType.fieldCode + "'] is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "'] ></div>"
                                //htmltext = "<div ng-if=isShowData['" + controlType.fieldCode + "'] irm-date config='formcon[" + index + "]' config=formcon is-read-only=isReadOnly['" + controlType.fieldCode + "'] is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "'] ></div>"

                            } else {
                                htmltext = "<div ng-if=isShowData['" + controlType.fieldCode + "'] irm-date config='formcon[" + index + "]' config=formcon is-read-only=isReadOnly['" + controlType.fieldCode + "'] is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "'] ></div>"
                            }
                            return htmltext;
                        }
                    },
                    //多行文本框
                    textarea: {
                      
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                               // htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group mispt-detail-form-textarea'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div page=page irm-textarea is-read-only=isReadOnly['" + controlType.fieldCode + "']  config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-textarea config='formcon[" + index + "]' is-read-only=isReadOnly['" + controlType.fieldCode + "']  is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";

                            } else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-textarea config='formcon[" + index + "]' is-read-only=isReadOnly['" + controlType.fieldCode + "']  is-required=isRequired['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //单选框
                    radiolist: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-radiolist page='page' readonly=isReadOnly['" + controlType.fieldCode + "'] config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            return htmltext;
                        }
                    },
                    //下拉框
                    dropdownlist: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                            //    htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-dropdownlist  page='page' is-read-only=isReadOnly['" + controlType.fieldCode + "'] config='formcon[" + index + "]' view-post-data=viewPostData></div> </div>";
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group '><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-dropdownlist is-read-only=isReadOnly['" + controlType.fieldCode + "'] config='formcon[" + index + "]' view-post-data=viewPostData></div> </div>";

                            }
                            else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group '><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-dropdownlist is-read-only=isReadOnly['" + controlType.fieldCode + "'] config='formcon[" + index + "]' view-post-data=viewPostData></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //文件
                    fileDirective: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                    htmltext = "<div ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div bascirm-file-directive  is-read-only=isReadOnly['" + controlType.fieldCode + "'] business-module-id=businessModuleId  app-code=appCode scene-code=sceneCode  rpid=rpid name=name id=id  page=page state=state  rpid=rpid  config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";

                            } else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label' style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-file-directive config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //图片
                    picture: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div is-read-only=isReadOnly['" + controlType.fieldCode + "']  rpid='rpid' page=page irm-picture new-manager=newManager config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            } else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-picture new-manager=newManager config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //组织机构选人
                    organizationPersonnel: {//"organizationPersonnel"
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                //lz-memberlist-config="ctmrdTaskManager.memberConfig"
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-organization-detailpersonnel  lz-memberlist-config='ctmrdTaskManager.memberConfig' config='formcon[" + index + "]'  is-read-only=isReadOnly['" + controlType.fieldCode + "'] view-post-data=viewPostData['" + controlType.fieldCode + "']></div></div>";

                            } else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-organization-personnel  user-manager='orguserManager' config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div></div>";
                            }
                            return htmltext;
                        }
                    },
                    //登记人
                    principal: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'> <label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-del-principal page='page' config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            } else {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-principal user=user config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            }
                            return htmltext;
                        }
                    },
                    //录音指令
                    recording: {
                        buildControl: function ($scope,controlType, index, pagesign) {
                            var htmltext = "";
                            if (pagesign == "detail") {
                                htmltext = "<div  ng-if=isShowData['" + controlType.fieldCode + "'] class='form-group'><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{formcon[" + index + "].fieldName}}</div>：</div></label><div irm-recording rpid=rpid config='formcon[" + index + "]' view-post-data=viewPostData['" + controlType.fieldCode + "']></div> </div>";
                            } else {
                            }
                            return htmltext;
                        }
                    },

                };
                return typemodal;
            }
            
            //=================定义标准的接口 begin=================
        }
    });
})(window, angular, define);


