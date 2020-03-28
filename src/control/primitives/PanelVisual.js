define([
	"qscript/lang/Class",
	"qscript/data/geom/Geometry",
	"qscript/data/geom/Rect",
	"qscript/data/geom/Ellipse",
	"qscript/data/geom/Line",
	"qscript/data/geom/Polyline",
	"qscript/data/geom/Arrow",
	"qscript/data/styles/Pen",
	"qscript/data/styles/Brush",
	"qscript/data/styles/Border",
	"qscript/data/styles/Padding",
	"qface/media/ContainerVisual"
],function(
	Class,
	Geometry,
	Rect,
	Ellipse,
	Line,
	Polyline,
	Arrow,
	Pen,
	Brush,
	Border,
	Padding,
	ContainerVisual
) {
	var PanelVisual = Class.declare(ContainerVisual, {
		// summary:
		//		a Shape object, which knows how to apply
		//		graphical attributes and transformations
		
		"-protected-"	:	{
			/*
			 *@override
			 */
			_clientLeftGetter	:	function() {
				//TODO will be implemented
				return borderWidthLeft + paddingLeft;
			},
			/*
			 *@override
			 */
			_clientTopGetter	:	function() {
				//TODO will be implemented
				return borderWidthTop + paddingTop;
			},
			/*
			 *@override
			 */
			_clientRightGetter	:	function() {
				//TODO will be implemented
				return borderWidthRight + paddingRight + VertScrollBar.width;
			},
			/*
			 *@override
			 */
			_clientBottomGetter	:	function() {
				//TODO will be implemented
				return borderWidthBottom + paddingBottom + HorzScrollBar.height;
			},
			
			"_drawBorder" : function(gdi) {
				var x = 0,
					y = 0,
					width = this.width,
					height = this.height,
					border = this.border,
					borderWidth = border.width,
					borderRadius = border.radius,
					borderColor = border.color,
					dt = borderWidth>1? borderWidth / 2 : 0,
					rect = new Rect(x+dt,y+dt,width-2*dt,height-2*dt,borderRadius),
					pen = new Pen(borderWidth,borderRadius,borderColor);
					
				gdi.applyPen(pen);
				gdi.strokeRect(rect);
			},
			
			"_drawBackground"	: function(gdi) {
				var brush = this.background,
					rect = new Rect(0,0,this.width,this.height);
				gdi.applyBrush(brush);
				gdi.fillRect(rect);
			},
			
			"
			"_draw"	:	function(gdi){
				this._drawBackground(gdi);
				this._drawBorder(gdi);
				this._drawContent(gdi);
			},
			
			"_drawContent"	:	function(gdi){
			
			}
		},
		
		"-public-"	:	{

			"-attributes-" : {
				"border" : {
					"type" : Border
				},
		
				background : {
					"type" : Brush
				},
				
				padding	:	{
					"type"	:	Padding
				}
			},
			
			"-methods-"	:	{
				"drawRaisedRect" : function(g,x1,y1,w,h,d,brightest,middle) {
		            var x2 = x1 + w - 1, y2 = y1 + h - 1;
		            g.setColor(this.brightest);
		            g.drawLine(x1, y1, x2, y1);
		            g.drawLine(x1, y1, x1, y2);
		            g.setColor(this.middle);
		            g.drawLine(x2, y1, x2, y2 + 1);
		            g.drawLine(x1, y2, x2, y2);
				},
				
				"drawSunkenRect" : function(g,x1,y1,w,h,d,brightest,middle) {
		            var x2 = x1 + w - 1, y2 = y1 + h - 1;
		            g.setColor(this.middle);
		            g.drawLine(x1, y1, x2 - 1, y1);
		            g.drawLine(x1, y1, x1, y2 - 1);
		            g.setColor(this.brightest);
		            g.drawLine(x2, y1, x2, y2 + 1);
		            g.drawLine(x1, y2, x2, y2);
		            g.setColor(this.darkest);
		            g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2);
		            g.drawLine(x1 + 1, y1 + 1, x2, y1 + 1);
				},

				"drawEtchedRect" : function(g,x1,y1,w,h,d,brightest,middle) {
		            var x2 = x1 + w - 1, y2 = y1 + h - 1;
		            g.setColor(this.middle);
		            g.drawLine(x1, y1, x1, y2 - 1);
		            g.drawLine(x2 - 1, y1, x2 - 1, y2);
		            g.drawLine(x1, y1, x2, y1);
		            g.drawLine(x1, y2 - 1, x2 - 1, y2 - 1);

		            g.setColor(this.brightest);
		            g.drawLine(x2, y1, x2, y2);
		            g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2 - 1);
		            g.drawLine(x1 + 1, y1 + 1, x2 - 1, y1 + 1);
		            g.drawLine(x1, y2, x2 + 1, y2);
				},

				"drawRaisedRect" : function(g,x1,y1,w,h,d,brightest,middle) {
		            var x2 = x1 + w - 1, y2 = y1 + h - 1;
		            g.setColor(this.brightest);
		            g.drawLine(x1, y1, x2, y1);
		            g.drawLine(x1, y1, x1, y2);
		            g.setColor(this.middle);
		            g.drawLine(x2, y1, x2, y2 + 1);
		            g.drawLine(x1, y2, x2, y2);
				},
				
				"readFromPlainObject"	:	function(/*PlainObject*/store){
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
							childControl.readFromPlainObject(childStore);
						} else `{
							var childControl = childStore;
							childControl.parent = this;
						}
					}
					
				}
				
			}
		}	

	
		"-constructor-"	:	{
		}
	});
		
	return PanelVisual;
	
});	
