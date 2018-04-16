//#region ******************************************控件相关*******************************************
//2017年6月30日17:07:17
/**
 * 控件类型实体
 */
var IrmControlType = (function () {
    function IrmControlType(obj) {
        this.code = ""; //控件编码（唯一），例如：text
        this.text = ""; //控件名称，例如：单行文本框
        this.width = 0; //如果该控件可以显示在列表中，所占列宽
        this.tpl = ""; //控件ng-template模板的ID
        this.config = {}; //控件配置类，例如：IrmControlConfigText
        this.isFieldOrTab = false; //是否既现在在表中又可以现在标签页（详情页中）中，例如：文件
        this.isPersonnel = false; //是否是人员指令
        this.isShowList = false; //是否允许显示在列表上
        this.isSupportSort = false; //如果该控件可以显示在列表中，是否支持排序
        this.isSupportSearch = false; //如果该控件可以显示在列表中，是否支持过滤
        if (obj) {
            this.text = obj.Name;
            this.code = obj.Code;
        }
    }
    return IrmControlType;
}());
/**
 * 控件类型配置--》单行文本框/多行文本框
 */
var IrmControlConfigText = (function () {
    function IrmControlConfigText(_length, _isRequired, _isReadOnly) {
        this.IsRequired = false; //是否必填
        this.IsReadOnly = false; //是否只读
        this.Length = 0; //该字段限制的长度
        this.IsNormal = true;
        this.Unit = "";
        this.IsRequired = _isRequired ? _isRequired : false;
        this.IsReadOnly = _isReadOnly ? _isReadOnly : false;
        this.Length = _length ? _length : 0;
    }
    return IrmControlConfigText;
}());
/**
 * 控件类型配置--》单选框集合/下拉框
 */
var IrmControlConfigList = (function () {
    function IrmControlConfigList() {
        this.IsCustomized = false;
        this.Options = [];
    }
    return IrmControlConfigList;
}());
/**
 * 控件类型配置--》文件指令--》文件夹对象
 */
var IrmControlConfigFileFolderModel = (function () {
    function IrmControlConfigFileFolderModel(obj) {
        this.Name = "";
        this.Children = [];
        this.Resourcemodels = [];
        if (obj) {
            this.Name = obj.Name;
            this.Resourcemodels = [];
            var _this = this;
            obj.Children.forEach(function (item, i, arr) {
                _this.Children.push(new IrmControlConfigFileFolderModel(item));
            });
        }
    }
    return IrmControlConfigFileFolderModel;
}());
/**
 * 控件类型配置--》文件指令
 */
var IrmControlConfigFile = (function () {
    function IrmControlConfigFile(obj) {
        this.IsShowTab = true;
        this.Folders = [];
        if (obj) {
            this.IsShowTab = obj.IsShowTab;
            var _this = this;
            obj.Folders.forEach(function (item, i, arr) {
                _this.Folders.push(new IrmControlConfigFileFolderModel(item));
            });
        }
    }
    return IrmControlConfigFile;
}());
/**
 * 控件类型配置--》日期
 */
var IrmControlConfigDate = (function () {
    function IrmControlConfigDate() {
        this.IsRequired = false;
        this.IsReadOnly = false;
        this.DateType = "yyyy年MM月dd日";
    }
    return IrmControlConfigDate;
}());
/**
 * 控件类型配置--》组织机构
 */
var IrmControlConfigParticipant = (function () {
    function IrmControlConfigParticipant() {
        this.ThisOrg = false;
        this.Single = false;
    }
    return IrmControlConfigParticipant;
}());
//#endregion ***************************************控件相关*******************************************
//#region *****************************************以下是客户端实体对象*******************************
/**
 * 客户端--》表单配置--》字段基本配置
 */
var IrmFieldBase = (function () {
    function IrmFieldBase(sModel) {
        this.fieldCode = "";
        this.fieldName = "";
        this.isDefault = false;
        this.isHidden = false;
        this.controlType = {};
        this.controlConfig = {};
        this.controlNormal = {};
        this.isListValid = false;
        this.isSupportSort = true;
        this.isSupportSearch = true;
        this.width = 0;
        if (sModel) {
            this.fieldCode = sModel.FieldCode;
            this.fieldName = sModel.FieldName;
            this.isDefault = sModel.IsDefaultField;
            this.isHidden = sModel.IsHiddenField;
            this.controlType = sModel.ControlType;
            if (sModel.ControlNormal) {
                this.controlNormal = JSON.parse(sModel.ControlNormal);
            }
            this.controlConfig = JSON.parse(sModel.ControlConfig);
        }
    }
    return IrmFieldBase;
}());
/**
 * 客户端 - 属性实体类
 */
