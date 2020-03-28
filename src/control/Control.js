define([
	"qscript/lang/Class",
	"qscript/lang/Enum",
	"qscript/util/collection/Set",
	"qscript/data/styles/Pen",
	"qscript/data/styles/Brush",
	"qscript/data/styles/Font",
	"qscript/data/styles/Border",
	"qscript/util/IOwned",
	"qscript/util/IOwner",
	"qscriptx/layout/IContained",
	"qscriptx/layout/IContainer",
	"qscriptx/input/IMouseEventHost",
	"qscriptx/input/IKeyEventHost",
	"qscriptx/input/IDragDropEventHost",
	"qscriptx/input/IFocusEventHost",
	"qscriptx/input/IMoveEventHost",
	"qscriptx/input/IResizeEventHost",
	"qscriptx/input/ResizeOrient",
	"qfacex/windows/controls/primitives/ControlVisual",
	"qfacex/windows/control/primitives/ControlStyle",
	"qfacex/windows/control/primitives/ControlStyles",
	"qfacex/windows/control/primitives/ControlState",
	"qfacex/windows/control/primitives/ControlArea"
],function(
	Class,
	Enum,
	sets,
	Stroke,
	Brush,
	Font,
	Border,
	IOwned,
	IOwner,
	IContained,
	IContainer,
	IMouseEventHost,
	IKeyEventHost,
	IDragDropEventHost,
	IFocusEventHost,
	IMoveEventHost,
	IResizeEventHost,
	ResizeOrient,
	ControlVisual,
	ControlStyle,
	ControlStyles,
	ControlState,
	ControlArea
) {

	var InternalState = Enum.declare({
		"-options-"	:	"Creating","Layouting","Painting","Destroying"
	});
	
	var ControlContext = Control.ControlContext = Class.declare(Context,{
	
	
	});
	
	var Control = Class.declare([IContained,IContainer,IMouseEventHost,IKeyEventHost,IFocusEventHost,IDragDropEventHost,IMoveEventHost,IResizeEventHost,IOwned,IOwner],{
		"-protected-"	: {
			_offsetLeftGetter	:	function(){
				var v = this.vomNode;
				return 
			},

			_saveMouseDownInfo	: function(x,y) {
				this._startLocation = this.location;
				this._startSize = this.size);

				this._mouseDownX = x;
				this._mouseDownY = y;
				var pt =this.displayLocation();
				this._deltaX = x - pt.x;
				this._deltaY = y - pt.y;
			},

			_clearMouseDownInfo	: function() {
				this._startLocation = null;
				this._startSize = null;
				this._mouseDownX = -1;
				this._mouseDownY = -1;
			},


			_validateAutoMove	: function(/*Object*/evtArgs) {
				var ca = this.hitTest(evtArgs.position);
				return  (ca == ControlArea.Client) 
			},

			_validateAutoResize : /*ResizeOrient*/function(/*Object*/evtArgs) {
				var orient = null;
				var ca = this.hitTest(evtArgs.position);
				switch (ca) {
					case ControlArea.LeftBorder :
							orient =  ResizeOrient.Left;
							break;
					case ControlArea.TopBorder :
							orient =  ResizeOrient.Top;
							break;
	                case ControlArea.RightBorder :
							orient =  ResizeOrient.Right;
							break;
	                case ControlArea.BottomBorder :
							orient =  ResizeOrient.Bottom;
							break;
	                case ControlArea.LeftTopCorner :
							orient =  ResizeOrient.LeftTop;
							break;
	                case ControlArea.RightTopCorner :
							orient =  ResizeOrient.RightTop;
							break;
	                case ControlArea.LeftBottomCorner :
							orient =  ResizeOrient.LeftBottom;
							break;
	                case ControlArea.RightBottomCorner : 
							orient =  ResizeOrient.RightBottom;
							break;
				}
				return orient;
			},

			
			_handleInputEvent	:	function(/*InputEvent*/voEvt)	{
				var evtArgs = {
					"target"	:	this,
					"ctrlKey"	:	ctrlKey,
					"shiftKey"	:	shiftKey,
					"altKey"	:	altKey,
					"cmdKey"	:	cmdKey
				};
				if (voEvt.isInstanceOf(IMouseEventHost._MouseEvent) {
					// the event is mouse event
					Object.mixin(evtArgs,{
						"leftButton"	:	voEvt.leftButton,
						"middleButton"	:	voEvt.middleButton,
						"rightButton"	:	voEvt.rightButton,
						"position"		:	voEvt.position
					});
					if (voEvt.isInstanceOf(IMouseEventHost.MoudeDownEvent){
						this._doMouseDown(evtArgs);
					} else if (voEvt.isInstanceOf(IMouseEventHost.MoudeMoveEvent){
						this._doMouseMove(evtArgs);
					
					} else if (voEvt.isInstanceOf(IMouseEventHost.MoudeUpEvent){
						this._doMouseUp(evtArgs);
					
					} else if (voEvt.isInstanceOf(IMouseEventHost.MoudeEnterEvent){
						this._doMouseEnter(evtArgs);
					
					} else if (voEvt.isInstanceOf(IMouseEventHost.MoudeLeaveEvent){
						this._doMouseLeave(evtArgs);
					}
				
				} else if (voEvt.isInstanceOf(IKeyEventHost._KeyEvent) {
					// the event is key event
				
				} else if (voEvt.isInstanceOf(IFocusEventHost._FocusEvent) {
					// the event is focus event
				
				} else if (voEvt.isInstanceOf(IDragDropEventHost._DragEvent) {
					// the event is drag event
				
				}
				if (ctrlEvt) {
					this.emit(ctrlEvt);
				}
				voEvt.stopPropagation();
				
			},
			
			//handle mouse event
			_doMouseDown	: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.MoudeDownEvent) {
					var cEvt = new IMouseEventHost.MoudeDownEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
				if (evtArgs.leftButton) {
					var css = this.controlStyles;

					if (css.contains(ControlStyle.Resizable)) {
						if (this._validateAutoResize(x,y,mouse._mouseinEl)) {
							W.DragObject._dragInit(this,W.DragObject.DT_RESIZE);
							return;
						}
					}

					if (css.contains(W.ControlStyle.Movable)) {
						if (this._validateAutoMove(x,y,mouse._mouseinEl)) {
							W.DragObject._dragInit(this,W.DragObject.DT_REPOS);
							return;
						}
					}
				}
			},
			
			_doMouseMove	: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.MoudeMoveEvent) {
					var cEvt = new IMouseEventHost.MoudeMoveEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
				var cs = this.controlStyles;
				var ca = null;
			 	if (cs.contains(ControlStyle.Resizable)) {
					ca = this._validateAutoResize(x,y,mouse._mouseinEl);
				}

				if (!ca && cs.contains(ControlStyle.Movable)) {
					ca = this._validateAutoMove(x,y,mouse._mouseinEl)
				}

				if (ca) {
					desk.setCurrentCursor(ca);
				} else {
					desk.setCurrentCursor(this.getCursor());
				}
			},

			_doMouseUp	: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.MoudeUpEvent) {
					var cEvt = new IMouseEventHost.MoudeUpEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			
			},

			_doMouseEnter	: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.MoudeEnterEvent) {
					var cEvt = new IMouseEventHost.MoudeEnterEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doMouseLeave	: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.MoudeLeaveEvent) {
					var cEvt = new IMouseEventHost.MoudeLeaveEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doClick		: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.ClickEvent) {
					var cEvt = new IMouseEventHost.ClickEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDblClick		: function(/*Object*/evtArgs) {
				if (this.listened(IMouseEventHost.DblClickEvent) {
					var cEvt = new IMouseEventHost.DblClickEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

	        _HandleStateChanged = function(o,n){
	            var id = this.idByState(n), b = false;

	            for(var i=0; i < this.kids.length; i++) {
	                if (this.kids[i].parentStateUpdated) {
	                    this.kids[i].parentStateUpdated(o, n, id);
	                }
	            }

	            if (this.border && this.border.activate) b = this.border.activate(id) || b;
	            if (this.view   && this.view.activate)  b = this.view.activate(id) || b;
	            if (this.bg     && this.bg.activate)   b = this.bg.activate(id) || b;

	            if (b) this.repaint();
	        },
	        

			
			//handle focus event
			_doGetFocus		: function(/*Object*/evtArgs) {
				if (this.listened(IFocusEventHost.GetFocusEvent) {
					var cEvt = new IFocusEventHost.GetFocusEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doLostFocus	: function(/*Object*/evtArgs) {
				if (this.listened(IFocusEventHost.LostFocusEvent) {
					var cEvt = new IFocusEventHost.LostFocusEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			//handle key event
			_doKeyDown		: function(/*Object*/evtArgs) {
				if (this.listened(IKeyEventHost.KeyDownEvent) {
					var cEvt = new IKeyEventHost.KeyDownEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doCharInput	: function(/*Object*/evtArgs) {
				if (this.listened(IKeyEventHost.CharInputEvent) {
					var cEvt = new IKeyEventHost.CharInputEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doKeyUp		: function(/*Object*/evtArgs) {
				if (this.listened(IKeyEventHost.KeyUptEvent) {
					var cEvt = new IKeyEventHost.KeyUptEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			//handle dnd event
			_doDragEnter		: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragEntertEvent) {
					var cEvt = new IDragDropEventHost.DragEntertEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDragMove		: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragMoveEvent) {
					var cEvt = new IDragDropEventHost.DragMoveEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDragLeave	: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragLeaveEvent) {
					var cEvt = new IDragDropEventHost.DragLeaveEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDragDrop		: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragDropEvent) {
					var cEvt = new IDragDropEventHost.DragDropEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDragStart	: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragStartEvent) {
					var cEvt = new IDragDropEventHost.DragStartEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doDragEnd		: function(/*Object*/evtArgs) {
				if (this.listened(IDragDropEventHost.DragEndEvent) {
					var cEvt = new IDragDropEventHost.DragEndEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},
			
			_doMoving	:	function(/*Object*/evtArgs){
				if (this.listened(IMoveEventHost.MovingEvent) {
					var cEvt = new IMoveEventHost.MovingEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
				var positon = evtArgs.positon,
					downPosition = evtArgs.downPosition,
					location = this.location;
					
				var dx = positon.x-downPosition.x,
					dy = positon.y-downPosition.y;

				location.move(dx,dy);
				
				this.location = location;
			},

			_doMoved	:	function(/*Object*/evtArgs){
				if (this.listened(IMoveEventHost.MovedEvent) {
					var cEvt = new IMoveEventHost.MovedEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},

			_doResizing	:	function(/*Object*/evtArgs){
				if (this.listened(IResizeEventHost.ResizingEvent) {
					var cEvt = new IResizeEventHost.ResizingEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}
				
				var positon = evtArgs.positon,
					downPosition = evtArgs.downPosition,
					orient = evtArgs.orient,
					bounds = this.bounds;
				
				var nLeft  = bounds.x,
					nTop   = bounds.y,
					nWidth = bounds.width,
					nHeight = bounds.height,
					nRight = nLeft + nWidth,
					nBottom = nTop + nHeight,

				var dx = positon.x-downPosition.x,
					dy = positon.y-downPosition.y;

				switch (orient) {
					case ResizeOrient.resize :
						{
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							break;
						};
					case ResizeOrient.wresize :
						{
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
					case ResizeOrient.nresize :
						{
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							break;
						};
					case ResizeOrient.sresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							break;
						};
					case ResizeOrient.neresize :
						{
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							break;
						};
					case ResizeOrient.nwresize :
						{
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
					case ResizeOrient.seresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							break;
						};
					case ResizeOrient.swresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
				}
				

				this.setBounds(nLeft,nTop,nWidth,nHeight);
			},

			_doResized	:	function(/*Object*/evtArgs){
				if (this.listened(IResizeEventHost.ResizedEvent) {
					var cEvt = new IResizeEventHost.ResizedEvent(evtArgs);
					this.emit((cEvt);
					if (cEvt.defaultPrevented) {
						return;
					}
				}	
			},


			_doCanSetParent	: function(oParent){
				return true;
			},

			_doEndUpdate	: function() {
				this._layout();
			},

			"_parseControl"		:	function(o,name) {
				var ctoc = v.type;
				if (Class.isClassType(ctoc) && ctoc.inheritsFrom(Control)) {
					var c = new ctoc(this);
					c.readFromPlainObject(attrs);
				}
				
				o.name = c.visual;
			
			},
			
			
			"_buildRendering"	:	function(){
				this.visual = new ControlVisual(this);
				var tpl = this.template;
				if (tpl) {
				
					var content = Object.clone(tpl);
					
					this._parseControl(content);
					
					this.visual.readFromPlainObject(content);
				
				}
			},
			
			_layout : function(bInvalidate) {
				if (this.isUpdating()) {
					return ;
				}
				this._ncSizeCalced = false;

				if (this.getDock() != W.Dock.none) {
					var p = this.getParent();
					if (p) {
						p._requestDock();
					}
				}
				if (this.getWidth() != this._oldWidth || this.getHeight()!=this._oldHeight) {
					this._oldWidth = this.getWidth();
					this._oldHeight = this.getHeight();
	            	this._doResize();
				}
			}
		},
		
		"-public-"	:	{
			"-attributies-" :  {
				"location"	:	{
					"type"	:	Location,
					default	:	Location.Zero
				},
				
				"size"	:	{
					"type"	:	Size,
					"invalidate":	true					
				},
				"padding"	:	{
					"type"	:	Padding,
					default	:	Padding.Zero,
					"invalidate":	true
					
				},
				
				"scroll"	:	{
				
				},
				
				"border" : {
					"type" 		: 	Border,
					"invalidate":	true
				},
				
				"background" : {
					"type"		:	ControlBackground,
					"repaint"	:	true
				},
				"font" : {
					"type" 		: 	ControlFont,
					"repaint"	:	true
				},
				"scrollbar"	:	{
				},
				"cursor" : {
				},

				"enabled" : {
					"type" 		: 	Boolean,
					"repaint"	:	true
				},
				
				"visibility"	:	{
					//この要素の ユーザー インターフェイス (UI) 表現を取得または設定します。 
					"type" 		: 	Boolean,
					"invalidate":	true
				},
				
				"controlStyle"	:	{
					"type"	:	ControlStyle,
				
				},
				
				"controlState"	:	{
					"type"	:	ControlState,
					"repaint"	:	true
				},
				
				"controlTemplate"	:	{
				
				}
			},
			"-events-"	:	{
			
			},
			"-methods-" : {
				/**
				 *
				 */
				"invalidate"	:	function(){
					this._layout();
				},
				
				"repaint"	:	function(x,y,w,h){
					if (this.isVisible()) {
						var display = this.getDisplay();
			            display.paintManager.repaint(this.visual, x, y, w, h);				
					}
				},
				
				"beginInit" : function() {
				},
				
				"endInit" : function() {
				},
				
				"focus"	: function() {
				},
				
				"isVisible"	:	function() {
					return  true;
				},
				
				findDisplayLocation	:	function(){
				
				},
				
				"fromPlainObject"	:	function(/*Object*/store){
				
				
				
				},
				
				findVisualParent	:	function(){
					//コントロールのビジュアル親コントロールすべてを取得する
					var p,v = this.visual.parent;
					while (v) {
						if (v.control) {
							p = v.control;
							break;
						}
					}
					return p;
				},
				
				findVisualChildren	:	function(){
					//コントロールのビジュアル子コントロールすべてを取得する
				},
				
				"calcVisibleArea" : function(r) {
					//コントロールの可視領域を判定する
					var c = this;
				    if (c.width > 0 && c.height > 0 && c.isVisible()){
				        var p = c.parent, px = -c.x, py = -c.y;
				        if (r == null) r = { x:0, y:0, width:0, height:0 };
				        else r.x = r.y = 0;
				        r.width  = c.width;
				        r.height = c.height;

				        while (p != null && r.width > 0 && r.height > 0) {
				            var xx = r.x > px ? r.x : px, yy = r.y > py ? r.y : py;

				            r.width  = Math.min(r.x + r.width, px + p.width) - xx,
				            r.height = Math.min(r.y + r.height, py + p.height) - yy;
				            r.x = xx;
				            r.y = yy;

				            px -= p.x;
				            py -= p.y;
				            p = p.parent;
				        }
				        return r.width > 0 && r.height > 0 ? r : null;
				    }
				    return null;
				},
				
				"pointToDisplay"	:	function(p){
				},
				
				"pointFromDisplay"	:	function(p){
				},
				
				"hitTest"	: function(x,y) {
					var lborder = this.leftBorderWidth,
						tborder = this.topBorderWidth,
						rborder = this.rightBorderWidth,
						bborder = this.bottomBorderWIdth;

					var ctop	= this.clientTop,
						cleft   = this.clientLeft,
						cwidth  = this.clientWidth,
						cheight = this.clientHeight;
					
					var width   = this.width,
						height  = this.height;

					var deskPos = this.displayLocation;
					var dx = deskPos.x;
					var dy = deskPos.y;

					var de = x - dx;
					var dw = dx + width - x;
					var dn = y - dy;
					var ds = dy + height - y;
					if (de>=0 && de < lborder) {
						if (dn>=0 && dn < tborder) {
							return ControlArea.LeftTopCorner;
						} else if (ds>=0 && ds < bborder) {
							return ControlArea.LeftBottomCorner;
						} else if (dn>0 && ds>0) {
							return ControlArea.LeftBorder;
						}
					} else if (dw>=0 && dw < lborder) {
						if (dn>=0 && dn < tborder) {
							return ControlArea.RightTopCorner;
						} else if (ds>=0 && ds < bborder) {
							return ControlArea.RightBottomCorner;
						} else if (dn>0 && ds>0) {
							return ControlArea.RightBorder;
						}
					} else if (de>=0 && dw>=0 && dn>=0 && dn < tborder) {
						return ControlArea.TopBorder;

					} else if (de>=0 && dw>=0 &&  ds>=0 && ds < bborder)  {
						return ControlArea.BottomBorder;

					} else if (de>=0 && dw>=0 && dn>=0 && dn < ctop)  {
						return ControlArea.TitleBar;

					} else if (de>=0 && dw>=0 &&  ds>=0 && ds < height-ctop-cheight)  {
						return ControlArea.HorzScrollBar;
					
					} else if (dn>=0 && ds>=0 &&  dw>=0 && dw < width-cleft-cwidth)  {
						return ControlArea.VertScrollBar;

					} else if (de>=0 && dw>=0 && dn>=0 && ds>=0) {
						return ControlArea.Client;
					} 

					return null;
				},
				
				
				"readFromPlainObject"	:	function(/*PlainObject*/store,/*IOwner*/owner){
					//var store = {
					//	"type"		:	TabControl,
					//	"layout"	:	FormLayout,
					//	"children"	:	{
					//		"name1"	:	{
					//			"type"		:	Button,
					//			"location"	:	"3,3",
					//			"size"		:	"20,10"
					//		},
					//		"name2"	:	{
					//		
					//		
					//		
					//		}
					//	}
					//
					//
					//}							
					var attrsStore = Object.mixin({},store),
						children = store.children,
						attrs = {};
					delete attrsStore.children;
					
					for (var attrName in attrsStore) {
						var attrInfo  = attrsStore[attrName],attrValue;
						if (attrInfo.type) {
					}
					
					this._setupAttributeValues(attrs);
					
					for (var name in children) {
						var childStore = Object.mixin({},children[name]),
							ctor = childStore.type;
						delete 	childStore.type;
						if (ctor) {
							var childControl = new ctor(owner,{"name":name});
							childControl.parent = this;
							childControl.loadFromStore(childStore);
						}	
					}
					
				}
			}
			
		},	

		"-constructor-"	:	{
			"initialize"	:	[
				function(){	
					this.overload(null,{});
				},
				function(/*Control*/owner){
					this.overload(owner,{});
				},
				function(/*Control*/owner,/*Object*/attrs){
					this._buildRendering();
					this._setupAttributeValues(attrs);
					this.owner = owner;
				}
			]
		}
	
	});
	
	
	return Control;
	
});	
