/// <reference path="TaskManager.js" />
/*********************************************************
* 创建者：lz-zyf
* 创建日期：2017-03-01 14:18:48
* 描述：协作模型【列表】页面逻辑控制器
* 维护：
* *******************************************************/
; (function ($) {
    //二次开发新增按钮跳转方法
    var DEVELOP_ADDPAGE;
    //是否无数据
    var isEmpty = true;
    //api管理对象
    var webApiManager;
    //分页
    var pageSetting = {
        pageSize: 20,
        loadSize: 5
    };
    //搜索对象
    var searchModel = {
        //场景组织机构ID
        SceneOrgId: null,
        //应用编码
        AppCode: null,
        //场景编码
        SceneCode: null,
        //业务模块id
        BusinessModuleId: null,
        //用户id
        UserId: null,
        //组织机构Id
        OrganizationId: null,
        //列表类型
        ListType: 2,
        //字段过滤  -  {Field: "",Value: "",FilterType: 1//0:=，1:like}
        Filter: [],
        //排序   -   { Field: "Title", IsASC: true }
        Sort: [],
        //开始位置
        StartIndex: 0,
        //获取数量
        Length: 20,
        attr: {
            setListType: function () {
                //{ Field: "Title", IsASC: true }
            }
        }
    }
    //字段过滤构造方法
    var filterParameter = function () {
        return {
            //过滤字段
            Field: "1",
            //字段值
            Value: "1",
            //过滤类型  0 - "=", 1 -  "like"
            FilterType: 1
        };
    }
    //列表实体对象
    var gridEntity = function () {
        return {
            Id: null,
            PicPath: null,
            State: null,
            Name: null,
            PublishDate: null,
            CreateDate: null
        };
    }
    //列表缓存对象
    var _GridData = {};
    /**
    * 数据对象转换方法
    * @data {array} 数据源
    * @return {array} 客户端数据源
    */
    var convertModel = function (data) {
        var result = new Array();
        var gridModel;
        $.each(data, function (index, item) {
            gridModel = new gridEntity();
            gridModel.Id = item["_id"];
            gridModel.PicPath = TaskManager.webApiManager.getFacePic(item["CreateUserFaceId"] || null);
            gridModel.State = item["State"];
            gridModel.Name = item["Title"];
            gridModel.CreateDate = lzm.Date.format(item.CreateTime.$date, "yyyy年MM月dd日");
            gridModel.BusinessModuleId = item["BusinessModuleId"];
            gridModel.AppCode = item["AppCode"];
            gridModel.sceneCode = item["SceneCode"];
            _GridData[gridModel.Id] = gridModel;
            result.push(gridModel);
        })
        return result;
    }
    /**
    * 创建列表
    * @dataArray {array} 数据源数组对象
    * @returns {string} html字符串
    */
    var buildList = function (dataArray) {
        var tempItem = '<li class="mui-table-view-cell mui-media">' +
        '<a id="{0}" class="mui-navigate-right lzm-full-item">' +
        '<img class="mui-media-object mui-pull-left lzm-img-circle" src="{1}" onerror="javascript:this.src=\'/BasePlus/MISPTModule/Mobile/Images/defaltFace.gif\';" >' +
        '<div class="mui-media-body">' +
        '<span class="lzm-ellipsis lzm-display-block">{2}</span>' +
        '<p class="mui-ellipsis">{3}</p>' +
        '</div>' +
        '</a>' +
        '</li>';
        var result = "";
        $.each(dataArray, function (index, item) {
            result += lzm.String.format(tempItem, item["Id"], item["PicPath"], item["Name"], item["CreateDate"]);
        })
        return result;
    }
    /**
    * 获取列表数据
    * @filterArray {array} 字段搜索集合
    * @callBack {function} 回调函数
    */
    var getData = function (filterArray, callBack) {
        if (filterArray instanceof Array)
            searchModel.Filter = filterArray;
        TaskManager.webApiManager.post("api/Runtime/Business/GetList", searchModel, function (data) {
            callBack(convertModel(data.List));
        }, function (data) {
            $.toast(data.Message);
        }, true);
    }
    /**
    * 下拉刷新具体业务实现
    */
    var pulldownRefresh = function (filterArray, isNeedHidderLoading) {
        var listCount = document.getElementById('scroll-content').querySelector('.mui-scroll').querySelectorAll('ul li').length;
        if (isNeedHidderLoading || listCount < 20) {
            $('#scroll-content') && $('#scroll-content')[0].classList.add('lz-bottom-loading');
        }
        if (isNeedClearSearch) {
            document.getElementById("search").value = "";
            //获取查询框状态，如果是激活状态，则重置 begin
            var searchUI = document.querySelector('.mui-search');
            searchUI && searchUI.classList.remove('mui-active')
            searchModel.Filter = null;
            filterArray = null;
            //获取查询框状态，如果是激活状态，则重置 end
        }
        searchModel.StartIndex = 0;
        searchModel.Length = pageSetting.pageSize;
        getData(filterArray, function (data) {
            var htmlStr = buildList(data);
            setTimeout(function () {
                //判断是否存在
                isNeedPreventUpCallBack = true;
                $('#scroll-content').pullRefresh().refresh(true);
            }, 0);
            var parent = document.getElementById('scroll-content').querySelector('.mui-scroll');
            var loading = parent.querySelector('.mui-loading');
            var ul = parent.querySelector('ul');
            if (loading) parent.removeChild(loading);
            if (!ul) {
                ul = document.createElement('ul');
                ul.className = 'mui-table-view mui-table-view-chevron';
            }
            ul.innerHTML = buildList(data);
            parent.insertBefore(ul, parent.querySelector('.mui-pull-bottom-pocket'));
            $('#scroll-content').pullRefresh().setTranslate(0, 0);
            if (data && data.length < 20) {
                $('#scroll-content')[0].classList.add('lz-bottom-loading');
            }
            else {
                $('#scroll-content')[0].classList.remove('lz-bottom-loading');
            }
            isEmpty = !data.length;
            isEmptyHimt(isEmpty)
            $('#scroll-content').pullRefresh().endPulldownToRefresh();
        });
    }
    /**
    * 上拉加载具体业务实现
    */
    var pullupRefresh = function () {
        $('#scroll-content')[0].classList.remove('lz-bottom-loading');
        var flag = false;
        searchModel.StartIndex = 0 === searchModel.StartIndex ? pageSetting.pageSize : searchModel.StartIndex + pageSetting.loadSize;
        searchModel.Length = pageSetting.loadSize;
        getData(searchModel.Filter instanceof Array ? searchModel.Filter : [], function (data) {
            if (data.length == 0 || searchModel.Length > data.length) {
                flag = true;
            }
            document.getElementById('scroll-content').querySelector('.mui-scroll ul').innerHTML += buildList(data);
            $('#scroll-content').pullRefresh().endPullupToRefresh(flag)
        });
    }
    /**
    * 初始化mui组件
    */
    $.init({
        swipeBack: false,
        pullRefresh: {
            container: '#scroll-content',
            down: {
                //callback: pulldownRefresh
                callback: pullDownRefreshEvent
            },
            up: {
                contentrefresh: '正在加载...',
                auto: true,
                callback: pullUpRefreshProxy
            }
        }
    });
    var isNeedClearSearch = true;
    var isNeedPreventUpCallBack = false;
    var isInitUpLoad = true;
    /**
    * 下拉刷新事件
    */
    function pullDownRefreshEvent(args) {
        return clearSearchAndExecute(pulldownRefresh, args);
    }
    /**
    * @description 用于统一执行需要不需要清理查询框的函数
    * 注意：如果存在异步调用时，请勿将依赖isNeedClearSearch变量的逻辑写入异步回调中
    */
    function clearSearchAndExecute(callFunc, args) {
        isNeedClearSearch = false;
        var result = callFunc && (callFunc.call(null, args));
        isNeedClearSearch = true;
        return result;
    }
    /**
    * @description 上拉事件代理
    * 主要用于第一次显示‘上拉显示更新’提醒。
    */
    function pullUpRefreshProxy() {
        if (isInitUpLoad) {
            isInitUpLoad = false;
            isNeedPreventUpCallBack = false;
            $('#scroll-content').pullRefresh().endPullupToRefresh(true);
            return;
        }
        if (isEmpty) {
            $('#scroll-content').pullRefresh().endPullupToRefresh(true);
            return;
        }
        pullupRefresh();
    }

    /**
    * 为空提示
    */
    function isEmptyHimt(isEmpty) {
        document.querySelector('.no-item-himt').classList[!isEmpty ? "add" : "remove"]('hide-himt');
        if (searchModel.Filter && searchModel.Filter.length) {
            document.querySelector('.no-item-himt-title').innerText = "无结果，下拉进行刷新";
        } else {
            document.querySelector('.no-item-himt-title').innerText = "无数据，下拉进行刷新";
        }
    }

    /**
    * 页面加载事件
    */
    $.ready(function () {
        window.document.forms[0].onsubmit = function (e) {
            var $Seach = document.getElementById("search");
            if ($Seach == null) {
                $.toast("找不到搜索对象~");
                return;
            }
            $Seach.blur();
            var filterModel = new filterParameter();
            filterModel.Field = "Title",
            filterModel.Value = lzm.String.trim($Seach.value, " ");
            var filterArray = new Array();
            filterArray.push(filterModel);
            if (/^[ ]+$/.test($Seach.value) || $Seach.value.length == 0)
                filterArray = new Array();
            searchModel.StartIndex = 0;
            searchModel.Length = pageSetting.pageSize;
            clearSearchAndExecute(pulldownRefresh, filterArray);
            return false;
        }
        //初始化添加按钮
        addEventListener("JSNCLoaded", function () {
            lzm.JSNCHelper.setNavigationBtn(0, "新建", function () {
                TaskManager.runtimeContext["nowPage"] = "add";
                if (DEVELOP_ADDPAGE) DEVELOP_ADDPAGE(TaskManager);
                else LeadingCloud.Navigation.goto("TaskAdd.html", TaskManager.runtimeContext);
            })
        })
        //下拉菜单点击事件
        $("#topPopover").on("tap", ".popover-item", function (e) {
            lzm.JSNCHelper.hideKeyboard(function () {
                $("#popoverBtn")[0].innerHTML = e.target.innerText;
                searchModel.ListType = e.target.id;
                var box = document.getElementById('scroll-content').querySelector('.mui-scroll');
                var ul = document.getElementById('scroll-content').querySelector('ul');
                var div = document.createElement('div');
                div.className = 'mui-loading';
                var div1 = document.createElement('div');
                div1.className = 'mui-spinner';
                div.appendChild(div1);
                box.replaceChild(div, ul);
                $("#topPopover").popover('toggle');
                pulldownRefresh(null, true);
            });
            document.getElementById("search").blur();
        });
        // - item - 点击事件
        $(".mui-scroll").on('tap', '.mui-navigate-right', function () {
            TaskManager.runtimeContext["businessid"] = this["id"]
            TaskManager.runtimeContext["nowPage"] = "detail";
            lzm.JSNCHelper.openDetail(TaskManager.runtimeContext, "InformationRegistModel");
        });

        //改写原型
        $('#scroll-content').pullRefresh().pristine_pullupLoading = $('#scroll-content').pullRefresh().pullupLoading;
        $('#scroll-content').pullRefresh().pullupLoading = function (callback, x, time) {
            if (!isNeedPreventUpCallBack) {
                this.pristine_pullupLoading(callback, x, time)
            }
            isNeedPreventUpCallBack = false;;
        }
        $('#scroll-content').pullRefresh().refresh = function (isReset) {
            if (isReset && this.finished) {
                this.enablePullupToRefresh();
                this.finished = false;
            }
            setTimeout(function () { isNeedPreventUpCallBack = false; }, 800);
        }
    })
    LeadingCloud.onPageWillAppear = function () {
        //pulldownRefresh();
        clearSearchAndExecute(pulldownRefresh);
    }
    //获取共有配置
    window.lzmList = function (config, extendJSConfig) {
        if ((extendJSConfig instanceof Array) && extendJSConfig.length > 0) {
            require(extendJSConfig, function (obj) {
                if (!obj) { alert("加载列表二次开发js失败"); return; }
                if ("function" == typeof obj.openAddPage) DEVELOP_ADDPAGE = obj.openAddPage;
            });
        }

        var _Config = {
            showFields: new Array()
        };
        lzm.extendInHere(_Config, config);
        //设置标题
        try {
            lzm.JSNCHelper.setPageTitle(TaskManager.runtimeContext.moduleInfo.name);
        } catch (e) {
        }
        var userInfo = LeadingCloud.User.loginInfo();
        searchModel.UserId = userInfo.userId;
        searchModel.OrganizationId = userInfo.oid;
        lzm.extendInHere(searchModel, {
            AppCode: TaskManager.runtimeContext.moduleInfo.appCode,
            SceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode,
            BusinessModuleId: TaskManager.runtimeContext.moduleInfo.businessModuleId,
            SceneOrgId: TaskManager.runtimeContext.sceneInfo.sceneOrganizationId
        });
        pulldownRefresh();
    }
})(mui);