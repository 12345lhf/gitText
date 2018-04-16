; (function (window, angular, undefined, $) {
    "use strict";
    //合并命名
    var IRMModel = angular.module('lz.mistpt.irmModel', ['ng']);//定义包名，并确定依赖模块

    //新建页面和详情页面的框架指令，将页面的html转换为带有指令的html并且编译。.
    IRMModel.directive("formControl", ["$compile", "$templateCache", "$q", function ($compile, $templateCache, $q) {
        return {
            replace: true,
            restrict: 'EA',
            link: function ($scope, elm, iAttrs, controller) {

                $scope.jstemp = [];
                $scope.csstemp = [];
                angular.forEach($scope.controls, function (item, k) {
                    if (item.webJS) {
                        $scope.jstemp.push(item.webJS);
                    }
                    if (item.webCSS) {
                        $scope.csstemp.push(item.webCSS);
                    }
                });
                $scope.bindhtml1 = function () {
                    var defer = $q.defer();
                    //循环将css注册到页面
                    angular.forEach($scope.csstemp, function (item, k) {
                        if (item) {
                            var head = document.getElementsByTagName('head')[0];
                            var link = document.createElement('link');
                            link.href = item;
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            head.appendChild(link);
                        }

                    });
                    require($scope.jstemp, function (obj) {
                        var htmlmodal = {};
                        var len = arguments.length;
                        angular.forEach(arguments, function (item, k) {
                            //这是一个对象，每次加载新的时候，循环一次已经存在的数据，如果codetype已经存在，不进行添加
                            if (item) {
                                var newmodal = item.gethtmlconfig();
                                if (newmodal) {
                                    for (var sProp in newmodal) {
                                        if (sProp) {
                                            if (!htmlmodal[sProp]) {
                                                htmlmodal[sProp] = newmodal[sProp];
                                            }
                                        }
                                    }
                                }
                                //htmlmodal = item.gethtmlconfig();
                            }

                        });
                        defer.resolve && defer.resolve({ html: htmlmodal });//执行成功
                    });
                    return defer.promise;
                };
                var typemodal;
                function ControlType(controlType, i, page) {
                    var fieldCode = controlType.fieldCode;
                    if (typemodal[controlType.controlType].buildControl) {
                        var a = typemodal[controlType.controlType].buildControl($scope, controlType, i, page);

                    } else {
                        a = "";
                    }
                    return a;
                }
                var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
                    root = elm,
                    childScope,
                    destroyChildScope = function () {
                        (childScope || DUMMY_SCOPE).$destroy();
                    };

                iAttrs.$observe("config", function (config) {
                    if (config) {
                        var html = "";
                        var promiseAll = $q.all([$scope.bindhtml1()]);
                        promiseAll.then(function (res) {
                            if (res[0]) {
                                typemodal = res[0].html;
                                for (var i = 0; i < $scope.formcon.length; i++) {
                                    //判断项目字段中是否有值
                                    if ($scope.formcon[i].controlType == "projectName") {
                                        if ($scope.projectName == "" || $scope.projectName == null) {

                                        }
                                        else {
                                            html += ControlType($scope.formcon[i], i, $scope.page);
                                        }
                                    } else if ($scope.formcon[i].fieldCode == "Conclusion" && $scope.page != "detail") {

                                    }
                                    else {
                                        html += ControlType($scope.formcon[i], i, $scope.page);

                                    }
                                }
                                destroyChildScope();
                                //构建新的子作用域
                                childScope = $scope.$new(true);
                                var content = $compile(html)($scope);
                                root.replaceWith(content);
                                root = content;
                            }
                            $scope.$on("$destroy", destroyChildScope);
                        });
                    }
                });
            }
        };
    }]);

    //单行文本框指令
    IRMModel.directive("irmText", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'timelyBlur': '=',
                'isRequired': "=",
                'isReadOnly': "=",
            },
            template: "<div ng-class={true:\'has-error\',false:\'\'}[(isRequired)] class='col-sm-9'><input name='{{config.fieldCode}}' ng-readonly='isReadOnly' type='text' class='form-control f14' ng-class='{{unitinput}}'    placeholder={{holdervalue}} ng-model='viewPostData'/><span ng-if='isshow' class='unit'>{{Unit}}</span></div>",
            link: function (scope, elem, attr) {
                if (scope.config.controlConfig.isRequired == true) {
                    scope.holdervalue = "必填";
                    scope.allowempty = false;
                } else {
                    scope.allowempty = true;
                }
                //判断返回的其他类型是否为空//如果为空的话就为普通控件，如果不为空的话就是金额控件，如果是金额控件的话只允许输入数字
                if (scope.config.controlNormal && JSON.parse(scope.config.controlNormal).IsNormal == false) {
                    scope.unitinput = 'unitinput';
                    scope.isshow = true;
                    var controlNormal = JSON.parse(scope.config.controlNormal);
                    scope.IsNormal = controlNormal.IsNormal;
                    scope.Unit = controlNormal.Unit;

                }

                //判断是否是详细页面，如果是的话重新组装模板
                scope.timelyBlur1 = function (atts, newValue) {
                    //发送事件
                    if (scope.oldvalue != newValue) {
                        scope.oldvalue = newValue;
                        //app.event.trigger(scope, "event-irm-detail-form-change", { code: atts.name, value: newValue });
                    }

                    //scope.timelyBlur(atts, newValue);
                }
                var html = "";
                if (scope.page == "detail") {
                    scope.oldvalue = scope.viewPostData;
                    html = "<div class='col-sm-9 mispt-form-control-box' ng-class={true:\'mispt-readonly\',false:\'mispt-write\'}[isReadOnly] ><span class='allow-emputy-control' name='{{config.fieldCode}}' lz-Autoinput bind-feild='viewPostData' read-only=isReadOnly change='timelyBlur1' lz-allowempty=!config.controlConfig.isRequired class='form-controls f14' myplaceholder={{holdervalue}}></span></div>";
                    var root = elem;
                    var content = $compile(html)(scope);
                    root.replaceWith(content);
                    root = content;
                }
            }
        }
    });

    /*多行文本框指令*/
    IRMModel.directive("irmTextarea", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'isRequired': '=',
                'isReadOnly': "=",
            },
            template: "<div ng-class={true:\'has-error\',false:\'\'}[(isRequired)] class='col-sm-9'><textarea class='form-control' ng-readonly='isReadOnly'  placeholder={{holdervalue}} cols='3' name='remarks' ng-model='viewPostData'></textarea></div>",
            link: function (scope, elem, attr) {
                if (scope.config.controlConfig.isRequired == true) {
                    scope.holdervalue = "必填";
                }
                if (scope.config.controlConfig.isReadOnly) {
                    scope.readonlyvalue = true;
                }
                scope.timelyBlur = function (atts, newValue) {
                    if (scope.oldvalue != newValue) {
                        //判断是否时必填
                        if (scope.config.controlConfig.isRequired == true && (newValue == "" || newValue == null)) {
                            scope.viewPostData = scope.oldvalue;
                        }
                        else {
                            scope.oldvalue = scope.viewPostData;
                            //app.event.trigger(scope, "event-irm-detail-form-change", { code: atts.name, value: newValue });

                        }
                    }
                }
                var html = "";
                if (scope.page == "detail") {
                    scope.oldvalue = scope.viewPostData;
                    html = "<div class='col-sm-9 mispt-form-control-box' ng-class={true:'mispt-readonly',false:'mispt-textarea-read'}[(isReadOnly)]><span name='{{config.fieldCode}}' misptcoop-textarea rows='3'lz-placeholder={{holdervalue}} value='viewPostData' read-only=isReadOnly class='auto-textearinput-class' on-change='timelyBlur' ></span></div>";

                    var root = elem;
                    var content = $compile(html)(scope);
                    root.replaceWith(content);
                    root = content;
                }

            }
        }
    });

    /*日期(date)在详情下存在问题，可以重新实现一个*/
    IRMModel.directive("irmDate", function ($compile, $filter) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'isRequired': "=",
                'isReadOnly': "=",
            },
            link: function (scope, elem, attr, controller) {
                scope.tempdate = "";
                if (scope.config.controlConfig.isRequired == true) {
                    scope.viewdata = "必填";
                }
                scope.datatype = scope.config.controlConfig.dateType;

                if (scope.datatype == "yyyy年MM月dd日") {
                    scope.minview = 2;
                } else {
                    scope.minview = 0;
                }
                //console.log(elem.html());
                //时间控件的回掉方法
                scope.projectInformationTimeSelect = function (viewPostData1) {
                    scope.viewdata = $filter('date')(viewPostData1, scope.datatype);
                    document.getElementById(scope.config.fieldCode).innerText = scope.viewdata;
                }

                var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
             root = elem,
             childScope,
             destroyChildScope = function () {
                 (childScope || DUMMY_SCOPE).$destroy();
             };
                attr.$observe("config", function (config) {
                    if (config) {
                        var html = "";
                        html = "<div class='form-group'><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{config.fieldName}}</div>：</div></label><div  class='col-sm-9'><div ng-class={true:\'has-errortime\',false:\'\'}[(isRequired)] class='time_div1'><span name='{{config.fieldCode}}' id='{{config.fieldCode}}' class='time_div_span'><span style=' color: #999999;'>{{viewdata}}</span></span> <span ng-show='!isReadOnly' class='icon-calendar time_div_img' lz-datepicker=\"projectInformationTimeSelect(viewPostData)\"  min-view={{minview}} ng-model='viewPostData'> </span> </div></div></div>";
                        destroyChildScope();
                        //构建新的子作用域
                        childScope = scope.$new(true);
                        var content = $compile(html)(scope);
                        root.replaceWith(content);
                        root = content;
                    }
                    scope.$on("$destroy", destroyChildScope);
                });
            }
        }

    });

    //详细页面的时间控件
    IRMModel.directive('irmDetaildate', function ($compile, $filter) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'isRequired': "=",
                'isReadOnly': "=",
            },
            link: function (scope, elem, attr) {
                if (scope.config.controlConfig.dateType == "yyyy年MM月dd日") {
                    scope.minview = 2;
                } else {
                    scope.minview = 0;
                }
                if (scope.viewPostData) {
                    scope.conviewPostData = scope.viewPostData;
                    if (new Date(scope.conviewPostData) == "Invalid Date") {
                        if (scope.config.controlConfig.dateType == "yyyy年MM月dd日") {
                            scope.conviewPostData = scope.conviewPostData + '00时00分00秒'
                        } else {
                            if (scope.conviewPostData.indexOf("分") == -1) {
                                scope.conviewPostData = scope.conviewPostData + '00时00分00秒'
                            }
                        }
                        var data = (scope.conviewPostData + '00秒').replace(/[年月]/g, ',').replace(/[日]/g, ',').replace(/[时分秒]/g, ',');
                        data = data.substring(0, data.length - 1);
                        //将字符串按照逗号进行分割
                        var strs = data.split(",");
                        //字符串按照要求拼接成新的时间字符串 //month dd,yyyy hh:mm:ss
                        var datestring = strs[0] + "/" + strs[1] + "/" + strs[2] + " " + strs[3] + ":" + strs[4] + ":" + strs[5];
                        data = new Date(datestring);
                        scope.conviewPostData = data;
                    }
                    scope.oldvalue = $filter('date')(scope.conviewPostData, scope.config.controlConfig.dateType);
                    scope.viewdata = $filter('date')(scope.conviewPostData, scope.config.controlConfig.dateType);
                } else {
                    scope.conviewPostData = '';
                }



                if (scope.config.controlConfig.isRequired == true && (scope.conviewPostData == "" || scope.conviewPostData == null)) {
                    scope.requirclass = "detailtimespan";
                    scope.viewdata = "必填";
                }
                scope.projectInformationTimeSelect = function (conviewPostData) {
                    scope.viewdata = $filter('date')(conviewPostData, scope.config.controlConfig.dateType);
                    document.getElementById(scope.config.fieldCode).innerText = scope.viewdata;

                    if (scope.viewdata != scope.oldvalue) {
                        if (scope.page == "detail") {
                            //发送事件
                            scope.oldvalue = scope.viewdata;
                            scope.viewPostData = scope.viewdata;
                            //app.event.trigger(scope, "event-irm-detail-form-change", { code: scope.config.fieldCode, value: scope.viewdata });
                        }

                    }

                }
                var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
            root = elem,
            childScope,
            destroyChildScope = function () {
                (childScope || DUMMY_SCOPE).$destroy();
            };
                attr.$observe("config", function (config) {
                    if (config) {
                        var html = "";
                        html = "<div class='form-group'><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{config.fieldName}}</div>：</div></label><div  class='col-sm-9'><div ng-class={\'border-time-readOnly\':isReadOnly,\'has-errortime\':isRequired}  class='time_div1' ><span name='{{config.fieldCode}}' id='{{config.fieldCode}}' class='time_div_span'><span style=' color: #999999;'>{{viewdata}}</span></span> <span ng-show='!isReadOnly' class='icon-calendar time_div_img' lz-datepicker=\"projectInformationTimeSelect(conviewPostData)\"  min-view={{minview}} ng-model='conviewPostData'> </span> </div></div></div>";
                                                                                                                                                                                                                                                              // ng-class={true:,false:\'\'}[isReadOnly]// ng-class={true:\'has-errortime\',false:\'\'}[(isRequired)]
                        //html = "<div class='form-group' ng-class={true:\'select-time-readOnly\',false:\'select-time\'}[isReadOnly] ><label class='col-sm-2  control-label'style='min-width:140px'><div class='pull-right' style='display:flex'><div class='addformwrap'>{{config.fieldName}}</div>：</div></label><div class='col-sm-9 detail_time' style='padding-top: 7px;' ng-class={true:\'mispt-time-readonly\',false:\'\'}[(isReadOnly)]><div class='time_div time_div_detail'><span  name='{{config.fieldCode}}'id='{{config.fieldCode}}' class='time_div_span'><span ng-class='requirclass'>{{viewdata}}</span></span><span ng-show='!isReadOnly' class='icon-calendar time_div_img' lz-datepicker=\"projectInformationTimeSelect(viewPostData)\" min-view={{minview}} ng-model='viewPostData'></span></div></div></div>";
                        destroyChildScope();
                        //构建新的子作用域
                        childScope = scope.$new(true);
                        var content = $compile(html)(scope);
                        root.replaceWith(content);
                        root = content;
                    }
                    scope.$on("$destroy", destroyChildScope);
                });
            }
        }
    });

    /*单选框radiolist*/
    IRMModel.directive("irmRadiolist", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'readonly': '=',
            },
            template: "<div class='col-sm-9' ng-class='detailclass'><div  ng-class='formradioleft'><label class='radio-inline mispt-form-radio-inline' ng-repeat='item in radiosop'><input ng-class='detailradioclass'  ng-disabled='isreadonly' type='radio' name='{{config.fieldCode}}' ng-click='selfInsideManager.radioInlineItemClick(item);' ng-checked='item.checked'><div style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-top: -1px;'>{{item.name}}</div></label></div></div>",
            link: function (scope, elem, attr) {
                scope.isreadonly = false;
                //如果是详情页面判断其是否是只读
                if (scope.page == 'detail') {
                    scope.formradioleft = 'formradioleft',
                    scope.detailradioclass = 'detailredio';
                    scope.detailclass = 'formredio';
                    scope.isreadonly = scope.readonly;
                } else {
                    scope.detailclass = 'addradio';
                }
                scope.$watch('readonly', function (newValue, oldValue) {
                    scope.isreadonly = scope.readonly;
                });
                scope.radiosop = [];

                if (scope.viewPostData != undefined) {
                    if (scope.viewPostData != '') {
                        //判断传入的值是否在配置项中
                        if ($.inArray(scope.viewPostData, scope.config.controlConfig.options) == -1) {
                            //添加到单选框数组的第一个
                            scope.config.controlConfig.options.unshift(scope.viewPostData);
                        }

                        angular.forEach(scope.config.controlConfig.options, function (item, k) {
                            if (item == scope.viewPostData) {
                                scope.viewPostData = item;
                                scope.radiosop[k] = {
                                    name: item,
                                    checked: true
                                }
                            } else {
                                scope.radiosop[k] = {
                                    name: item,
                                    checked: false
                                }
                            }

                        });
                    } else {
                        if (scope.page == 'detail') {
                            angular.forEach(scope.config.controlConfig.options, function (item, k) {
                                if (item == scope.viewPostData) {
                                    scope.viewPostData = item;
                                    scope.radiosop[k] = {
                                        name: item,
                                        checked: true
                                    }
                                } else {
                                    scope.radiosop[k] = {
                                        name: item,
                                        checked: false
                                    }
                                }

                            });
                        } else {
                            angular.forEach(scope.config.controlConfig.options, function (item, k) {
                                if (k == 0) {
                                    scope.viewPostData = item;
                                    scope.radiosop[k] = {
                                        name: item,
                                        checked: true
                                    }
                                } else {
                                    scope.radiosop[k] = {
                                        name: item,
                                        checked: false
                                    }
                                }

                            });
                        }

                    }
                } else {
                    if (scope.page == 'detail') {
                        angular.forEach(scope.config.controlConfig.options, function (item, k) {
                            if (item == scope.viewPostData) {
                                scope.viewPostData = item;
                                scope.radiosop[k] = {
                                    name: item,
                                    checked: true
                                }
                            } else {
                                scope.radiosop[k] = {
                                    name: item,
                                    checked: false
                                }
                            }

                        });
                    }
                }
                scope.selfInsideManager = {
                    radioInlineItemClick: function (item) {
                        if (item.name != scope.viewPostData) {
                            scope.viewPostData = item.name;
                            if (scope.page == "detail") {
                                //  app.event.trigger(scope, "event-irm-detail-form-change", { code: scope.config.fieldCode, value: scope.viewPostData });
                            }
                        }

                    }
                };
            }
        }
    });

    /*下拉框dropdownlist*/
    IRMModel.directive("irmDropdownlist", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'timelyBlur': '=',
                'isReadOnly': "=",
            },
            template: "<div  class='col-sm-9'   ng-class='detailclass'><div misptcoop-drop-down  ng-class=dropclass options='config.controlConfig.options' on-select-change='presentCompanyChange' iscoop=isdetail  read-only='isReadOnly' need-hover=needhover bind-entity='viewPostData' field-name='{{config.fieldCode}}' ></div></div>",
            link: function (scope, elem, attr) {
                if (scope.page == "detail") {
                    scope.isdetail = true;
                    scope.needhover = true;
                    scope.detailclass = "mispt-form-control-box";
                    scope.dropclass = "mistpt-padding-left12";

                } else {
                    scope.isdetail = false;
                    //scope.dropclass = "dropDropadd";
                    scope.needhover = false;
                }
                if (scope.isReadOnly) {
                    scope.detailclass = "mispt-form-control-box detailclassreadonly";
                }
                //console.log(scope.config.controlConfig.options);
                //判断是否发生了变化
                scope.presentCompanyChange = function (newValue, oldValue) {
                    scope.viewPostData[scope.config.fieldCode] = newValue;
                    //  app.event.trigger(scope, "event-irm-detail-form-change", { code: scope.config.fieldCode, value: newValue });

                }
            }
        }
    });

    /*文件(fileDirective)*/
    IRMModel.directive("irmFileDirective", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'timelyBlur': '=',
            },
            link: function (scope, elem, attr) {
                scope.viewPostData = {
                    "children": [
                    ],
                    "resourcemodels": []
                }
                scope.viewPostData.children = angular.copy(scope.config.controlConfig.folders);
                var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
                   root = elem,
                   childScope,
                   destroyChildScope = function () {
                       (childScope || DUMMY_SCOPE).$destroy();
                   };
                var html = "";
                attr.$observe("config", function (config) {
                    if (config) {
                        html = "<div class='col-sm-9 '><div class='mispt-upload-container'> <div lz-mispt-upload upload-type='add' init-source='viewPostData'class='add-file-height'></div></div></div>";
                        destroyChildScope();
                        //构建新的子作用域
                        childScope = scope.$new(true);
                        var content = $compile(html)(scope);
                        root.replaceWith(content);
                        root = content;
                    }
                    scope.$on("$destroy", destroyChildScope);
                });
            }
        }
    });

    /*图片(picture)*/
    IRMModel.directive("irmPicture", function ($compile, lzMisptUploadService, $modal) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                'rpid': '=',
                'isReadOnly': "=",
            },
            templateUrl: $versionManger.getHtml("/BasePlus/InformationRegistModel/PC/View/FormControl/PictureTemplate.html"),
            link: function (scope, elem, attr) {
                //  //弹出修改名称dialog
                //var ShowBagDialog = function (obj, beginfun) {
                //    

                //    scope.resource = obj;
                //    scope.resource.name=scope.resource.name+"(1)"
                //    //关闭弹窗
                //    scope.CancelUpload = function ($event, resource, hide) {
                //        hide();
                //    }
                //    //开始上传
                //    scope.BeginUpload = function ($event, resource, hide) {
                //        
                //        hide();
                //        resource.showname = resource.name + "." + resource.exptype;
                //        beginfun(resource);
                //    }
                //    //弹出dialog
                //    var intervateusermodal = $modal({
                //        scope: scope,
                //        templateUrl: "/BasePlus/InformationRegistModel/PC/JS/FormControl/test.html",
                //        backdrop: 'static',
                //        prefixEvent: 'modal',
                //        placement: 'center',
                //        show: true
                //    });
                //}
                scope.allowImageFormats = "jpg,png,jpeg,bmp,gif";
                //新建图片管理
                scope.newManager = {
                    //标识是否保存完成
                    isSaveFinish: true,

                    //图片相关
                    isShowDelPhoto: false,
                    selectedDelPhotos: [],
                    filePostData: {
                        "children": [

                        ],
                        "resourcemodels": []
                    },

                    //上传照片
                    uploadPhoto: function (files) {
                        if (!files) {
                            return;
                        }
                        var _this = this;
                        ////定义重名文件夹
                        //scope.tempfolder = [];
                        for (var i = 0; i < files.length; i++) {
                            //判断是否重名，如果重名则提示让其改名，不重名则直接上传
                            //
                            //angular.forEach(_this.filePostData.resourcemodels, function (item, k) {
                            //    if (item.showname == files[i].name) {
                            //        //该文件已经重名，提示修改名字的弹窗
                            //        scope.tempfolder.push(files[i]);
                            //        return false;
                            //    }


                            //});
                            //
                            //if (scope.tempfolder.length != 0) {
                            //    //弹出修改名称的弹窗，点击确认再次判断是否重名，重名给出提示，不进行下一步操作，不重名则
                            //    //进行上传，点击取消，则清空当前的数组，关闭弹窗
                            //    ShowBagDialog(scope.tempfolder[0]);
                            //    scope.tempfolder = [];
                            //}
                            //
                            var promise = lzMisptUploadService.uploadTempFile(files[i]);
                            promise.then(function (resObj) {//上传成功
                                var resource = {
                                    "rid": resObj.fileid,
                                    "showname": resObj.showname,
                                    "rtype": 1,
                                    "partitiontype": "0",
                                    "iconurl": resObj.iconurl,
                                    "delChecked": false
                                };
                                _this.filePostData.resourcemodels.push(resource);
                                scope.viewPostData = _this.filePostData;
                            });
                        }
                    },
                    //打开删除照片操作
                    showDelPhoto: function () {
                        if (!this.filePostData.resourcemodels.length) {
                            opacityAlert("没有任何照片!", "glyphicon glyphicon-ok-sign");
                            return false;
                        }
                        this.isShowDelPhoto = true;
                    },
                    //关闭删除照片操作
                    closeDelPhoto: function () {
                        this.isShowDelPhoto = false;
                        var _this = this;
                        angular.forEach(_this.filePostData.resourcemodels, function (res, k) {
                            res.delChecked = false;
                        });
                        this.selectedDelPhotos = [];
                    },
                    //选中/取消 删除某一张照片
                    selectPhotoClick: function (photo) {
                        if (!this.isShowDelPhoto) return;
                        photo.delChecked = !photo.delChecked;
                        if (photo.delChecked) {
                            this.selectedDelPhotos.push(photo);
                        }
                        else {
                            this.selectedDelPhotos.splice(this.selectedDelPhotos.indexOf(photo), 1);
                        }
                    },
                    //批量删除照片(UI删除)
                    batchDeleteDealBeforePhotos: function () {
                        if (this.selectedDelPhotos.length <= 0) {
                            opacityAlert("请选择要删除的照片!", "glyphicon glyphicon-ok-sign");
                            return false;
                        }
                        //从ui中删除
                        for (var i = 0; i < this.selectedDelPhotos.length; i++) {
                            this.filePostData.resourcemodels.splice(this.filePostData.resourcemodels.indexOf(this.selectedDelPhotos[i]), 1);
                            scope.viewPostData = this.filePostData;

                        }
                        //关闭删除操作
                        this.closeDelPhoto();
                    },
                };
                if (scope.page != "detail") {
                    scope.viewPostData = scope.newManager.filePostData;

                }
                //详细页面的图片管理
                var allowImageFormats = "bmp,pcx,tiff,gif,jpeg,jpg,jpe,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,png,hdri,raw,wmf,lic,emf";
                scope.dealBeforeFileManager = {
                    allowImageFormats: allowImageFormats,
                    dealBeforeEnclosureSource: null,
                    isShowMisptUpload: true,
                    dealBeforeEnclosureData: null,
                    //处理前 照片数据源
                    dealBeforePhotos: [],
                    //是否显示删除
                    isShowDelPhoto: false,
                    //选中的要删除的图片对象
                    selectedDelPhotos: [],
                    //打开删除照片操作
                    showDelPhoto: function () {
                        if (!this.dealBeforePhotos.length) {
                            opacityAlert("没有任何照片!", "glyphicon glyphicon-ok-sign");
                            return false;
                        }
                        this.isShowDelPhoto = true;
                    },
                    //关闭删除照片操作
                    closeDelPhoto: function () {
                        this.isShowDelPhoto = false;
                        var _this = this;
                        angular.forEach(_this.dealBeforePhotos, function (res, k) {
                            res.delChecked = false;
                        });
                        this.selectedDelPhotos = [];
                    },
                    //选中/取消 删除某一张照片
                    selectPhotoClick: function (photo) {
                        if (!this.isShowDelPhoto) return;
                        photo.delChecked = !photo.delChecked;
                        if (photo.delChecked) {
                            this.selectedDelPhotos.push(photo);
                        }
                        else {
                            this.selectedDelPhotos.splice(this.selectedDelPhotos.indexOf(photo), 1);
                        }
                    },
                    //加载 处理前 照片
                    loadBeforePhoto: function (rpid, folderid) {
                        var _this = this;
                        lzMisptUploadService.getFolderResource(scope.rpid, scope.folderId).then(
                            function success(res_files) {
                                angular.forEach(res_files.resourcemodels, function (res, k) {
                                    res.delChecked = false;
                                    _this.dealBeforePhotos.unshift(res);
                                });
                            }, function error(msg) {
                                console.log(msg);
                            }
                        );
                    },
                    //上传 处理前 照片
                    uploadDealBeforePhotos: function (files) {
                        if (!files) {
                            return;
                        }
                        var _this = this;
                        lzMisptUploadService.addFiles(files, { "rpid": scope.rpid, isEditName: false, "rtype": 1, "partitiontype": "0", "classid": scope.folderId, "description": "" }).then(function (resources) {
                            angular.forEach(resources, function (res, k) {
                                _this.dealBeforePhotos.push(res);
                            });
                        });
                    },
                    //批量删除照片（api请求）
                    batchDeleteDealBeforePhotos: function () {
                        if (this.selectedDelPhotos.length <= 0) {
                            opacityAlert("请选择要删除的图片!", "glyphicon glyphicon-ok-sign");
                            return false;
                        }
                        var tempResources = [];
                        for (var i = 0; i < this.selectedDelPhotos.length; i++) {
                            tempResources.push(this.selectedDelPhotos[i].rid);
                        }
                        var apiOperateModel = {
                            rpid: scope.rpid,
                            partitiontype: "0",
                            resourceids: tempResources.join(','),
                            //folderids: folders.join(',')
                        };
                        var _this = this;
                        lzMisptUploadService.batchDeleteFileOrFolder(apiOperateModel).then(function (data) {
                            if (data.ErrorCode.Code == "0") {
                                //从ui中删除
                                for (var i = 0; i < _this.selectedDelPhotos.length; i++) {
                                    _this.dealBeforePhotos.splice(_this.dealBeforePhotos.indexOf(_this.selectedDelPhotos[i]), 1);
                                }
                                //关闭删除操作
                                _this.closeDelPhoto();
                            }
                        });
                    },
                    getDealBeforeEnclosureFolderSource: function (operationType, data) {
                        this.dealBeforeEnclosureSource = data;
                        if (!(data.children.length || data.resourcemodels.length) && scope.detailManager.isReadOnly) {
                            this.isShowMisptUpload = false;
                        }
                    }
                };
                if (scope.page == "detail") {
                    scope.detailManager = {
                        isReadOnly: false,
                    }
                    scope.$watch('isReadOnly', function () {
                        if (scope.isReadOnly) {
                            scope.detailManager.isReadOnly = true;
                        }
                    });
                    if (scope.isReadOnly) {
                        scope.detailManager.isReadOnly = true;
                    }
                    //加载资源
                    scope.rpid = scope.rpid;
                    if (scope.viewPostData == "" || scope.viewPostData == null) {
                        //获取config.fieldCode作为文件夹的名称
                        var folder = { rpid: scope.rpid, name: scope.config.fieldCode, parentid: "", partitiontype: "0", description: "" };
                        var promise = lzMisptUploadService.addFolder(folder);
                        promise.then(function success(data) {
                            scope.folderId = data.DataContext.id;
                            scope.viewPostData = scope.folderId;
                            //发送事件将获取到的数据保存到数据库
                            app.event.trigger(scope, "event-irm-detail-form-change", { code: scope.config.fieldCode, value: scope.viewPostData });
                            scope.dealBeforeFileManager.loadBeforePhoto();
                        });
                    } else {
                        scope.folderId = scope.viewPostData;
                        scope.dealBeforeFileManager.loadBeforePhoto();
                    }
                }
            }
        }
    });

    /*新建页面登记人(principal)*/
    IRMModel.directive("irmPrincipal", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'user': '=',
            },
            template: "<div class='col-sm-9'><div><span lz-cooperationusercard lz-uid='user.uid'><img id='userimg' class='lzUserImg32 img-circle' lz-img='user.face' wh-size='32X32' err-src='/BasePlus/MISPTFramework/PC/Images/img.gif' /><span class='user-name facenamespan'>{{user.username}}</span></span></div></div>",
            link: function (scope, elem, attr) {
                scope.viewPostData = scope.user.uid;
            }
        }
    });

    /*详情页登记人(principal)*/
    IRMModel.directive("irmDelPrincipal", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
            },
            template: "<div class='col-sm-9  mispt-form-control-box'style='margin-top:0px'><span style='padding-top: 7px' class='f14 readonly-span' name='{{config.fieldCode}}' lz-Autoinput bind-feild='username' myplaceholder='' read-only='true'></span> </div>",

            link: function (scope, elem, attr) {
                //根据userid查询人员的姓名
                var tempTaskIds = [];
                tempTaskIds.push({ uid: scope.viewPostData });
                app.http.post("api/user/getuserbatchbyuefilter", { '': tempTaskIds }, function (dataUsers) {
                    if (dataUsers.ErrorCode.Code == "0") {
                        scope.username = dataUsers.DataContext[0].username
                    }
                });

            }
        }
    });

    /*录音(recording)*/
    IRMModel.directive("irmRecording", function ($compile, lzMisptUploadService) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'config': '=',
                'viewPostData': '=',
                'rpid': '=',
            },
            template: "<div  class='col-sm-9 mispt-form-control-box'style='height:100%;padding-left: 20px;padding-top: 0px;'><div class='radiodiv' id='{{id}}'ng-click='playPause()'><div class='pull-right audiotext' id='{{textid}}'></div><span class='radioback'><img  class='radioimg'id='{{idimg}}' ></img></span></div></div>",
            link: function (scope, elem, attr) {


                var music = new Audio();
                var playStatus = "";
                var t;
                music.onended = function () {

                    scope.pause();
                    document.getElementById(scope.idimg).src = "/BasePlus/InformationRegistModel/PC/Images/vioce.png";

                };
                if (scope.viewPostData) {
                    scope.viewPostData = JSON.parse(scope.viewPostData)
                    if (scope.viewPostData && scope.viewPostData.FileIds) {
                        if (scope.viewPostData.FileIds[0]) {
                            scope.id = scope.viewPostData.FileIds[0];
                            scope.textid = scope.id + "text";
                            scope.idimg = scope.id + "img";
                            app.http.get("api/fileserver/gallelryfilemodel/" + scope.id, function (data) {
                                var totaltimefixed = scope.totaltimefixed || 1;
                                scope.audioinfo = JSON.parse(data.DataContext.description);
                                scope.audioinfo.totaltime = Math.ceil(parseFloat(scope.audioinfo.totaltime).toFixed(totaltimefixed));
                                document.getElementById(scope.textid).innerHTML = scope.audioinfo.totaltime + "\'\'";
                                document.getElementById(scope.id).style.width = scope.audioinfo.totaltime / 600 * 100 + "%";
                                document.getElementById(scope.idimg).src = "/BasePlus/InformationRegistModel/PC/Images/vioce.png";
                                app.http.transformurl("api/fileserver/download/" + scope.id, 'file', function (src) {
                                    playStatus = false;
                                    scope.ispause = true;
                                    music.src = src;//这里替换成一个有效的音频文件地址以方便测试

                                    scope.pause = function () {
                                        scope.ispause = true;
                                        playStatus = false;
                                    }
                                    scope.playPause = function () {
                                        if (playStatus) {
                                            playStatus = !playStatus;
                                            scope.ispause = true;
                                            document.getElementById(scope.idimg).src = "/BasePlus/InformationRegistModel/PC/Images/vioce.png";

                                            music.pause();
                                        } else {
                                            playStatus = !playStatus;
                                            music.play();
                                            document.getElementById(scope.idimg).src = "/BasePlus/InformationRegistModel/PC/Images/voicegif.gif";

                                            scope.ispause = false;
                                        }
                                    }
                                });
                            },
                            function () { },
                            'file');

                        } else {
                            var DUMMY_SCOPE = {
                                $destroy: angular.noop
                            },
                 root = elem,
                 childScope,
                 destroyChildScope = function () {
                     (childScope || DUMMY_SCOPE).$destroy();
                 };
                            attr.$observe("config", function (config) {
                                if (config) {
                                    var html = "";
                                    html = "<div  class='col-sm-9 mispt-form-control-box'style='height:100%;padding-left: 20px;'></div>";
                                    destroyChildScope();
                                    //构建新的子作用域
                                    childScope = scope.$new(true);
                                    var content = $compile(html)(scope);
                                    root.replaceWith(content);
                                    root = content;
                                }
                                scope.$on("$destroy", destroyChildScope);
                            });
                            scope.playPause = function () {
                                opacityAlert("暂无录音文件", " glyphicon glyphicon-remove-sign");
                            }

                        }



                    }

                } else {
                    var DUMMY_SCOPE = {
                        $destroy: angular.noop
                    },
                    root = elem,
                    childScope,
                    destroyChildScope = function () {
                        (childScope || DUMMY_SCOPE).$destroy();
                    };
                    attr.$observe("config", function (config) {
                        if (config) {
                            var html = "";
                            html = "<div  class='col-sm-9 mispt-form-control-box'style='height:100%;padding-left: 20px;'></div>";
                            destroyChildScope();
                            //构建新的子作用域
                            childScope = scope.$new(true);
                            var content = $compile(html)(scope);
                            root.replaceWith(content);
                            root = content;
                        }
                        scope.$on("$destroy", destroyChildScope);
                    });
                    scope.playPause = function () {
                        opacityAlert("暂无录音文件", " glyphicon glyphicon-remove-sign");
                    }
                }
            }
        }
    });

    /*基础协作文件(fileDirective)*/
    IRMModel.directive("bascirmFileDirective", function ($compile, lzMisptUploadService) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                'isReadOnly': "=",
                'config': '=',
                'viewPostData': '=',
                'page': '=',
                //任务的状态
                'state': '=',
                //任务的名称
                'name': '=',
                //资源池id
                'rpid': '=',
                //任务id
                'id': '=',
                //appcode
                'appCode': '=',
                //动态类型
                //动态的扩展字段
                'businessModuleId': '=',
                'sceneCode': '=',
            },
            link: function (scope, elem, attr) {
                scope.isshow = false;
                //先判断是否存在文件夹id，如果存在的话继续进行，如果不存在的话先生成一个文件夹id，然后保存
                if (scope.viewPostData == "" || scope.viewPostData == null) {
                    //在该资源池下添加文件夹文件夹名称为scope.config.fieldCode
                    var folder = { rpid: scope.rpid, name: scope.config.fieldCode, parentid: "", partitiontype: "0", description: "" };
                    var promise = lzMisptUploadService.addFolder(folder);
                    promise.then(function success(data) {
                        scope.viewPostData = data.DataContext.id;
                        scope.isshow = true;
                        var expanddata = {
                            AppCode: scope.appCode,
                            BusinessModuleId: scope.businessModuleId,
                            SceneCode: scope.sceneCode,
                            TaskId: scope.id,
                            Source: "CTM_Post_Source",
                        };
                        scope.basefileparameter = [];
                        scope.basefileparameter.push(scope.config.fieldCode);

                        scope.basefileparameter[scope.config.fieldCode] = {
                            islog: false,//*必填 操作是否产生日志
                            ispost: false,//*必填   操作是否产生动态
                            ispermissions: !scope.isReadOnly,// *必填  是否可操作文件 权限相关
                            rpid: scope.rpid,//*必填 资源区id
                            cooperationid: scope.id, //*必填 基础协作id
                            name: scope.name,//*必填 基础协作名称
                            classid: scope.viewPostData,// 选填 初始加载只打开当前id下的文件id
                            appcode: scope.appCode,//*必填  应用appcode
                            posttype: "CTM_Post",//*必填 产生动态所需的参数
                            expanddata: JSON.stringify(expanddata),//动态跳转所需的参数
                            rootname: scope.name,
                            fixedheight: "300"
                        }
                        //发送事件将获取到的数据保存到数据库
                        app.event.trigger(scope, "event-irm-detail-form-change", { code: scope.config.fieldCode, value: scope.viewPostData });

                    });
                } else {
                    scope.isshow = true;
                    var expanddata = {
                        AppCode: scope.appCode,
                        BusinessModuleId: scope.businessModuleId,
                        SceneCode: scope.sceneCode,
                        TaskId: scope.id,
                        Source: "CTM_Post_Source",
                    };
                    scope.basefileparameter = [];
                    scope.basefileparameter.push(scope.config.fieldCode);
                    scope.basefileparameter[scope.config.fieldCode] = {
                        islog: false,//*必填 操作是否产生日志
                        ispost: false,//*必填   操作是否产生动态
                        ispermissions: !scope.isReadOnly,
                        rpid: scope.rpid,//*必填 资源区id
                        cooperationid: scope.id, //*必填 基础协作id
                        name: scope.name,//*必填 基础协作名称
                        classid: scope.viewPostData,// 选填 初始加载只打开当前id下的文件id
                        appcode: scope.appCode,//*必填  应用appcode
                        posttype: "CTM_Post",//*必填 产生动态所需的参数
                        expanddata: JSON.stringify(expanddata),//动态跳转所需的参数
                        rootname: scope.name,
                        fixedheight: "300"
                    }
                }
                //scope.$watch('state', function (newValue, oldValue) {
                //    if (scope.basefileparameter) {


                //        if (scope.basefileparameter[scope.config.fieldCode]) {
                //            scope.basefileparameter[scope.config.fieldCode].islog = /1|2/gi.test(newValue);
                //            scope.basefileparameter[scope.config.fieldCode].ispost = newValue == 2;
                //            //scope.basefileparameter[scope.config.fieldCode].ispermissions = /1|2/gi.test(newValue);
                //        }
                //    }
                //});
                scope.$watch('isReadOnly', function (newValue, oldValue) {

                    if (scope.basefileparameter) {
                        if (scope.basefileparameter[scope.config.fieldCode]) {
                            scope.basefileparameter[scope.config.fieldCode].ispermissions = !scope.isReadOnly;
                        }
                    }
                });
                var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
                   root = elem,
                   childScope,
                   destroyChildScope = function () {
                       (childScope || DUMMY_SCOPE).$destroy();
                   };
                var html = "";
                attr.$observe("config", function (config) {
                    if (config) {
                        html = "<div class='col-sm-9'ng-if=isshow><div  style='height:300px; overflow: hidden;border-radius: 2px;border: 1px solid #bbb;margin-top: 7px;margin-left: -3px;'><lz-basecooperationfile basefileparameter=basefileparameter['" + scope.config.fieldCode + "']></lz-basecooperationfile></div></div>";
                        destroyChildScope();
                        //构建新的子作用域
                        childScope = scope.$new(true);
                        var content = $compile(html)(scope);
                        root.replaceWith(content);
                        root = content;
                    }
                    scope.$on("$destroy", destroyChildScope);
                });
            }
        }
    });
    
    /*组织机构人员选择(organizationPersonnel)*/
    IRMModel.directive("irmOrganizationPersonnel", function ($compile) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                appCode: "=",
                sceneCode: "=",
                userManager: "=",
                config: "=",
            },
            template: "<div class='col-sm-9'><ul class='list-inline mispt-form-member'style='overflow:hidden'><li ng-repeat='user in userManager.selectedUsers'><span style='display: flex;align-items: center;'  class='userValid' lz-cooperationusercard lz-uid='user.uid'> <img id='userimg' class='lzUserImg32 img-circle' lz-img='user.face' wh-size='32X32' err-src='/BasePlus/MISPTFramework/PC/Images/img.gif' /><span style='width:59px;overflow:hidden' class=' facenamespan user-name'><span class='ellipsis'>{{user.username}}</span></span></span></li> <li class='userBtn' title='添加成员' lz-Commonpersonselect  lz-Rangeoeid=selectoid lz-isselectsingle={{issingle}} lz-IsAllowSelfDel='true' lz-Getpersonhave='userManager.getPersonHave()' lz-Pickclick='userManager.onDealSelectedUser(args)'> <button type='button' class='btn btn-default btn-circle lzUserImg32' data-original-title='添加成员'> <i class='icon-plus'></i> </button> </li> </ul></div>",
            link: function (scope, elem, attr) {
                /*
                */
                //判断是否是需要是本组织下的
                if (scope.config.controlConfig.thisOrg == "true") {
                    //lz-Rangeoeid="app.session.user.selectorg.oid"
                    scope.selectoid = app.session.user.selectorg.oid;
                }
                //判断是否是单选
                if (scope.config.controlConfig.single == "true") {
                    scope.issingle = "true";
                    //lz-isselectsingle
                }

            }
        }
    });
    /*组织机构选人详情页irm-organization-detailpersonnel*/
    IRMModel.directive("irmOrganizationDetailpersonnel", function ($compile, lzMisptSearchScope, $stateParams, lzMisptWebAPI, $timeout) {
        return {
            restrict: "A",
            replace: true,
            templateUrl: $versionManger.getHtml("/BasePlus/InformationRegistModel/PC/View/FormControl/IRM_org_member.html"),

            scope: {
                lzMemberlistConfig: "=",
                'config': '=',
                'viewPostData': '=',
                'isReadOnly': "=",
            },
            link: function (scope, element, attrs, controlles) {  //任务id

                //判断是否是需要是本组织下的
                if (scope.config.controlConfig.thisOrg == "true") {
                    //lz-Rangeoeid="app.session.user.selectorg.oid"
                    scope.selectoid = app.session.user.selectorg.oid;
                }
                //判断是否是单选
                if (scope.config.controlConfig.single == "true") {
                    scope.issingle = "true";
                    //lz-isselectsingle
                }





                scope.tid = scope.lzMemberlistConfig.tid;
                //任务状态
                scope.state = scope.lzMemberlistConfig.state;
                //任务成员
                scope.appcode = scope.lzMemberlistConfig.appcode;
                scope.businessModuleId = scope.lzMemberlistConfig.businessModuleId;
                scope.sceneCode = scope.lzMemberlistConfig.sceneCode;
                scope.taskTitle = scope.lzMemberlistConfig.taskTitle;
                scope.members = scope.lzMemberlistConfig.members;
                scope.loginuser = app.session.user;

                //单个成员转为服务器成员
                function member2PostModel(member) {
                    return {
                        UserId: member.uid,
                        UserFaceId: member.face,
                        OrganizationId: "",
                        user: {
                            username: member.username,
                        }
                    };
                }
                //多个成员转为服务器成员
                function members2PostModel(members) {
                    var postModel = [];
                    members.forEach(function (item) {
                        postModel.push(member2PostModel(item));
                    });
                    return postModel;
                }
                scope.userManager = {
                    //打开弹窗的获取人员函数
                    getPersonHave: function () {
                        var args = [];
                        //获取全部人员，将其转换为控件所需格式。
                        //angular.forEach(scope.members, function (item, k) {

                        //    args.push({
                        //        uid: item.uid,
                        //        face: item.face,
                        //        username: item.user.username,
                        //        type: "user",
                        //    });
                        //});
                        
                       
                        for (var i = scope.members.length-1; i >= 0; i--)
                        {
                            args.push({
                                uid: scope.members[i].uid,
                                face: scope.members[i].face,
                                username: scope.members[i].user.username,
                                type: "user",
                            });
                        }
                        return args;
                    },
                    onDealSelectedUser: function (args, relateid) {


                        //如果返回的成员为空，（如果原有成员不为空则删除原有成员，为空的话则跳出）
                        if (args.length == 0) {
                            //判断原有成员是否为空
                            if (scope.members.length != 0) {
                                //删除原有的成员
                                //循环成员列表
                                var mids = [];
                                angular.forEach(scope.members, function (item, k) {
                                    if (item.utype != "1") {
                                        mids.push({
                                            "UserId": item.uid,
                                            "OrganizationId": item.oid,
                                        })
                                    }
                                });
                                var url = 'api/Runtime/Business/Member/Remove/' + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid;
                                lzMisptWebAPI.post(url, { '': JSON.stringify({ 'Members': mids }) }, "InformationRegistModel").then(function (data) {
                                    if (data == true) {
                                        scope.members = [];
                                        scope.memberinit();
                                    }
                                });
                            }
                        } else {
                            if (scope.members.length == 0) {
                                //将新增人员添加到数据库中
                                var postData = members2PostModel(args);
                                lzMisptWebAPI.post("api/Runtime/Business/Member/Add/" + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid, { '': JSON.stringify({ 'Members': postData }) }, 'InformationRegistModel').then(function (data) {
                                    if (data) {
                                        var users = [];
                                        data = postData;
                                        if (data.length == 0) {
                                            opacityAlert('没有新的成员添加', 'glyphicon glyphicon-info-sign')
                                        }
                                        else {
                                            //添加成功,循环当前返回的数据，将重复的数据数据在列表中删除
                                            angular.forEach(data, function (v, k) {
                                                if (scope.state == 1) {
                                                    v.isvalid = 0;
                                                }
                                                //先保存到数据库后，成功则加入到列表，失败则报错
                                                users.push({
                                                    face: v.UserFaceId,
                                                    isvalid: false,
                                                    uid: v.UserId,
                                                    oid: v.OrganizationId,
                                                    user: v.user,
                                                })
                                            });
                                            scope.members = scope.members.concat(users);
                                            //发送事件
                                            scope.memberinit();
                                        }
                                    }

                                });
                            } else {
                                var postData = members2PostModel(args);
                                //var removal = function (postData) {
                                //    var temp = [];
                                //    angular.forEach(postData, function (item, index) {
                                //        angular.forEach(scope.members, function (k) {
                                //            if (item.UserId == k.uid) {
                                //                temp.push(index);
                                //            }
                                //        });
                                //    });
                                //    if (temp.length != 0) {
                                //        for (var i = temp.length - 1; i >= 0; i--) {
                                //            postData.splice(temp[i], 1);
                                //        }
                                //    }
                                //    return postData;
                                //}
                                //var postEntity = {
                                //    members: removal(postData),
                                //}
                                //判断是否是单人选择（如果是单人选择的话，将原来的删除，添加新的人员）
                                //判断人员是否发生了变化，如果没有发生变化则不发送请求
                                if (scope.config.controlConfig.single == "true") {
                                    if (args[0].uid == scope.members[0].uid) {
                                        //不发送请求
                                        return;
                                    }
                                    else {
                                        //将原来的成员删除，然后添加新的成员，同时刷新成员列表
                                        //循环成员列表
                                        var mids = [];
                                        angular.forEach(scope.members, function (item, k) {
                                            if (item.utype != "1") {
                                                mids.push({
                                                    "UserId": item.uid,
                                                    "OrganizationId": item.oid,
                                                })
                                            }
                                        });
                                        var url = 'api/Runtime/Business/Member/Remove/' + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid;
                                        lzMisptWebAPI.post(url, { '': JSON.stringify({ 'Members': mids }) }, "InformationRegistModel").then(function (data) {
                                            if (data == true) {
                                                scope.changeMemberConfig(mids[0].UserId, true, "");
                                                //将新的成员添加到成员列表中
                                                lzMisptWebAPI.post("api/Runtime/Business/Member/Add/" + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid, { '': JSON.stringify({ 'Members': postData }) }, 'InformationRegistModel').then(function (data) {
                                                    if (data) {
                                                        var users = [];
                                                        data = postData;
                                                        if (data.length == 0) {
                                                            // opacityAlert('没有新的成员添加', 'glyphicon glyphicon-info-sign')
                                                        }
                                                        else {
                                                            //添加成功,循环当前返回的数据，将重复的数据数据在列表中删除
                                                            angular.forEach(data, function (v, k) {
                                                                if (scope.state == 1) {
                                                                    v.isvalid = 0;
                                                                }
                                                                //先保存到数据库后，成功则加入到列表，失败则报错
                                                                users.push({
                                                                    face: v.UserFaceId,
                                                                    isvalid: false,
                                                                    uid: v.UserId,
                                                                    oid: v.OrganizationId,
                                                                    user: v.user,
                                                                })
                                                            });
                                                        }
                                                        scope.members = scope.members.concat(users);
                                                        //发送事件
                                                        scope.memberinit();
                                                    }


                                                })
                                            }
                                        });
                                    }
                                } else
                                    /////////多人选择。初步实现是将原来的成员全部删除，后续将会判断人员是否发生变化,将添加的人员全部添加
                                    ///到新的成员中
                                {
                                    //将原来的成员删除，然后添加新的成员，同时刷新成员列表
                                    //循环成员列表
                                    var mids = [];
                                    angular.forEach(scope.members, function (item, k) {
                                        if (item.utype != "1") {
                                            mids.push({
                                                "UserId": item.uid,
                                                "OrganizationId": item.oid,
                                            })
                                        }
                                    });
                                    var url = 'api/Runtime/Business/Member/Remove/' + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid;
                                    lzMisptWebAPI.post(url, { '': JSON.stringify({ 'Members': mids }) }, "InformationRegistModel").then(function (data) {
                                        if (data == true) {
                                            scope.members = [];
                                            //将新的成员添加到成员列表中
                                            lzMisptWebAPI.post("api/Runtime/Business/Member/Add/" + scope.businessModuleId + "/" + scope.sceneCode + "/" + scope.tid, { '': JSON.stringify({ 'Members': postData }) }, 'InformationRegistModel').then(function (data) {
                                                if (data) {
                                                    var users = [];
                                                    data = postData;
                                                    if (data.length == 0) {
                                                        // opacityAlert('没有新的成员添加', 'glyphicon glyphicon-info-sign')
                                                    }
                                                    else {
                                                        //添加成功,循环当前返回的数据，将重复的数据数据在列表中删除
                                                        angular.forEach(data, function (v, k) {
                                                            if (scope.state == 1) {
                                                                v.isvalid = 0;
                                                            }
                                                            //先保存到数据库后，成功则加入到列表，失败则报错
                                                            users.push({
                                                                face: v.UserFaceId,
                                                                isvalid: false,
                                                                uid: v.UserId,
                                                                oid: v.OrganizationId,
                                                                user: v.user,
                                                            })
                                                        });
                                                    }
                                                    scope.members = scope.members.concat(users);
                                                    //发送事件
                                                    scope.memberinit();
                                                }


                                            })
                                        }
                                    });
                                }
                            }



                        }

                    }

                }
                scope.setisquit = function () {

                    // app.event.trigger(scope, 'event-iim-detail-toolbar-detail-cancel', "1");
                    var pScope = lzMisptSearchScope.findUp(scope, 'modaltest', 'modaltest1111');
                    pScope.close();
                }
                //人员初始化
                scope.memberinit = function () {

                    var tempTaskIds = [];
                    angular.forEach(scope.members, function (item, k) {
                        if (item.utype == 1) {
                            scope.curmember = item;
                        }
                        tempTaskIds.push({ uid: item.uid });
                    });

                    var maptoviewmodal = function (serverModel, uidUser) {

                        angular.forEach(serverModel, function (item, k) {
                            item.user = uidUser[item.uid];
                        });
                    }
                    app.http.post("api/user/getuserbatchbyuefilter", { '': tempTaskIds }, function (dataUsers) {
                        if (dataUsers.ErrorCode.Code == "0") {
                            var tempUidUser = {};
                            angular.forEach(dataUsers.DataContext, function (item, k) {
                                tempUidUser[item.uid] = item;
                            });
                            maptoviewmodal(scope.members, tempUidUser);
                            scope.memberslength = scope.members.length;
                        }
                    });


                };
                scope.memberinit();
            },
            controller: function ($scope, $element, $attrs) {
                //删除成员初始化
                this.changeMemberConfig = function (newmember, isdelete, isquit) {
                    var member = [];
                    angular.forEach($scope.members, function (item) {
                        if (item.uid != newmember) {
                            member.push(item);
                        }
                    });
                    $scope.members = member;
                    $scope.memberinit();
                    $scope.memberslength = $scope.members.length;
                    if (isdelete == true) {
                        //如果是退出的话，发送事件
                        if (isquit == "1") {
                            $scope.setisquit();
                        }
                    }
                }
                $scope.changeMemberConfig = function (newmember, isdelete, isquit) {
                    var member = [];
                    angular.forEach($scope.members, function (item) {
                        if (item.uid != newmember) {
                            member.push(item);
                        }
                    });
                    $scope.members = member;
                    $scope.memberinit();
                    $scope.memberslength = $scope.members.length;
                    if (isdelete == true) {
                        //如果是退出的话，发送事件
                        if (isquit == "1") {
                            $scope.setisquit();
                        }
                    }
                }
                $scope.open2Message = function (taskId) {

                }
            }
        }
    });
    
    /*信息登记模型选人页签（已经作废）*/
    IRMModel.directive("lzirmCooperationusercard", function ($popover, lzMisptWebAPI, lzMisptSearchScope, $stateParams) {
        var api = {
            loaduser: "api/user/loaduser",
            sendmsg: "api/colleaguelist/sendmsg",
            getone: "api/cooperation/v2/member/get"
        }
        var loadUser = function (uid, callback) {
            app.http.post(api.loaduser, { "": uid }, function (data) {
                if (data.ErrorCode.Code == "0") {
                    if (typeof callback == "function") {
                        callback(data.DataContext);
                    }
                }
            });
        }
        var getMember = function (cid, uid, callback) {
            app.http.get(api.getone + "/" + cid + "/" + uid, function (data) {
                callback(data.ErrorCode.Code == "0", data.DataContext);
                if (data.ErrorCode.Code == "0") {
                    if (typeof callback == "function") {
                        callback(true, data.DataContext);
                    }
                } else if (data.ErrorCode.Code == "45014") {
                    callback(false, data.DataContext);
                    //opacityAlert("该成员已退出协作！", "glyphicon glyphicon-info-sign");
                }
            });
        }
        return {
            restrict: 'A',
            require: ['?^irmOrganizationDetailpersonnel'],
            scope: {
                uid: "=lzUid",
                tid: "=lzTid",
                utype: "=lzType",
                mid: "=lzMid",
                oid: "=oid",
                appcode: "@lzAppcode",
                state: "=lzState",
                businessModelId: "=bid",
                sceneCode: "=scenecode",
                readonly: "=readonly",
            },
            link: function (scope, element, attrs, controlles) {

                scope.isreadonly = scope.readonly
                scope.lzMemberList = controlles;
                var myplacement = attrs.lzPlacement;
                if (!myplacement || myplacement == "") {
                    myplacement = "auto";
                }
                var myTemplateUrl = attrs.lzTemplateUrl;
                if (!myTemplateUrl || myTemplateUrl == "") {
                    myTemplateUrl = "/BasePlus/InformationRegistModel/PC/View/FormControl/IRMUserCard.html";
                }

                var myPopover = $popover(element, { scope: scope, animation: "am-flip-x", container: "body", html: true, trigger: 'manual', autoClose: true, contentTemplate: myTemplateUrl, placement: myplacement });
                element.bind("click", function () {
                    loadUser(scope.uid, function (data) {
                        scope.userMsg = data;
                        if (!scope.user || !scope.user.uid) {
                            scope.user = { uid: scope.userMsg.uid, uname: scope.userMsg.username, face: scope.userMsg.face };
                        }
                    })
                    getMember(scope.cid, scope.uid, function (isexist, data) {
                        if (isexist) {
                            scope.user = data;
                        } else {
                            scope.user = { uid: scope.userMsg.uid, uname: scope.userMsg.username, face: scope.userMsg.face };
                        }
                    })
                    myPopover.show();
                });
                app.event.bind(scope, eventnames.token_lose, function (e, data) {
                    if (myPopover) {
                        myPopover.hide();
                    }
                });
                app.event.bind(scope, eventnames.cooperation_closemodal, function (e, data) {
                    if (myPopover) {
                        myPopover.hide();
                    }
                });
            },
            controller: function ($scope, $http, $modal, lzMisptWebAPI) {
                //名片工具栏操作方法
                $scope.loginuser = app.session.user;
                $scope.popoverToolBar = {
                    observe: function () {

                    },
                    openIMChat: function (hide) {
                        hide();
                        app.openIMChat(0, $scope.user.uid);
                    },
                    sendEmail: function (hide) {
                        var email = $scope.userMsg.email;
                        if (email && email != "") {
                            hide();
                            email = "mailto:" + email;
                            window.open(email);
                        } else {
                            opacityAlert("用户没有填写email!");
                            return;
                        }
                    },
                    sendPhoneMsg: function (hide) {
                        var mobile = $scope.userMsg.mobile;
                        if (mobile && mobile != "") {
                            hide();
                            $scope.receiver = {
                                face: $scope.userMsg.face,
                                uid: $scope.userMsg.uid,
                                username: $scope.user.uname,
                                phonenum: $scope.userMsg.mobile,
                                msg: "",
                                msglengh: 0
                            }
                            var addremarkmodal = $modal({
                                scope: $scope,
                                templateUrl: '/App/Cooperation/PC/View/Template/Template_SendShortMsg.html',
                                backdrop: 'static',
                                prefixEvent: 'modal',
                                placement: 'center',
                                show: true
                            });
                        } else {
                            opacityAlert($scope.user.uname + "没有填写手机号!");
                            return;
                        }
                    },
                    setmsglengh: function () {
                        $scope.receiver.msglengh = $scope.receiver.msg.length;
                    },
                    SendMsg: function (hide) {
                        app.http.post(api.sendmsg, { senduid: app.session.user.uid, receiveduid: $scope.receiver.uid, content: $scope.receiver.msg }, function (data) {
                            if (data.ErrorCode.Code == "0") {
                                if (data.DataContext) {
                                    opacityAlert("发送成功!");
                                    hide();
                                } else {
                                    opacityAlert("发送失败!");
                                }
                            } else {
                                opacityAlert(data.ErrorCode.Message);
                            }
                        }, function (data) {
                            opacityAlert("网络繁忙!");
                        });
                    },
                    //删除方法
                    deleteMember: function (hide, isquit) {

                        var uid = $scope.uid;
                        var tid = $scope.tid;
                        var mid = $scope.mid;
                        var oid = $scope.oid;
                        var appcode = $scope.appcode;
                        var mids = [];
                        //是否自己退出
                        $scope.isquit = isquit;
                        mids.push({
                            "UserId": uid,
                            "OrganizationId": oid,
                        });
                        var url = "";
                        url = 'api/Runtime/Business/Member/Remove/' + $scope.businessModelId + "/" + $scope.sceneCode + "/" + tid;

                        lzMisptWebAPI.post(url, { '': JSON.stringify({ 'Members': mids }) }, "InformationRegistModel").then(function (data) {

                            if (data == true) {
                                $scope.lzMemberList[0].changeMemberConfig($scope.uid, true, $scope.isquit);
                                hide();
                            }
                            else {
                                opacityAlert('该成员移除失败', 'glyphicon glyphicon-info-sign')
                            }
                        }, function (data) {
                            opacityAlert('该成员移除失败', 'glyphicon glyphicon-info-sign')
                        });
                    }
                }
            }
        }
    });

    //新建页面的弹窗服务
    IRMModel.service('taskModal', function ($modal, lzMisptSearchScope, $timeout) {
        //私有或者方法
        function openModal($scope, myMisptModalConfig) {
            var empty = {};
            var baseConfig = {
                ismask: true,
                title: "未传入数据",
                isEsc: false,
                isScrollable: true,
                showHeader: true,
                isHeaderConfig: false,
                showFooter: false,
                headerButtonConfig: [],
                footerButtonConfig: [],
                height: "500px",
                width: "500px",
                templateUrl: "/BasePlus/MISPTFramework/PC/View/MISPT_ModelContent.html",
                showHeaderbottom: true,
                showtitlecenter: false,
                iscustomHeader: false,
            };
            var nowConfig = angular.extend(baseConfig, myMisptModalConfig);
            //判断遮罩层的显示方式
            if (nowConfig.ismask == undefined || nowConfig.ismask == true) {
                nowConfig.ismask = 'static';
            }
            else {
                nowConfig.ismask = false;
            }
            //Esc自动关闭
            if (nowConfig.isEsc == "" || nowConfig.isEsc == undefined) {
                nowConfig.isEsc == false;
            }
            var lzModal = $modal({
                id: "123456",
                scope: $scope,
                size: 'lg',
                templateUrl: "/BasePlus/InformationRegistModel/PC/View/FormControl/IRM_Modal.html",
                controller: function ($scope, $modal) {
                    //获取用户传入的键值对
                    //取消的事件
                    $scope.modaltest = "modaltest1111";
                    $scope.showtitlecenter = nowConfig.showtitlecenter;
                    $scope.isbottom = nowConfig.showHeaderbottom;
                    $scope.misptmodal = nowConfig.keyvalue;
                    $scope.formValid = false;
                    var close = function () {
                        $scope.isInited = false;
                        var tags = document.getElementsByClassName("modal center fade in ng-scope am-fade");
                        var indexzindex = jQuery(tags).css("z-index");
                        jQuery(tags).focus();
                        jQuery(tags).css("z-index", "" + 1030);
                    }
                    //关闭方法
                    $scope.close = function ($hide) {
                        lzModal.hide();
                        lzModal.destroy();
                        close();
                        //遮罩层处理，关闭弹窗后，获取当前页面的modal元素，对其进行判断将其z-index元素设置1050
                    }
                    //遮罩层处理方式
                    //打开模态框时，控制遮罩层的样式如果是0层不做处理，判断有几层遮罩层采用循环的方式获取最后一层遮罩层的z-index
                    //在此基础上加10，
                    $(document).ready(function () {

                        var tags = document.getElementsByClassName("modal center fade in ng-scope am-fade");
                        //获取tags的元素个数，如果为0，不做处理
                        var modalCount = tags.length;
                        if (modalCount != 0) {
                            var indexzindex = jQuery(tags).css("z-index");
                            jQuery(tags).css("z-index", "" + 1000);
                        }
                    });
                    //当按下ESC时获取下个页面的焦点
                    document.onkeydown = function (event, lzModal, $window, $rootScope, $bsCompiler, $q, $templateCache, $http, $animate, $timeout, $sce, dimensions) {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        if (e && e.keyCode == 27) { // 按 Esc 
                            //判断esc的功能是否开启，如果开启执行内部的函数，否则不执行
                            if (nowConfig.isEsc) {
                                close();
                            }
                        }
                    }
                    //标题头
                    if (nowConfig.title != "" || nowConfig.title != undefined) {
                        $scope.lzMisModal_title = nowConfig.title;
                    }
                    else {
                        $scope.title = "";
                    }
                    $scope.lzMisModaltitledesc = nowConfig.titledesc;
                    //获取浏览器的高度
                    var clientHeight = document.documentElement.clientHeight;
                    $scope.lzHeight = clientHeight - 98 + "px";
                    //判断该高度是
                    $scope.mystyle = { 'max-height': $scope.lzHeight };
                    //传入宽度
                    var congigWidth = (nowConfig.width).split('p')[0];
                    //获取浏览器的宽度
                    var clientWidth = document.documentElement.clientWidth;
                    if (congigWidth > clientWidth) {
                        $scope.lzWidth = clientWidth + "px";
                        $scope.urlwidth = clientWidth - 2 + "px";
                    } else {
                        $scope.lzWidth = nowConfig.width;
                        $scope.urlwidth = congigWidth - 2 + "px";

                    }
                    $scope.myWidthstyle = { 'width': $scope.lzWidth };
                    //是否使用滚动条
                    $scope.isScrollable = nowConfig.isScrollable;
                    //是否使用footer
                    $scope.showFooter = nowConfig.showFooter;
                    $scope.footerButtonConfig = nowConfig.footerButtonConfig;
                    $scope.headerButterConfig = nowConfig.headerButterConfig
                    $scope.showHeader = nowConfig.showHeader;
                    $scope.isHeaderConfig = nowConfig.isHeaderConfig;
                    $scope.iscustomHeader = nowConfig.iscustomHeader;
                    //指定的模板页
                    $scope.lzMisModal_url = nowConfig.templateUrl;
                    $scope.setDisable = function (footerButtonConfig) {
                        $scope.footerButtonConfig = footerButtonConfig;
                    }
                    //实时检测弹窗的大小，如果是奇数的话减一，偶数的话还是原来的高度
                },

                container: 'body',
                backdrop: nowConfig.ismask,
                prefixEvent: 'model123456',
                placement: 'center',
                keyboard: nowConfig.isEsc,
            });
            $scope.isInited = false;

            $timeout(function () {
                var setheight = function () {
                    if (document.getElementById("InformationRegistModel_Add")) {
                        //获取当前页面的高度，如果高度为奇数的话高度加1，如果高度为偶数的话不变
                        var height = document.getElementById("InformationRegistModel_Add").offsetHeight;
                        if (height % 2 == 0) {
                            document.getElementById("InformationRegistModel_Add").style.height = height + "px";
                        } else {
                            document.getElementById("InformationRegistModel_Add").style.height = height + 1 + "px";
                        }
                    } else {
                        int = window.clearInterval(int)
                    }
                }
                var int = self.setInterval(setheight, 100);//1000为1秒钟
                $scope.isInited = true;

            }, 400);


            //var int = self.setInterval(setheight, 100);//1000为1秒钟
            //按钮的点击事件方法
            $scope.applyClick = function (key, value, methodName, params) {
                var scope = lzMisptSearchScope.findIncludeThis($scope, key, value);
                //循环遍历传入的参数，使其统一,展开参数；
                //循环遍历传入的方法名：
                var methods = methodName.split('.');
                var temp;
                var that;
                for (var i = 0; i < methods.length; i++) {
                    if (methods.length == (i + 1)) {
                        temp = (that || scopeu)[methods[i]];
                        break;
                    }
                    if (that) {
                        that = that[methods[i]];
                    }
                    else {
                        that = scope[methods[i]];
                    }
                };
                //传入参数：
                var paramsbase = [];
                var newparams = angular.extend(paramsbase, params);
                //安全的关闭方法
                function safeClose() {
                    lzModal.hide();
                    lzModal.destroy();
                }
                newparams.push(safeClose);
                temp.apply(that, newparams);
            }

        }
        return {
            lzModal: openModal,
        };
    });

    //注入指令
    if (window.app) {
        !window.app['useModule'] || window.app['useModule']('lz.mistpt.irmModel');
    }
})(window, angular, undefined, angular.element);