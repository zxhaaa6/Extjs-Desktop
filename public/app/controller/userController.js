/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.controller.userController', {
    extend: 'Ext.app.Controller',
    stores: ['userStore'],
    models: ['userModel'],
    views: ['user.list', 'user.edit', 'user.add'],
    init: function () {

        this.control({
            'userlist': {
                itemdblclick: this.editUser
            },
            'useredit button[action=save]': {
                click: this.updateUser
            },
            'useradd button[action=save]': {
                click: this.addUser
            }
        });
    },
    editUser: function (grid, record) {
        var view = Ext.widget('useredit');
        view.down('form').loadRecord(record);
    },
    updateUser: function (button) {
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        /*console.log(record);
         console.log(values);*/
        record.set(values);
        win.close();
        var me = this;
        this.getStore('userStore').sync({
            callback: function () {
                me.getStore('userStore').read();
            }
        });
    },
    addUser: function (button) {
        var win = button.up('window');
        var form = win.down('form');
        var values = form.getValues();
        //console.log(values);
        if (values.name === '' || values.email === '') {
            Ext.MessageBox.alert('提示', '输入不能为空');
        } else {
            this.getStore('userStore').add(values);
            win.close();
            var me = this;
            this.getStore('userStore').sync({
                callback: function () {
                    me.getStore('userStore').read();
                }
            });
        }

    },
    showAlert: function () {
        console.log('s');
    }
});