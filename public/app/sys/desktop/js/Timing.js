Ext.define('com.sys.desktop.Timing', {
    extend: 'Ext.Component',

    requires: [
        'com.sys.desktop.SlideMessage'
    ],

    id: 'timing',

    timing: function() {
        Ext.Ajax.request({
            url: webRoot + '/sys/now',
            method: 'GET',
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success === true) {
                    var serverDate = new Date(result.data);
                    var localDate = Ext.Date.now(); //new Date();.getTime()
                    var diff = Math.abs(Math.round((serverDate.getTime() - localDate) / 1000));
                    if (diff >= 60) {
                        myDesktopApp.diffTime = true;
                        var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                        msg.popup('警告：', '服务器当前时间 ' + Ext.util.Format.date(serverDate, "Y-m-d H:i:s") + ' ,您的电脑与服务器时间不一致，请校时后重新登录！', 2 * 60 * 1000);
                        /*Ext.Msg.show({
                            title: '警告：',
                            msg: '服务器当前时间 ' + Ext.util.Format.date(serverDate, "Y-m-d H:i:s") + ' ,您的电脑与服务器时间不一致，请校时后重新登录！',
                            buttonText: {
                                ok: '重新登录'
                            },
                            fn: function() {
                                window.onbeforeunload = null; // 退出时不再提示是否要离开本页面
                                window.location.reload();
                            }
                        });*/
                    }
                }
            }
        });
    }
});
