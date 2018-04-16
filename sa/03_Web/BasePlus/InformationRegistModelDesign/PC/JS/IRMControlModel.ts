//#region ******************************************控件相关*******************************************
//2017年6月30日17:07:17
/**
 * 控件类型实体
 */
class IrmControlType {
    code: string = "";//控件编码（唯一），例如：text
    text: string = "";//控件名称，例如：单行文本框
    width: number = 0;//如果该控件可以显示在列表中，所占列宽
    tpl: string = "";//控件ng-template模板的ID
    config: any = {};//控件配置类，例如：IrmControlConfigText
    isFieldOrTab: boolean = false;//是否既现在在表中又可以现在标签页（详情页中）中，例如：文件
    isPersonnel: boolean = false;//是否是人员指令
    isShowList: boolean = false;//是否允许显示在列表上
    isSupportSort: boolean = false;//如果该控件可以显示在列表中，是否支持排序
    isSupportSearch: boolean = false;//如果该控件可以显示在列表中，是否支持过滤
    constructor(obj?: any) {
        if (obj) {
            this.text = obj.Name;
            this.code = obj.Code;
        }
    }
}
/**
 * 控件类型配置--》单行文本框/多行文本框
 */
class IrmControlConfigText {
    IsRequired: boolean = false;//是否必填
    IsReadOnly: boolean = false;//是否只读
    Length: number = 0;//该字段限制的长度
    IsNormal: boolean = true;
    Unit: string = "";
    constructor(_length?: number, _isRequired?: boolean, _isReadOnly?: boolean) {
        this.IsRequired = _isRequired ? _isRequired : false;
        this.IsReadOnly = _isReadOnly ? _isReadOnly : false;
        this.Length = _length ? _length : 0;
    }
}
/**
 * 控件类型配置--》单选框集合/下拉框
 */
class IrmControlConfigList {
    IsCustomized: boolean = false;
    Options: Array<any> = [];
}
/**
 * 控件类型配置--》文件指令--》文件夹对象
 */
class IrmControlConfigFileFolderModel {
    Name: string = "";
    Children: Array<IrmControlConfigFileFolderModel> = [];
    Resourcemodels: Array<any> = [];
    constructor(obj?: any) {
        if (obj) {
            this.Name = obj.Name;
            this.Resourcemodels = [];
            var _this = this;
            obj.Children.forEach(function (item, i, arr) {
                _this.Children.push(new IrmControlConfigFileFolderModel(item));
            });
        }
    }
}
/**
 * 控件类型配置--》文件指令
 */
class IrmControlConfigFile {
    IsShowTab: boolean = true;
    Folders: Array<IrmControlConfigFileFolderModel> = [];
    constructor(obj?: any) {
        if (obj) {
            this.IsShowTab = obj.IsShowTab;
            var _this = this;
            obj.Folders.forEach(function (item, i, arr) {
                _this.Folders.push(new IrmControlConfigFileFolderModel(item));
            });
        }
    }
}
/**
 * 控件类型配置--》日期
 */
class IrmControlConfigDate {
    IsRequired: boolean = false;
    IsReadOnly: boolean = false;
    DateType: string = "yyyy年MM月dd日";
}

/**
 * 控件类型配置--》组织机构
 */
class IrmControlConfigParticipant {
    ThisOrg: boolean = false;
    Single: boolean = false;
}

//#endregion ***************************************控件相关*******************************************


//#region *****************************************以下是客户端实体对象*******************************
/**
 * 客户端--》表单配置--》字段基本配置
 */
class IrmFieldBase {
    fieldCode: string = "";
    fieldName: string = "";
    isDefault: boolean = false;
    isHidden: boolean = false;
    controlType: any = {};
    controlConfig: any = {};
    controlNormal: any = {};
    isListValid: boolean = false;
    isSupportSort: boolean = true;
    isSupportSearch: boolean = true;
    width: number = 0;
    constructor(sModel?: IrmServerFieldConfig) {
        if (sModel) {
            this.fieldCode = sModel.FieldCode;
            this.fieldName = sModel.FieldName;
            this.isDefault = sModel.IsDefaultField;
            this.isHidden = sModel.IsHiddenField;
            this.controlType = sModel.ControlType;
            if (sModel.ControlNormal) { this.controlNormal = JSON.parse(sModel.ControlNormal); }
            this.controlConfig = JSON.parse(sModel.ControlConfig);
        }
    }
}

