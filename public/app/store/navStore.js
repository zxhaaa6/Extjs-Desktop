/**
 * Created by backup on 2015/9/18.
 */
Ext.define('AM.store.navStore', {
    extend: 'Ext.data.TreeStore',
    model: 'AM.model.navModel',
    root: {
        expanded: true,
        children: [
            {text: "detention", leaf: true},
            {
                text: "homework", expanded: true, children: [
                {text: "book report", leaf: true},
                {text: "algebra", leaf: true}
            ]
            },
            {text: "buy lottery tickets", leaf: true}
        ]
    }
    /*proxy: {
     type: 'ajax',
     api: {
     read: '/getAllUsers'
     },
     //url:'/getAllUsers',
     reader: {
     type: 'json',
     root: 'users',
     successProperty: 'success'
     }
     },*/
});