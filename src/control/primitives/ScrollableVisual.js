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
	"qfacex/windows/control/primitives/PanelVisual",
	"qfacex/windows/control/primitives/HorzScrollBarVisual",
	"qfacex/windows/control/primitives/VertScrollBarVisual"
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
	PanelVisual,
	HorzScrollBarVisual,
	VertScrollBarVisual
) {

	var ScrollableVisual = = Class.declare(PanelVisual,{
		"-protected-"	: {
						
			
			layout	:	function (target){
			    var sman   = (this.scrollObj == null) ? null : this.scrollObj.scrollManager,
					right  = this.clientRight, 
					top    = this.clientTop, 
					bottom = this.clientBottom, 
					left   = this.clientLeft,
					ww     = this.width  - left - right,  maxH = ww, 
					hh     = this.height - top  - bottom, maxV = hh,
					so     = this.scrollSize,
					vps    = this.vertScrollBar == null ? { width:0, height:0 } : this.vertScrollBar.preferredSize,
					hps    = this.horzScrollBar == null ? { width:0, height:0 } : this.horzScrollBar.preferredSize;

			    // compensate scrolled vertical size by reduction of horizontal bar height if necessary
			    // autoHidded scrollers don't have an influence to layout
			    if (this.horzScrollBar != null && this.autoHide === false &&
					  (so.width  > ww ||
					  (so.height > hh && so.width > (ww - vps.width))))
			    {
					maxV -= hps.height;
			    }
			    maxV = so.height > maxV ? (so.height - maxV) :  -1;
			    
			    // compensate scrolled horizontal size by reduction of vertical bar width if necessary
			    // autoHidded scrollers don't have an influence to layout
			    if (this.vertScrollBar != null && this.autoHide === false &&
					  (so.height > hh ||
					  (so.width > ww && so.height > (hh - hps.height))))
			    {
					maxH -= vps.width;
			    }
			    maxH = so.width > maxH ? (so.width - maxH) :  -1;
			   
			    var sy = this.scrollTop, sx = this.scrollLeft;
			    if (this.vertScrollBar != null) {
					if (maxV < 0) {
					    if (this.vertScrollBar.isVisible()){
							this.vertScrollBar.visible = false;
							sman.scrollTo(sx, 0);
							this.vertScrollBar.position=0;
					    }
					    sy = 0;
					} else {
						this.vertScrollBar.visible = true;
					}	
			    }

			    if (this.horzScrollBar != null){
					if (maxH < 0){
					    if (this.horzScrollBar.isVisible){
							this.horzScrollBar.setVisible(false);
							this.scrollTo(0, sy);
							this.horzScrollBar.position = 0;
					    }
					} else {
						this.horzScrollBar.visible = true;
					}	
			    }


			    if (this.horzScrollBar != null && this.horzScrollBar.isVisible){
					this.horzScrollBar.location = new Location(left, this.height - bottom - hps.height);
					this.hBar.size = new Size(ww - (this.vertScrollBar != null && this.vertScrollBar.isVisible ? vps.width : 0), hps.height);
					this.horzScrollBar.max = maxH;
			    }

			    if (this.vertScrollBar != null && this.vertScrollBar.isVisible){
					this.vertScrollBar.setLocation(this.width - right - vps.width, top);
					this.vertScrollBar.size = new Size(vps.width, hh -  (this.horzScrollBar != null && this.horzScrollBar.isVisible ? hps.height : 0));
					this.vertScrollBar.max = maxV;
			    }
			}
		},

		"-public-"	:	{		
			"-attributes-"	:	{
			},
			
			"-methods-"	: {
			}
		},

		"-constructor-"	:	{
			"initialize"	:	[
				function() {
				}
			]
		}	
	
	});
		
	
	return ScrollableVisual;
	
});	