/**
 * 客户端 - 属性实体类
 */
class IrmProperty {
    fieldName: string = "";
    fieldCode: string = "";
    constructor(sModel?: IrmServerProperty) {
        this.fieldName = sModel.FieldName;
        this.fieldCode = sModel.FieldCode;

    }
}

/**
 * 客户端 - 属性实体类
 */
class IrmListField {
    fieldName: string = "";
    fieldCode: string = "";
    isListValid: boolean = true;
    isSupportSearch: boolean = true;
    isSupportSort: boolean = true;
    width: number = 0;
    constructor(sModel?: IrmServerListFieldConfig) {
        this.isSupportSearch = sModel.IsSupportSearch;
        this.isSupportSort = sModel.IsSupportSort;
        this.width = parseInt(sModel.Width);
        this.fieldName = sModel.FieldName;
        this.fieldCode = sModel.FieldCode;
    }
}


/**
 * 客户端--》表单配置
 */
class IrmFormConfig {
    fields: Array<IrmFieldBase> = [];
    extendFields: Array<IrmFieldBase> = [];
}

/**
 * 客户端--》列表配置
 */
class IrmListConfig {
    fields: Array<IrmListField> = [];
    isShowSerialNumber: boolean = false;
}

/**
 * 客户端--》详情页配置--》扩展JS配置--》详情配置
 */
