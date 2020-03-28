define([
	"qscript/lang/Class",
	"qfacex/windows/control/Control"
],function(Class,Control) {
System.defineClass({
	name		: "sw2.widget.ListItems",
	statics		: {
	},
	instances	: {
		_c		: null,
		_items	: null,

		_initialize : function(c) {
			this._c = c;
			this._items	= new Array();
		},

		_finalize : function() {
			this._c = null;
			if (this._items){
				System.dispose(this._items);
				this._items = null;
			}
		},

		add		: function(item) {
			if (this._c._datasource){
				return;
			}
			this._items.push(item);
			this._c._doAddItem(item);
		},

		remove	: function(item) {
			if (this._c._datasource){
				return;
			}
			var i = this._items.indexOf(item);
			if (i>-1) {
				this.removeAt(i);
			}
		},

		insertAt	: function(item,i) {
			if (this._c._datasource){
				return;
			}
			this._items.insertAt(item,i);
		},

		removeAt	: function(i){
			if (this._c._datasource){
				return;
			}
			this._items.removeAt(i);
			this._c._doRemoveItem(i);
		},

		getCount	: function(){
			var ds = this._c._datasource;
			if (ds) {
				if (System.instanceOf(ds,Array)) {
					return ds.length;
				} 
			} else {
				return this._items.length;
			}
		},

		getItem		: function(i){
			var ds = this._c._datasource;
			if (ds) {
				if (System.instanceOf(ds,Array)) {
					return ds[i];
				} 
			} else {
				return this._items.get[i];
			}
		}
	}
});
	
	return ItemsCollection;
	
});	
