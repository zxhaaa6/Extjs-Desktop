/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.view.tree.nav', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.navtree',
    title: 'Simple Tree',
    width: 200,
    height: 150,
    store: 'navStore',
    rootVisible: false,
    renderTo: Ext.getBody()
});