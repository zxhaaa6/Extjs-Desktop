/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.store.userStore', {
    extend: 'Ext.data.Store',
    model: 'AM.model.userModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
            read: '/getAllUsers',
            update: '/updateUsers',
            create: '/addUser',
            destroy: '/deleteUsers'
        },
        //url:'/getAllUsers',
        reader: {
            type: 'json',
            root: 'users',
            successProperty: 'success'
        }
    },
    remoteSort: false,
    sorters: [{
        //排序字段。
        property: 'name',
        //排序类型，默认为 ASC
        direction: 'asc'
    }]

});

