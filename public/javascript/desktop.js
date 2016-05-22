var userInfo = '';
var logo = '';
Ext.Loader.setPath({
    'com.sys.desktop': '/app/sys/desktop/js'
});
//Ext.require('MyDesktop.App');
var myDesktopApp;
Ext.onReady(function() {

    if (userInfo === 'undefined'||userInfo ==='') {
        var dlg = Ext.create('com.sys.desktop.LoginWindow', {
            parent: this
        });
        dlg.show();
    } else {
        myDesktopApp = new MyDesktop.App();
    }

    Ext.EventManager.onWindowResize(function(a, b) {
        var win = Ext.getCmp("loginWindow");
        if (win == undefined) {
            return;
        }
        win.center();
    });
});