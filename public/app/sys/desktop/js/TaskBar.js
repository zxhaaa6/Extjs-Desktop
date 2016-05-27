Ext.define('com.sys.desktop.TaskBar', {

    extend: 'Ext.toolbar.Toolbar',

    requires: [
        'Ext.button.Button',
        'Ext.resizer.Splitter',
        'Ext.menu.Menu',
        'com.sys.desktop.StartMenu'
    ],

    alias: 'widget.taskbar',

    cls: 'ux-taskbar',
    height: 37,
    startBtnText: '开始',
    style: {
        "background-color": "#ddeef5"
    },

    initComponent: function () {
        var me = this;

        me.startMenu = new com.sys.desktop.StartMenu(me.startConfig);

        me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());
        me.quickStart.width = me.quickStart.items.items.length * 32;
        me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

        me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());

        me.items = [{
            xtype: 'button',
            cls: 'ux-start-button bar-button-style',
            tooltip: {
                text: me.startBtnText,
                align: 'bl-tl'
            },
            text: me.startBtnText,
            menu: me.startMenu,
            menuAlign: 'bl-tl',
            listeners: {
                beforerender: function (_this, eOpts) {
                    if (logo !== "none") {
                        _this.icon = '';
                    }
                },
                afterrender: function (_this, eOpts) {
                    if (logo === "none") {
                        document.getElementById(_this.id + '-btnEl').style.position = "relative";
                        document.getElementById(_this.id + '-btnEl').style.right = "-7px";
                    }
                }
            }
        }, {
            xtype: 'tbseparator',
            style: {
                borderColor: "white"
            }
        }];

        me.items.push({
                xtype: 'button',
                iconCls: 'locked',
                cls: 'bar-button-style',
                menuAlign: 'bl-tl',
                tooltip: {
                    text: '锁定当前用户',
                    align: 'bl-tl'
                },
                handler: me.app.locked
            },
            me.quickStart, {
                xtype: 'splitter',
                html: '&#160;',
                height: 14,
                width: 2, // TODO - there should be a CSS way here
                cls: 'x-toolbar-separator x-toolbar-separator-horizontal'
            },
            me.windowBar, {
                xtype: 'tbseparator',
                style: {
                    borderColor: "white"
                }
            }, {
                xtype: 'label',
                width: '16px',
                height: '16px',
                html: '<div class="user" style="width: inherit;height: inherit;"></div>'
            }, {
                xtype: 'label',
                id: 'userAndDeptName',
                html: '',
                listeners: {
                    render: function (_this) {

                    }
                }
            }, {
                xtype: 'tbseparator',
                style: {
                    borderColor: "white"
                }
            },
            me.tray);
        me.on('boxready', function () {
            setTimeout(function () {
                me.doLayout();
            }, 300);
        });

        me.callParent();
    },

    afterLayout: function () {
        var me = this;
        me.callParent();
        me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
    },

    getQuickStart: function () {
        var me = this,
            ret = {
                minWidth: 20,
                width: Ext.themeName === 'neptune' ? 70 : 32,
                items: [],
                enableOverflow: true
            };

        Ext.each(this.quickStart, function (item) {
            ret.items.push({
                xtype: 'tbseparator',
                style: {
                    borderColor: "white"
                }
            });
            ret.items.push({
                tooltip: {
                    text: item.name,
                    align: 'bl-tl'
                },
                cls: 'bar-button-style',
                //tooltip: item.name,
                overflowText: item.name,
                iconCls: item.iconCls,
                module: item.module,
                handler: me.onQuickStartClick,
                scope: me
            });
        });

        return ret;
    },

    getTrayConfig: function () {
        var ret = {
            items: this.trayItems
        };
        delete this.trayItems;
        return ret;
    },

    getWindowBarConfig: function () {
        return {
            flex: 1,
            cls: 'ux-desktop-windowbar',
            items: ['&#160;'],
            layout: {
                overflowHandler: 'Scroller'
            }
        };
    },

    getWindowBtnFromEl: function (el) {
        var c = this.windowBar.getChildByElement(el);
        return c || null;
    },

    onQuickStartClick: function (btn) {
        if (myDesktopApp.diffTime) {
            Ext.MessageBox.alert('提示', myDesktopApp.diffContent);
        } else {
            var module = this.app.getModule(btn.module),
                window;

            if (module) {
                window = module.createWindow();
                window.show();
            }
        }
    },

    onButtonContextMenu: function (e) {
        var me = this,
            t = e.getTarget(),
            btn = me.getWindowBtnFromEl(t);
        if (btn) {
            e.stopEvent();
            me.windowMenu.theWin = btn.win;
            me.windowMenu.showBy(t);
        }
    },

    onWindowBtnClick: function (btn) {
        var win = btn.win;

        if (win.minimized || win.hidden) {
            btn.disable();
            win.show(null, function () {
                btn.enable();
            });
        } else if (win.active) {
            btn.disable();
            win.on('hide', function () {
                btn.enable();
            }, null, {
                single: true
            });
            win.minimize();
        } else {
            win.toFront();
        }
    },

    addTaskButton: function (win) {
        var config = {
            iconCls: win.iconCls,
            enableToggle: true,
            toggleGroup: 'all',
            width: 140,
            margins: '0 2 0 3',
            text: Ext.util.Format.ellipsis(win.title, 20),
            listeners: {
                click: this.onWindowBtnClick,
                scope: this
            },
            win: win
        };

        var cmp = this.windowBar.add(config);
        cmp.toggle(true);
        return cmp;
    },

    removeTaskButton: function (btn) {
        var found, me = this;
        me.windowBar.items.each(function (item) {
            if (item === btn) {
                found = item;
            }
            return !found;
        });
        if (found) {
            me.windowBar.remove(found);
        }
        return found;
    },

    setActiveButton: function (btn) {
        if (btn) {
            btn.toggle(true);
        } else {
            this.windowBar.items.each(function (item) {
                if (item.isButton) {
                    item.toggle(false);
                }
            });
        }
    },

    //修改密码
    onChangePassword: function () {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            title: '修改用户密码',
            width: 232,
            height: 198,
            modal: true,
            layout: 'fit',
            items: [{
                xtype: 'form',
                border: false,
                padding: '5 0 0 0',
                defaults: {
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 76,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'USERID',
                        value: userInfo.userId,
                        hidden: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '登录名',
                        name: 'USERNAME',
                        width: 215,
                        disabled: true,
                        value: userInfo.loginId + '(' + userInfo.name + ')'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 76,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '旧密码',
                        inputType: 'password',
                        name: 'OLDPASSWORD',
                        width: 215,
                        allowBlank: false
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 76,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '新密码',
                        inputType: 'password',
                        name: 'USERPASSWORD',
                        width: 215,
                        allowBlank: false
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 76,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'CONFIRMPASSWORD',
                        inputType: 'password',
                        fieldLabel: '确认新密码',
                        width: 215,
                        msgTarget: 'qtip',
                        allowBlank: false
                        /*listeners: {
                         blur: function(_this, _the, eOpts) {
                         //验证两次密码是否一致
                         var form = win.items.items[0].getForm();
                         var pass = form.findField('USERPASSWORD').getValue(),
                         repass = _this.getValue();
                         var saveButton = win.getDockedItems('toolbar[dock="bottom"]').items.items[0];
                         if (pass !== repass) {
                         _this.setActiveError('');

                         } else {
                         saveButton.setDisabled(false);
                         }
                         }
                         }*/
                    }]
                }]
            }],
            buttons: [{
                text: '确定',
                iconCls: 'common-win-save',
                handler: function (_this) {
                    var form = win.items.items[0].getForm();
                    var formValues = form.getValues();
                    //验证两次密码是否一致
                    if (formValues.USERPASSWORD !== formValues.CONFIRMPASSWORD) {
                        Ext.MessageBox.alert('提示', '两次密码不一致！', function () {
                            form.findField('CONFIRMPASSWORD').focus(true);
                        });
                        return;
                    }
                    if (form.isValid()) {
                        _this.setDisabled(true);
                        form.submit({
                            url: webRoot + '/sys/user/edit/Password',
                            method: 'PUT',
                            success: function (form, action) {
                                _this.setDisabled(false);
                                var respText = Ext.decode(action.response.responseText).data;
                                if (!respText.flag) {
                                    Ext.MessageBox.alert('提示', '旧密码错误，请输入正确的旧密码！');
                                    return;
                                }
                                var msg = Ext.create('com.sys.desktop.SlideMessage');
                                msg.popup('提示：', '修改用户密码成功！');
                                win.close();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.alert('提示', '修改用户密码失败,请求超时或网络故障！');
                            }
                        });
                    }
                }
            }, {
                text: '取消',
                iconCls: 'common-win-cancel',
                scope: me,
                handler: function () {
                    win.close();
                }
            }]
        });
        return win;
    }
});

