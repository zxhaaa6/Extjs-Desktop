/**
 * Created by backup on 2015/9/18.
 */
Ext.application({
    name: 'AM',
    appFolder: 'app',
    controllers: ['userController', 'navController'],
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            defaults: {
                //bodyStyle: "background-color: #FFFFFF;",
                frame: true
            },
            items: [
                accordion,
                {region: "east", width: 200, xtype: 'navtree', title: 'north', collapsible: true},
                {region: "north", height: 100, title: 'north', collapsible: true},
                {region: "center", xtype: 'userlist', split: true, border: true, collapsible: true, title: 'center'},
                {region: "south", title: "south", split: true, border: true, collapsible: true, height: 100},

            ]
        })
    }
});
var accordion = Ext.create("Ext.panel.Panel", {
    title: "west",
    layout: "accordion", //可折叠面板
    layoutConfig: {
        animate: true
    },
    width: 200,
    minWidth: 90,
    region: "west", //设置方位
    split: true,
    collapsible: true,
    items: [
        {title: "嵌套面板一", html: "嵌套面板一"},
        {title: "嵌套面板二", html: "嵌套面板二"},
        {title: "嵌套面板三", html: "嵌套面板三"},
        {title: "嵌套面板四", html: "嵌套面板四"}
    ]
});