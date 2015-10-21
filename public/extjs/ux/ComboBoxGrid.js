/**
 *  基于Extjs4的下拉树控件
 *  version:2014-5-15
 *  author: LIUJINJIN
 *  用法:
    
    实例化store作为数据源
    var store = Ext.create('Ext.data.SimpleStore',{
		proxy:{
			type:'ajax',
			url:'${webRoot}/wip/ttttQueryAction.action'
		}
	});
	
	实例化ComboBoxTree
	var ctree =Ext.create("Ext.ux.ComboBoxGrid", {
        id:'c_grid',
        name:'c_grid',
        store :store,
		editable: false,
        width : 300
	});
	
	说明：
	
	常用方法:
	
	
 */

Ext.define('Ext.ux.ComboBoxGrid', {
	extend: 'Ext.form.field.Picker',
	requires: [
		'Ext.panel.Panel',
		'Ext.grid.Panel'
	],
	alias: [
		'widget.comboboxgrid'
	],
	pickerWidth: 150,
    mutilSel:false,
	initComponent: function() {
		var self = this;
		Ext.apply(self, {
			fieldLabel: self.fieldLabel,
			labelWidth: self.labelWidth
		});
		self.callParent();
	},
	createPicker: function() {
		var self = this,selModel=null;
        if(self.mutilSel){
            selModel = Ext.create('Ext.selection.CheckboxModel',{mode:"SIMPLE"});
        }
		self.picker = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			height: self.panelHeight == null ? 150 : self.panelHeight,
			width: '100%',
			floating: true,
			border: false,
			shadow: false,
			items: [{
				xtype: 'grid',
				region: 'west',
				width: '30%',
				hideHeaders: true,
				border: false,
				style: {
					border: '1px solid #e1e1e1',
					borderRight: '1px solid #99BCE8'
				},
				columns: [{
					width: '100%',
					dataIndex: 'text',
					sortable: false,
					align: 'center'
				}],
				store: self.leftStore,
				listeners: {
					afterrender: function(_this) {
						_this.getSelectionModel().select(self.selectRow);
                        _this.ownerCt.items.items[1].fireEvent('change',0);
					},
					itemclick: function(_this, record, item, index, e, eOpts) {
						for (var i = 0; i < _this.getStore().data.items.length; i++) {
							if (index == i) {
								_this.ownerCt.ownerCt.items.items[1].getStore().loadData(self.rightStoreArr[i], false);
                                _this.ownerCt.ownerCt.items.items[1].fireEvent('change',i);
							}
						}
					}
				}
			}, {
				xtype: 'grid',
				region: 'center',
				hideHeaders: true,
				border: false,
				style: {
					border: '1px solid #e1e1e1',
					borderLeft: '0px'
				},
                viewConfig:{
                    style:'overflow-x:hidden !important;'
                },
				columns: [{
					width: '100%',
					dataIndex: 'text',
					sortable: false,
					align: 'left'
				}],
				store: self.rightStore,
                selModel:selModel,
				listeners: {
                    selectionchange: function(_this, selected, eOpts) {
                        if(self.mutilSel){
                            var selModel = selected,tempText='';
                            for(var i=0;i<selModel.length;i++){
                                tempText += selModel[i].get('text');
                                if(i<selModel.length-1){
                                    tempText +=',';
                                }
                            }
                            self.setValue(tempText);
                        }else if(selected.length>0){
                            self.setValue(selected[0].get('text'));
                            setTimeout(function(){
                                self.collapse();
                            },300)
                        }

					},
                    change:function(i){
                        var sValue = self.getValue().split(','),
                            sotreArray=self.rightStoreArr[i],
                            selData={};
                        for(i=0;i<sValue.length;i++){
                            selData[sValue[i]]=true;
                        }
                        for(var l=0;l<sotreArray.length;l++){
                            if(selData[sotreArray[l][0]]){
                                this.getSelectionModel().select(l,true,false);
                            }
                        }
                    }
				}
			}]
		});
		return self.picker;
	},
	setPickerWidth: function(pickerWidth) {
		this.pickerWidth = pickerWidth;
	},
	getPickerWidth: function() {
		return this.pickerWidth;
	},
	alignPicker: function() {
		var me = this,
			picker, isAbove, aboveSfx = '-above';
		if (this.isExpanded) {
			picker = me.getPicker();
			//if (me.matchFieldWidth){picker.setWidth(me.bodyEl.getWidth());}
			if (me.matchFieldWidth) {
				if (me.pickerWidth && me.pickerWidth != 0) {
					picker.setWidth(me.pickerWidth);
				} else {
					picker.setWidth(me.bodyEl.getWidth());
				}
			}
			if (picker.isFloating()) {
				picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl
				isAbove = picker.el.getY() < me.inputEl.getY();
				me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
				picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
			}
		}
	}
});