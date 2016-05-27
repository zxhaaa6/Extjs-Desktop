Ext.define('MyDesktop.App', {
    extend: 'com.sys.desktop.App',

    requires: [
        'com.sys.desktop.ShortcutModel',
        'com.firstModule.App',
        'com.sys.desktop.Timing'
    ],

    init: function() {
        var me = this;
        this.callParent();
        me.showMsgWin();

    },

    getModules: function() {
        var modules = [];
        modules.push(new com.firstModule.App());
        return modules;
    },

    getDesktopConfig: function() {
        var me = this,
            ret = me.callParent(),
            currWallpaper = '/images/wallpapers/1.jpg';

        var shortcutsStore = Ext.create('Ext.data.Store', {
            model: 'com.sys.desktop.ShortcutModel',
            data: [{
                id: 'a4947cc0321911e3bc42abf9027aeb3f',
                name: 'firstModule',
                iconCls: 'firstModule-shortcut',
                module: 'mbs'
            }]
        });
        var contextMenuItems = [{
            text: '更改系统设置',
            iconCls: 'settings',
            handler: me.onSettings,
            scope: me
        }];
        var records = shortcutsStore.getRange(0, shortcutsStore.getCount());
        shortcutsStore.loadData(records);

        return Ext.apply(ret, {
            contextMenuItems: contextMenuItems,
            shortcuts: shortcutsStore,
            wallpaper: currWallpaper,
            wallpaperStretch: true
        });
    },

    getStartConfig: function() {
        var me = this,
            setItems = [{
                text: '系统设置',
                iconCls: 'settings',
                cls: 'bar-set-button-style',
                handler: me.onSettings,
                scope: me
            },
                '-', {
                    text: '退出',
                    iconCls: 'logout',
                    cls: 'bar-set-button-style',
                    handler: me.onLogout,
                    scope: me
                }],
            ret = me.callParent();

        var vText = [
            '<div style="color:rgb(153, 153, 153); position:absolute; bottom:2px;top:5px">',
            '<span>',
            '版本：' ,
            '</span>',
            '</div>'
        ].join('');

        setItems.push({
            xtype: 'tbtext',
            style: {
                left: "184px",
                top: "5px"
            },
            text: vText,
            flex: 1
        });

        return Ext.apply(ret, {
            title: '欢迎您',
            iconCls: 'user',
            style: {
                borderWidth: "0px",
                background: "url(../../../images/start-background.jpg) no-repeat"
            },
            height: 356,
            toolConfig: {
                width: 100,
                items: setItems
            }
        });
    },

    getTaskbarConfig: function() {
        var ret = this.callParent();
        var setItems = [];


        return Ext.apply(ret, {
            quickStart: setItems,
            trayItems: [{
                xtype: 'trayclock',
                flex: 1
            }]
        });
    },

    onLogout: function() {
        Ext.Msg.confirm('退出', '确认要退出吗？', function(btn) {
            if (btn === 'yes') {
                window.onbeforeunload = null;
                window.location.href = webRoot + '/sys/logout/';
            }
        });
    },

    onSettings: function() {

    },
    showMsgWin: function() {

    }
});
