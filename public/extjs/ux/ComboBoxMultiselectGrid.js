/**
 *  基于Extjs4的下拉两个表格，左侧表格是选择数据的表格，右侧为已选择的数据的展示
 *  author: 徐优优
 *  用法:
	实例化ComboBoxMultiselectGrid
		{
            xtype: 'comboBoxMultiselectGrid',
            id: 'PRE_DIAGNOSIS',
            name: 'PRE_DIAGNOSIS',
            fieldLabel: '术前诊断',
            emptyText: '请输入拼音首字母或汉字',
            width: 628,
            pickerWidth: 559,
            panelHeight: 350,
            leftPanelWidth: 350,
            valueField: 'value',
            displayField: 'text',
            leftStore: leftStore,
            matchFieldWidth: false,
            pageSize: 10,
            leftColumns: [{
                width: '100%',
                dataIndex: 'text',
                sortable: false,
                align: 'left',
                header: '名称',
                renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (!Ext.isEmpty(value)) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }],
            rightStore: new Ext.data.Store({
                fields: ['value', 'text'],
            }),
            rightColumns: [{
                width: '100%',
                dataIndex: 'text',
                sortable: false,
                align: 'left',
                header: '名称',
                renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (!Ext.isEmpty(value)) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }],
            rightStoreModel: {
                value: null,
                text: null
            }
        }
	说明：

	常用方法:
	setFieldValue 设置组件的值
	getFieldValue 获取组件的值
 */

