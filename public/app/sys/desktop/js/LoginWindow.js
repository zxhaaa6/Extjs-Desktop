Ext.define('com.sys.desktop.LoginWindow', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.layout.container.VBox'
	],
	uses: [
		'com.sys.desktop.LoginForm'
	],
	id: 'loginWindow',
	width: 341,
	height: 355,
	border: false,
	closable: false,

	bodyStyle: "background-image:url('/images/login_Login_Background.png'); padding:74px 0px 0",
	layout: 'fit',
	lableWidth: 50,
	draggable: false,
	baseCls: '', //  这个很关键 背景透明
	shadow: false,
	frame: false,
	hideMode: 'offsets',
	constrain: false,
	maximizable: false,
	bodyPadding: '76px 6px 6px 6px',

	resizable: false, // 禁止拖动
	maxCookieCount: 10, // cookie中只记录最近登录的十个用户
	initComponent: function() {
		var me = this;
		me.items = [me.createLoginForm()];
		me.callParent();
	},

	createLoginForm: function() {
		var me = this;
		var form = Ext.create('com.sys.desktop.LoginForm', {
			parent: me
		});
		return form;
	}
});
