"use strict";
; (function () {
    app.register.controller("InformationRegistModel_List", function ($scope, $q, $state, lzMisptRouter, lzMisptWebAPI, $filter, misptModal, taskModal, lzMisptUploadService, $injector) {
        //注册退出任务列表
        app.event.register("event-irm-detail-modal-close");
        app.event.register("event-irm-detail-member_quit");
        //注册表单修改列表联动
        app.event.register("event-irm-detail-from-change-tolist");
        ////注册详情页面修改表单信息同步到列表
        //app.event.register("event-");
        app.event.register("event-iim-detail-toolbar-deleteflush");
        $scope.listtitle = $scope.runtimeContext.moduleInfo.name;
        //获取运行时配置上下文
        $scope.baseconfig = $scope.runtimeContext;
        $scope.appCode = $scope.baseconfig.moduleInfo.appCode;
        $scope.businessModuleId = $scope.baseconfig.moduleInfo.businessModuleId;
        $scope.sceneCode = $scope.baseconfig.sceneInfo.sceneCode;
        $scope.loadOper = {
            //滚动加载标识，在滚动加载时，直到返回结果之后才可以发送下次请求
            scrollFlag: true,
            //判断是不是加载完成，依据是第一次出现返回0条记录时（如果想刷新新增的记录，可以点击刷新按钮）
            isSearchFinish: false,
            //滚动加载的控制逻辑
            loadData: function () {
                if ($scope.loadOper.scrollFlag) {
                    $scope.loadOper.scrollFlag = false;
                    if (!$scope.loadOper.isSearchFinish) {
                        $scope.scarchtest(true);
                    }
                }
            },
            //初始化滚动加载配置
            init: function () {
                //滚动加载 初始值
                $scope.loadOper.scrollFlag = true;
                $scope.loadOper.isSearchFinish = false;
            }
        };
        //查找列表scope元素
        $scope.InformationRegistModelListManagerScope = 'InformationRegistModellistscope';
        //实例化配置对象
        var configirmManager = new ConfigManager1();
        //初始化配置信息
        configirmManager.initirm({
            appCode: $scope.appCode,
            sceneCode: $scope.sceneCode,
            sceneOrganizationId: $scope.runtimeContext.sceneInfo.sceneOrganizationId,
            businessModuleId: $scope.businessModuleId,//模块实例ID（取用户自定义字段）
            $http: {
                get: function (webapi, apiServer, success, error) {
                    lzMisptWebAPI.get(webapi, apiServer).then(success, error);
                },
                post: function (webapi, postData, apiServer, success, error) {
                    lzMisptWebAPI.post(webapi, postData, apiServer).then(success, error);
                }
            },
            initSuccess: function (modelInfo, controls) {
                $scope.controls = controls;
                //负责人字段集合
                $scope.principaltemp = [];
                $scope.baseconfig = $scope.runtimeContext;
                $scope.sceneOrganizationId = $scope.baseconfig.sceneInfo.sceneOrganizationId
                angular.forEach(modelInfo.formConfig.fields, function (item, k) {
                    if (item.controlType == "principal") {
                        $scope.principaltemp.push(item.fieldCode);
                    }
                })

                $scope.scarchtest = function (a) {
                    searchData(a);
                }
                $scope.taskOpen = function (th, tr) {

                    $scope.selectTaskId = tr._id;
                    $scope.openDetailManager.openDetail();
                }
                $scope.openDetailManager = {
                    title: "登记信息",
                    openDetail: function (event) {
                        //先判断二次开发的口
                        if (!$scope.detailTitle) {
                            $scope.detailTitle = $scope.openDetailManager.title;
                        }
                        var IRMdetailConfig = {
                            ismask: true,
                            title: $scope.detailTitle,
                            isScrollable: true,
                            showHeader: true,
                            showFooter: true,
                            footerButtonConfig: [
                         {
                             "text": "保存",
                             "class": "btn btn-long btn-default",
                             'key': 'InformationRegistModel_DetailScope', // 用于查询子scope的key
                             'value': 'InformationRegistModel_DetailScope',// 用于查询子scope的key
                             'methodName': 'InformationRegistModelManager.save',
                             'params': [1]//往来函件 状态值参数
                         },

                            ],
                            width: "900px",
                            height: "820px",
                            titledesc: $scope.titledesc,
                            templateUrl: "/BasePlus/InformationRegistModel/PC/View/Detail.html",
                        };

                        //获取配置信息，设置按钮
                        if (modelInfo.extendConfig && modelInfo.extendConfig.extendToolBarConfig && modelInfo.extendConfig.extendToolBarConfig.detail) {
                            if (modelInfo.extendConfig.extendToolBarConfig.detail.length != 0) {
                                IRMdetailConfig.footerButtonConfig = [];
                                angular.forEach(modelInfo.extendConfig.extendToolBarConfig.detail, function (item, k) {
                                    //判断是否支持pc端
                                    if (item.isSupportPC == true) {
                                        if (item.buttonName == "保存") {
                                            IRMdetailConfig.footerButtonConfig.push({
                                                "text": item.buttonName,
                                                "class": "btn btn-long btn-primary",
                                                'key': 'InformationRegistModel_DetailScope', // 用于查询子scope的key
                                                'value': 'InformationRegistModel_DetailScope',// 用于查询子scope的key
                                                'methodName': 'InformationRegistModelManager.IRMClickTemp',
                                                'params': [[$scope, item]]//往来函件 状态值参数
                                            });
                                        } else {
                                            IRMdetailConfig.footerButtonConfig.push({
                                                "text": item.buttonName,
                                                "class": "btn btn-long btn-default",
                                                'key': 'InformationRegistModel_DetailScope', // 用于查询子scope的key
                                                'value': 'InformationRegistModel_DetailScope',// 用于查询子scope的key
                                                'methodName': 'InformationRegistModelManager.IRMClickTemp',
                                                'params': [[$scope, item]]//往来函件 状态值参数
                                            });
                                        }


                                    }

                                });
                            }
                        }
                        taskModal.lzModal($scope, IRMdetailConfig);


                    }
                }

                //将取到的数据添加到列表中
                $scope.newTaskAddToList = function (paramObj) {
                    paramObj.isFavorite = false;
                    $scope.table.trs.uid = paramObj.CreateUserId;
                    if ($scope.timecode.length != 0) {
                        angular.forEach($scope.timecode, function (codeitem, m) {
                            //codeitem = firstLowerCase(codeitem);
                            if (codeitem == "CreateTime") {
                                paramObj.CreateTime = new Date(paramObj.CreateTime.$date);
                            } else {
                                paramObj[codeitem] = $filter('date')(paramObj[codeitem], "yyyy年MM月dd日");
                            }
                        });
                        angular.forEach($scope.codetemp, function (codeitem, m) {
                            if ($.inArray(codeitem, $scope.timecode) == -1) {
                                codeitem = firstLowerCase(codeitem);
                                paramObj[codeitem + 't'] = paramObj[codeitem];
                                if (paramObj[codeitem]) {
                                    paramObj[codeitem] = paramObj[codeitem].split('\n')[0];

                                }
                            }
                        });

                    }
                    var tempUidface = {};
                    angular.forEach($scope.principalcode, function (codeitem, m) {
                        codeitem = firstLowerCase(codeitem);
                        tempUidface[codeitem] = [];
                    });
                    angular.forEach($scope.principalcode, function (codeitem, m) {
                        if (paramObj[codeitem]) {
                            tempUidface[firstLowerCase(codeitem)].push({ uid: paramObj[codeitem] });
                        }
                    });
                    angular.forEach($scope.principalcode, function (codeitem, m) {
                        codeitem = firstLowerCase(codeitem);
                        if (tempUidface[codeitem].length > 0) {
                            lzMisptWebAPI.post('api/user/getuserbatchbyuefilter', { "": tempUidface[codeitem] }, '').then(function (userdata) {

                                var Uidname = {};
                                angular.forEach(userdata, function (item, k) {
                                    Uidname[item.uid] = item.username;
                                });


                                angular.forEach($scope.principalcode, function (codeitem, m) {
                                    codeitem = firstLowerCase(codeitem);
                                    if (Uidname[paramObj[codeitem]]) {
                                        var temp = Uidname[paramObj[codeitem]];
                                        paramObj[codeitem] = temp;
                                        paramObj[codeitem + "t"] = temp;
                                    }

                                });
                            })


                        };
                    });
                    $scope.table.trs.unshift(configirmManager.firstCharToLowerCaseForAll(paramObj));
                    //循环当前的对象，将序号加入到trs
                    angular.forEach($scope.table.trs, function (item, k) {
                        item.index = k + 1;
                    })
                }
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
                    var taskTypeItem = $scope.searchOrderParams.taskTypeItem
                    //查询实体(默认查询实体)
                    var searchModel = {
                        'AppCode': $scope.appCode,
                        'BusinessModuleId': $scope.businessModuleId,
                        'SceneCode': $scope.sceneCode,
                        'SceneOrgId': $scope.sceneOrganizationId,
                        ListType: taskTypeItem.index,//任务状态,例如我参与的...
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
                    var isbyuser = 1;
                    //发送请求
                    lzMisptWebAPI.post('api/Runtime/Business/GetList/' + isbyuser, searchModel, 'InformationRegistModel').then(function (data) {
                        data = configirmManager.firstCharToLowerCaseForAll(JSON.parse(data)).list;
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
                                                    var temp = Uidname[item[codeitem]];
                                                    item[codeitem] = temp;
                                                    item[codeitem + "t"] = temp;
                                                    //item[codeitem] = Uidname[item[codeitem]]

                                                }

                                            });
                                        })
                                    });

                                };
                            });

                        } else if (data.length == 0) {
                            $scope.loadOper.isSearchFinish = true;
                        }
                        //循环当前的对象，将序号加入到trs
                        angular.forEach($scope.table.trs, function (item, k) {
                            item.index = k + 1;
                        })

                        $scope.loadOper.scrollFlag = true;
                        //给列表内容赋值
                    }, function (error) {
                        opacityAlert("获取列表失败!", "glyphicon glyphicon-remove-sign");
                    })
                };
                $scope.modelInfo = modelInfo;
                //查询,排序,过滤,参数对象
                $scope.searchOrderParams = {
                    //选中的任务状态项
                    taskTypeItem: null,
                    //选中的排序项
                    sortItem: null,
                    //选中的过滤项
                    filterItem: null
                }
                $scope.pageHeader = {
                    //1>>下拉框
                    taskType: {
                        //2>> 初始化任务切换状态数据
                        initData: [
                            { index: 0, type: "unpublish", title: "未发布的", iconClass: "icon-share" },
                            { index: 2, type: "participant", title: "我参与的", iconClass: "icon-check" },
                            { index: 1, type: "responsible", title: "我负责的", iconClass: "icon-legal" },
                            { index: 3, type: "star", title: "我收藏的", iconClass: "icon-star-empty" },
                            { index: 5, type: "finish", title: "完成的", iconClass: "icon-ok" },
                            { index: 4, type: "abandon", title: "废弃的", iconClass: "icon icon-ban-circle" },
                        ],

                        //3>> 任务状态切换 事件
                        itemChange: function (item) {
                            searchOrderManger.init(item);
                            $scope.pageHeader.selectType.selectedItem = item;
                            $scope.searchOrderParams.taskTypeItem = item;
                            searchData();
                        }
                    },
                    selectType: {
                        selectedItem: null
                    },
                    //2>> 全屏按钮
                    fullScreen: {
                        isShow: true,
                        click: function () {
                            jQuery("#LetterController").parent().toggleClass("lzContent-fullScreen");
                        }
                    }
                };
                //查询排序、过滤条件初始化
                var searchOrderManger = {

                    //设置初始值和查询方法
                    init: function (taskTypeItem) {

                        if (taskTypeItem) {
                            $scope.searchOrderParams.taskTypeItem = taskTypeItem;
                            $scope.pageHeader.selectType.selectedItem = taskTypeItem;

                        } else {
                            $scope.searchOrderParams.taskTypeItem = $scope.pageHeader.taskType.initData[1];
                            $scope.pageHeader.selectType.selectedItem = $scope.pageHeader.taskType.initData[1];
                        }
                        //初始化 排序和过滤条件默认值
                        $scope.toolsBar.filterManager.selectFilterItem = $scope.toolsBar.filterManager.initData[0];
                        $scope.searchOrderParams.filterItem = $scope.toolsBar.filterManager.initData[0];
                        $scope.searchOrderParams.sortItem = $scope.toolsBar.orderManager.initData[0];
                        $scope.toolsBar.sort.selectRankItem = $scope.toolsBar.orderManager.initData[0];
                        //清空 查询条件的值
                        angular.forEach($scope.toolsBar.filterManager.initData, function (item, k) {
                            item.inputValue = "";
                        });
                        //设置表头的状态为初始值
                        angular.forEach($scope.table.ths, function (item, k) {
                            if (item.issort && item.field == $scope.searchOrderParams.sortItem.rankCode) {
                                item.isdesc = $scope.searchOrderParams.sortItem.isdesc;
                            }
                            else {
                                if (item.issort) { item.isdesc = false; }
                            }
                        });
                        //设置查询的个数和条数
                        $scope.table.trs = [];
                    }
                }
                /*判断是否有二次开发的相关配置如果有的话显示自定义配置的按钮,没有的话显示默认配置的按钮,自定义配置的按钮
                允许传入按钮的名称和样式,以及按钮的点击方法,同时可以传入多个按钮的配置
                
                */
                $scope.IRMlistMansge = {
                    eventRegister: function () {

                        angular.forEach(modelInfo.extendConfig.extendToolBarConfig.list, function (btn, k) {

                            if (btn.isSupportPC) {
                                app.event.register(btn.targetEvent);
                            }
                        });

                    },
                    userTargetBtn: function (btn) {

                        app.event.trigger($scope, btn.targetEvent, {});
                    },
                    asyncJS: function (serverConfigModel, controls) {
                        var tempExtendJSConfig = modelInfo.extendConfig.extendJSConfig
                        var defer1 = $q.defer();
                        if (tempExtendJSConfig && tempExtendJSConfig.web && tempExtendJSConfig.web.list) {
                            require(tempExtendJSConfig.web.list, function (obj) {
                                defer1.resolve && defer1.resolve({ serverConfigModel: serverConfigModel, userDefaultObj: obj, controls: controls });//执行成功
                            });
                        }
                        else {
                            defer1.resolve && defer1.resolve({ serverConfigModel: serverConfigModel, userDefaultObj: null, controls: controls });//执行成功           
                        }
                        return defer1.promise;
                    },
                }


                //if (modelInfo.extendConfig && modelInfo.extendConfig.extendToolBarConfig && modelInfo.extendConfig.extendToolBarConfig.list) {
                //    if (modelInfo.extendConfig.extendToolBarConfig.list.length != 0) {
                //        $scope.isShowextend = true;
                //    }
                //}
                //统一注册事件
                $scope.IRMlistMansge.eventRegister();
                //工具栏新建 
                $scope.createProjectManager = {
                    title: "新建",
                    //1>> 新建信息登记模型
                    createTask: function (event) {
                        if (!$scope.title) {
                            $scope.title = "新建" + $scope.runtimeContext.moduleInfo.name
                        }
                        //新建 信息登记模型的 弹窗配置对象
                        var letterModelConfig = {
                            ismask: true,
                            title: $scope.title,
                            isScrollable: true,
                            showHeader: true,
                            showFooter: true,
                            footerButtonConfig: [
                               {
                                   "text": "保存",
                                   "class": "btn btn-long btn-default",
                                   'key': 'InformationRegistModelManagerScope', // 用于查询子scope的key
                                   'value': 'InformationRegistModelscope',// 用于查询子scope的key
                                   'methodName': 'InformationRegistModelManager.save',
                                   'params': [1]//往来函件 状态值参数
                               },

                            ],
                            width: "900px",
                            height: "820px",
                            titledesc: $scope.titledesc,
                            templateUrl: "/BasePlus/InformationRegistModel/PC/View/Add.html",
                        };
                        //获取配置信息，设置按钮
                        if (modelInfo.extendConfig && modelInfo.extendConfig.extendToolBarConfig && modelInfo.extendConfig.extendToolBarConfig.add) {
                            if (modelInfo.extendConfig.extendToolBarConfig.add.length != 0) {
                                letterModelConfig.footerButtonConfig = [];
                                angular.forEach(modelInfo.extendConfig.extendToolBarConfig.add, function (item, k) {
                                    //判断是否支持pc端

                                    if (item.isSupportPC == true) {
                                        if (item.buttonName == "保存") {
                                            letterModelConfig.footerButtonConfig.push({
                                                "text": item.buttonName,
                                                "class": "btn btn-long btn-primary",
                                                'key': 'InformationRegistModelManagerScope', // 用于查询子scope的key
                                                'value': 'InformationRegistModelscope',// 用于查询子scope的key
                                                'methodName': 'InformationRegistModelManager.IRMClickTemp',
                                                'params': [[$scope, item]]//往来函件 状态值参数
                                            });
                                        }
                                        else {
                                            letterModelConfig.footerButtonConfig.push({
                                                "text": item.buttonName,
                                                "class": "btn btn-long btn-default",
                                                'key': 'InformationRegistModelManagerScope', // 用于查询子scope的key
                                                'value': 'InformationRegistModelscope',// 用于查询子scope的key
                                                'methodName': 'InformationRegistModelManager.IRMClickTemp',
                                                'params': [[$scope, item]]//往来函件 状态值参数
                                            });
                                        }
                                    }


                                });
                            }
                        }
                        if ($scope.modelInfo.detailConfig && $scope.modelInfo.detailConfig.extendJSConfig && $scope.modelInfo.detailConfig.extendJSConfig.web) {
                            if ($scope.modelInfo.detailConfig.extendJSConfig.web.list) {
                                require($scope.modelInfo.detailConfig.extendJSConfig.web.list, function (obj) {
                                    var promise = obj.beforeOpenAdd($scope, $injector);
                                    promise.then(function (data) {
                                        if (data) {
                                            taskModal.lzModal($scope, letterModelConfig);
                                        }
                                    }, function (error) {

                                    });
                                });
                            } else {
                                taskModal.lzModal($scope, letterModelConfig);
                            }
                        } else {
                            taskModal.lzModal($scope, letterModelConfig);
                        }
                    },

                }
                //工具条管理 toolsBar.filterManager.searchByKeyup
                $scope.toolsBar = {
                    // #region 1>>排序管理
                    orderManager: {
                        //1>> 初始化排序数据
                        initData: [
                           { index: 0, rankCode: "", isdesc: false, rankValue: "排序", classValue: "" },
                        ],

                        //2>> 排序项单击事件
                        orderItemClick: function (item) {
                            if ($scope.toolsBar.sort.selectRankItem.index == item.index) {
                                return;
                            }
                            if (item.index == 0) {
                                $scope.toolsBar.sort.selectRankItem = item;
                                $scope.searchOrderParams.sortItem = $scope.toolsBar.orderManager.initData[0];
                                angular.forEach($scope.table.ths, function (item, k) {
                                    if (item.issort) { item.isdesc = false; }
                                });
                                searchData();
                                return;
                            }
                            $scope.table.trs = [];
                            $scope.toolsBar.sort.selectRankItem = item;
                            $scope.searchOrderParams.sortItem = item;
                            angular.forEach($scope.table.ths, function (item, k) {
                                if (item.issort && item.field == firstLowerCase($scope.searchOrderParams.sortItem.rankCode)) {
                                    item.isdesc = $scope.searchOrderParams.sortItem.isdesc;
                                }
                                else {
                                    if (item.issort) { item.isdesc = false; }
                                }
                            });
                            searchData();
                        },

                        //3>> 排序事件——列表头部标题
                        tableHeaderSortClick: function (item) {
                            $scope.searchOrderParams.sortItem = $filter("filter")($scope.toolsBar.orderManager.initData, { rankCode: item.field, isdesc: item.isdesc })[0];
                            searchData();
                        }
                    },
                    // #endregion

                    // #region 2>> 过滤管理
                    filterManager: {
                        //1>> 初始化过滤类型
                        initData: [
                            { filterCode: "none", filterValue: "过滤", placeholder: "", classValue: "", inputType: "", inputValue: "" },
                        ],
                        //2>>过滤类型点击事件
                        filterItemClick: function (item) {
                            $scope.toolsBar.filterManager.selectFilterItem = item;
                            $scope.searchOrderParams.filterItem = item;

                            switch (item.filterCode) {
                                case "none": {
                                    //重新加载数据
                                    //清空输入框中的字
                                    //调用请求数据方法
                                    $scope.toolsBar.filterManager.selectFilterItem = item;
                                    $scope.searchOrderParams.filterItem = item;
                                    angular.forEach($scope.toolsBar.filterManager.initData, function (item, k) {
                                        item.inputValue = "";
                                    });
                                    searchData();
                                    break;
                                }
                            }

                        },

                        //3 按回车相应查询事件
                        searchByKeyup: function (e) {
                            var value = jQuery.trim(e.target.value);
                            var keycode = e.keyCode || e.which;
                            if (keycode == 13) {
                                searchData();

                            }
                        },

                        //4>> 查询按钮事件
                        searchByBtnClick: function () {
                            //alert($scope.toolsBar.filterManager.selectFilterItem.inputValue);
                            searchData();
                        }
                    },
                    // #endregion

                    // #region 3>> 刷新管理
                    refreshManager: {
                        //1>> 刷新按钮事件
                        refreshClick: function () {
                            searchOrderManger.init($scope.searchOrderParams.taskTypeItem);
                            searchData();
                        }
                    },
                    // #endregion
                    sort: {
                        selectRankItem: null
                    },
                    selectFilterItem: null

                };
                //列表
                $scope.table = {
                    ths: [],
                    trs: [],
                }
                //首字母大写
                var firstLowerCase = function (s) {
                    return s.toString()[0].toLowerCase() + s.toString().slice(1);
                }
                //列表行的显示
                var bindConfigData = {
                    init: function () {
                        document.getElementById("pageHeaderAndToolbar").style.height = "110px";
                        var temp = {
                        }
                        $scope.timecode = [];
                        //多行文本框字段集合
                        $scope.codetemp = [];
                        $scope.principalcode = [];
                        var width = document.getElementById("InformationRegistModel_List").offsetWidth - 30;
                        if ($scope.modelInfo.listConfig.isShowSerialNumber) {
                            width = width - 100;
                        }
                        var noWidthCode = [];
                        var widthSun = 0;
                        var averageWidth = 0;
                        //循环列表的配置信息，将有宽度的表单信息的和计算出来
                        angular.forEach(modelInfo.listConfig.showFields, function (item, k) {
                            if (parseInt(item.width) != 0 && item.width) {
                                widthSun += parseInt(item.width);

                            } else {
                                noWidthCode.push(item.fieldCode);
                            }
                        })


                        //平均列表的宽度（需要判断是否需要序号列）
                        if (noWidthCode.length != 0) {
                            if (modelInfo.listConfig.isShowSerialNumber == true) {
                                averageWidth = (parseInt(width) - widthSun - (8 * (modelInfo.listConfig.showFields.length))) / noWidthCode.length;

                            }
                            else {
                                //averageWidth = (parseInt(width) - widthSun-(8*(modelInfo.listConfig.showFields.length))) / noWidthCode.length;
                                averageWidth = (parseInt(width) - widthSun) / noWidthCode.length;

                            }

                        }







                        angular.forEach(modelInfo.listConfig.showFields, function (item, k) {
                            if (configirmManager.isDateTimeField(item.fieldCode)) {
                                $scope.timecode.push(item.fieldCode);
                            }
                            $scope.codetemp.push(item.fieldCode);
                            //循环创建人
                            angular.forEach($scope.principaltemp, function (itemcode) {
                                if (item.fieldCode == itemcode) {
                                    $scope.principalcode.push(itemcode);
                                }
                            })
                            temp = {};

                            //判断如果显示序号列的话则打开第二列，如果不显示序号则打开第一列
                            var index = 0;
                            if (item.fieldCode == "CreateTime") {
                                if (k == index) {
                                    var titlePercentage = parseInt(item.width) / 10;

                                    temp.colTemplate = "misptTableCol_datetimeclick.html";
                                    //temp.style = {
                                    //    "min-width": titlePercentage * (width - 160) + "px",
                                    //};
                                } else {
                                    temp.colTemplate = "misptTableCol_datetime.html";
                                    //temp.style = {
                                    //    "width": "160px ",
                                    //};
                                }
                                temp.format = "yyyy年MM月dd日";
                                temp.issort = true;
                                temp.isdesc = true;

                                temp.isshowStar = true;
                                temp.isStar = "isFavorite";


                            }
                            else {
                                if (k == index) {
                                    temp.colTemplate = "misptTableCol_faceAndStateAndTitle.html";
                                    temp.class = "text-left td-text-ellipsis";
                                    temp.taskState = "state";

                                    temp.uisref = "TaskOper";
                                    temp.uisref_par = "_id";
                                    temp.uisref_parField = "_id";
                                    temp.clickHref = $scope.taskOpen;
                                    var titlePercentage = parseInt(item.width) / 10;

                                    //temp.style = {
                                    //    "min-width": titlePercentage * (width - 160) + "px",
                                    //};
                                } else {
                                    temp.class = "text-left td-text-ellipsis";
                                    temp.colTemplate = "misptTableCol_SomeTextAndAllTitle.html";
                                    var Percentage = parseInt(item.width) / 10;
                                    //temp.style = {
                                    //    "width": Percentage * (width - 160) + "px",
                                    //};
                                }

                            }
                            angular.forEach(noWidthCode, function (widthitem, k) {
                                if (item.fieldCode == widthitem) {
                                    //判断使用最小宽度还是计算出的宽度
                                    if ((parseInt(item.width) != 0) && item.width ) {
                                        //&&
                                        if (parseInt(item.width) <= 100) {
                                            temp.style = {
                                                "min-width": 100 + "px",
                                                'width': 100 + "px",

                                            }
                                        } else {
                                            temp.style = {
                                                "min-width": item.width + "px",
                                                'width': item.width + "px",

                                            }
                                        }

                                    } else {
                                        temp.style = {
                                            "min-width": averageWidth + "px",
                                            'width': averageWidth + "px",

                                        }
                                    }

                                }
                            })
                            if (!temp.style) {
                                temp.style = {
                                    'min-width': item.width + "px",
                                    'width': item.width + "px",
                                }
                            }
                            temp.headerTitle = item.fieldName;
                            temp.fieldAllTitle = firstLowerCase(item.fieldCode) + "t";
                            temp.field = firstLowerCase(item.fieldCode);
                            temp.faceField = "createUserFaceId";
                            temp.issort = item.isSupportSort;
                            temp.isdesc = true;
                            temp.clickSort = function (item) {

                                $scope.searchOrderParams.sortItem = $filter("filter")($scope.toolsBar.orderManager.initData, { rankCode: item.field, isdesc: item.isdesc })[0];
                                $scope.toolsBar.sort.selectRankItem = $filter("filter")($scope.toolsBar.orderManager.initData, { rankCode: item.field, isdesc: item.isdesc })[0];
                                //将其他列还原到原始状态
                                angular.forEach($scope.table.ths, function (item, k) {
                                    if (item.issort && item.field == firstLowerCase($scope.searchOrderParams.sortItem.rankCode)) {
                                        item.isdesc = $scope.searchOrderParams.sortItem.isdesc;
                                    }
                                    else {
                                        if (item.issort) { item.isdesc = false; }
                                    }
                                });
                                $scope.table.trs = [];
                                searchData();
                            }
                            $scope.table.ths.push(temp);
                        });

                        //在$scope.table.ths数组的头部添加序号列的配置信息
                        //判断是否显示序号列
                        //a.unshift()

                        if ($scope.modelInfo.listConfig.isShowSerialNumber) {
                            //序号列模板
                            var numbertemp = {
                                headerTitle: "序号",
                                colTemplate: "misptTableCol_Index.html",
                                style: {
                                    'min-width': "100px",
                                    'width': "100px",
                                    'text-align': 'center'
                                }
                            }

                            $scope.table.ths.unshift(numbertemp)
                        }
                        //将时间配置列添加到配置中//循环数据显示到排序的数组中
                        angular.forEach(modelInfo.listConfig.showFields, function (item, k) {
                            //排序数组中
                            if (item.isSupportSort == true) {
                                var sorttemp1 = {};
                                var sorttemp2 = {};
                                sorttemp1.rankCode = item.fieldCode;
                                sorttemp1.index = item.fieldName + "1";
                                sorttemp1.isdesc = false;
                                sorttemp1.rankValue = "按" + item.fieldName + "升序";
                                sorttemp1.classValue = "glyphicon glyphicon-arrow-up";
                                sorttemp2.rankCode = item.fieldCode;
                                sorttemp2.isdesc = true;
                                sorttemp2.index = item.fieldName + "-1";
                                sorttemp2.rankValue = "按" + item.fieldName + "降序";
                                sorttemp2.classValue = "glyphicon glyphicon-arrow-down";
                                $scope.toolsBar.orderManager.initData.push(sorttemp1);
                                $scope.toolsBar.orderManager.initData.push(sorttemp2);
                            }

                            //搜索数组的添加 $scope.toolsBar.filterManager.initData
                            if (item.isSupportSearch == true) {
                                var seachtemp = {};
                                //{ filterCode: "SubjectName", filterValue: "主题", placeholder: "请输入主题", classValue: "", inputType: "text", inputValue: "" }
                                seachtemp.filterCode = item.fieldCode;
                                seachtemp.filterValue = item.fieldName;
                                seachtemp.placeholder = "请输入" + item.fieldName;
                                seachtemp.classValue = "";
                                seachtemp.inputType = "text";
                                seachtemp.inputValue = "";
                                $scope.toolsBar.filterManager.initData.push(seachtemp);
                            }
                        });

                        //初始化 查询,排序,过滤 值
                        searchOrderManger.init();
                        $scope.isshowlist = true;
                        //查询数据
                        searchData();
                    }
                }
                 //首字母大写
                var firstLowerCase = function (s) {
                    return s.toString()[0].toLowerCase() + s.toString().slice(1);
                }
                //平台修改任务名称、任务状态等之后  我们这边同步
                app.event.bind($scope,"event-irm-detail-from-change-tolist", function (event, obj) {
                    if (obj.data) {
                        var id = obj.data.id;
                        var newvalue = configirmManager.firstCharToLowerCaseForAll(obj.data.value);
                        
                        angular.forEach(Object.getOwnPropertyNames(newvalue), function (filecode, k) {
                            //循环当前字段是否是在参与人字段中，如果是的话跳出
                            var isprincipal = false;
                            angular.forEach($scope.principalcode, function (item, k)
                            {
                                if (filecode == firstLowerCase(item))
                                {
                                    isprincipal = true;
                                }
                            })
                            if (!isprincipal) {
                                $scope.table.trs.map(function (item, index, array) {
                                    if (item['_id'] == id) {
                                        //循环列表的字段，如果该字段存在，就给他赋值
                                        item[filecode] = newvalue[filecode];
                                        angular.forEach($scope.codetemp, function (codeitem, m) {
                                            if ($.inArray(codeitem, $scope.timecode) == -1 && filecode == codeitem) {
                                                codeitem = firstLowerCase(codeitem);
                                                item[codeitem + 't'] = item[codeitem];
                                                if (item[codeitem]) {
                                                    item[codeitem] = item[codeitem].split('\n')[0];

                                                }
                                            }
                                        });
                                    }
                                })

                            }
                        })

                    }
                });
                app.event.bind($scope, "event-iim-detail-toolbar-deleteflush", function (event, obj) {

                    if (obj.data) {
                        var id = obj.data.id;
                        var newvalue = obj.data.value;
                        $scope.table.trs.map(function (item, index, array) {
                            if (item['_id'] == id) {
                                array.splice(index, 1);
                            }
                        });
                        //循环当前的对象，将序号加入到trs
                        angular.forEach($scope.table.trs, function (item, k) {
                            item.index = k + 1;
                        })

                    }
                });
                //退出任务后刷新列表
                app.event.bind($scope, "event-irm-detail-member_quit", function (event, obj) {
                    if (obj.data) {
                        var id = obj.data.id;
                        var newvalue = obj.data.value;
                        var code = obj.data.code;
                        if (code == "MemberQuit") {
                            $scope.table.trs.map(function (item, index, array) {
                                if (item['_id'] == id) {
                                    array.splice(index, 1);
                                }
                            });

                        }
                    }
                });
                app.event.bind($scope, "event-irm-toolbar-list-register", function (e, obj) {

                    $scope.createProjectManager.createTask();
                });
                var promiseAll = $q.all([$scope.IRMlistMansge.asyncJS()]);
                promiseAll.then(function (res) {
                    if (res[0].userDefaultObj) {
                        res[0].userDefaultObj.initConfig($scope, $injector);
                        res[0].userDefaultObj.pageLoad($scope, $injector);

                    }
                    bindConfigData.init();
                    $scope.isShowextend = true;
                })
            },
            initError: function (error) {
                opacityAlert("获取配置信息失败!", "glyphicon glyphicon-remove-sign");
            }
        });
    });
})();