Ext.define('Ext.ux.ComboBoxMultiselectGrid', {
    extend: 'Ext.form.field.Picker',
    requires: [
        'Ext.panel.Panel',
        'Ext.grid.Panel',
        'Ext.data.Store',
        'Ext.toolbar.Paging'
    ],
    alias: [
        'widget.comboBoxMultiselectGrid'
    ],
    pickerWidth: 470, //下拉框的宽度
    matchFieldWidth: false,
    panelHeight: 300, //下拉框的高度
    leftPanelWidth: 300, //左侧表格的宽度
    leftGrid: null, //左侧表格对象
    rightGrid: null, //右侧表格对象
    queryDelay: 0, //查询左侧表格延迟时间
    leftStore: null, //左侧表格的store
    pageSize: 10, //左侧表格每页显示数量
    leftColumns: [], //左侧表格的columns
    rightStore: null, //右侧表格store
    rightColumns: [], //右侧表格的columns
    rightStoreModel: {}, //右侧表格中store的model对象，必须是左侧model中有的字段
    valueField: 'value', //左右侧表格中需要提交到后台的字段
    displayField: 'text', //右侧表格中需要显示到输入框中的字段
    minChars: 0,
    initComponent: function() {
        var self = this;
        Ext.apply(self, {
            fieldLabel: self.fieldLabel,
            labelWidth: self.labelWidth
        });
        self.leftGrid = self.getLeftGrid();
        self.rightGrid = self.getRightGrid();
        self.doQueryTask = new Ext.util.DelayedTask(self.doRawQuery, self);
        self.callParent();
    },
    createPicker: function() {
        var self = this;
        self.picker = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            height: self.panelHeight === null ? 200 : self.panelHeight,
            width: self.pickerWidth,
            floating: true,
            border: 1,
            items: [self.leftGrid, self.rightGrid]
        });
        return self.picker;
    },
    /**
     * 获取左侧表格
     * @return {[type]}
     */
    getLeftGrid: function() {
        var self = this;
        var leftGrid = Ext.create('Ext.grid.Panel', {
            region: 'west',
            width: self.leftPanelWidth,
            border: false,
            height: '100%',
            autoScroll: false,
            style: {
                border: '1px solid #e1e1e1',
                borderRight: '1px solid #99BCE8'
            },
            columns: self.leftColumns,
            store: self.leftStore,
            columnLines: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 30,
                items: ['搜索结果:(双击添加到已选内容)']
            }, {
                xtype: 'pagingtoolbar',
                store: self.leftStore,
                pageSize: 10,
                padding: 0,
                dock: 'bottom',
                height: 30
            }],
            listeners: {
                itemdblclick: function(_this, record, item, index, e, eOpts) {
                    self.leftGridDBLClick(_this, record, item, index, e, eOpts);
                }
            }
        });
        return leftGrid;
    },
    /**
     * 左侧表格双击事件
     * @param  {[type]} _this 左侧表格
     * @param  {[type]} record 当前选中的记录
     * @param  {[type]} item
     * @param  {[type]} index 选中记录的下标
     * @param  {[type]} e
     * @param  {[type]} eOpts
     * @return {[type]}
     */
    leftGridDBLClick: function(_this, record, item, index, e, eOpts) {
        var self = this;
        if (!Ext.isEmpty(record.get(this.valueField))) {
            //判断当前选中的记录在右侧表格是否已有
            for (var i = 0; i < self.rightStore.getCount(); i++) {
                var temp = self.rightStore.getAt(i);
                if (temp.get(self.valueField) === record.get(self.valueField)) {
                    return;
                }
            }
            var obj = {};
            for (var key in self.rightStoreModel) {
                obj[key] = record.get(key);
            }
            self.rightStore.add(obj);
        }
    },
    /**
     * 获取右侧表格
     * @return {[type]}
     */
    getRightGrid: function() {
        var self = this;
        var rightGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            border: false,
            minWidth: 160,
            style: {
                border: '1px solid #e1e1e1',
                borderLeft: '0px'
            },
            viewConfig: {
                style: 'overflow-x:hidden !important;'
            },
            columns: self.rightColumns,
            store: self.rightStore,
            columnLines: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 30,
                items: ['已选内容:(双击可移除内容)']
            }],
            listeners: {
                itemdblclick: function(_this, record, item, index, e, eOpts) {
                    self.rightGridDBLClick(_this, record, item, index, e, eOpts);
                }
            }
        });
        return rightGrid;
    },
    /**
     * 左侧表格双击事件
     * @param  {[type]} _this 左侧表格
     * @param  {[type]} record 当前选中的记录
     * @param  {[type]} item
     * @param  {[type]} index 选中记录的下标
     * @param  {[type]} e
     * @param  {[type]} eOpts
     * @return {[type]}
     */
    rightGridDBLClick: function(_this, record, item, index, e, eOpts) {
        _this.store.remove(record);
    },
    /**
     * 再次加载页面,给组件中赋值
     * @param {[type]} displayFieldStr 显示字段的字符串
     * @param {[type]} storeArr        右侧已选列表中对象数组
     */
    setFieldValue: function(displayFieldStr, storeArr) {
        var self = this;
        if (displayFieldStr !== null && displayFieldStr !== undefined && displayFieldStr.length > 0) {
            self.checkChange = Ext.emptyFn;
            self.setValue(displayFieldStr);
            self.checkChange = self.checkChangeSelf;
        } else {
            self.setValue(null);
        }
        if (storeArr !== null && storeArr !== undefined && storeArr.length > 0) {
            self.rightGrid.store.loadData(storeArr);
        }
    },
    initValue: function() {
        var me = this;

        me.value = me.transformOriginalValue(me.value);
        /**
         * @property {Object} originalValue
         * The original value of the field as configured in the {@link #value} configuration, or as loaded by the last
         * form load operation if the form's {@link Ext.form.Basic#trackResetOnLoad trackResetOnLoad} setting is `true`.
         */
        me.originalValue = me.lastValue = me.value;

        // Set the initial value - prevent validation on initial set
        me.suspendCheckChange++;
        //me.setValue(me.value);
        me.setFieldValue(me.value);
        me.suspendCheckChange--;
    },
    setValue: function(value) {
        var me = this,
            inputEl = me.inputEl;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
            me.valueContainsPlaceholder = false;
        }
        me.callParent(arguments);

        me.applyEmptyText();
        return me;
    },
    checkChangeSelf: function() {
        if (!this.suspendCheckChange) {
            var me = this,
                newVal = me.getValue(),
                oldVal = me.lastValue;
            if (!me.isEqual(newVal, oldVal) && !me.isDestroyed) {
                me.lastValue = newVal;
                me.fireEvent('change', me, newVal, oldVal);
                me.onChange(newVal, oldVal);
            }
        }
    },
    /**
     * 获取控件的rightStoreModel对象数组
     * @return {[string]} 如果为空返回null
     */
    getFieldValue: function() {
        var self = this;
        var resArr = [];
        var rightStore = self.rightGrid.store;
        for (var i = 0; i < rightStore.getCount(); i++) {
            var temp = rightStore.getAt(i);
            var obj = {};
            for (var key in self.rightStoreModel) {
                obj[key] = temp.get(key);
            }
            resArr.push(obj);
        }
        resArr = resArr.length > 0 ? resArr : null;
        return resArr;
    },
    /**
     * 失去焦点给输入框中赋值
     * @param  {[type]} _this [description]
     * @return {[type]}       [description]
     */
    blurSetValue: function(_this) {
        var rightStore = _this.rightGrid.store;
        var valueArr = [];
        for (var i = 0; i < rightStore.getCount(); i++) {
            var temp = rightStore.getAt(i);
            valueArr.push(temp.get(_this.displayField));
        }
        return valueArr;
    },
    onTriggerClick: function() {
        var self = this;
        if (!self.readOnly && !self.disabled) {
            if (self.isExpanded) {
                self.collapse();
            } else {
                self.expand();
                self.focus();
                self.doOnTriggerClick();
            }
        }
    },
    doOnTriggerClick: function() {
        this.setValue('');
        this.leftGrid.store.proxy.extraParams.query = 'all';
        this.leftGrid.store.loadPage(1);
    },
    onPaste: function() {
        var me = this;

        if (!me.readOnly && !me.disabled && me.editable) {
            me.doQueryTask.delay(me.queryDelay);
        }
    },

    // store the last key and doQuery if relevant
    onKeyUp: function(e, t) {
        var me = this,
            key = e.getKey();

        if (!me.readOnly && !me.disabled && me.editable) {
            me.lastKey = key;
            // we put this in a task so that we can cancel it if a user is
            // in and out before the queryDelay elapses

            // perform query w/ any normal key or backspace or delete
            if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
                me.doQueryTask.delay(me.queryDelay);
            }
        }

        if (me.enableKeyEvents) {
            me.callParent(arguments);
        }
    },
    initEvents: function() {
        var me = this;
        me.callParent();

        /*
         * Setup keyboard handling. If enableKeyEvents is true, we already have
         * a listener on the inputEl for keyup, so don't create a second.
         */
        if (!me.enableKeyEvents) {
            me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
        }
        me.mon(me.inputEl, 'paste', me.onPaste, me);
        me.mon(me.inputEl, 'click', me.onTriggerClick, me);
    },
    doRawQuery: function() {
        this.doQuery(this.getRawValue(), false, true);
    },
    beforeQuery: function(queryPlan) {
        var me = this;

        // Allow beforequery event to veto by returning false
        if (me.fireEvent('beforequery', queryPlan) === false) {
            queryPlan.cancel = true;
        }

        // Allow beforequery event to veto by returning setting the cancel flag
        else if (!queryPlan.cancel) {

            // If the minChars threshold has not been met, and we're not forcing an "all" query, cancel the query
            if (queryPlan.query.length < me.minChars && !queryPlan.forceAll) {
                queryPlan.cancel = true;
            }
        }
        return queryPlan;
    },
    doQuery: function(queryString, forceAll, rawQuery) {
        var me = this,

            // Decide if, and how we are going to query the store
            queryPlan = me.beforeQuery({
                query: queryString || '',
                rawQuery: rawQuery,
                forceAll: forceAll,
                combo: me,
                cancel: false
            });

        // Allow veto.
        if (queryPlan === false || queryPlan.cancel) {
            return false;
        }

        // If they're using the same value as last time, just show the dropdown
        if (me.queryCaching && queryPlan.query === me.lastQuery) {
            me.expand();
        }

        // Otherwise filter or load the store
        else {
            me.lastQuery = queryPlan.query;

            /*if (me.queryMode === 'local') {
                me.doLocalQuery(queryPlan);
            } else {
                me.doRemoteQuery(queryPlan);
            }*/
            me.doRemoteQuery(queryPlan);
        }

        return true;
    },
    doRemoteQuery: function(queryPlan) {
        var me = this;

        // expand before loading so LoadMask can position itself correctly
        me.expand();

        // In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
        // and these are automatically passed as params with every load call, so we do *not* call clearFilter.
        if (me.pageSize) {
            // if we're paging, we've changed the query so start at page 1.
            // eventStore.proxy.extraParams.startDate = startDate;
            me.leftGrid.store.proxy.extraParams.query = this.lastQuery;
            this.leftGrid.store.loadPage(1);
        } else {
            me.leftGrid.store.load({
                params: me.getParams(queryPlan.query),
                rawQuery: queryPlan.rawQuery,
                callback: loadCallback
            });
        }
    },
    getParams: function(queryString) {
        var params = {},
            param = this.queryParam;

        if (param) {
            params[param] = queryString;
        }
        return params;
    },
    beforeBlur: function(e) {
        if (this.isExpanded) {
            this.collapse();
        }
        this.doQueryTask.cancel();
        var valueArr = this.blurSetValue(this);
        this.setValue(valueArr);
    },
    onExpand: function() {
        this.setValue('');
        this.focus();
    },
    onCollapse: function() {
        this.doQueryTask.cancel();
        var valueArr = this.blurSetValue(this);
        this.setValue(valueArr);
    }
});