var IrmProperty = (function () {
    function IrmProperty(sModel) {
        this.fieldName = "";
        this.fieldCode = "";
        this.fieldName = sModel.FieldName;
        this.fieldCode = sModel.FieldCode;
    }
    return IrmProperty;
}());
/**
 * 客户端 - 属性实体类
 */
var IrmListField = (function () {
    function IrmListField(sModel) {
        this.fieldName = "";
        this.fieldCode = "";
        this.isListValid = true;
        this.isSupportSearch = true;
        this.isSupportSort = true;
        this.width = 0;
        this.isSupportSearch = sModel.IsSupportSearch;
        this.isSupportSort = sModel.IsSupportSort;
        this.width = parseInt(sModel.Width);
        this.fieldName = sModel.FieldName;
        this.fieldCode = sModel.FieldCode;
    }
    return IrmListField;
}());
/**
 * 客户端--》表单配置
 */
var IrmFormConfig = (function () {
    function IrmFormConfig() {
        this.fields = [];
        this.extendFields = [];
    }
    return IrmFormConfig;
}());
/**
 * 客户端--》列表配置
 */
var IrmListConfig = (function () {
    function IrmListConfig() {
        this.fields = [];
        this.isShowSerialNumber = false;
    }
    return IrmListConfig;
}());
/**
 * 客户端--》详情页配置--》扩展JS配置--》详情配置
 */
var IrmExtendJSConfigItem = (function () {
    function IrmExtendJSConfigItem(sModel) {
        this.list = "";
        this.add = "";
        this.detail = "";
        if (sModel) {
            if (sModel.List) {
                this.list = sModel.List.join("\n");
            }
            if (sModel.Add) {
                this.add = sModel.Add.join("\n");
            }
            if (sModel.Detail) {
                this.detail = sModel.Detail.join("\n");
            }
        }
    }
    return IrmExtendJSConfigItem;
}());
/**
 * 客户端--》详情页配置--》扩展JS配置
 */
var IrmExtendJSConfig = (function () {
    function IrmExtendJSConfig(sModel) {
        this.web = new IrmExtendJSConfigItem();
        this.mobile = new IrmExtendJSConfigItem();
        if (sModel) {
            this.web = new IrmExtendJSConfigItem(sModel.Web);
            this.mobile = new IrmExtendJSConfigItem(sModel.Mobile);
        }
    }
    return IrmExtendJSConfig;
}());
// #region ===================扩展配置======================
/**
 * 客户端--》扩展配置--》工具条按钮配置
 */
var IrmToolbarBtnConfig = (function () {
    function IrmToolbarBtnConfig(sModel) {
        this.btnCode = "";
        this.btnName = "";
        this.btnEvent = "";
        this.isValid = false;
        this.isSupportPC = false;
        this.isSupportMobile = false;
        this.isDefault = false;
        if (sModel) {
            this.btnCode = sModel.ButtonCode;
            this.btnName = sModel.ButtonName;
            this.btnEvent = sModel.TargetEvent;
            this.isValid = sModel.IsValid;
            this.isSupportPC = sModel.IsSupportPC;
            this.isSupportMobile = sModel.IsSupportMobile;
            this.isDefault = sModel.IsDefault;
        }
    }
    return IrmToolbarBtnConfig;
}());
/**
 * 客户端--》扩展配置--》工具条配置
 */
var IrmExtendToolbarConfig = (function () {
    function IrmExtendToolbarConfig(sModel) {
        var _this = this;
        this.list = [];
        this.add = [];
        this.detail = [];
        if (sModel) {
            sModel.Add.forEach(function (item) {
                _this.add.push(new IrmToolbarBtnConfig(item));
            });
            sModel.Detail.forEach(function (item) {
                _this.detail.push(new IrmToolbarBtnConfig(item));
            });
            sModel.List.forEach(function (item) {
                _this.list.push(new IrmToolbarBtnConfig(item));
            });
        }
    }
    return IrmExtendToolbarConfig;
}());
/**
 * 客户端--》扩展配置
 */
var IrmModelExtendConfig = (function () {
    function IrmModelExtendConfig(sModel) {
        this.extendToolBar = new IrmExtendToolbarConfig();
        this.extendJS = new IrmExtendJSConfig();
        if (sModel) {
            this.extendToolBar = new IrmExtendToolbarConfig(sModel.ExtendToolBarConfig);
            this.extendJS = new IrmExtendJSConfig(sModel.ExtendJSConfig);
        }
    }
    return IrmModelExtendConfig;
}());
// #endregion ================扩展配置======================
/**
 * 客户端--》模型实体对象
 */
