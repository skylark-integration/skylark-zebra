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
	"qfacex/windows/control/primitives/PanelVisual"
],function(Class,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Brush,PanelVisual) {
	var ScrolledEvent = Control.ScrolledEvent = Class.declare(InputEvent,{
		"-attributes-"	:	{
			sx	:	{
				type	:	Number
			},
			sy	:	{
				type	:	Number
			},
		},
		
		"-methods-"	:	{
	        scrollTo : function(x, y){
	            var psx = this.getSX(), psy = this.getSY();
	            if (psx != x || psy != y){
	                this.sx = x;
	                this.sy = y;
	                if (this.updated) this.updated(x, y, psx, psy);
	                if (this.target.catchScrolled) this.target.catchScrolled(psx, psy);
	                this._.scrolled(psx, psy);
	            }
	        },

	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        },
	        scrollXTo : function(v){ 
	        	this.scrollTo(v, this.getSY()); 
	        },
	        scrollYTo : function(v){ 
	        	this.scrollTo(this.getSX(), v); 
	        },
	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        }
		
		}
	
	});
	
	
	var ScrollManagerListeners = Listeners.Class("scrolled");

	var	ScrollManager = Class.declare(null,{
		"-attributes-"	:	{
			sx	:	{
				type	:	Number
			},
			sy	:	{
				type	:	Number
			},
		},
		
		"-methods-"	:	{
	        scrollTo : function(x, y){
	            var psx = this.getSX(), psy = this.getSY();
	            if (psx != x || psy != y){
	                this.sx = x;
	                this.sy = y;
	                if (this.updated) this.updated(x, y, psx, psy);
	                if (this.target.catchScrolled) this.target.catchScrolled(psx, psy);
	                this._.scrolled(psx, psy);
	            }
	        },

	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        },
	        scrollXTo : function(v){ 
	        	this.scrollTo(v, this.getSY()); 
	        },
	        scrollYTo : function(v){ 
	        	this.scrollTo(this.getSX(), v); 
	        }
		},
	
		constructor	:	function (c){
			this.sx = this.sy = 0;
			this._ = new ScrollManagerListeners();
			this.target = c;
		}
	});


	
	return ScrollManager;
	
});	
