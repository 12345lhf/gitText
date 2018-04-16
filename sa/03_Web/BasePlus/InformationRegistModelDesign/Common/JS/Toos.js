'use strict';
(function () {
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

    function Tools() { }
    Tools.prototype = (function () {
        return {
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
        }
    })()
    defineWindowProperty('CommonTools', new Tools())
})();