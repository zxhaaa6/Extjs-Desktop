Ext.define('com.sys.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    requires: [
        'Ext.container.Viewport',
        'com.sys.desktop.Desktop'
    ],
    id: 'sys-desktop-app',
    isReady: false,
    diffTime: false, //时间差
    diffContent: null,
    modules: null,
    useQuickTips: true,

    constructor: function (config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
        );

        me.mixins.observable.constructor.call(this, config);
        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },

    init: function () {
        var me = this,
            desktopCfg;
        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.sysOptionItems = null;

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }
        desktopCfg = me.getDesktopConfig();
        me.desktop = new com.sys.desktop.Desktop(desktopCfg);
        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [me.desktop],
            listeners: {
                afterrender: function (_this, eOpts) {
                    me.onLocked(me, _this);
                }
            }
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.diffTime = false;
        me.diffContent = "请校时后重新登录!";
        me.fireEvent('ready', me);
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this,
            cfg = {
                app: me,
                taskbarConfig: me.getTaskbarConfig()
            };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    getStartConfig: function () {
        var me = this,
            cfg = {
                app: me,
                menu: []
            },
            launcher;

        Ext.apply(cfg, me.startConfig);
        Ext.each(me.modules, function (module) {
            launcher = module.launcher;
            if (launcher) {
                launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
                cfg.menu.push(module.launcher);
            }
        });
        return cfg;
    },

    createWindow: function (module) {
        var me = this;

        localStorage.options = JSON.stringify({
            isMaxWindow: me.desktop.isMaxWindow == 'true',
            winSize: {
                width: me.desktop.body.getWidth(),
                height: me.desktop.body.getHeight()
            }
        });
        var window = module.createWindow(me.desktop.isMaxWindow);
        window.show();
    },

    getTaskbarConfig: function () {
        var me = this,
            cfg = {
                app: me,
                startConfig: me.getStartConfig()
            };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules: function (modules) {
        var me = this;
        Ext.each(modules, function (module) {
            module.app = me;
        });
    },

    getModule: function (name) {
        var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },

    onReady: function (fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop: function () {
        return this.desktop;
    },

    onUnload: function (e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    },

    //锁定
    onLocked: function (_this, _view) {

    },

    locked: function () {
        var me = this;
        var panel = Ext.getCmp('loginWindow');
        if (panel === undefined) {
            panel = createLockedWindow();
            Ext.Ajax.request({
                url: webRoot + '/sys/logout/',
                method: 'GET',
                async: false,
                autoError: false,
                scope: this,
                success: function (response) {

                },
                failure: function (response, options) {

                }
            });
            panel.show();
        }
    }
});

function createLockedWindow() {
    var dlg = Ext.create('com.sys.desktop.LoginWindow', {
        locked: true,
        modal: true
    });
    return dlg;
}
