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
    initComponent: function () {
        var me = this;
        me.items = [me.createLoginForm()];
        me.on('afterrender', me.onKeyPress);
        me.callParent();
    },

    createLoginForm: function () {
        var me = this;
        var form = Ext.create('com.sys.desktop.LoginForm', {
            parent: me
        });
        return form;
    },

    onLogin: function () {
        var me = this;
        var form = Ext.getCmp('login-form').getForm(),
            values = form.getValues();

        if (form.isValid()) {
            Ext.getCmp('login-button').setDisabled(true);

            form.submit({
                url: webRoot + '/sys/login',
                method: 'POST',
                success: function (form, action) {
                    if (action.result.data.loginSuccess === true) {
                        userInfo = action.result.data.userInfo;
                        if (myDesktopApp === undefined) {
                            myDesktopApp = new MyDesktop.App();
                        }
                        me.close();
                    } else {
                        me.setErrorValue(action.result.data.msg);
                    }
                },
                failure: function (form, action) {
                    me.setErrorValue('请求超时或网络故障！');
                    Ext.getCmp('login-button').setDisabled(false);
                }
            });
        }
    },

    onKeyPress: function(_this, eOpts) {
        var loginWindow = _this.getEl();
        loginWindow.on('keydown', function(e, t, eOpts) {
            if (e.getKey() == 13) {
                _this.onLogin();
            }
        });
    },

    setErrorValue: function (errMsg) {
        var me = this,
            form = Ext.getCmp('login-form').getForm();
        var errObj = form.findField('ERRORMSG'),
            errObjFieldEl = errObj.inputEl,
            domErrObj = errObj.getEl().dom;
        // 设置错误信息
        errObj.setValue(errMsg);

        // 更改错误提示字体颜色
        errObj.setFieldStyle('color: #E4393C');
        // 更改错误提示图标
        if (errObjFieldEl.hasCls('login-tip-cls')) {
            errObjFieldEl.replaceCls('login-tip-cls', 'login-error-cls');
        }
        // 更改错误提示背景
        if (errObj.hasCls('login-tip-background'))
            errObj.removeCls('login-tip-background');
        errObj.addCls('login-error-background');
        domErrObj.title = errMsg;
        Ext.getCmp('login-button').setDisabled(false);
    }
});