Ext.define('com.sys.desktop.TrayClock', {
    extend: 'Ext.toolbar.TextItem',

    alias: 'widget.trayclock',

    cls: 'ux-desktop-trayclock',

    html: '&#160;',

    timeFormat: 'G:i',

    tpl: '<span id="systemTimeTip" style="cursor:default">{time}</span>',

    initComponent: function () {
        var me = this;
        me.callParent();

        if (typeof(me.tpl) == 'string') {
            me.tpl = new Ext.XTemplate(me.tpl);
        }
    },

    afterRender: function () {
        var me = this;
        Ext.Function.defer(me.updateTime, 100, me);
        me.callParent();
    },

    onDestroy: function () {
        var me = this;
        if (me.timer) {
            window.clearTimeout(me.timer);
            me.timer = null;
        }

        me.callParent();
    },

    updateTime: function () {
        var me = this,
            time = Ext.Date.format(new Date(), me.timeFormat),
            text = me.tpl.apply({
                time: time
            });
        if (me.lastText != text) {
            me.setText(text);
            me.lastText = text;
        }
        me.timer = Ext.Function.defer(me.updateTime, 10000, me);
        var day = null;
        if (new Date().getDay() == 1) {
            day = '一';
        } else if (new Date().getDay() == 2) {
            day = '二';
        } else if (new Date().getDay() == 3) {
            day = '三';
        } else if (new Date().getDay() == 4) {
            day = '四';
        } else if (new Date().getDay() == 5) {
            day = '五';
        } else if (new Date().getDay() == 6) {
            day = '六';
        } else if (new Date().getDay() === 0) {
            day = '日';
        }
        Ext.create('Ext.tip.ToolTip', {
            target: 'systemTimeTip',
            anchor: 'right',
            anchorOffset: 50,
            html: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '号<br/>星期' + day
        });
    }
});
