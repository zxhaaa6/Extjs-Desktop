Ext.define('AM.view.user.list', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userlist', //别名
    title: 'All Users',
    store: 'userStore',
    selModel: {selType: 'checkboxmodel'},
    initComponent: function () {
        /*this.store = {
         fields: ['name', 'email'],
         data: [
         {name: 'Peter', email: 'x@a.com'},
         {name: 'Tom', email: 'a@x.com'}
         ]
         };*/
        var me = this;
        this.columns = [
            {header: 'Name', dataIndex: 'name',width: 120},
            {header: 'Email', dataIndex: 'email',width: 120},
            {
                text: '状态',
                width: 44,
                style: 'text-align:center;',
                align: 'left',
                locked: true,
                //dataIndex: 'status'
                renderer:me.formatStatus
                // lockable: false
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            },{
                text: 'Email',
                width: 120,
                style: 'text-align:center;',
                align: 'center'
            }];
        this.bbar = [{
            xtype: 'pagingtoolbar',
            store: 'userStore',
            displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
            emptyMsg: "没有数据",
            beforePageText: "当前页",
            afterPageText: "共{0}页",
            displayInfo: true
        }];
        this.tbar = [
            {
                text: '新增',
                handler: function () {
                    Ext.widget('useradd');
                }
            }, "-",
            {
                text: '编辑',
                handler: function () {
                    var selection = me.getSelectionModel().getSelection()[0];
                    console.log(selection);
                    if (selection === undefined) {
                        Ext.MessageBox.alert('提示', '请选择一条记录进行更改');
                    } else {
                        var view = Ext.widget('useredit');
                        view.down('form').loadRecord(selection);
                    }
                }
            }, "-",
            {
                text: '删除',
                handler: function () {
                    var selections = me.getSelectionModel().getSelection();
                    console.log(selections);
                    if (selections.length < 1) {
                        Ext.MessageBox.alert('提示', '请选择记录进行删除');
                    } else {
                        me.getStore('userStore').remove(selections);
                        me.getStore('userStore').sync({
                            callback: function () {
                                me.getStore('userStore').read();
                            }
                        });
                    }

                }
            }
        ];
        this.callParent(arguments);
        /*me.getStore('userStore').load({
            params: {
                start: 0,
                limit: 3
            }
        });*/
    },
    formatStatus: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var div= '<div style="text-align:center;">';
        var id=Number(record.data.id);
        if(id%2===0){
            return div+"<img src='../../../images/circle-red.png' title='安排已完成'/></div>";
        }else{
            return div+"<img src='../../../images/circle-green.png' title='安排'/></div>";
        }
    }

});
/*
Ext.create('Ext.form.Panel', {
    title: 'Upload a Photo',
    width: 400,
    bodyPadding: 10,
    frame: true,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'filefield',
        name: 'fulAvatar',
        fieldLabel: 'Photo',
        labelWidth: 50,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: 'Select Photo...'
    }],

    buttons: [{
        text: 'Upload',
        handler: function() {
            var form = this.up('form').getForm();
            if(form.isValid()){
                form.submit({
                    url: '/fileUpload',
                    waitMsg: 'Uploading your photo...',
                    success: function(fp, o) {
                        Ext.Msg.alert('Success', 'Your photo "' + o.result.file + '" has been uploaded.');
                    }
                });
            }
        }
    }]
});*/