class IrmExtendJSConfigItem {
    list: string = "";
    add: string = "";
    detail: string = "";
    constructor(sModel?: IrmServerExtendJSConfigItem) {
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
}

/**
 * 客户端--》详情页配置--》扩展JS配置
 */
class IrmExtendJSConfig {
    web: IrmExtendJSConfigItem = new IrmExtendJSConfigItem();
    mobile: IrmExtendJSConfigItem = new IrmExtendJSConfigItem();
    constructor(sModel?: IrmServerExtendJSConfig) {
        if (sModel) {
            this.web = new IrmExtendJSConfigItem(sModel.Web);
            this.mobile = new IrmExtendJSConfigItem(sModel.Mobile);
        }
    }
}


// #region ===================扩展配置======================
/**
 * 客户端--》扩展配置--》工具条按钮配置
 */
class IrmToolbarBtnConfig {
    btnCode: string = "";
    btnName: string = "";
    btnEvent: string = "";
    isValid: boolean = false;
    isSupportPC: boolean = false;
    isSupportMobile: boolean = false;
    isDefault: boolean = false;
    constructor(sModel?: IrmServerExtendToolBarItemConfig) {
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
}
/**
 * 客户端--》扩展配置--》工具条配置
 */
class IrmExtendToolbarConfig {
    list: Array<IrmToolbarBtnConfig> = [];
    add: Array<IrmToolbarBtnConfig> = [];
    detail: Array<IrmToolbarBtnConfig> = [];
    constructor(sModel?: IrmServerExtendToolbarConfig) {
        if (sModel) {
            sModel.Add.forEach((item) => {
                this.add.push(new IrmToolbarBtnConfig(item));
            });

            sModel.Detail.forEach((item) => {
                this.detail.push(new IrmToolbarBtnConfig(item));
            });

            sModel.List.forEach((item) => {
                this.list.push(new IrmToolbarBtnConfig(item));
            });
        }
    }
}

/**
 * 客户端--》扩展配置
 */
class IrmModelExtendConfig {
    extendToolBar: IrmExtendToolbarConfig = new IrmExtendToolbarConfig();
    extendJS: IrmExtendJSConfig = new IrmExtendJSConfig();
    constructor(sModel?: IrmServerExtendConfig) {
        if (sModel) {
            this.extendToolBar = new IrmExtendToolbarConfig(sModel.ExtendToolBarConfig);
            this.extendJS = new IrmExtendJSConfig(sModel.ExtendJSConfig);
        }
    }
}
// #endregion ================扩展配置======================

/**
 * 客户端--》模型实体对象
 */
class IrmModelConfig {
    id: string = "";
    name: string = "";
    description: string = "";
    state: number = 0;
    createDate: string = "";
    createUserId: string = "";
    publishDate: string = "";
    publishUserId: string = "";
    classId: string = "";
    propertys: Array<IrmProperty> = [];
    formConfig: IrmFormConfig = new IrmFormConfig();
    listConfig: IrmListConfig = new IrmListConfig();
    extendConfig: IrmModelExtendConfig = new IrmModelExtendConfig();
    constructor(sModel?: IrmServerModelConfig) {
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
                    _this.listConfig.fields.push(new IrmListField(itemList))
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
    controlTypeToObj(typeDic: any) {
        if (this.formConfig && this.formConfig.fields.length) {
            this.formConfig.fields.forEach(function (item, index, ar) {
                item.controlType = typeDic[item.controlType];
            });
        }
    }
}


//#endregion *******************************************以上是客户端实体对象***************************************


//#region *****************************************以下是服务器端对应实体**************************
/**
* 服务器端--》表单配置--》字段配置
*/
class IrmServerFieldConfig {
    FieldCode: string = "";
    FieldName: string = "";
    IsDefaultField: boolean = false;
    IsHiddenField: boolean = false;
    ControlType: string = "";
    ControlNormal: string = "";
    ControlConfig: string = "";
    constructor(cModel: IrmFieldBase) {
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
        this.IsDefaultField = cModel.isDefault;
        this.IsHiddenField = cModel.isHidden;
        this.ControlType = cModel.controlType.code;
        if (cModel.controlNormal) { this.ControlNormal = JSON.stringify(cModel.controlNormal); }
        this.ControlConfig = JSON.stringify(cModel.controlConfig);
    }
}

/**
 * 服务器端--》表单配置
 */
class IrmServerFormConfig {
    Fields: Array<IrmServerFieldConfig> = [];
    constructor(cList: Array<IrmFieldBase>) {
        var _this = this;
        cList.forEach(function (item, index, ar) {
            _this.Fields.push(new IrmServerFieldConfig(item));
        });
    }
}

/**
 * 服务器端--》列表配置--》字段配置
 */
class IrmServerListFieldConfig {
    FieldCode: string = "";
    FieldName: string = "";
    Width: string = "0";
    IsSupportSort: boolean = false;
    IsSupportSearch: boolean = false;
    constructor(cModel: IrmListField) {
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
        this.Width = cModel.width.toString();
        this.IsSupportSort = cModel.isSupportSort;
        this.IsSupportSearch = cModel.isSupportSearch;
    }
}

/**
 * 服务器端--》列表配置
 */
class IrmServerListConfig {
    ShowFields: Array<IrmServerListFieldConfig> = [];
    IsShowSerialNumber: boolean = false;
    constructor(cList: IrmListConfig) {
        var _this = this;
        cList.fields.forEach(function (item, index, ar) {
            if (item.isListValid) {
                _this.ShowFields.push(new IrmServerListFieldConfig(item));
            }
        });
        _this.IsShowSerialNumber = cList.isShowSerialNumber;
    }
}

// #region ===================扩展配置======================

/**
 * 服务器端--》扩展配置--》工具条按钮配置
 */
class IrmServerExtendToolBarItemConfig {
    ButtonCode: string = "";
    ButtonName: string = "";
    TargetEvent: string = "";
    IsValid: boolean = false;
    IsSupportPC: boolean = false;
    IsSupportMobile: boolean = false;
    IsDefault: boolean = false;
    constructor(cModel: IrmToolbarBtnConfig) {
        this.ButtonCode = cModel.btnCode;
        this.ButtonName = cModel.btnName;
        this.TargetEvent = cModel.btnEvent;
        this.IsValid = cModel.isValid;
        this.IsSupportPC = cModel.isSupportPC;
        this.IsSupportMobile = cModel.isSupportMobile;
        this.IsDefault = cModel.isDefault;
    }
}

/**
 * 服务器端--》扩展配置--》工具条配置
 */
class IrmServerExtendToolbarConfig {
    List: Array<IrmServerExtendToolBarItemConfig> = [];
    Add: Array<IrmServerExtendToolBarItemConfig> = [];
    Detail: Array<IrmServerExtendToolBarItemConfig> = [];
    constructor(cModel: IrmExtendToolbarConfig) {
        if (cModel) {
            cModel.add.forEach((item) => {
                this.Add.push(new IrmServerExtendToolBarItemConfig(item));
            });

            cModel.detail.forEach((item) => {
                this.Detail.push(new IrmServerExtendToolBarItemConfig(item));
            });

            cModel.list.forEach((item) => {
                this.List.push(new IrmServerExtendToolBarItemConfig(item));
            });
        }
    }
}

/**
 * 服务器端--》扩展配置--》扩展JS配置--》详情配置
 */
class IrmServerExtendJSConfigItem {
    List: Array<string> = [];
    Add: Array<string> = [];
    Detail: Array<string> = [];
    constructor(cModel: IrmExtendJSConfigItem) {
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
}

/**
 * 服务器端--》扩展配置--》扩展JS配置
 */
class IrmServerExtendJSConfig {
    Web: IrmServerExtendJSConfigItem = null;
    Mobile: IrmServerExtendJSConfigItem = null;
    constructor(cModel: IrmExtendJSConfig) {
        this.Web = new IrmServerExtendJSConfigItem(cModel.web);
        this.Mobile = new IrmServerExtendJSConfigItem(cModel.mobile);
    }
}

/**
 * 服务器端--》扩展页配置
 */
class IrmServerExtendConfig {
    ExtendToolBarConfig: IrmServerExtendToolbarConfig = null;
    ExtendJSConfig: IrmServerExtendJSConfig = null;
    constructor(cModel: IrmModelExtendConfig) {
        var _this = this;
        this.ExtendToolBarConfig = new IrmServerExtendToolbarConfig(cModel.extendToolBar);
        this.ExtendJSConfig = new IrmServerExtendJSConfig(cModel.extendJS);
    }
}


// #endregion ================扩展配置======================

/**
 * 服务端 - 属性实体类
 */
class IrmServerProperty {
    FieldName: string;
    FieldCode: string;
    constructor(cModel: IrmProperty) {
        this.FieldCode = cModel.fieldCode;
        this.FieldName = cModel.fieldName;
    }
}

/**
 * 服务器端--》模型实体对象
 */
class IrmServerModelConfig {
    Id: string = "";
    Name: string = "";
    AddUserId: string = "";
    PublishUserId: string = "";
    State: number = 0;
    Description: string = "";
    AddTime: string = "";
    PublishTime: string = "";
    Propertys: Array<IrmServerProperty> = [];
    FormConfig: IrmServerFormConfig = null;
    ListConfig: IrmServerListConfig = null;
    ExtendConfig: IrmServerExtendConfig = null;
    ClassId = "";
    constructor(cModel: IrmModelConfig) {
        this.Id = cModel.id;
        this.Name = cModel.name;
        this.AddUserId = cModel.createUserId;
        this.PublishUserId = cModel.publishUserId;
        this.State = cModel.state;
        this.AddTime = cModel.createDate;
        this.PublishTime = cModel.publishDate;
        this.Description = cModel.description;

        if (cModel.propertys) {
            cModel.propertys.forEach((item) => {
                this.Propertys.push(new IrmServerProperty(item));
            });
        }

        this.ClassId = cModel.classId;
        this.FormConfig = new IrmServerFormConfig(cModel.formConfig.fields);
        this.ListConfig = new IrmServerListConfig(cModel.listConfig);
        this.ExtendConfig = new IrmServerExtendConfig(cModel.extendConfig);
    }
}

//#endregion *************************************以上是服务器端对应实体********************************