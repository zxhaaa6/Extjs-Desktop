Ext.define('com.sys.desktop.LoginForm', {
	extend: 'Ext.form.Panel',
	id: 'login-form',
	isFiredChangeEvent: true,
	initComponent: function() {
		var me = this;
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
				value: '点击登录名录入框，可选择最近10个登录用户。' //'请输入用户名和密码，并选择所属角色进行登录。',
			}, {
				xtype: 'textfield',
				hidden: true,
				name: 'LOGIN_ID',
				value: ''
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
				value: '',
				grow: true,
				typeAhead: false,
				queryDelay: 1000,
				valueField: 'text',
				displayField: 'text',
				minChars: 0,
				fieldCls: 'login-user-cls',
				store: new Ext.data.SimpleStore({
					fields: ['value', 'text'],
					data: ''
				}),
				listeners: {
					blur: function(_this, _the, eOpts) {

					},
					afterrender: function(_this, eOpts) {

					},
					select: function(_this, records) {

					},
					change: function(_this) {

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
				valueField: 'id',
				displayField: 'name',
				store: new Ext.data.Store({
					fields: ['id', 'name', 'userName', 'loginId'],
					proxy: {
						type: 'ajax',
						url: '',
						reader: {
							type: 'json',
							root: 'data'
						}
					},
					listeners: {
						load: function(_this, records, successful, eOpts) {
							if (records != null && records.length > 0) {

							}
						}
					}
				}),
				listConfig: {
					loadingText: 'Loading...',
					emptyText: '该用户没有角色...'
				},
				listeners: {
					beforerender: function(_this, eOpts) {

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
					html: ''
				}, {
					xtype: 'label',
					id: 'rembername_label',
					margins: '15 0 0 5',
					html: '',
					labelWidth: 70
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
						render: function() { //渲染后添加click事件
							Ext.fly(this.el).on('click', function() {

							});
						}
					}
				}]
			}]
		});
		me.callParent();

	}
});
