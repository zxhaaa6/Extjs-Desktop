/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.view.user.edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.useredit',
    title: 'Edit User',
    layout: 'fit',
    autoShow: true,
    initComponent: function () {
        this.items = [
            {
                xtype: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: 'Name'
                    },
                    {
                        xtype: 'textfield',
                        name: 'email',
                        fieldLabel: 'Email'
                    }
                ]
            }
        ];
        this.buttons = [
            {
                text: 'save',
                action: 'save'
            },
            {
                text: 'cancel',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    }

});