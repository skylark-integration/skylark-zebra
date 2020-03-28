define([
	"qscript/lang/Class",
	"qfacex/windows/control/HeaderedItemsControl"
],function(Class,Enmu) {
	
	var TreeViewItem = Class.declare(HeaderedItemsControl,{
		//<<summary
		//TreeView コントロール内の選択可能な項目を実装します。
		//TreeViewItem は HeaderedItemsControl です。つまり、そのヘッダーとオブジェクトのコレクションは
		//任意の型 (文字列、イメージ、パネルなど) です。
		//TreeViewItem コントロールは、TreeView コントロール内のノードの階層を作成するために、他の TreeViewItem 
		//コントロール内に埋め込むことができます。
		//TreeViewItem を展開するまたは折りたたむ場合は、IsExpanded プロパティを使用します。
		//
		//
		//summary>>
		"-protected-"	:	{
			_nodes			: null,
			_tree 			: null,

			_icon 			: null,
			_expandedIcon 	: null,
			_checkable 		: false,
			_checked 		: false,
			_hasChild 		: false,
			_text			: "",

			_children 		: null,
			_parent 		: null,

			_expanded 		: false,


			_elText			: null,
			_elButton		: null,
			_elIcon			: null,
			_elCheck		: null,

			_elRow			: null,

			_elCell 		: null,

			_initialize : function () {
				this._children = new Array();
			},
		},
		"-attributes-"	:	{
		
			"isExpanded"	:	{
				//<<summary
				//TreeViewItem 内の入れ子になった項目が展開されているか、折りたたまれているかを取得または設定します。
				//summary>>
				type	:	Boolean
			
			},
			
			"isSelected"	:	{
				//<<summary
				//TreeViewItem コントロールが選択されているかどうかを取得または設定します。
				//summary>>
				type	:	Boolean
			
			}
			
		},
		"-events-"	:	{
			"collapsed"	: {
				type	: TreeItemCollapsedEvent
			},
			"expanded"	: {
				//<<summary
				//IsExpanded プロパティの値が false から true に変更された場合に発生します。
				//summary>>
				type	: TreeItemExpandedEvent
			},
			"selected"	: {
				type	: TreeItemSelectedEvent
			},
			"unselected	"	: {
				type	: TreeItemUnSelectedEvent
			}
		
		}
		"-methods-"	:	{
			getLevel : function() {
				var nLevel = 0;
				var p = this._parent;
				while (p) {
					p = p._parent;
					nLevel++;
				}
				return nLevel;
			},

			getIcon : function() {
				return this._icon;
			},

			setIcon : function(icon) {
	            this._icon = icon;
				if (this._elIcon && !this._expanded) {
					UIImg.setSrc(this._elIcon,icon);
				}
			},

			getExpandedIcon : function() {
				return this._expandedIcon;
			},

			setExpandedIcon : function(icon) {
	            this._expandedIcon = icon;
				if (this._elIcon && this._expanded) {
					UIImg.setSrc(this._elIcon,icon);
				}
			},
			
			getCheckable : function() {
				return this._checkable;
			},

			setCheckable : function(bCheckable) {
				if (bCheckable == this._checkable) {
					return;
				}
				this._checkable = bCheckable;
				if (this._elRow) {
					this._showNodeCell(true);
				}
			},

			getChecked : function() {
				return this._checked;
			},

			setChecked : function(bChecked) {
				this._checked = bChecked;
				if (this._elCheck) {
					UICheck.setChecked(this._elCheck,bChecked);
				}
			},

			getHasChild : function() {
				return this._hasChild;
			},

			setHasChild : function(bHasChild) {
				this._hasChild = bHasChild;
				this._refreshNode();
			},

			getExpanded : function() {
				return this._expanded;
			},

			setExpanded : function(bExpanded) {
				if (bExpanded) {
					this.expand();
				} else {
					this.collapse();
				}
			},

			getParent : function() {
				return this._parent;
			},

	        getChildren : function() {
				var children = new Array();
				for (var i=0;i<this._children.length;i++){
					children.push(this._children[i]);
				}
	            return children;
	        },

			getPrevSibling : function() {
				var p = this._parent;
				var cs = null
				if (p) {
					cs = p._children;
				} else {
					if (this._nodes) {
						cs = this._nodes._roots;
					}
				}
				if (!cs) {
					return null;
				}
				var i = cs.indexOf(this);
				if (i>0) {
					return cs[i-1];
				} else {
					return null;
				}
			},

			getNextSibling : function() {
				var p = this._parent;
				var cs = null
				if (p) {
					cs = p._children;
				} else {
					if (this._nodes) {
						cs = this._nodes._roots;
					}
				}
				if (!cs) {
					return null;
				}
				var i = cs.indexOf(this);
				if (i<cs.length-1) {
					return cs[i+1];
				} else {
					return null;
				}
			},

			getFirstDescendant : function() {
				var cs = this._children;
				if (cs.length>0) {
					return cs[0];
				} else {
					return null;
				}
			},

			getLastDescendant : function() {
				var cs = this._children;
				if (cs.length>0) {
					var oChild = cs[cs.length-1];
					if (oChild.hasChildren()) {
						return oChild.getLastDescendant();
					} else {
						return oChild;
					}
				} else {
					return null;
				}
			},

			getNext : function() {
				var oNext = this.getFirstDescendant();
				if (oNext) {
					return oNext;
				}

				var oNode = this;
				oNext = oNode.getNextSibling();
				while (!oNext) {
					oNode = oNode.getParent();
					if (!oNode) {
						break;
					}
					oNext = oNode.getNextSibling();
				}
				return oNext;
				
			},

			getPrev : function() {
				var oPrevNode = this.getPrevSibling();
				if (oPrevNode == null) {
					oPrevNode = this._parent;
				} else if (this._expanded) {
					var node1 = this.getLastDescendant();
					if (node1 != null)
						oPrevNode = node1;
				};
				return oPrevNode;
			},

			getNextVisible		: function () {
				function _nextNode(node) {
					var parent = node._parent;
					if (parent != null && parent._expanded) {
						var next = node.getNextSibling();
						if (next == null) {
							next = _nextNode(parent);
						};
						return next;
					};
					return null;
				};
				var next = this.getNext();
				while (next) {
					if (next._elRow) {
						return next;
					}
					next = next.getNext();
				}
			},

			getPrevVisible		: function () {
				function _prevNode(node) {
					if (node._expanded && node._children && node._children.length>0) {
						return _prevNode(node._children[node._children.length-1]);
					} 

					return node;
				};
				var pre = this.getPrevSibling();
				if (!pre) {
					return this.getParent();
				}
				pre = _prevNode(pre);
				return pre;
			},

			_showNodeCell	: function(bReShow) {
				if (bReShow || !this._elRow) {
					if (!this._elRow) {
						var tree = this.getTreeView();
	/*
						var preNode = this.getPrevVisible();
						if (preNode && !preNode._elRow) {
							return;
						}
						var rowIndex = 0;
						if (preNode && preNode._elRow){
							var elRowPre = preNode._elRow;
							rowIndex = UITableRow.rowIndex(elRowPre)+1;
						}
	*/
						var nextNode = this.getNextVisible();
						if (nextNode && !nextNode._elRow) {
							return;
						}
						var rowIndex = 0;
						if (nextNode && nextNode._elRow){
							var elRowNext = nextNode._elRow;
							rowIndex = UITableRow.rowIndex(elRowNext);
						}  else {
							rowIndex = UITable.getRowCount(tree._elTable);
						}

						this._elRow = UITable.insertRow(tree._elTable,rowIndex,"TreeNodeRow");
						this._elRow._node = this;
					} else {
						UITableCell.removeAllChild(UITableRow.cells(this._elRow,0));
					}
					var elRow = this._elRow;


					var elCell = UITableRow.cells(elRow,0);
	//				UITableCell.setInnerText(UITableRow.cells(elRow,1),"prop11111111111111111");
	//				UITableCell.setInnerText(UITableRow.cells(elRow,2),"prop222222222222");

	//				UITableRow.cells(elRow,1).style.overflow = "hidden";
	//				UITableRow.cells(elRow,2).style.overflow = "hidden";

					UITableCell.addCssClass(elCell,"TreeNodeCell");

					var bHasIcon = (this.getIcon() || this.getExpandedIcon());

					for (var i = 0; i< this.getLevel();i++) {
						UISpan.create(elCell,"TreeNodeIndent");
					}

					this._elButton = UIImg.create(null,elCell,"TreeNodeButton");

					if (bHasIcon) {
						this._elIcon = UIImg.create(null,elCell,"TreeNodeIcon");
					};

					if (this._checkable) {
						this._elCheck= UICheck.create(elCell,"TreeNodeCheckBox")
					};

					this._elText = UILabel.create(elCell,"TreeNodeText");

					this._refreshNode();

					if (this._expanded) {
						for(var i =0;i<this._children.length; i++) {
							this._children[i]._showNodeCell();
						}
					}
				}
			},

			_hideNodeCell	: function() {
				if (this._elRow) {
					if (this._children) {
						for (var i =0;i<this._children.length;i++){
							var oChild = this._children[i];
							oChild._hideNodeCell();
						}
					}
					
					UITableRow.removeElement(this._elRow);

					this._elRow    = null;
					this._elButton = null;
					this._elIcon   = null;
					this._elText   = null;
					this._elCheck  = null;
				}

			},

			_refreshNode		: function () {
				if (!this._elRow) {
					return;
				}
				var fn1 = "";
				if (this._hasChild	|| (this._children != null && this._children.length > 0)) {
					if (this._expanded) {
						fn1 = sw2.ResLibPath + "/images/treeview/tree_node_opened.gif";
					} else {
						fn1 = sw2.ResLibPath + "/images/treeview/tree_node_closed.gif";
					}
				} else {
					fn1 = sw2.ResLibPath + "/images/common/blank.gif";
				};

				UIImg.setSrc(this._elButton,fn1);

				UILabel.setText(this._elText,this.getText());

				if (this._elCheck != null) {
					UICheck.setChecked(this._elCheck,this.getChecked());
				};

				if (this._elIcon != null) {
	   				fn1 = this.getIcon();
	                if (this._hasChild	|| (this._children != null && this._children.length > 0)) {
	    				if (this._expanded && this.getExpandedIcon()) {
							fn1 = this.getExpandedIcon();
						}
	                } 
					UIImg.setSrc(this._elIcon,fn1);
	 			}
			},

			collapse	: function() {
				if (!this._expanded) {
					return;
				};

				var tree = this.getTreeView();

				var evt = new W.TreeNodeCollapsing(tree,this);
				tree.notifyEvent(evt);
				if (evt.getResult() == 1) {
					return;
				}

				for (var i = 0; i<this._children.length;i++) {
					this._children[i]._hideNodeCell();
				}
				this._hasChild = false;			
				this._expanded = false;
				this._refreshNode();

				tree.notifyEvent(new W.TreeNodeCollapsed(tree,this));
			},

			expand		: function() {
				if (this._expanded) {
					return;
				}
				if (this._children.length>0 || this._hasChild) {
					var tree = this.getTreeView();

					var evt = new W.TreeNodeExpanding(tree,this);
					tree.notifyEvent(evt);
					if (evt.getResult() == 1) {
						return;
					}

					var hasChild = false;
					for (var i = 0; i<this._children.length; i++) {
						this._children[i]._showNodeCell();
						hasChild = true;
					}

					this._hasChild = hasChild;
					if (hasChild) {
						this._expanded = true;
					}
					this._refreshNode();

					tree.notifyEvent(new W.TreeNodeExpanded(tree,this));
				}
			},

			getText : function() {
				return this._text;
			},

			setText : function(text) {
				this._text = text;
				if (this._elText) {
					UIElement.setInnerText(this._elText,text);
				}
			},

			getTreeView		: function() {
				return this._nodes?this._nodes._owner:null;
			},

			toString : function() {
				return this.getText() + "\nlevel: " + this.getLevel();
			}

		},
		name		: "sw2.widget.TreeNode",
	    superc      : sw2.Persistent,
		statics		: {
			_initialize : function() {
				Component.registerComponentTag(this,"TreeNode");
			},
			_defineProperties	: function(propInfo) {
	            propInfo.put("icon", String);
	            propInfo.put("text", String);
	            propInfo.put("expandedIcon", String);
	            propInfo.put("checkable", Boolean);
	            propInfo.put("checked", Boolean);
			}
	    },
		instances	: {

		}
	});

	System.defineClass({
		name		: "sw2.widget.TreeNodes",
		superc		: sw2.Component,
		statics		: {
		},
		instances	: {
			_roots	: null,

			_initialize : function (treeview) {
				System.execMethod(this,"_initialize",[treeview],sw2.Component);	
				this._roots = new Array();
			},

			getRootNodes : function(){
				var roots = new Array();
				for (var i=0;i<this._roots.length;i++){
					roots.push(this._roots[i]);
				}
	            return roots;
			},

			add			: function(node,parent) {
				if (node._nodes) {
					return;
				}
				
				if (parent && !this.contains(parent)) {
					return;
				}

				if (parent && node.getParent() == parent) {
					return;
				}

				node._nodes = this;
				if (parent) {
					parent._children.push(node);
					node._parent = parent;
					parent._refreshNode();
					if (parent._expanded) {
						node._showNodeCell();
					}
				} else {
					this._roots.push(node);
					node._showNodeCell();
				}

			},

			addFirst	: function(node,parent) {
				if (node._nodes) {
					return;
				}
				
				if (parent && !this.contains(parent)) {
					return;
				}

				if (parent && node.getParent() == parent) {
					return;
				}

				node._nodes = this;
				if (parent) {
					parent._children.insertAt(node,0);
					node._parent = parent;
					parent._refreshNode();
					if (parent._expanded) {
						node._showNodeCell();
					}
				} else {
					this._roots.insertAt(node,0);
					node._showNodeCell();
				}
			},

			insert		: function(node,ref){
				if (node._nodes) {
					return;
				}

				if (!this.contains(ref)) {
					return;
				}

				node._nodes = this;
				var parent = ref.getParent();

				if (parent) {
					parent._children.insertBefore(node,ref);
					node._parent = parent;
					parent._refreshNode();
					if (parent._expanded) {
						node._showNodeCell();
					}
				} else {
					this._roots.insertBefore(node,ref);
					node._showNodeCell();
				}
			},

			remove		: function(node) {
				if (this.contains(node)) {
					node._hideNodeCell();
					
					var p = node.getParent();
					if (p) {
						p._children.remove(node);
					} else {
						this._roots.remove(node);
					}
					node._nodes = null;
				}
			},

			clear		: function() {
			},

			contains	: function(node) {
				var root = node;
				while (root.getParent()) {
					root = root.getParent();
				}
				return this._roots.contains(root);
			},

			getRootNodesCount	: function() {
				return this._roots.length;
			},

			loadFromArray	: function(oArray,oParent) {
				this.beginUpdate();
				for (var i =0;i<oArray.length;i++) {
					var oHash = oArray[i];
					
					var text = oHash["text"];
					var hasChild = oHash["hasChild"];
					var icon = oHash["icon"];
					var expandedIcon = oHash["expandedIcon"];
					var checkable = oHash["checkable"];
					var checked = oHash["checked"];

					var oNode = new W.TreeNode()
					if (text) {
						oNode.setText(text);
					}
					if (hasChild) {
						oNode.setHasChild(hasChild);
					}
					if (icon) {
						oNode.setIcon(icon);
					}
					if (expandedIcon) {
						oNode.setExpandedIcon(expandedIcon);
					}
					if (checkable) {
						oNode.setCheckable(checkable);
					}
					if (checked) {
						oNode.setChecked(checked);
					}
					this.add(oNode,oParent);

					var children = oHash["children"];
					if (children) {
						this.loadFromArray(children,oNode);
					}

				}
				this.endUpdate();
			}
		}
	});

	return TreeViewItem;
	
});	
