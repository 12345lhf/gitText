/**
 * 图片列表控件
 * @author wjs
 */
; (function (window, undefined, $) {

    function ImageList(options) {
        var defaultOptions = {
            //列表ID
            listElementId: '',
            //数据
            data: [],
            //删除事件，可以没有
            removeEvent: function (element, field) { },
            //新增事件，可以没有
            addEvent: function (element, field) { },
            openFileEvent: function (element, field) { },
            //转换函数，可以没有
            transationHandler: null
        }
        this.options = $.extend({}, defaultOptions, options);
        /**
         * 列表元素
         */
        this.listElement;
        this.isCanSeleted = false;
        this._isInit = false;
        this.init();
    }

    /**
     * 添加一张图片
     */
    ImageList.prototype.add = function (item) {
        var itemElement = this._createItemDocument(item);
        this.listElement.appendChild(itemElement);
        !this._isInit && this.options.addEvent && this.options.addEvent(itemElement, item.id);
        !this._isInit && this._cheakHasItems();
    }
    /**
     * 添加一组图片
     */
    ImageList.prototype.addList = function (dataList) {
        var that = this;
        dataList.forEach(function (item) {
            that.add(item);
        });
    }

    /**
     * 删除一张图片
     */
    ImageList.prototype.remove = function (itemElement) {
        this.listElement.removeChild(itemElement);
        alert('删除')
        !this._isInit && this._cheakHasItems();
    }

    /**
     * 删除多个图片，根据属性值匹配
     */
    ImageList.prototype.removeSelected = function () {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            this.listElement.removeChild(items[i]);
        }
        !this._isInit && this._cheakHasItems();
    }

    /**
     * 初始化
     */
    ImageList.prototype.init = function () {
        this._isInit = true;
        //获取列表元素
        this.listElement = document.querySelector(this.options.listElementId);
        if (!this.listElement) {
            alert('没有找到ID：' + this.options.listElementId + '对应的列表');
        }
        this.addList(this.options.data);
        this._bindEvent();
        this._isInit = false;
        this._cheakHasItems();
    }

    /**
     * 显示删除
     */
    ImageList.prototype.showRemove = function () {
        this.listElement.classList.add('show-remove');
    }
    /**
     * 隐藏删除
     */
    ImageList.prototype.hideRemove = function () {
        this.listElement.classList.remove('show-remove');
    }

    /**
     * 获取所有选中项
     */
    ImageList.prototype.getSelectedItems = function () {
        return this.listElement.querySelectorAll('div[selected=true]')
    }

    /**
    * 获取所有选中项
    */
    ImageList.prototype.getItems = function () {
        return this.listElement.querySelectorAll('div.img-list-item')
    }

    /**
     * 清理选中
     */
    ImageList.prototype.clearSelected = function () {
        var temp = this.getSelectedItems();
        for (var i = 0; i < temp.length; i++) {
            temp[i].classList.remove('show-remove');
            temp[i].setAttribute('selected', false);
        }
    }

    /**
     * 创建一个元素
     */
    ImageList.prototype._createItemDocument = function (dataItem) {
        var that = this;
        var itemDiv = document.createElement('div');
        var spanRemove = document.createElement('span');
        var itemImage = document.createElement('img');
        //删除图标
        spanRemove.classList.add('mui-icon');
        spanRemove.classList.add('iconfont');
        spanRemove.classList.add('icon-right');
        //图片
        //  地址
        var imgAttrSrc = document.createAttribute('src');
        imgAttrSrc.value = dataItem.path;
        itemImage.attributes.setNamedItem(imgAttrSrc);
        //  ID
        var imgAttrId = document.createAttribute('id');
        imgAttrId.value = 'item-img-' + dataItem.id;
        itemImage.attributes.setNamedItem(imgAttrId);
        //div ID
        var divAttrId = document.createAttribute('id');
        divAttrId.value = 'item-' + dataItem.id;
        itemDiv.attributes.setNamedItem(divAttrId);
        //div fileid
        var divAttrFileId = document.createAttribute('fileid');
        divAttrFileId.value = dataItem.id;
        itemDiv.attributes.setNamedItem(divAttrFileId);
        //div fileid
        var divAttrVersion = document.createAttribute('version');
        divAttrVersion.value = dataItem.version;
        itemDiv.attributes.setNamedItem(divAttrVersion);
        //div seleted
        var divAttrSelected = document.createAttribute('selected');
        divAttrSelected.value = false;
        itemDiv.attributes.setNamedItem(divAttrSelected);

        //div fname
        var divAttrFname = document.createAttribute('fname');
        divAttrFname.value = dataItem.name;
        itemDiv.attributes.setNamedItem(divAttrFname);

        //div exptype
        var divAttrExptype = document.createAttribute('exptype');
        divAttrExptype.value = dataItem.extype;
        itemDiv.attributes.setNamedItem(divAttrExptype);

        dataItem.extype && (dataItem.extype);

        //DIV Class
        itemDiv.classList.add('mui-col-xs-4');
        itemDiv.classList.add('mui-col-sm-3');
        itemDiv.classList.add('img-list-item');
        itemDiv.appendChild(spanRemove);
        itemDiv.appendChild(itemImage);

        //itemDiv.addEventListener('touchstart', function (event) {
        //    if (!that.isCanSeleted) {
        //        return;
        //    }
        //    event.preventDefault();
        //    var ele = event.target.parentElement;
        //    var selected = ele.getAttribute('selected');
        //    if (selected == true || selected == "true") {
        //        ele.setAttribute('selected', false);
        //    } else {
        //        ele.setAttribute('selected', true);
        //    }
        //    if (!this._isInit && that.options.removeEvent) {
        //        that.options.removeEvent(ele, ele.getAttribute('fileid')) != false;
        //    }
        //});
        return itemDiv;
    }
    /**
     * 绑定事件
     */
    ImageList.prototype._bindEvent = function () {
        var that = this;
        $(this.listElement).on('tap', '.img-list-item', function () {
            var ele = event.target.parentElement;
            if (!that.isCanSeleted) {
                that.options.openFileEvent(ele, ele.getAttribute('fileid'));
                return;
            }
            var selected = ele.getAttribute('selected');
            if (selected == true || selected == "true") {
                ele.setAttribute('selected', false);
                ele.querySelector('span').classList.remove('show-remove-span')
            } else {
                ele.setAttribute('selected', true);
                ele.querySelector('span').classList.add('show-remove-span')//兼容低版本android
            }
            if (!this._isInit && that.options.removeEvent) {
                that.options.removeEvent(ele, ele.getAttribute('fileid')) != false;
            }
        });
    }
    /**
     * 检查是否有元素，没有则隐藏内边距
     */
    ImageList.prototype._cheakHasItems = function () {
        if (this.getItems().length) {
            this.listElement.classList.remove('no-item');
        } else {
            this.listElement.classList.add('no-item');
        }
    }
    /**
     * 数据实体
     */
    function DataItem() {
        this.id;
        this.name;
        this.path;
    }

    function openFile(fileId) {

    }

    var _ImageList = ImageList;
    window.lzMisptImageList = _ImageList;
})(window, undefined, mui);
