/// <reference path="TaskManager.js" />
/*********************************************************
* 创建者：lz-zyf
* 创建日期：2017-03-01 14:18:48
* 描述：内置控件实现
* 维护：
* *******************************************************/
"use strict";
; (function (window, define) {
    define(function () {
        return {
            initControls: function (config) {
                /**
                * text/单行文本框
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    var CLASS_INPUT = '';
                    var CLASS_INPUT = '';
                    $.TEXT = function (parentElement, dataConfig) {
                        var controlDom = $.createElement('div')
                        var lable = $.createElement('label')
                        lable.innerText = dataConfig.fieldName;
                        var inputBox = $.createElement('div');
                        inputBox.classList.add('lzm-form-item-content');
                        var input = $.createElement('input');
                        input.attr("type", "text");
                        if ("add" == dataConfig._client_nowPage) {
                            input.attr("placeholder", lzm.String.format("请输入{0}", (dataConfig.controlConfig.isRequired ? "(必填)" : "")));
                            input.classList.add('mui-input-clear');
                        }
                        var method = {
                            init: function () {
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData) {
                                    input.value = fieldData.value;
                                    return input.value;
                                }
                            },
                            getValue: function () {
                                return $.validate(dataConfig, input.value);
                            },
                            setReadOnly: function (flag) {
                                if (flag) {
                                    input.readOnly = true;
                                    input.classList.add("lzm-default-value");
                                } else {
                                    input.readOnly = false;
                                    input.classList.remove("lzm-default-value");
                                }
                            }
                        };
                        var _value = "";
                        input.onfocus = function () {
                            _value = this.value;
                        }
                        input.onblur = function () {
                            if (_value != this.value) {
                                $.trigger(input, "CTM_FormControlValueChange", { fieldCode: dataConfig.fieldCode, oldValue: _value, newValue: this.value });
                            }
                        }
                        inputBox.appendChild(input);
                        controlDom.appendChild(lable);
                        controlDom.appendChild(inputBox);
                        parentElement.appendChild(controlDom);
                        return method;
                    }
                })(formControl, window, document);

                /**
                * textarea/多行文本框
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    var CLASS_INPUT = '';
                    $.TEXTAREA = function (parentElement, dataConfig) {
                        var controlDom = $.createElement('div')
                        var lable = $.createElement('label')
                        lable.innerText = dataConfig.fieldName;
                        var inputBox = $.createElement('div');
                        inputBox.classList.add('lzm-form-item-content');
                        var input = $.createElement('textarea');
                        input.attr("rows", "3");
                        if ("add" == dataConfig._client_nowPage) {
                            input.attr("placeholder", lzm.String.format("请输入{0}", (dataConfig.controlConfig.isRequired ? "(必填)" : "")));
                            input.classList.add('mui-input-clear');
                        }
                        var _value = "";
                        input.onfocus = function () {
                            _value = this.value;
                        }
                        input.onblur = function () {
                            if (_value != this.value) {
                                $.trigger(input, "CTM_FormControlValueChange", { fieldCode: dataConfig.fieldCode, oldValue: _value, newValue: this.value });
                            }
                        }
                        var method = {
                            init: function () {

                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData) {
                                    input.value = fieldData.value;
                                    return input.value;
                                }
                            },
                            getValue: function () {
                                return $.validate(dataConfig, input.value);
                            },
                            setReadOnly: function (flag) {
                                if (flag) {
                                    input.readOnly = true;
                                    input.classList.add("lzm-default-value");
                                } else {
                                    input.readOnly = false;
                                    input.classList.remove("lzm-default-value");
                                }
                            }
                        };
                        inputBox.appendChild(input);
                        controlDom.appendChild(lable);
                        controlDom.appendChild(inputBox);
                        parentElement.appendChild(controlDom);
                        return method;
                    }
                })(formControl, window, document);

                /**
                * projectName/项目
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.PROJECTNAME = function (parentElement, dataConfig) {
                        var controlDom = $.createElement('div')
                        var content = $.createElement('div')
                        content.classList.add('controls');
                        content.attr("style", '  padding-left: 100px;');
                        content.classList.add('lzm-default-value');
                        var lable = $.createElement('label')
                        content.innerText = ""
                        lable.innerText = dataConfig.fieldName;
                        controlDom.appendChild(lable);
                        controlDom.appendChild(content);
                        parentElement.appendChild(controlDom);
                        var method = {
                            init: function () {

                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData.value) {
                                    content.innerText = fieldData.value;
                                    return content.innerText
                                }
                            },
                            getValue: function () {
                                return "";
                                //项目不提交数据
                                //return content.innerText;
                            },
                            setReadOnly: function (flag) { }
                        };
                        return method;
                    }
                })(formControl, window, document);

                /**
                * principal/负责人
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.PRINCIPAL = function (parentElement, dataConfig) {
                        var _UserInfo = {
                            userId: null,
                            userName: null,
                            userFaceId: null,
                            src: "/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif"
                        };
                        var controlDom = $.createElement('div')
                        var lable = $.createElement('label')
                        lable.innerText = dataConfig.fieldName;
                        var inputBox = $.createElement('div');
                        inputBox.classList.add('lzm-form-item-content');
                        var userFaceDom = $.createElement('img');
                        userFaceDom.classList.add('lzm-float-left');
                        userFaceDom.classList.add('lzm-img-circle');
                        userFaceDom.classList.add('lzm-img-face');
                        userFaceDom.src = _UserInfo.src;
                        userFaceDom.onerror = "javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';"
                        var userNameDom = $.createElement('span');
                        userNameDom.classList.add("lzm-ellipsis")
                        userNameDom.classList.add('lzm-float-left');
                        userNameDom.classList.add("lzm-img-face-name")
                        userNameDom.innerText = "";
                        if ("detail" == dataConfig._client_nowPage) {
                            userFaceDom.classList.add('lzm-display-none');
                            userFaceDom.classList.add('lzm-default-value');
                            userNameDom.classList.add('lzm-default-value');
                        }
                        var method = {
                            init: function () {

                            },
                            /**
                             *  userInfo={userId: null,userName: null,userFaceId: null}
                             */
                            setValue: function (fieldData, entity) {
                                lzm.extendInHere(_UserInfo, fieldData.value);
                                userFaceDom.src = new lzm.WebApi().getFacePic(_UserInfo.userFaceId) || src;
                                userNameDom.innerText = _UserInfo.userName;
                            },
                            getValue: function () {
                                return _UserInfo.userId;
                            },
                            setReadOnly: function (flag) { }
                        };
                        controlDom.appendChild(lable);
                        controlDom.appendChild(inputBox);
                        inputBox.appendChild(userFaceDom);
                        inputBox.appendChild(userNameDom);
                        parentElement.appendChild(controlDom);
                        return method;
                    }
                })(formControl, window, document);

                /**
                * dropdownlist、radiolist/下拉框、单选框
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.DROPDOWNLIST = $.RADIOLIST = function (parentElement, dataConfig) {
                        var picker = new mui.PopPicker(), setData = [], readOnly = false;
                        if (dataConfig.controlConfig.options instanceof Array)
                            setData = [].map.call(dataConfig.controlConfig.options, function (item) { return { value: item, text: item } });
                        picker.setData(setData);

                        var controlDom = $.createElement('div');
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", '  margin-top: 1px;');

                        var controlDom = $.createElement('div');
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", '  margin-top: 1px;');

                        var optionCtrl = $.createElement('div');
                        optionCtrl.classList.add('mui-navigate-right');
                        optionCtrl.innerText = dataConfig.fieldName;

                        var optionDom = $.createElement('span');
                        optionDom.classList.add('placeholder-span');
                        if ("detail" != dataConfig._client_nowPage && (setData instanceof Array) && setData.length > 0) optionDom.innerText = setData[0].text;
                        controlDom.addEventListener('tap', function () {
                            if (readOnly) return;
                            var oldSelected = optionDom.innerText === picker.getSelectedItems()[0].value ? picker.getSelectedItems() : "";
                            if (picker.getSelectedItems()[0].text === optionDom.innerText && oldSelected) {
                                picker.pickers[0].setSelectedValue(optionDom.innerText);
                            } else {
                                picker.pickers[0].setSelectedIndex(0);
                            }
                            lzm.JSNCHelper.hideKeyboard(function () {
                                picker.show(function (items) {
                                    if (items[0].text) {
                                        optionDom.innerText = items[0].text;
                                        if (!(oldSelected[0] === items[0])) $.trigger(controlDom, "CTM_FormControlValueChange", { fieldCode: dataConfig.fieldCode, oldValue: oldSelected[0], newValue: items[0] });
                                    }
                                });
                            })
                        })
                        optionCtrl.appendChild(optionDom);
                        controlDom.appendChild(optionCtrl);
                        parentElement.appendChild(controlDom);
                        var method = {
                            init: function (pageConfig, initData, selectedValue) {
                                initData && picker.setData(initData);
                                selectedValue && this.setValue({ value: selectedValue });
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData.value) picker.pickers[0].setSelectedValue(fieldData.value);
                                optionDom.innerText = fieldData.value
                            },
                            getValue: function () {
                                return optionDom.innerText;
                            },
                            setReadOnly: function (flag) {
                                controlDom.classList[flag ? "add" : "remove"]('mui-disabled');
                                readOnly = flag
                            }
                        };
                        return method;
                    }
                })(formControl, window, document);

                /**
                * date/选择日期控件
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    var CLASS_INPUT = '';
                    $.DATE = function (parentElement, dataConfig) {
                        var readOnly = false;
                        var controlDom = $.createElement('div');
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", '  margin-top: 1px;');

                        var dataCtrl = $.createElement('div');
                        dataCtrl.classList.add('mui-navigate-right');
                        dataCtrl.innerText = dataConfig.fieldName;
                        var span = $.createElement('span');
                        span.classList.add('placeholder-span');
                        if ("add" == dataConfig._client_nowPage) {
                            span.innerText = lzm.String.format('请选择{0}', (dataConfig.controlConfig.isRequired ? "(必填)" : ""));
                        };
                        var tempDate = lzm.Date.format(new Date(), dataConfig.controlConfig.dateType, true);
                        controlDom.addEventListener('tap', function () {
                            if (readOnly) return;
                            lzm.JSNCHelper.selectDate(function (date) {
                                span.innerText = tempDate = date;
                            }, dataConfig.controlConfig.dateType, dataConfig.fieldName, tempDate);
                        })
                        dataCtrl.appendChild(span);
                        controlDom.appendChild(dataCtrl);
                        parentElement.appendChild(controlDom);
                        return {
                            init: function () {

                            },
                            getValue: function () {
                                var result = span.innerText.replace("请选择", "").replace("(必填)", "");
                                if (dataConfig.controlConfig.isRequired && result.length == 0) throw new Error(lzm.String.format("请选择{0}！", dataConfig.fieldName));
                                else return result;
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData.value) {
                                    span.innerText = tempDate = fieldData.value;
                                }
                            },
                            setReadOnly: function (flag) {
                                controlDom.classList[flag ? "add" : "remove"]('mui-disabled');
                                readOnly = flag;
                            }
                        }
                    }
                })(formControl, window, document);

                /**
                * fileDirective/文件
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.FILEDIRECTIVE = function (parentElement, dataConfig) {
                        var _Data = { fieldData: {}, model: {} };
                        var result = {
                            "rpid": null,
                            "partitiontype": "0",
                            "savetype": "child",
                            "folders": [],//{ "name": "asdasd" }
                            "resources": []//{ "fileids": "162077610357043200" }
                        }
                        var controlDom = $.createElement('div')
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", '  margin-top: 1px;padding: 0px;');
                        var lable = $.createElement('label')
                        lable.innerText = dataConfig.fieldName;
                        addEventListener("TaskStateChange", function () {
                            var data = sessionStorage.getItem("lcm.jsnotice.TaskStateChange");
                            _Data.model.State = data;
                        });
                        controlDom.addEventListener('tap', function () {
                            if (_Data.fieldData.value)
                                lzm.JSNCHelper.openFile(_Data.model.ResoucePoolId, _Data.fieldData.value, _Data.model._client_readOnly, dataConfig.fieldName, {
                                    //是否发动态，1：发动态 0：不发
                                    ispost: ((_Data.model.State != 1) ? "1" : "0"),
                                    //任务Id
                                    cid: _Data.model._id,
                                    //应用appcode
                                    appcode: _Data.model.AppCode,
                                    // 动态类型 
                                    posttype: "CTM_Post",
                                    //读写权限（默认读写）1：只读0：读写
                                    right: (_Data.model._client_readOnly ? "1" : "0"),
                                    //扩展参数
                                    expanddata: JSON.stringify({
                                        AppCode: _Data.model.AppCode,
                                        BusinessModuleId: _Data.model.BusinessModuleId,
                                        SceneCode: _Data.model.SceneCode,
                                        TaskId: _Data.model._id,
                                        Source: "CTM_Post_Source"
                                    })
                                });
                            else alert("没有找到目录id");
                        })
                        controlDom.appendChild(lable);
                        parentElement.appendChild(controlDom);
                        if (dataConfig.controlConfig.folders instanceof Array) result['folders'] = dataConfig.controlConfig.folders;
                        var method = {
                            init: function () {

                            },
                            getValue: function () {
                                if ("detail" == dataConfig._client_nowPage) {
                                    return _Data.fieldData.value;
                                } else {
                                    return result;
                                }
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData && entity) {
                                    _Data.fieldData = fieldData;
                                    _Data.model = entity;
                                }
                            },
                            setReadOnly: function (flag) {
                                _Data.model._client_readOnly = flag;
                            }
                        };
                        return method;
                    }
                })(formControl, window, document);

                /**
                * picture/图片
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.PICTURE = function (parentElement, dataConfig) {
                        //运行时配置
                        var runtime = {
                            imgListPlugin: {},
                            //图片列表容器id
                            listMainContainerId: '',
                            //图片列表控件按钮元素组
                            listToolElements: {
                                //上传
                                upload: null,
                                //删除
                                remove: null,
                                //保存
                                save: null,
                                //取消
                                cancel: null,
                            },
                            //图片列表控件主元素
                            listMainElement: null,
                            //是否只读
                            isReadonly: false,
                            //是否是新增模式
                            isAddMode: true,
                            //资源池ID
                            resourcePoolId: null,
                            //目录ID
                            folderId: null,
                            //文件集合
                            images: [],
                        };

                        //显示工具条
                        function showTool(element) {
                            element.classList.remove('icon-hide');
                        }

                        //隐藏工具条
                        function hideTool(element) {
                            element.classList.add('icon-hide');
                        }

                        //文件信息转换
                        function file2DataItem(file) {
                            return {
                                id: file.fileid,
                                path: lzm.fileHelper.getFilesUrl(file.fileid),
                                name: file.filename,
                                extype: file.fileExtype || file.fileext
                            }
                        }

                        //文件信息转换 批量
                        function file2DataItems(files) {
                            var tempList = [];
                            files.forEach(function (item) {
                                tempList.push(file2DataItem(item));
                            });
                            return tempList;
                        }

                        //判断是否显示删除图片
                        function changeImgTrash() {
                            if (runtime.imgListPlugin && runtime.imgListPlugin.getItems().length > 0 && !runtime.isReadonly) {
                                showTool(runtime.listToolElements.remove);
                            } else {
                                hideTool(runtime.listToolElements.remove);
                            }
                        }

                        //构建元素
                        function crateElement() {
                            var mainDom = $.createElement('div')
                            // #region 工具条
                            var list_tools_container = $.createElement('div')

                            //lable
                            var list_toolbar_lable = $.createElement('div')
                            var lable = $.createElement('label')
                            lable.innerText = dataConfig.fieldName;
                            list_toolbar_lable.appendChild(lable);

                            //imglist-toolbar
                            var list_toolbar = $.createElement('div');
                            list_toolbar.classList.add('img-list-toolbar');

                            //上传
                            var imgUpload = $.createElement('span');
                            imgUpload.classList.add('mui-icon');
                            imgUpload.classList.add('mui-icon-camera');
                            list_toolbar.appendChild(imgUpload);

                            //删除
                            var imgRemove = $.createElement('span');
                            imgRemove.classList.add('mui-icon');
                            imgRemove.classList.add('mui-icon-trash');
                            imgRemove.classList.add('icon-hide');
                            list_toolbar.appendChild(imgRemove);

                            //确定
                            var imgSave = $.createElement('span');
                            imgSave.classList.add('mui-icon');
                            imgSave.classList.add('imglist-btn');
                            imgSave.classList.add('icon-hide');
                            imgSave.innerText = '确定';
                            list_toolbar.appendChild(imgSave);

                            //取消
                            var imgCancel = $.createElement('span');
                            imgCancel.classList.add('mui-icon');
                            imgCancel.classList.add('imglist-btn');
                            imgCancel.classList.add('icon-hide');
                            imgCancel.innerText = '取消';
                            list_toolbar.appendChild(imgCancel);


                            list_tools_container.appendChild(list_toolbar_lable);
                            list_tools_container.appendChild(list_toolbar);
                            //#endregion

                            //#region 图片列表
                            var list_main_container = $.createElement('div')
                            list_main_container.classList.add('lzm-form-group');
                            list_main_container.classList.add('mui-row');
                            list_main_container.classList.add('img-list');
                            list_main_container.classList.add('no-item');

                            var attrId = document.createAttribute('id');
                            attrId.value = ('imglist' + new Date().getTime() + Math.random().toString().split('.')[1]);
                            list_main_container.attributes.setNamedItem(attrId);
                            //#endregion
                            mainDom.appendChild(list_tools_container);
                            mainDom.appendChild(list_main_container);

                            //赋值
                            runtime.listMainContainerId = attrId.value;
                            runtime.listMainElement = mainDom;
                            runtime.listToolElements.upload = imgUpload;
                            runtime.listToolElements.remove = imgRemove;
                            runtime.listToolElements.save = imgSave;
                            runtime.listToolElements.cancel = imgCancel;
                        }

                        //绑定事件
                        function bindEvent() {
                            //上传
                            runtime.listToolElements.upload.addEventListener('tap', function () {
                                var plugin = LeadingCloud.JSNC.getChannel("LZMobileFileUpload");
                                lzm.JSNCHelper.uploadFile(function (resultData) {
                                    runtime.imgListPlugin.addList(file2DataItems(resultData));
                                    changeImgTrash();
                                }, true, [1, 2], 9);
                            });
                            //删除
                            runtime.listToolElements.remove.addEventListener('tap', function () {
                                //显示删除
                                runtime.imgListPlugin.showRemove();
                                runtime.imgListPlugin.isCanSeleted = true;

                                showTool(runtime.listToolElements.save);
                                showTool(runtime.listToolElements.cancel);

                                hideTool(runtime.listToolElements.upload);
                                hideTool(runtime.listToolElements.remove);
                            });
                            //取消
                            runtime.listToolElements.cancel.addEventListener('tap', function () {
                                //隐藏删除
                                runtime.imgListPlugin.hideRemove();
                                runtime.imgListPlugin.clearSelected();
                                runtime.imgListPlugin.isCanSeleted = false;

                                hideTool(runtime.listToolElements.save);
                                hideTool(runtime.listToolElements.cancel);

                                showTool(runtime.listToolElements.upload);
                                showTool(runtime.listToolElements.remove);


                                changeImgTrash();
                            });
                            //保存
                            runtime.listToolElements.save.addEventListener('tap', function () {
                                //取到要删除的数据
                                var removeItems = runtime.imgListPlugin.getSelectedItems() || [];
                                var removeFiles = [];
                                for (var i = 0; i < removeItems.length; i++) {
                                    removeFiles.push(removeItems[i].getAttribute('fileid'));
                                }
                                if (!runtime.isAddMode) {
                                    //删除元素
                                    lzm.fileHelper.removeFiles(runtime.resourcePoolId, runtime.folderId, removeFiles, function (data) { }, function () { alert('删除失败') });
                                }
                                //隐藏删除
                                runtime.imgListPlugin.hideRemove();

                                hideTool(runtime.listToolElements.save);
                                hideTool(runtime.listToolElements.cancel);

                                showTool(runtime.listToolElements.upload);
                                showTool(runtime.listToolElements.remove);

                                runtime.imgListPlugin.removeSelected();
                                runtime.imgListPlugin.isCanSeleted = false;
                                changeImgTrash();
                            });
                        }


                        var main_dom = crateElement();
                        parentElement.appendChild(runtime.listMainElement);

                        function readyData(value, model) {
                            runtime.resourcePoolId = model.ResoucePoolId;
                            runtime.folderId = value;
                            if (!runtime.isAddMode && runtime.resourcePoolId && runtime.folderId) {
                                //获取文件信息
                                lzm.fileHelper.getFiles(runtime.resourcePoolId, runtime.folderId, function (data) {
                                    data['resourcemodels'] && data['resourcemodels'].forEach(function (file) {
                                        runtime.images.push({
                                            id: file.rid,
                                            expid: file.expid,
                                            version: file.version,
                                            path: lzm.fileHelper.getFilesUrl(file.expid)
                                        });
                                    });
                                    init();
                                }, function (error) {
                                    alert(error);
                                });
                            } else {
                                init();
                            }
                        }
                        function init() {
                            bindEvent();
                            runtime.imgListPlugin = new window.lzMisptImageList({
                                listElementId: '#' + runtime.listMainContainerId,
                                data: runtime.images,
                                //新增事件
                                addEvent: function (element, fileId) {
                                    if (runtime.isAddMode) {
                                        runtime.images.push({ fileIds: fileId });
                                    } else {
                                        //新增文件
                                        lzm.fileHelper.addFile(runtime.resourcePoolId, runtime.folderId, {
                                            id: element.getAttribute('fileid'),
                                            name: element.getAttribute('fname'),
                                            exptype: element.getAttribute('exptype'),
                                            fileids: element.getAttribute('fileid'),
                                        }, function (data) {
                                            element.setAttribute('fileid', data.DataContext.rid);
                                            element.setAttribute('version', data.DataContext.version);
                                        }, function () { alert('添加失败') });
                                    }
                                },
                                //删除事件
                                removeEvent: function (element, field) {
                                    runtime.images = runtime.images.filter(function (m) {
                                        return m.fileIds != field;
                                    });
                                },
                                //打开事件
                                openFileEvent: function (element, fileId) {
                                    if (runtime.isAddMode) {
                                        lzm.fileHelper.openFileByFid(fileId, element.getAttribute('fname') + '.' + element.getAttribute('exptype'));
                                    } else {
                                        lzm.fileHelper.openFile(fileId, element.getAttribute('version'));
                                    }
                                }
                            });
                            changeImgTrash();
                        }

                        var method = {
                            init: function (options) {
                                runtime.isAddMode = (options && options.nowPage == 'add');
                                if (runtime.isAddMode) {
                                    readyData({}, {});
                                }
                            },
                            setValue: function (fieldData, entity) {
                                if (!runtime.isAddMode) {
                                    readyData(fieldData.value, entity);
                                }
                            },
                            getValue: function () {
                                if (runtime.isAddMode) {
                                    return {
                                        "rpid": runtime.resourcePoolId,
                                        "partitiontype": "0",
                                        "savetype": "child",
                                        "folders": [],
                                        "resources": runtime.images
                                    }
                                } else {
                                    return runtime.folderId;
                                }
                            },
                            setReadOnly: function (flag) {
                                runtime.isReadonly = flag;
                                if (flag) {
                                    hideTool(runtime.listToolElements.upload);
                                    hideTool(runtime.listToolElements.remove);
                                } else {
                                    showTool(runtime.listToolElements.upload);
                                    showTool(runtime.listToolElements.remove);
                                }
                            }
                        }
                        return method;
                    }
                })(formControl, window, document);

                /**
                * recording/录音
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.RECORDING = function (parentElement, dataConfig) {
                        var readOnly = false, _Data = {
                            fieldData: {
                                fieldId: null,
                                value: {
                                    FloderId: null,
                                    FileIds: null,
                                    RIds: null
                                }
                            }, model: {}
                        }, result = {
                            "rpid": null,
                            "partitiontype": "0",
                            "savetype": "child",
                            "folders": [],//{ "name": "asdasd" }
                            "resources": []//{ "fileids": "162077610357043200" }
                        }

                        var controlDom = $.createElement('div')
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", '  margin-top: 1px;padding: 0px;');
                        var lable = $.createElement('label')
                        lable.innerText = dataConfig.fieldName;

                        var recordingVoid = $.createElement('i');
                        recordingVoid.classList.add('recording-void');
                        recordingVoid.classList.add('mui-icon');
                        recordingVoid.classList.add('mui-icon-mic');
                        recordingVoid.classList.add("irm-hidden");

                        var progressBar = $.createElement('div');
                        progressBar.classList.add('recording-progress-bar');
                        progressBar.classList.add("irm-hidden");

                        var playbox = $.createElement('i');
                        playbox.classList.add('audio');
                        playbox.classList.add('iconfont');
                        playbox.classList.add('icon-xdn-audio');

                        var timebox = $.createElement('i');
                        timebox.classList.add('time');

                        //录音方法
                        var recording = function (callback) {
                            lzm.JSNCHelper.SoundRecording(function (data) {
                                if (data instanceof Array && data.length > 0) {
                                    data = data[0];
                                    var timeNum = Number(JSON.parse(data["description"] || "{}")["totaltime"]);
                                    timeNum = isNaN(timeNum) ? 0 : Math.ceil(timeNum);
                                    callback(data["fileid"], timeNum);
                                }
                            }, 600, false);
                        }
                        //点击控件事件
                        controlDom.addEventListener('tap', function () {
                            if (_Data.fieldData.value.FileIds) {
                                //已经有正式文件目录
                                if (_Data.fieldData.value.FileIds.length > 0 && _Data.fieldData.value.FileIds[0]) {
                                    //存在录音-执行播放操作
                                    lzm.fileHelper.openFileByFid(_Data.fieldData.value.FileIds[0], "*.mp3");
                                } else {
                                    //不存在录音-执行录音
                                    recording(function (fileid, time) {
                                        timebox.innerText = time;
                                        progressBar.attr("style", 'width:' + time + 'px;');
                                        //转换成正式文件
                                        lzm.JSNCHelper.showTip("1");
                                        lzm.fileHelper.importFiles(_Data.model.ResoucePoolId, _Data.fieldData.value.FloderId, fileid, function (ss) {
                                            var newData = JSON.parse(JSON.stringify(_Data.fieldData.value));
                                            newData.RIds = [ss.rid];
                                            newData.FileIds = [ss.expid];
                                            $.trigger(controlDom, "CTM_FormControlValueChange", { fieldCode: _Data.fieldData.fieldId, oldValue: _Data.fieldData.value, newValue: newData });
                                            //之后在调用init方法
                                        }, function (data) {
                                            lzm.JSNCHelper.showTip(3, "录音转换正式文件失败");
                                        });
                                    })
                                }
                            } else {
                                if (result['resources'].length > 0) {
                                    lzm.fileHelper.openFileByFid(result['resources'][0]["fileids"], "*.mp3");
                                } else {
                                    recording(function (fileid, time) {
                                        timebox.innerText = time;
                                        progressBar.attr("style", 'width:' + time + 'px;');
                                        if ("detail" == dataConfig._client_nowPage) {
                                            //转换成正式文件
                                            lzm.JSNCHelper.showTip("1");
                                            lzm.fileHelper.importFiles(_Data.model.ResoucePoolId, _Data.fieldData.value.FloderId, fileid, function (ss) {
                                                var newData = JSON.parse(JSON.stringify(_Data.fieldData.value));
                                                newData.RIds = [ss.rid];
                                                newData.FileIds = [ss.expid];
                                                $.trigger(controlDom, "CTM_FormControlValueChange", { fieldCode: _Data.fieldData.fieldId, oldValue: _Data.fieldData.value, newValue: newData });
                                                //之后在调用init方法
                                            }, function (data) {
                                                lzm.JSNCHelper.showTip(3, "录音转换正式文件失败");
                                            });
                                        } else if ("add" == dataConfig._client_nowPage) {
                                            result['resources'].push({ fileids: fileid });
                                            recordingVoid.classList.add("irm-hidden");
                                            progressBar.classList.remove("irm-hidden");
                                        }
                                    });
                                }
                            }
                        })
                        //长按删除
                        controlDom.addEventListener('longtap', function () {
                            if (!readOnly) {
                                //存在录音文件-执行提示是否删除 
                                if ((_Data.fieldData.value.FileIds && _Data.fieldData.value.FileIds.length > 0 && _Data.fieldData.value.FileIds[0]) || (result['resources'].length == 1 && result['resources'][0]["fileids"])) {
                                    mui.confirm("确认删除该录音？", "", ['取消', '确认'], function (e) {
                                        if (e.index == 1) {
                                            if (result['resources'].length > 0) {
                                                //删除临时区
                                                result['resources'] = [];
                                                recordingVoid.classList.remove("irm-hidden");
                                                progressBar.classList.add("irm-hidden");
                                            } else {
                                                //删除正式区
                                                if (_Data.fieldData.value.RIds.length > 0 && _Data.fieldData.value.RIds[0]) {
                                                    lzm.JSNCHelper.showTip("1");
                                                    lzm.fileHelper.removeFiles(_Data.model.ResoucePoolId, _Data.fieldData.value.FloderId, [_Data.fieldData.value.RIds[0]], function (data) {
                                                        var newValue = JSON.parse(JSON.stringify(_Data.fieldData.value));
                                                        newValue.FileIds = [];
                                                        newValue.RIds = [];
                                                        $.trigger(controlDom, "CTM_FormControlValueChange", {
                                                            fieldCode: _Data.fieldData.fieldId, oldValue: _Data.fieldData.value, newValue: newValue
                                                        });
                                                        //删除之后调用set方法或者init方法
                                                    }, function () {
                                                        lzm.JSNCHelper.showTip(3, "删除录音文件失败");
                                                    });
                                                } else {
                                                    alert("没有要删除的录音");
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });

                        progressBar.appendChild(playbox);
                        progressBar.appendChild(timebox);

                        controlDom.appendChild(lable);
                        controlDom.appendChild(recordingVoid);
                        controlDom.appendChild(progressBar);
                        parentElement.appendChild(controlDom);
                        var method = {
                            init: function (config, fieldData) {
                                if (fieldData && fieldData.value) {
                                    "string" === typeof fieldData.value && (fieldData.value = JSON.parse(fieldData.value));
                                    lzm.extendInHere(_Data.fieldData.value, fieldData.value)
                                    _Data.fieldData.fieldId = fieldData.fieldId;
                                    if (_Data.fieldData.value.FileIds.length > 0) {
                                        lzm.fileHelper.getFileInfo(_Data.fieldData.value.FileIds[0], function (data) {
                                            var timeNum = Number(JSON.parse(data["description"] || "{}")["totaltime"]);
                                            timeNum = isNaN(timeNum) ? 0 : Math.ceil(timeNum);
                                            timebox.innerText = timeNum;
                                            progressBar.attr("style", 'width:' + timeNum + 'px;');
                                            recordingVoid.classList.add("irm-hidden");
                                            progressBar.classList.remove("irm-hidden");
                                        }, function (data) {
                                            lzm.JSNCHelper.showTip(3, "获取录音文件失败");
                                        })
                                    }
                                    else {
                                        recordingVoid.classList.remove("irm-hidden");
                                        progressBar.classList.add("irm-hidden");
                                    }
                                } else {
                                    recordingVoid.classList.remove("irm-hidden");
                                    progressBar.classList.add("irm-hidden");
                                }
                            },
                            getValue: function () {
                                if (_Data.fieldData.fieldId) {
                                    return JSON.stringify(_Data.fieldData.value);
                                } else {
                                    return result;
                                }
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData.value) {
                                    "string" === typeof fieldData.value && (fieldData.value = JSON.parse(fieldData.value));
                                    lzm.extendInHere(_Data.fieldData, fieldData.value)
                                    _Data.fieldData.fieldId = fieldData.fieldId;
                                    _Data.model = entity;
                                    this.init({}, fieldData);
                                }
                            },
                            setReadOnly: function (flag) {
                                readOnly = flag;
                            }
                        };
                        return method;
                    }
                })(formControl, window, document);

                /**
                * organizationPersonnel/组织机构人员选择
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.ORGANIZATIONPERSONNEL = function (parentElement, dataConfig) {
                        var controlDom = $.createElement('div')
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", 'margin-top: 1px;padding: 0px;');
                        var disableSelectedUsers = [], selectedUserModels = [], setterUserArray = new Array(), readOnly = false, webApi = new lzm.WebApi();
                        if ((LeadingCloud.User.loginInfo() || {
                        })['userId']) disableSelectedUsers.push((LeadingCloud.User.loginInfo() || {})['userId']);
                        var userEntity = function () {
                            return {
                                UserId: "",
                                OrganizationId: "",
                                UserFaceId: "",
                                UserType: 2,
                                MemberType: 2,
                                IsValid: true,
                            }
                        };
                        var bulidDetailMember = function (result) {
                            if (result instanceof Array) {
                                setterUserArray = result;
                                //构建人员头像
                                var personFaceHtmlStr = "";
                                if (setterUserArray.length > 0) personnelNumDom.parentNode.classList.remove("lzm-display-none");
                                else {
                                    personnelNumDom.parentNode.classList.add("lzm-display-none");
                                    personFaceHtmlStr = '<span class="placeholder-right-span lzm-ellipsis">未选择成员</span>';
                                }
                                //设置人数 - 数字
                                personnelNumDom.innerHTML = setterUserArray.length;
                                var personFaceHtmlStr = "";
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]["MemberType"] == 1) {
                                        personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left">' +
                                                                                    '<img class="principal-personnel-portrait lzm-img-circle" src="' + TaskManager.webApiManager.getFacePic((result[i]["FaceId"] ? result[i]["FaceId"] : result[i]["UserFaceId"])) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';"  />' +
                                                                                    '<em class="personnel-miter-king"></em>' +
                                                                                '</div>'
                                    } else {
                                        personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left">' +
                                                                                  '<img class="principal-personnel-portrait lzm-img-circle" src="' + TaskManager.webApiManager.getFacePic((result[i]["FaceId"] ? result[i]["FaceId"] : result[i]["UserFaceId"])) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';" />' +
                                                                              '</div>'
                                    }
                                }
                                personnelBox.innerHTML = personFaceHtmlStr;
                            }
                        }
                        if ("detail" == dataConfig._client_nowPage) {
                            var controlContent = $.createElement('div');
                            controlContent.classList.add('lzm-form-item-content');
                            controlContent.classList.add('mui-navigate-right');
                            controlContent.attr("style", 'padding-left: 55px;');

                            var lableIcon = $.createElement('i');
                            lableIcon.classList.add('lzm-icon-user-list-group');

                            var personnelBox = $.createElement('div');
                            personnelBox.classList.add('personnel-content');


                            var personnelDefaultDom = $.createElement('span');
                            personnelDefaultDom.classList.add('placeholder-right-span');
                            personnelDefaultDom.classList.add('lzm-ellipsis');
                            personnelDefaultDom.innerText = "未选择成员";

                            var personnelNumBox = $.createElement('div');
                            personnelNumBox.classList.add('lzm-float-right');
                            personnelNumBox.classList.add('personnel-tool');
                            personnelNumBox.classList.add('lzm-display-none');

                            var talkbtn = $.createElement('i');
                            talkbtn.classList.add('personnel-icon-message');

                            var personnelNumDom = $.createElement('em');
                            personnelNumDom.classList.add('personnel-num');
                            personnelNumDom.innerText = "0"

                            talkbtn.addEventListener('tap', function () {
                                lzm.JSNCHelper.openMessage("2", TaskManager.runtimeContext.taskInfo._id);
                                window.event.stopPropagation()
                            });
                            controlContent.addEventListener('tap', function () {
                                lzm.PickerPerson({
                                    appCode: TaskManager.runtimeContext.sceneInfo.sceneAppCode,
                                    sceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    businessModuleId: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    name: "",
                                    taskId: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    readOnlySelectedList: readOnly,
                                }, function (result, extendNames) {
                                    bulidDetailMember(result);
                                }, setterUserArray, {
                                    addMember: function (memberArray, callback, errorback) {
                                        var memberData = new Array();
                                        [].map.call(memberArray, function (item) {
                                            memberData.push({
                                                //用户ID
                                                UserId: item.UserId,
                                                //用户头像ID
                                                UserFaceId: item.FaceId,
                                                //用户组织机构ID
                                                OrganizationId: item.OrganizationId,
                                            });
                                        })


                                    },
                                    deleteMember: function (userArray, callback, errorback) {
                                        TaskManager.webApiManager.post(lzm.String.format("api/Runtime/Business/Member/Remove/{0}/{1}/{2}",
                                            TaskManager.runtimeContext.moduleInfo.businessModuleId,
                                            TaskManager.runtimeContext.sceneInfo.sceneCode,
                                            TaskManager.runtimeContext.taskInfo._id), {
                                                "": JSON.stringify({
                                                    Members: [userArray]
                                                })
                                            }, function (data) {
                                                callback();
                                            }, function (date) {
                                                lzm.JSNCHelper.showTip(3, "删除失败");
                                                errorback();
                                            });
                                    },
                                    openSelectPerson: function (callback) {
                                        lzm.JSNCHelper.selectPersons(function (memberData) {
                                            var memberArray = new Array();
                                            if (memberData instanceof Array) {
                                                [].map.call(memberData, function (item) {
                                                    memberArray.push({
                                                        //用户ID
                                                        UserId: item['uid'],
                                                        //用户头像ID
                                                        UserFaceId: item['face'],
                                                        //用户名称
                                                        UserName: item['username'],
                                                        //用户组织机构ID
                                                        OrganizationId: ""
                                                    });
                                                })
                                                TaskManager.webApiManager.post(lzm.String.format("api/Runtime/Business/Member/Add/{0}/{1}/{2}",
                                                    TaskManager.runtimeContext.moduleInfo.businessModuleId,
                                                    TaskManager.runtimeContext.sceneInfo.sceneCode,
                                                    TaskManager.runtimeContext.taskInfo._id), {
                                                        "": JSON.stringify({
                                                            Members: memberArray
                                                        })
                                                    }, function (data) {
                                                        callback(memberArray);
                                                    }, function (date) {
                                                        alert("添加人员失败！")
                                                    });
                                            }
                                        }, 0, 1, 0, disableSelectedUsers, []);
                                    }
                                });
                            });
                            controlContent.appendChild(lableIcon);
                            controlContent.appendChild(personnelBox);
                            personnelBox.appendChild(personnelDefaultDom);
                            controlContent.appendChild(personnelNumBox);
                            personnelNumBox.appendChild(talkbtn);
                            personnelNumBox.appendChild(personnelNumDom);
                            parentElement.appendChild(controlContent);
                        }
                        else if ("add" == dataConfig._client_nowPage) {
                            var lable = $.createElement('label')
                            lable.innerText = dataConfig.fieldName;
                            var controlContent = $.createElement('div');
                            controlContent.classList.add('lzm-form-item-content');
                            controlContent.classList.add('mui-navigate-right');

                            var personnelBox = $.createElement('div');
                            personnelBox.classList.add('personnel-content-notalk');

                            var personnelDefaultDom = $.createElement('span');
                            personnelDefaultDom.classList.add('placeholder-right-span');
                            personnelDefaultDom.classList.add('lzm-ellipsis');
                            personnelDefaultDom.innerText = "未选择成员";

                            var personnelNumBox = $.createElement('div');
                            personnelNumBox.classList.add('lzm-float-right');
                            personnelNumBox.classList.add('personnel-tool');
                            personnelNumBox.classList.add('lzm-display-none');

                            var personnelNumDom = $.createElement('em');
                            personnelNumDom.classList.add('personnel-num-notalk');
                            personnelNumDom.innerText = "0"

                            controlDom.addEventListener('tap', function () {
                                lzm.JSNCHelper.selectPersons(function (data) {
                                    //构建人员头像
                                    var personFaceHtmlStr = "";
                                    selectedUserModels = new Array();
                                    if (data.length > 0) {
                                        //设置人数 - 数字
                                        personnelNumDom.innerText = data.length;
                                        personnelNumBox.classList.remove('lzm-display-none');
                                    }
                                    else {
                                        personnelNumBox.classList.add('lzm-display-none');
                                        personnelBox.innerHTML = '<span class="placeholder-right-span lzm-ellipsis">未选择成员</span>';
                                        return;
                                    }
                                    [].map.call(data, function (item) {
                                        selectedUserModels.push(item);
                                        setterUserArray.push({
                                            UserName: item['username'],
                                            UserId: item['uid'],
                                            UserFaceId: item['face'],
                                            OrganizationId: "",
                                        });
                                        //构建人员dom 
                                        personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left"><img class="principal-personnel-portrait lzm-img-circle" src="' + webApi.getFacePic(item['face']) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';"  /></div>';
                                    })
                                    //填充容器
                                    personnelBox.innerHTML = personFaceHtmlStr;
                                }, 0, 1, 0, disableSelectedUsers, selectedUserModels);
                            });
                            controlDom.appendChild(lable);
                            controlDom.appendChild(controlContent);
                            controlContent.appendChild(personnelBox);
                            personnelBox.appendChild(personnelDefaultDom);
                            controlContent.appendChild(personnelNumBox);
                            personnelNumBox.appendChild(personnelNumDom);
                            parentElement.appendChild(controlDom);
                        }
                        var method = {
                            init: function () {

                            },
                            getValue: function () {
                                if ("detail" == dataConfig._client_nowPage) return "";
                                else return setterUserArray;
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData && (fieldData.value instanceof Array)) {
                                    [].map.call(fieldData.value, function (item) {
                                        var temp = lzm.extendInHere(userEntity(), item);
                                        temp.UserType = item.MemberType;
                                        temp.FaceId = item.UserFaceId;
                                        setterUserArray.push(temp);
                                    })
                                    bulidDetailMember(setterUserArray);
                                }
                            },
                            setReadOnly: function (flag) {
                                readOnly = flag;
                            }
                        };
                        return method;
                    }
                })(formControl, window, document);

                /**
                * projectTeamPersonnel/项目团队人员选择
                * @param {Object} $
                * @param {Object} window
                * @param {Object} document
                */
                ; (function ($, window, document) {
                    $.PROJECTTEAMPERSONNEL = function (parentElement, dataConfig) {
                        var resultUserArray = new Array(), setterUserArray = new Array(), readOnly = false;
                        var bulidDetailMember = function (result) {
                            if (result instanceof Array) {
                                setterUserArray = result;
                                //构建人员头像
                                var personFaceHtmlStr = "";
                                if (setterUserArray.length > 0) personnelNumDom.parentNode.classList.remove("lzm-display-none");
                                else {
                                    personnelNumDom.parentNode.classList.add("lzm-display-none");
                                    personFaceHtmlStr = '<span class="placeholder-right-span lzm-ellipsis">未选择成员</span>';
                                }
                                //设置人数 - 数字
                                personnelNumDom.innerHTML = setterUserArray.length;
                                var personFaceHtmlStr = "";
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]["MemberType"] == 1) {
                                        personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left">' +
                                                                                    '<img class="principal-personnel-portrait lzm-img-circle" src="' + TaskManager.webApiManager.getFacePic((result[i]["FaceId"] ? result[i]["FaceId"] : result[i]["UserFaceId"])) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';"  />' +
                                                                                    '<em class="personnel-miter-king"></em>' +
                                                                                '</div>'
                                    } else {
                                        personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left">' +
                                                                                  '<img class="principal-personnel-portrait lzm-img-circle" src="' + TaskManager.webApiManager.getFacePic((result[i]["FaceId"] ? result[i]["FaceId"] : result[i]["UserFaceId"])) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';" />' +
                                                                              '</div>'
                                    }
                                }
                                personnelBox.innerHTML = personFaceHtmlStr;
                            }
                        }

                        var controlDom = $.createElement('div')
                        controlDom.classList.add('mui-table-view-cell');
                        controlDom.classList.add('lzm-form-group');
                        controlDom.attr("style", 'margin-top: 1px;padding: 0px;');
                        //dataConfig._client_nowPage = 'add'
                        if ("detail" == dataConfig._client_nowPage) {

                            var controlContent = $.createElement('div');
                            controlContent.classList.add('lzm-form-item-content');
                            controlContent.classList.add('mui-navigate-right');
                            controlContent.attr("style", 'padding-left: 55px;');

                            var lableIcon = $.createElement('i');
                            lableIcon.classList.add('lzm-icon-user-list-group');

                            var personnelBox = $.createElement('div');
                            personnelBox.classList.add('personnel-content');


                            var personnelDefaultDom = $.createElement('span');
                            personnelDefaultDom.classList.add('placeholder-right-span');
                            personnelDefaultDom.classList.add('lzm-ellipsis');
                            personnelDefaultDom.innerText = "未选择成员";

                            var personnelNumBox = $.createElement('div');
                            personnelNumBox.classList.add('lzm-float-right');
                            personnelNumBox.classList.add('personnel-tool');
                            personnelNumBox.classList.add('lzm-display-none');

                            var talkbtn = $.createElement('i');
                            talkbtn.classList.add('personnel-icon-message');

                            var personnelNumDom = $.createElement('em');
                            personnelNumDom.classList.add('personnel-num');
                            personnelNumDom.innerText = "0"

                            talkbtn.addEventListener('tap', function () {
                                lzm.JSNCHelper.openMessage("2", TaskManager.runtimeContext.taskInfo._id);
                                window.event.stopPropagation()
                            });
                            controlContent.addEventListener('tap', function () {
                                lzm.PickerPerson({
                                    appCode: TaskManager.runtimeContext.sceneInfo.sceneAppCode,
                                    sceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    businessModuleId: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    name: "",
                                    taskId: TaskManager.runtimeContext.sceneInfo.sceneCode,
                                    readOnlySelectedList: readOnly,
                                }, function (result, extendNames) {
                                    bulidDetailMember(result);
                                }, setterUserArray, {
                                    addMember: function (memberArray, callback, errorback) {
                                        var memberData = new Array();
                                        [].map.call(memberArray, function (item) {
                                            memberData.push({
                                                //用户ID
                                                UserId: item.UserId,
                                                //用户头像ID
                                                UserFaceId: item.FaceId,
                                                //用户组织机构ID
                                                OrganizationId: item.OrganizationId,
                                            });
                                        })

                                        TaskManager.webApiManager.post(lzm.String.format("api/Runtime/Business/Member/Add/{0}/{1}/{2}",
                                            TaskManager.runtimeContext.moduleInfo.businessModuleId,
                                            TaskManager.runtimeContext.sceneInfo.sceneCode,
                                            TaskManager.runtimeContext.taskInfo._id), {
                                                "": JSON.stringify({
                                                    Members: memberData
                                                })
                                            }, function (data) {
                                                callback(memberArray);
                                            }, function (date) {
                                                errorback();
                                            });
                                    },
                                    deleteMember: function (userArray, callback, errorback) {
                                        TaskManager.webApiManager.post(lzm.String.format("api/Runtime/Business/Member/Remove/{0}/{1}/{2}",
                                            TaskManager.runtimeContext.moduleInfo.businessModuleId,
                                            TaskManager.runtimeContext.sceneInfo.sceneCode,
                                            TaskManager.runtimeContext.taskInfo._id), {
                                                "": JSON.stringify({
                                                    Members: [userArray]
                                                })
                                            }, function (data) {
                                                callback();
                                            }, function (date) {
                                                lzm.JSNCHelper.showTip(3, "删除失败");
                                                errorback();
                                            });
                                    }
                                });
                            });
                            controlContent.appendChild(lableIcon);
                            controlContent.appendChild(personnelBox);
                            personnelBox.appendChild(personnelDefaultDom);
                            controlContent.appendChild(personnelNumBox);
                            personnelNumBox.appendChild(talkbtn);
                            personnelNumBox.appendChild(personnelNumDom);
                            parentElement.appendChild(controlContent);
                        }
                        else if ("add" == dataConfig._client_nowPage) {
                            var lable = $.createElement('label')
                            lable.innerText = dataConfig.fieldName;
                            var controlContent = $.createElement('div');
                            controlContent.classList.add('lzm-form-item-content');
                            controlContent.classList.add('mui-navigate-right');

                            var personnelBox = $.createElement('div');
                            personnelBox.classList.add('personnel-content-notalk');

                            var personnelDefaultDom = $.createElement('span');
                            personnelDefaultDom.classList.add('placeholder-right-span');
                            personnelDefaultDom.classList.add('lzm-ellipsis');
                            personnelDefaultDom.innerText = "未选择成员";

                            var personnelNumBox = $.createElement('div');
                            personnelNumBox.classList.add('lzm-float-right');
                            personnelNumBox.classList.add('personnel-tool');
                            personnelNumBox.classList.add('lzm-display-none');

                            var personnelNumDom = $.createElement('em');
                            personnelNumDom.classList.add('personnel-num-notalk');
                            personnelNumDom.innerText = "0"

                            var setterUserArray = new Array();
                            var webApi = new lzm.WebApi();
                            controlDom.addEventListener('tap', function () {
                                lzm.PickerPerson({
                                    appCode: TaskManager.runtimeContext.sceneInfo.sceneAppCode, sceneCode: TaskManager.runtimeContext.sceneInfo.sceneCode
                                }, function (result, extendNames) {
                                    if (result instanceof Array) {
                                        setterUserArray = result;
                                        //构建人员头像
                                        var personFaceHtmlStr = "";
                                        if (setterUserArray.length > 0) personnelNumDom.parentNode.classList.remove("lzm-display-none");
                                        else {
                                            personnelNumDom.parentNode.classList.add("lzm-display-none");
                                            personFaceHtmlStr = '<span class="placeholder-right-span lzm-ellipsis">未选择成员</span>';
                                        }
                                        //设置人数 - 数字
                                        personnelNumDom.innerHTML = setterUserArray.length;
                                        //更改参与人员
                                        var getUserNode = function () {
                                            return {
                                                UserName: null,
                                                UserId: null,
                                                UserFaceId: null,
                                                OrganizationId: null,
                                                ExtendData: null,
                                            }
                                        };
                                        resultUserArray = new Array();
                                        [].map.call(result, function (item, index) {
                                            resultUserArray.push({
                                                UserName: item.UserName,
                                                UserId: item.UserId,
                                                UserFaceId: item.FaceId,
                                                OrganizationId: item.OrganizationId,
                                                //ExtendData: item.ExtendData,
                                            });
                                            personFaceHtmlStr += '<div class="personnel-face-item lzm-float-left"><img class="principal-personnel-portrait lzm-img-circle" src="' + webApi.getFacePic(item.FaceId) + '"  onerror="javascript:this.src=\'/BasePlus/InformationRegistModel/Mobile/Images/Face/defaltFace.gif\';"  /></div>'
                                        })
                                        personnelBox.innerHTML = personFaceHtmlStr;
                                    }
                                }, setterUserArray);
                            })
                            controlDom.appendChild(lable);
                            controlDom.appendChild(controlContent);
                            controlContent.appendChild(personnelBox);
                            personnelBox.appendChild(personnelDefaultDom);
                            controlContent.appendChild(personnelNumBox);
                            personnelNumBox.appendChild(personnelNumDom);
                            parentElement.appendChild(controlDom);
                        }

                        var userEntity = function () {
                            return {
                                UserId: "",
                                OrganizationId: "",
                                UserFaceId: "",
                                UserType: 2,
                                MemberType: 2,
                                IsValid: true,
                            }
                        }

                        var method = {
                            init: function () {

                            },

                            getValue: function () {
                                if ("detail" == dataConfig._client_nowPage)
                                    return ""
                                else
                                    return resultUserArray;
                            },
                            setValue: function (fieldData, entity) {
                                if (fieldData && (fieldData.value instanceof Array)) {
                                    [].map.call(fieldData.value, function (item) {
                                        var temp = lzm.extendInHere(userEntity(), item);
                                        temp.UserType = item.MemberType;
                                        temp.FaceId = item.UserFaceId;
                                        setterUserArray.push(temp);
                                    })
                                    bulidDetailMember(setterUserArray);
                                }
                            },
                            setReadOnly: function (flag) {
                                readOnly = flag;
                            }
                        };
                        return method;
                    }
                })(formControl, window, document);
            }
        };
    });
})(window, define);