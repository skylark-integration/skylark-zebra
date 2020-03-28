define([
	"qscript/lang/Class",
	"qscript/lang/Stateful",
	"qfacex/windows/controlss/_Layoutable"
],function(Class,Statefu,_Layoutable) {

	var Container = Class.declare(_Layoutable,{
		_alChildren	: null,
		_children   : null,

		_initialize : function(cOwner) {
			System.execMethod(this,"_initialize",[cOwner],W.Control);	

			this._children = new Array();
			this._alChildren = new Array();
		},

		_finalize : function() {

			for (var i = 0;i<this._children.length;i++){
				var oChild = this._children[i];
				System.dispose(oChild);
				this._children[i] = null;
			}
			System.dispose(this._children);
			this._children = null;

			System.dispose(this._alChildren);
			this._alChildren = null;

			System.execMethod(this,"_finalize",null,W.Control);	
		},

		_doCheckClildDock 	: function() {
			var elClient = this._getClientElement();
			var bContain = this.containDockedChild();
			if (bContain) {
				elClient.style.overflow = "hidden";
			} else {
				elClient.style.overflow = "auto";
			}
		},

		_rebuildChildrenZorder : function() {
			var cs = this.getChildren();
			var zIndex = 1;
			for (var i = 0; i< cs.length;i++) {
				var c = cs[i];
				if (System.instanceOf(c,W.Control)) {
					UIElement.setStyle(c._el,"zIndex",zIndex++);
				}
			}
		},

		_moveChildToBottom 	: function(oChild) {
			var i = this._children.indexOf(oChild)
			var len = this._children.length;
			if (i>0) {
				this._children.removeAt(i);
				this._children.insertAt(oChild,0);
				this._rebuildChildrenZorder();
			}
		},

		_moveChildToTop 	: function(oChild) {
			var i = this._children.indexOf(oChild)
			var len = this._children.length;
			if (i>-1 && i<len-1) {
				this._children.removeAt(i);
				this._children.push(oChild);
				this._rebuildChildrenZorder();
			}
		},

		_doCanAddChild	: function(oChild){
			return true;
		},

		_doCanRemoveChild	: function(oChild){
			return true;
		},


		_doAddChild 	: function(oChild) {
			var elClient = this._getClientElement();
			if (elClient) {
				elClient.appendChild(oChild._el);
			}

		},

		_doRemoveChild	: function(oChild) {
			var elClient = this._getClientElement();
			if (elClient) {
				elClient.removeChild(oChild._el);
			}
		},

		_requestDock	: function() {
			if (this._requestDocking) {
				return ;
			}
			this._requestDocking = true;
			
			this._doCheckClildDock();
			var cs = this._alChildren;
			var l = cs.length;
			
			var npLeft = 0;
			var npTop  = 0;
			var npWidth = this.getClientWidth();
		    var npHeight = this.getClientHeight();

			for (var i = 0; i < l; i++) {
				var oChild = cs[i];

				var nLeft = oChild.getLeft();
				var nTop  = oChild.getTop();
				var nWidth = oChild.getWidth();
				var nHeight = oChild.getHeight();

				switch (oChild.getDock()) {
					case W.Dock.top : {
						nTop = npTop;
						nLeft = npLeft;
						nWidth = npWidth;

						npTop += nHeight;
						npHeight -= nHeight;

						break;
					};
					case W.Dock.bottom : {
						nLeft = npLeft;
						nTop = npTop+npHeight-nHeight;
						nWidth = npWidth;

						npHeight -= nHeight;
						break;
					};
					case W.Dock.right : {
						nLeft 	= npLeft + npWidth- nWidth;
						nTop 	= npTop;
						nHeight = npHeight;

						npWidth -= nWidth;
						break;

						break;
					};
					case W.Dock.left : {
						nTop = npTop;
						nLeft = npLeft;

						nHeight = npHeight;

						npLeft  += nWidth;
						npWidth -= nWidth;

						break;
					};
				}
				oChild.setBounds(nLeft,nTop,nWidth,nHeight);
			}
			for (var i = 0; i < l; i++) {
				var oChild = cs[i];
				if ( oChild.getDock() == W.Dock.client) {
					oChild.setBounds(npLeft,npTop,npWidth,npHeight);
				}
			}
			this._requestDocking = false;

		},

		_layout : function(bInvalidate) {
			if (this.isUpdating()) {
				return ;
			}

			this._requestDock();

			System.execMethod(this,"_layout",[bInvalidate],W.Control);	
		},

		_getNextDockedControl	: function(c) {
			var idx = this._alChildren.indexOf(c)
			for (var i= idx-1;i>=0;i--) {
				var cNext = this._alChildren[i];
				if (cNext._dock == c._dock) {
					return cNext;
				}
			}

			return null;
		},


		addChild : function(oChild) {
			var p = oChild.getParent();
			if (p == this) {
				return;
			}
			if (this._doCanAddChild(oChild)) {
				if (p != null) {
					p.removeChild(oChild);
				}
				this._children.push(oChild);
				oChild._parent = this;
				this._doAddChild(oChild);
				UIElement.setStyle(oChild._el,"position","absolute");
				this._rebuildChildrenZorder();

				if (oChild.getDock() != W.Dock.none) {
					this._alChildren.push(oChild);
					this._requestDock();
				}
			}
		},
		
		removeChild : function(oChild) {
			if (oChild._parent != this) {
				throw new Error("Can only remove children");
			}
			if (this._doCanRemoveChild(oChild)) {
				oChild._parent = null;
				this._children.remove(oChild);
				this._doRemoveChild(oChild);
				this._rebuildChildrenZorder();
				return oChild;
			} else {
				return null;
			}
		},

		removeAllChild : function() {
			var cs = this.getChildren();
			var l = cs.length;
			for (var i = 0; i < l; i++) {
				this.remove(cs[i]);
				System.dispose(cs[i]);
			}
		},

		getChildren : function() {
			var res =[];
			var cs = this._children;
			var l = cs.length;
			for (var i = 0; i < l; i++) {
				res.push(cs[i]);
			}
			return res;
		},

		hasChildren : function() {
			var cs = this._children;
			return cs.length > 0;
		},

		getChildrenCount	: function() {
			return this._children.length;
		},

		getChild	: function(idx) {
			if (idx>=0 && idx< this._children.length) {
				return this._children[idx];
			} else {
				return null;
			}
		},

		getChildIndex	: function(oChild) {
			return this._children.indexOf(oChild);
		},

		contains : function(oDescendant) {
			if (oDescendant == null)
				return false;
			if (oDescendant == this)
				return true;
			var p = oDescendant._parent;
			return this.contains(p);
		},

		containDockedChild 	: function() {
			return this._alChildren.length > 0 ;
		},

		_doChildDockChange : function() {

		}

	});
	
	
	return Panel;
	
});	
