Ext.define('com.sys.desktop.LoginForm', {
    extend: 'Ext.form.Panel',
    id: 'login-form',
    isFiredChangeEvent: true,
    initComponent: function () {
        var me = this;
        var cookieNameRoleObj = Ext.util.Cookies.get('names_roles');
        cookieNameRoleObj = cookieNameRoleObj === null ? {
            names: [],
            roles: []
        } : Ext.decode(cookieNameRoleObj);
        me.cookieNames = cookieNameRoleObj.names;
        me.cookieRoles = cookieNameRoleObj.roles;
        var cookieNamesData = [];
        for (var i = me.cookieNames.length - 1; i > -1; i--) {
            cookieNamesData.push([me.cookieNames[i]]);
        }
        Ext.apply(me, {
            border: false,
            bodyPadding: '10px 10px 0 10px',
            defaults: {
                width: 307,
                height: 37,
                labelWidth: 75,
                allowBlank: false,
                xtype: 'textfield',
                labelAlign: 'right',
                msgTarget: 'qtip'
            },
            items: [{
                xtype: 'displayfield',
                name: 'ERRORMSG',
                height: 31,
                cls: 'login-tip-background',
                fieldCls: 'login-tip-cls login-tip-common',
                value: '请输入用户名和密码，并选择所属角色进行登录。' //'请输入用户名和密码，并选择所属角色进行登录。',
            }, {
                xtype: 'combo',
                fieldLabel: '',
                style: 'margin-bottom: 10px;',
                name: 'NAME',
                emptyText: '登录名',
                blankText: '请输入登录名',
                editable: true,
                hideTrigger: true,
                queryMode: 'local',
                queryCaching: true,
                value: me.cookieNames[me.cookieNames.length - 1],
                grow: true,
                typeAhead: false,
                queryDelay: 1000,
                valueField: 'name',
                displayField: 'name',
                minChars: 0,
                fieldCls: 'login-user-cls',
                store: new Ext.data.SimpleStore({
                    fields: ['name'],
                    data: cookieNamesData
                }),
                listeners: {
                    blur: function (_this, _the, eOpts) {
                        me.selectRoleByName(_this, _this.up().getForm().findField('NAME').getValue());
                    },
                    afterrender: function (_this, eOpts) {
                        if (!me.parent.locked) {
                            Ext.fly(_this.el).on('click', function() {
                                if (!_this.isExpanded) {
                                    _this.expand();
                                }
                            });
                        }
                    },
                    select: function (_this, records) {
                        me.selectRoleByName(_this, _this.up().getForm().findField('NAME').getValue());
                    },
                    change: function (_this) {

                    }
                }
            }, {
                fieldLabel: '',
                style: 'margin-bottom: 10px;',
                name: 'PASSWORD',
                emptyText: '密码',
                inputType: 'password',
                blankText: '请输入密码',
                fieldCls: 'login-password-cls'
            }, {
                xtype: 'combo',
                id: 'role',
                fieldLabel: '',
                style: 'margin-bottom: 4px;',
                name: 'ROLE',
                emptyText: '请选择角色',
                blankText: '必须选择一个角色',
                editable: false,
                fieldCls: 'login-role-cls',
                triggerCls: 'login-roletrigger-cls',
                valueField: 'role',
                displayField: 'role',
                store: new Ext.data.Store({
                    fields: ['id', 'name', 'role'],
                    proxy: {
                        type: 'ajax',
                        url: '',
                        reader: {
                            type: 'json',
                            root: 'data'
                        }
                    },
                    listeners: {
                        load: function (_this, records, successful, eOpts) {
                            if (records !== null && records.length > 0) {
                                var form = me.getForm(),
                                    nameObj = form.findField('NAME'),
                                    roleObj = form.findField('ROLE'),
                                    currNameIndex = Ext.Array.indexOf(me.cookieNames, nameObj.getValue());
                                var roleValue = me.cookieRoles[currNameIndex];
                                if (me.parent.locked) {
                                    roleValue = userInfo.role;
                                    Ext.getCmp('role').setValue(userInfo.role);
                                } else {
                                    if (roleValue === null || roleValue === undefined) {
                                        roleObj.select(records[0]);
                                    } else {
                                        var curr = _this.getById(roleValue);
                                        if (curr == null) {
                                            roleObj.select(records[0]);
                                        } else {
                                            roleObj.select(curr);
                                        }
                                    }
                                }
                                //me.getForm().findField('ROLE').setValue(records[0].data.role);
                            }
                        }
                    }
                }),
                listConfig: {
                    loadingText: 'Loading...',
                    emptyText: '该用户没有角色...'
                },
                listeners: {
                    beforerender: function (_this, eOpts) {

                    }
                }
            }, {
                xtype: 'fieldcontainer',
                height: 36,
                style: 'margin-bottom: 4px;',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [{
                    xtype: 'label',
                    id: 'rembername',
                    margins: '10 0 0 0',
                    width: 21,
                    height: 22,
                    html: '<img onclick="rembername(1)" value=1 src=\'/images/login_Choose_1.png\'/>',
                    listeners: {
                        render: function () {
                            Ext.fly(this.el).on('click', function () {
                                var rn = me.getForm().findField("REMEMBER_NAME").getValue();
                                rn = rn === 'false' ? 'true' : 'false';
                                me.getForm().findField("REMEMBER_NAME").setValue(rn);
                            });
                        }
                    }
                }, {
                    xtype: 'label',
                    id: 'rembername_label',
                    margins: '15 0 0 5',
                    html: '<span style="cursor: pointer;" onclick="rembername(1)">记住登录名</span>',
                    labelWidth: 70,
                    listeners: {
                        render: function () {
                            Ext.fly(this.el).on('click', function () {
                                var rn = me.getForm().findField("REMEMBER_NAME").getValue();
                                rn = rn === 'false' ? 'true' : 'false';
                                me.getForm().findField("REMEMBER_NAME").setValue(rn);
                            });
                        }
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'REMEMBER_NAME',
                    value: 'true'
                }, {
                    xtype: 'label',
                    id: 'remberrole',
                    margins: '10 0 0 20',
                    width: 21,
                    height: 22,
                    html: ''
                }, {
                    xtype: 'label',
                    id: 'remberrole_label',
                    margins: '15 0 0 5',
                    html: '',
                    labelWidth: 58
                }, {
                    xtype: 'hiddenfield',
                    name: 'REMEMBER_ROLE',
                    value: 'true'
                }]
            }, {
                xtype: 'fieldcontainer',
                height: 36,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'end'
                },
                items: [{
                    xtype: 'label',
                    id: 'login-button',
                    html: '<span style="cursor: pointer;"><img src=\'/images/login_Push button.png\'/></span>',
                    width: 92,
                    margins: '3 0 0 0',
                    height: 35,
                    listeners: {
                        render: function () { //渲染后添加click事件
                            Ext.fly(this.el).on('click', function () {
                                me.up("window").onLogin();
                            });
                        }
                    }
                }]
            }]
        });
        me.callParent();
        me.on('afterrender', me.onafterrender, me);
    },

    onafterrender: function (_this, eOpts) {
        var me = this;
        var user = me.cookieNames[me.cookieNames.length - 1],
            roleValue = me.cookieRoles[me.cookieRoles.length - 1],
            role = Ext.getCmp('role');
        if (me.parent.locked) {
            user = userInfo.name;
            roleValue = userInfo.role;
        }
        if (user != null && user.length > 0) {
            role.getStore().proxy.url = webRoot + '/sys/roleByUser/' + user;
            role.getStore().load();
        } else {
            role.clearValue();
        }
        window.setTimeout(focusPassword, 500);

        function focusPassword() {
            var form = _this.getForm();
            var nameInput = form.findField('NAME'),
                passInput = form.findField('PASSWORD');
            if (nameInput.getValue() == null || nameInput.getValue().length == 0) {
                nameInput.focus();
            } else passInput.focus();
        }
    },

    selectRoleByName: function (_this, user) {
        var me = this;
        var role = Ext.getCmp('role');
        if (user != null && user.length != 0) {
            role.getStore().proxy.url = webRoot + '/sys/roleByUser/' + user;
            role.clearValue();
            role.getStore().load();
        } else {
            role.clearValue();
        }
    }
});
