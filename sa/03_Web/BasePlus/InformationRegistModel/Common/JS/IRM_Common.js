/**
 * author：wjs
 * description：此文件主要包含协作任务模型获取、解析、组织模块配置信息
 */
"use strict";
; (function (window, undefined) {

    //#region 模块实体
    function ModelEntity1(serverEntity) {
        this.id;
        this.code;
        this.name;
        this.description;
        this.propertys = [];
        this.formConfig;
        this.listConfig;
        this.extendConfig;

        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    ModelEntity1.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCase.bind(this)(serverEntity);
        this.formConfig = new FormEntity1(this.formConfig);
        this.listConfig = new ListEntity1(this.listConfig);
        this.extendConfig = new ExtendEntity1(this.extendConfig);
        var _this = this;
        this.propertys = [];
        serverEntity.Propertys.forEach(function (proto) {
            _this.propertys.push(new PropertyEntity(proto));
        });
    }


    //#endregion 模块实体

    //#region 属性实体
    function PropertyEntity(serverEntity) {
        this.fieldName = "";
        this.fieldCode = "";
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    PropertyEntity.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCase.bind(this)(serverEntity);
    }

    //#endregion

    //#region 表单实体
    function FormEntity1(serverEntity) {
        this.fields = [];
        this.userExtendFields = [];
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    FormEntity1.prototype._transation2Client = function (serverEntity) {
        var that = this;
        firstCharToLowerCase.bind(this)(serverEntity);
        //转换字段
        if (this.fields && this.fields.forEach) {
            var tempFields = [];
            this.fields.forEach(function (item) {
                tempFields.push(new FieldEntity1(item));
            });
            this.fields = tempFields;
        }
        //转换字段
        if (this.userExtendFields && this.userExtendFields.forEach) {
            var tempUserFields = [];
            this.userExtendFields.forEach(function (item) {
                tempUserFields.push(new FieldEntity1(item));
            });
            this.userExtendFields = tempUserFields;
        }
    }

    //#endregion

    //#region 字段实体
    function FieldEntity1(serverEntity) {
        this.fieldCode;
        this.fieldName;
        this.isDefaultField;
        this.controlType;
        this.controlConfig;
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    FieldEntity1.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCaseForAll.bind(this)(serverEntity);
        if (this.controlConfig) {
            this.controlConfig = JSON.parse(this.controlConfig);
            firstCharToLowerCaseForAll.bind(this.controlConfig)(this.controlConfig);
        }
    }
    //#endregion

    //#region 列表配置实体
    function ListEntity1(serverEntity) {
        this.showFields = [];
        this.isShowSerialNumber = false;
        this.showStyle = 0;
        this.groupField = "";
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    ListEntity1.prototype._transation2Client = function (serverEntity) {
        var that = this;
        firstCharToLowerCase.bind(this)(serverEntity);
        //转换字段
        if (this.showFields && this.showFields.forEach) {
            var tempFields = [];
            this.showFields.forEach(function (item) {
                tempFields.push(new ListFieldEntity1(item));
            });
            this.showFields = tempFields;
        }
    }
    //#endregion

    //#region 列表字段配置实体
    function ListFieldEntity1(serverEntity) {
        this.fieldCode;
        this.fieldName;
        this.width;
        this.isSupportSort;
        this.isSupportSearch;
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    ListFieldEntity1.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCaseForAll.bind(this)(serverEntity);
    }

    //#endregion

    //#region 扩展配置实体
    function ExtendEntity1(serverEntity) {
        this.extendToolBarConfig = {
            add: [],
            list: [],
            detail: []
        };
        this.extendJSConfig = {
            web: {
                add: [],
                list: [],
                detail: []
            }, mobile: {
                add: [],
                list: [],
                detail: []
            }
        };
        this._transation2Client(serverEntity);
    }

    /**
     * 服务端转客户端属性
     */
    ExtendEntity1.prototype._transation2Client = function (serverEntity) {
        var that = this;
        firstCharToLowerCase.bind(this)(serverEntity);
        firstCharToLowerCaseForAll.bind(this.extendJSConfig)(this.extendJSConfig);
        firstCharToLowerCaseForAll.bind(this.extendToolBarConfig)(this.extendToolBarConfig);
        //工具条
        //if (this.extendToolBarConfig) {
        //    for (var key in this.extendToolBarConfig) {
        //        this.extendToolBarConfig[key].forEach(function (item) {
        //            this.extendToolBarConfig[key].push(new ToolBarEntity(item));
        //        });
        //    }
        //}
    }

    //#endregion

    //#region 工具条配置实体
    function ToolBarEntity(serverEntity) {

        this.buttonCode;
        this.buttonName;
        this.targetEvent;
        this.isValid;
        this.isDefault;
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    ToolBarEntity.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCase.bind(this)(serverEntity);
    }

    //#endregion

    //#region 控件配置实体
    function ControlConfigEntity1(serverEntity) {
        this.code = '';
        this.name = '';
        this.webJS = '';
        this.webCSS = '';
        this.mobileJS = '';
        this.mobileCSS = '';
        this.designJS = '';
        this.designCSS = '';
        this.controlType = '';
        this._transation2Client(serverEntity);
    }
    /**
     * 服务端转客户端属性
     */
    ControlConfigEntity1.prototype._transation2Client = function (serverEntity) {
        firstCharToLowerCase.bind(this)(serverEntity);
        if (this.controlType) {
            this.controlType = JSON.parse(this.controlType);
            firstCharToLowerCase.bind(this.controlType)(this.controlType);
        }
    }
    //#endregion

    //#region 公用方法

    //#region 首字母转换 
    /**
     * 首字母小写
     * 
     * @see 调用时需要绑定this对象，例如xx.bind(this)(serverEntity);转换的值将会保存到this上
     */
    function firstCharToLowerCase(serverEntity) {
        _firstCharCase.bind(this)(serverEntity, 'Lower');
    }
    /**
    * 首字母小写（递归版，不能放入循环依赖的对象，否则将导致死循环）
    * 
    * @see 调用时需要绑定this对象，例如xx.bind(this)(serverEntity);转换的值将会保存到this上
    */
    function firstCharToLowerCaseForAll(serverEntity) {
        _firstCharToCaseForAll.bind(this)(serverEntity, 'Lower');
    }
    /**
     * 首字母大写
     * 
     * @see 调用时需要绑定this对象，例如xx.bind(this)(serverEntity);转换的值将会保存到this上
     */
    function firstCharToUpperCase(serverEntity) {
        _firstCharCase.bind(this)(serverEntity, 'Upper');
    }
    /**
     * 首字母大写（递归版，不能放入循环依赖的对象，否则将导致死循环）
     * 
     * @see 调用时需要绑定this对象，例如xx.bind(this)(serverEntity);转换的值将会保存到this上
     */
    function firstCharToUpperCaseForAll(serverEntity) {
        _firstCharToCaseForAll.bind(this)(serverEntity, 'Upper');
    }
    /**
     * 首字母大小写转换
     * 
     * @param model 需要转换的对象
     * @param caseType 'Lower'表示转小写 'Upper'表示转大写
     */
    function _firstCharCase(model, caseType) {
        var tempFirstChar, tempField, _isCaseFun = (caseType == 'Lower' ? 'toLocaleLowerCase' : 'toUpperCase');
        if (model && Object.prototype.toString.call(model) == '[object Object]') {
            for (var item in model) {
                if (item && item.indexOf('_') != 0) {
                    tempFirstChar = item.slice(0, 1);
                    tempField = item.replace(tempFirstChar, tempFirstChar[_isCaseFun]());
                    this[tempField] = model[item];
                    if (item != tempField) {
                        delete this[item]
                    }
                }
            }
        } else if (model && Object.prototype.toString.call(model) == '[object String]') {
            tempFirstChar = model.slice(0, 1);
            model = model.replace(tempFirstChar, tempFirstChar[_isCaseFun]());
        }
    }
    /**
     * 首字母大小写转换（递归版）
     * 
     * @param model 需要转换的对象
     * @param caseType 'Lower'表示转小写 'Upper'表示转大写
     */
    function _firstCharToCaseForAll(model, caseType) {
        if (model && Object.prototype.toString.call(model) == '[object Object]') {
            var tempFirstChar, tempField, _isCaseFun = (caseType == 'Lower' ? 'toLocaleLowerCase' : 'toUpperCase');
            for (var item in model) {
                if (item && item.indexOf('_') != 0) {
                    tempFirstChar = item.slice(0, 1);
                    tempField = item.replace(tempFirstChar, tempFirstChar[_isCaseFun]());
                    this[tempField] = model[item];
                    if (item != tempField) {
                        delete this[item]
                    }
                    if (Object.prototype.toString.call(this[tempField]) == '[object Object]') {
                        _firstCharToCaseForAll.bind(this[tempField])(this[tempField], caseType);
                    }
                    else if (Object.prototype.toString.call(this[tempField]) == '[object Array]') {
                        this[tempField].forEach(function (item) {
                            _firstCharToCaseForAll.bind(item)(item, caseType);
                        });
                    }
                }
            }
        }
    }

    function _charcaseProxy(func) {
        return function (model) {
            func.bind(model)(model);
            return model;
        };
    }
    //#endregion




    /**
     * 定义不可修改的window属性
     */
    function defineWindowProperty(name, obj) {
        !window[name] && Object.defineProperty(window, name, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: obj
        });
    }

    var extend = (function () {
        var extend,
        _extend,
        _isObject;

        _isObject = function (o) {
            return Object.prototype.toString.call(o) === '[object Object]';
        }

        _extend = function self(destination, source) {
            var property; for (property in destination) {
                if (destination.hasOwnProperty(property)) {
                    // 若destination[property]和sourc[property]都是对象，则递归 
                    if (_isObject(destination[property]) && _isObject(source[property])) {
                        self(destination[property], source[property]);
                    }; // 若sourc[property]已存在，则跳过 
                    if (source.hasOwnProperty(property)) {
                        continue;
                    } else {
                        source[property] = destination[property];
                    }
                }
            }
        }

        extend = function () {
            var arr = arguments,
                    result = {},
                    i; if (!arr.length) return {}; for (i = arr.length - 1; i >= 0; i--) {
                        if (_isObject(arr[i])) {
                            _extend(arr[i], result);
                        };
                    }

            arr[0] = result; return result;
        }

        return extend;
    })();


    //#endregion

    //#region 配置管理
    /**
     * 配置管理器
     */
    function ConfigManager1() {
    }

    ConfigManager1.prototype = (function () {
        var modelInfo;
        var $http;
        /**
         * 初始化
         * @param $http 用于访问WebAPI的HTTP请求对象
         */
        function initirm(options) {
            var defaultOptions = {
                appCode: '',//应用编码
                businessModuleId: '',//模块实例ID
                sceneCode: '',//场景编码
                $http: { get: function () { }, post: function () { } },//HTTP请求对象
                initSuccess: function (data) { },//初始化成功回调
                initError: function (error) { },//初始化失败回调
                sourceType: 'web',//调用端类型，web或mobile
                isLoadControlConfig: true//是否加载控件相关配置
            }
            this.options = extend({}, defaultOptions, options);
            var that = this;
            getIRMConfigForWebApi.bind(this)(function (data) {
                try { data = JSON.parse(data); } catch (e) { };
                modelInfo = new ModelEntity1(data);
                if (that.options.isLoadControlConfig) {
                    var temp = {}
                    modelInfo.formConfig.fields.forEach(function (item) {
                        temp[item.controlType] = item.controlType;
                    })
                    var postModel = { "": Object.getOwnPropertyNames(temp) };
                    getControlConfigForWebApi.bind(that)(postModel, function (data) {
                        var controls = {};
                        if (data) {
                            data.forEach(function (control) {
                                control = new ControlConfigEntity1(control);
                                controls[control.code] = control;
                            });
                        }
                        that.options.initSuccess(modelInfo, controls);
                    }, function (erro) {
                        that.options.initError(error);
                    });
                } else {
                    that.options.initSuccess(modelInfo);
                }
            }, function (error) {
                that.options.initError(error);
            })
        }
        //从WebAPI中获取配置数据
        function getIRMConfigForWebApi(successHandler, errorHandler) {
            var webAPIPath = 'api/Runtime/ModelInfo/' + this.options.appCode + '/' + this.options.businessModuleId + '/' + this.options.sceneCode + '/' + this.options.sceneOrganizationId;
           
            if (this.options.sourceType == 'web') {
                this.options.$http.get(webAPIPath, 'InformationRegistModel', successHandler, errorHandler);
            } else {
                this.options.$http.get(webAPIPath, 'InformationRegistModel', successHandler, errorHandler);
            }
        }
        //从WebAPI中获取控件配置数据
        function getControlConfigForWebApi(postModel, successHandler, errorHandler) {
            var webAPIPath = 'api/InformationRegistModel/Control/LoadByCodes';
            if (this.options.sourceType == 'web') {
                this.options.$http.post(webAPIPath, postModel, 'InformationRegistModel', successHandler, errorHandler);
            } else {
                this.options.$http.post(webAPIPath, postModel, 'InformationRegistModel', successHandler, errorHandler);
            }
        }
        //判断是否是时间字段
        function isDateTimeField(fieldCode) {
            var baseTimeField = ['createtime', 'publishtime']
            if (baseTimeField.find(function (m) { return m == fieldCode.toLocaleLowerCase(); })) {
                return true;
            }
            var formFields = modelInfo.formConfig.fields;
            if (formFields.find(function (m) { return m.controlType == 'date' && m.fieldCode == fieldCode; })) {
                return true;
            }
        }
        return {
            /**
             * 初始化
             */
            initirm: initirm,

            /**
             * 判断是否是时间字段
             */
            isDateTimeField: isDateTimeField,
            /**
             * 首字母转小写
             */
            firstCharToLowerCase: _charcaseProxy(firstCharToLowerCase),
            /**
             * 首字母转小写（递归）
             */
            firstCharToLowerCaseForAll: _charcaseProxy(firstCharToLowerCaseForAll),
            /**
             * 首字母转大写
             */
            firstCharToUpperCase: _charcaseProxy(firstCharToUpperCase),
            /**
             * 首字母转大写（递归）
             */
            firstCharToUpperCaseForAll: _charcaseProxy(firstCharToUpperCaseForAll),
        };
    })();
    //#endregion

    var JSmodleThat = this;


    //注册类型
    defineWindowProperty('ModelEntity1', ModelEntity1)
    defineWindowProperty('FormEntity1', FormEntity1)
    defineWindowProperty('FieldEntity1', FieldEntity1)
    defineWindowProperty('ListEntity1', ListEntity1)
    defineWindowProperty('ListFieldEntity1', ListFieldEntity1)
    defineWindowProperty('ExtendEntity1', ExtendEntity1)
    //defineWindowProperty('ToolBarEntity', ToolBarEntity)
    defineWindowProperty('ConfigManager1', ConfigManager1)
    defineWindowProperty('ControlConfigEntity1', ControlConfigEntity1)

})(window, undefined);