var IrmModelConfig = (function () {
    function IrmModelConfig(sModel) {
        this.id = "";
        this.name = "";
        this.description = "";
        this.state = 0;
        this.createDate = "";
        this.createUserId = "";
        this.publishDate = "";
        this.publishUserId = "";
        this.classId = "";
        this.propertys = [];
        this.formConfig = new IrmFormConfig();
        this.listConfig = new IrmListConfig();
        this.extendConfig = new IrmModelExtendConfig();
        if (sModel) {
            this.id = sModel.Id;
            this.name = sModel.Name;
            this.state = sModel.State;
            this.description = sModel.Description;
            this.createUserId = sModel.AddUserId;
            this.createDate = sModel.AddTime;
            this.publishUserId = sModel.PublishUserId;
            this.publishDate = sModel.PublishTime;
            this.classId = sModel.ClassId;
            var _this = this;
            if (sModel.FormConfig) {
                sModel.FormConfig.Fields.forEach(function (itemForm, i, arr) {
                    var tempFormField = new IrmFieldBase(itemForm);
                    _this.formConfig.fields.push(tempFormField);
                });
            }
            if (sModel.ListConfig) {
                sModel.ListConfig.ShowFields.forEach(function (itemList, k, ar) {
                    //if (itemForm.FieldCode === itemList.FieldCode) {
                    //    tempFormField.isListValid = true;
                    //    tempFormField.isSupportSearch = itemList.IsSupportSearch;
                    //    tempFormField.isSupportSort = itemList.IsSupportSort;
                    //    tempFormField.width = parseInt(itemList.Width);
                    //    _this.listConfig.fields[k] = tempFormField;
                    //}
                    _this.listConfig.fields.push(new IrmListField(itemList));
                });
                _this.listConfig.isShowSerialNumber = sModel.ListConfig.IsShowSerialNumber;
            }
            if (sModel.Propertys) {
                sModel.Propertys.forEach(function (itemForm, i, arr) {
                    _this.propertys.push(new IrmProperty(itemForm));
                });
            }
            this.extendConfig = new IrmModelExtendConfig(sModel.ExtendConfig);
        }
    }
    IrmModelConfig.prototype.controlTypeToObj = function (typeDic) {
        if (this.formConfig && this.formConfig.fields.length) {
            this.formConfig.fields.forEach(function (item, index, ar) {
                item.controlType = typeDic[item.controlType];
            });
        }
    };
    return IrmModelConfig;
}());
//#endregion *******************************************以上是客户端实体对象***************************************
//#region *****************************************以下是服务器端对应实体**************************
/**
* 服务器端--》表单配置--》字段配置
*/
var IrmServerFieldConfig = (function () {
    function IrmServerFieldConfig(cModel) {
        this.FieldCode = "";
        this.FieldName = "";
        this.IsDefaultField = false;
        this.IsHiddenField = false;
        this.ControlType = "";
        this.ControlNormal = "";
        this.ControlConfig = "";
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
        this.IsDefaultField = cModel.isDefault;
        this.IsHiddenField = cModel.isHidden;
        this.ControlType = cModel.controlType.code;
        if (cModel.controlNormal) {
            this.ControlNormal = JSON.stringify(cModel.controlNormal);
        }
        this.ControlConfig = JSON.stringify(cModel.controlConfig);
    }
    return IrmServerFieldConfig;
}());
/**
 * 服务器端--》表单配置
 */
var IrmServerFormConfig = (function () {
    function IrmServerFormConfig(cList) {
        this.Fields = [];
        var _this = this;
        cList.forEach(function (item, index, ar) {
            _this.Fields.push(new IrmServerFieldConfig(item));
        });
    }
    return IrmServerFormConfig;
}());
/**
 * 服务器端--》列表配置--》字段配置
 */
var IrmServerListFieldConfig = (function () {
    function IrmServerListFieldConfig(cModel) {
        this.FieldCode = "";
        this.FieldName = "";
        this.Width = "0";
        this.IsSupportSort = false;
        this.IsSupportSearch = false;
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
        this.Width = cModel.width.toString();
        this.IsSupportSort = cModel.isSupportSort;
        this.IsSupportSearch = cModel.isSupportSearch;
    }
    return IrmServerListFieldConfig;
}());
/**
 * 服务器端--》列表配置
 */
var IrmServerListConfig = (function () {
    function IrmServerListConfig(cList) {
        this.ShowFields = [];
        this.IsShowSerialNumber = false;
        var _this = this;
        cList.fields.forEach(function (item, index, ar) {
            if (item.isListValid) {
                _this.ShowFields.push(new IrmServerListFieldConfig(item));
            }
        });
        _this.IsShowSerialNumber = cList.isShowSerialNumber;
    }
    return IrmServerListConfig;
}());
// #region ===================扩展配置======================
/**
 * 服务器端--》扩展配置--》工具条按钮配置
 */
