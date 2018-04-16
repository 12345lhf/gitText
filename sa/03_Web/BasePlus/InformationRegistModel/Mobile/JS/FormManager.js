/// <reference path="TaskManager.js" />
/*********************************************************
* 创建者：lz-zyf
* 创建日期：2017-03-01 14:18:48
* 描述：Form构建管理者
* 维护：
* *******************************************************/
; (function (document, undefined) {
    var formControl = function () {
    }
    /**
    *  noop(function)
    */
    formControl.prototype.noop = function () { };
    /**
     * 触发事件
     */
    formControl.prototype.trigger = function (element, eventType, eventData) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return this;
    };
    /**
     * 快捷创建对象
     */
    formControl.prototype.createElement = function (name) {
        return document.createElement(name);
    }
    /**
     * dom 上挂载添加属性事件
     */
    HTMLElement.prototype.attr = function (name, value) {
        var attar = document.createAttribute(name);
        if (value) attar.value = value;
        this.setAttributeNode(attar);
        return this;
    }

    formControl.prototype.validate = function (config, value) {
        var controlConfig = config.controlConfig;
        if (controlConfig.isRequired && (lzm.String.trim(value, " ").length == 0)) {
            throw new Error(lzm.String.format("请输入{0}！", config.fieldName));
        }
        if (controlConfig.length && value.length > controlConfig.length) {
            throw new Error(lzm.String.format("{0}长度不能超过{1}字！", config.fieldName, controlConfig.length));
        }
        return value;
    }

    /**
    * 
    */
    formControl.prototype.parse = function () {
        //解析-有容错处理-后期处理
    }

    /**
    * 
    */
    formControl.prototype.stringify = function () {
        //解析-有容错处理-后期处理
    }

    formControl.prototype.fn = {
        each: function (callback) {
            [].every.call(this, function (el, idx) {
                return callback.call(el, idx, el) !== false;
            });
            return this;
        }
    };
    window.formControl = new formControl();
})(document);
; (function ($) {
    //创建控件 容器
    var createControlBoxElement = function () {
        var dom = document.createElement("div");
        dom.classList.add('mui-input-row');
        dom.classList.add('lzm-form-group');
        return dom;
    }

    /**
     * 构建表单
     * @param element  {dom}  表单容器
     * @param fields {json} 字段配置数据
     * @param controls {json} 控件配置
     * @returns {object} 表单对象
     */
    var lzmForm = function (element, fields, controls, callback) {
        var $this = this;
        this.formControls = {};
        this.fields = {};
        this.controlTypes = {};
        if (!(element && typeof window !== 'undefined' && (element === window || element.nodeType))) {
            alert("没有找到DOM对象")
        };

        //整合移动端-控件数据
        var mobileJS = new Array(), mobileCSS = new Array();

        var head = document.getElementsByTagName('head')[0], link;
        for (var i in controls) {
            if (controls[i].mobileCSS && mobileCSS.indexOf(controls[i].mobileCSS) < 0) {
                link = document.createElement('link');
                link.href = controls[i].mobileCSS;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
                mobileCSS.push(controls[i].mobileCSS);
            }
            if (controls[i].mobileJS && mobileJS.indexOf(controls[i].mobileJS) < 0) mobileJS.push(controls[i].mobileJS);
        }
        var initFormControl = function (TaskManager, fields, $this, callback) {
            //循环字段配置构建构建表单
            [].map.call(fields, function (item, index, array) {
                //构建控件父容器
                var ctlBox = createControlBoxElement();
                if (item['_client_isShow'] === false) {
                    ctlBox.classList.add("lzm-display-none");
                }
                //控件类型
                var controlName = (item['controlType'] || "").toLocaleUpperCase(),
                    //控件id【字段名称】
                    controlId = item['fieldCode'];
                //向外暴露类型控件类型对象
                if (!$this.controlTypes[controlName]) $this.controlTypes[controlName] = new Object();
                //向外暴露字段配置对象
                $this.fields[controlId] = item;
                //构建控件对象【向外暴露控件对象】
                var _ControlInstance = eval("new formControl['" + controlName + "'](ctlBox , item)");
                //给控件绑定共有方法
                if (_ControlInstance) {
                    try {
                        _ControlInstance._ToggleShow = function (flag) {
                            if (!flag) ctlBox.classList.add('lzm-display-none');
                            else ctlBox.classList.remove('lzm-display-none');
                        }
                    } catch (e) {
                        alert("控件扩展方法绑定失败！");
                    }
                }
                $this.formControls[controlId] = $this.controlTypes[controlName][controlId] = _ControlInstance;
                //添加到dom
                element.appendChild(ctlBox);
                try {
                    $this.formControls[controlId].init({
                        //当前配置页面、 add -新增  list-列表  detail-详情
                        nowPage: TaskManager.runtimeContext.nowPage
                    });
                } catch (e) {
                    alert(lzm.String.format("控件【{0}】没有实现 init 方法", item['controlType']));
                }
            });
            callback();
        };
        //加载控件实现
        if ((mobileJS instanceof Array) && mobileJS.length > 0) {
            require(mobileJS, function () {
                for (var i in arguments) {
                    if (!arguments[i]) { alert("加载初始化配置二次开发js失败"); return; }
                    if ("function" == typeof arguments[i].initControls) arguments[i].initControls(TaskManager);
                }
                initFormControl(TaskManager, fields, $this, callback);
            });
        } else {
            alert("没有配置控件实现js");
        }
    };
    /**
     * 获取表单数据
     * @returns {object} 表单实体对象（带数据）
     */
    lzmForm.prototype.getFromData = function () {
        var entity = new Object();
        for (var i in this.formControls) {
            if (!this.formControls[i].getValue) {
                entity[i] = null;
                alert(this.fields[i]['controlType'] + "控件没有实现getValue方法")
                continue;
            }
            try {
                entity[i] = this.formControls[i].getValue();
            } catch (e) {
                
                mui.toast(e.message);
                return false;
            }
        }
        return entity;
    };
    /**
     * 绑定表单数据
     * @param entity 表单实体对象
     */
    lzmForm.prototype.setFormData = function (entity) {
        for (var i in this.formControls) {
            var data = entity[i];
            if ((this.fields[i].controlType || "").toLocaleUpperCase() == "PROJECTTEAMPERSONNEL" || (this.fields[i].controlType || "").toLocaleUpperCase() == "ORGANIZATIONPERSONNEL")
                data = entity.Members;
            if (data) {
                if (!this.formControls[i].setValue) {
                    alert(this.fields[i]['controlType'] + "控件没有实现setValue方法")
                    continue;
                }
                this.formControls[i].setValue({ fieldId: i, value: data }, entity);
            }
            //else {
            //    var $this = this, _ControlType = {},
            //    preventResourceCtlException = /^(PICTURE|FILEDIRECTIVE)$/;
            //    if (preventResourceCtlException.test((this.fields[i].controlType || "").toLocaleUpperCase())) {
            //        var noInstantiationCtl = this.fields[i];
            //        lzm.fileHelper.addfolder(entity.ResoucePoolId, noInstantiationCtl.fieldCode, function (data) {
            //            entity[noInstantiationCtl.fieldCode] = data.id;
            //            $this.formControls[noInstantiationCtl.fieldCode].setValue(data.id, entity);
            //            //后期优化方案 设置值得时候 使用 { fieldId: "字段id", value:"值"}
            //            //$this.formControls[noInstantiationCtl.fieldCode].setValue({ fieldId: noInstantiationCtl.fieldCode, value: data.id }, entity);
            //        }, function (data) {
            //            lzm.JSNCHelper.showTip(3, "创建文件目录失败");
            //        })
            //    }
            //}
        }
    };
    /**
     * 设置表单只读
     */
    lzmForm.prototype.setFormReadOnly = function (flag) {
        for (var i in this.formControls) {
            if (!this.formControls[i].setReadOnly) {
                alert(this.fields[i]['controlType'] + "控件没有实现setReadOnly方法")
                continue;
            }
            this.formControls[i].setReadOnly(flag);
        }
    }
    /**
     * 全局提供
     */
    window.lzmForm = lzmForm;
})(mui);
