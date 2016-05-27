Ext.define('com.sys.desktop.SlideMessage', {
	extend: 'Ext.Component',

	popupOriginal: function(title, format, delay, id, data) {
		if (!Ext.get(id)) {
			msgCt = Ext.DomHelper.insertFirst(document.body, {
				id: id
			}, true);
		}
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		var m = Ext.DomHelper.append(msgCt, this.createBox(title, s), true);
		m.hide();
		if (id === 'msg-pop-bottom-div') {
			m.on('click', function() {
				var component = Ext.getCmp('msg-' + data.type);
				if (!component) {
					component = Ext.create('com.msg.' + data.type + '.MsgComponent', {
						id: 'msg-' + data.type
					});
				}
				component.openMsgWin();
			});
		}
		m.slideIn('t').ghost("t", {
			delay: delay || 5000,
			remove: true
		});
	},
	popup: function(title, format, delay) {
		this.popupOriginal(title, format, delay, 'msg-div');
	},
	popupBottom: function(data, delay) {
		this.popupOriginal(data.title, data.content, delay, 'msg-pop-bottom-div', data);
	},
	createBox: function(t, s) {
		if (t) {
			return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
		} else {
			return '<div class="msg-pop-bottom">' + s + '</div>';
		}
	}
});