var IrmServerExtendToolBarItemConfig = (function () {
    function IrmServerExtendToolBarItemConfig(cModel) {
        this.ButtonCode = "";
        this.ButtonName = "";
        this.TargetEvent = "";
        this.IsValid = false;
        this.IsSupportPC = false;
        this.IsSupportMobile = false;
        this.IsDefault = false;
        this.ButtonCode = cModel.btnCode;
        this.ButtonName = cModel.btnName;
        this.TargetEvent = cModel.btnEvent;
        this.IsValid = cModel.isValid;
        this.IsSupportPC = cModel.isSupportPC;
        this.IsSupportMobile = cModel.isSupportMobile;
        this.IsDefault = cModel.isDefault;
    }
    return IrmServerExtendToolBarItemConfig;
}());
/**
 * 服务器端--》扩展配置--》工具条配置
 */
var IrmServerExtendToolbarConfig = (function () {
    function IrmServerExtendToolbarConfig(cModel) {
        var _this = this;
        this.List = [];
        this.Add = [];
        this.Detail = [];
        if (cModel) {
            cModel.add.forEach(function (item) {
                _this.Add.push(new IrmServerExtendToolBarItemConfig(item));
            });
            cModel.detail.forEach(function (item) {
                _this.Detail.push(new IrmServerExtendToolBarItemConfig(item));
            });
            cModel.list.forEach(function (item) {
                _this.List.push(new IrmServerExtendToolBarItemConfig(item));
            });
        }
    }
    return IrmServerExtendToolbarConfig;
}());
/**
 * 服务器端--》扩展配置--》扩展JS配置--》详情配置
 */
var IrmServerExtendJSConfigItem = (function () {
    function IrmServerExtendJSConfigItem(cModel) {
        this.List = [];
        this.Add = [];
        this.Detail = [];
        if (cModel.list && cModel.list.trim()) {
            this.List = cModel.list.trim().replace(/\n\n*/g, '\n').split("\n");
        }
        else {
            this.List = [];
        }
        if (cModel.add && cModel.add.trim()) {
            this.Add = cModel.add.trim().replace(/\n\n*/g, '\n').split("\n");
        }
        else {
            this.Add = [];
        }
        if (cModel.detail && cModel.detail.trim()) {
            this.Detail = cModel.detail.trim().replace(/\n\n*/g, '\n').split("\n");
        }
        else {
            this.Detail = [];
        }
    }
    return IrmServerExtendJSConfigItem;
}());
/**
 * 服务器端--》扩展配置--》扩展JS配置
 */
var IrmServerExtendJSConfig = (function () {
    function IrmServerExtendJSConfig(cModel) {
        this.Web = null;
        this.Mobile = null;
        this.Web = new IrmServerExtendJSConfigItem(cModel.web);
        this.Mobile = new IrmServerExtendJSConfigItem(cModel.mobile);
    }
    return IrmServerExtendJSConfig;
}());
/**
 * 服务器端--》扩展页配置
 */
var IrmServerExtendConfig = (function () {
    function IrmServerExtendConfig(cModel) {
        this.ExtendToolBarConfig = null;
        this.ExtendJSConfig = null;
        var _this = this;
        this.ExtendToolBarConfig = new IrmServerExtendToolbarConfig(cModel.extendToolBar);
        this.ExtendJSConfig = new IrmServerExtendJSConfig(cModel.extendJS);
    }
    return IrmServerExtendConfig;
}());
// #endregion ================扩展配置======================
/**
 * 服务端 - 属性实体类
 */
var IrmServerProperty = (function () {
    function IrmServerProperty(cModel) {
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
    }
    return IrmServerProperty;
}());
/**
 * 服务器端--》模型实体对象
 */
var IrmServerModelConfig = (function () {
    function IrmServerModelConfig(cModel) {
        var _this = this;
        this.Id = "";
        this.Name = "";
        this.AddUserId = "";
        this.PublishUserId = "";
        this.State = 0;
        this.Description = "";
        this.AddTime = "";
        this.PublishTime = "";
        this.Propertys = [];
        this.FormConfig = null;
        this.ListConfig = null;
        this.ExtendConfig = null;
        this.ClassId = "";
        this.Id = cModel.id;
        this.Name = cModel.name;
        this.AddUserId = cModel.createUserId;
        this.PublishUserId = cModel.publishUserId;
        this.State = cModel.state;
        this.AddTime = cModel.createDate;
        this.PublishTime = cModel.publishDate;
        this.Description = cModel.description;
        if (cModel.propertys) {
            cModel.propertys.forEach(function (item) {
                _this.Propertys.push(new IrmServerProperty(item));
            });
        }
        this.ClassId = cModel.classId;
        this.FormConfig = new IrmServerFormConfig(cModel.formConfig.fields);
        this.ListConfig = new IrmServerListConfig(cModel.listConfig);
        this.ExtendConfig = new IrmServerExtendConfig(cModel.extendConfig);
    }
    return IrmServerModelConfig;
}());
//#endregion *************************************以上是服务器端对应实体******************************** 
