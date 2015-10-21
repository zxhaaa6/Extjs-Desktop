/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.controller.navController', {
    extend: 'Ext.app.Controller',
    stores: ['navStore'],
    models: ['navModel'],
    views: ['tree.nav'],
    init: function () {
        //console.log('Initialized Users! This happens before the Application launch function is called');
        this.control({
            'navtree': function () {
                console.log('success');
            }
        });
    }
});