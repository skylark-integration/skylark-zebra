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
	"qfacex/windows/control/primitives/ScrollableVisual"
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
	ScrollableVisual
) {
	var ControlVisual = = Class.declare(ScrollableVisual,{
		"-protected-"	: {
			
			"_boundsGetter"	: function() {
			},
			
			"_borderGetter"	:	function(){
				var c = this.control,
					state = c.controlState,
					cborder = c.border,
					border = cborder.getStateValue(state);
				if (!border) {
					border = cborder;
				}
				return border;
			},
			
			"_backgroundGetter"	:	function(){
				var c = this.control,
					state = c.controlState,
					cbg = c.background,
					bg = cbg.getStateValue(state);
				if (!bg) {
					bg = cbg;
				}
				return bg;
			},
			
			
			layout	:	function (target){
			}
		},

		"-public-"	:	{		
			"-attributes-"	:	{
				"template"	:	{
				
				}
			},
			
			"-methods-"	: {
			}
		},

		"-constructor-"	:	{
			"initialize"	:	[
				function() {
				},
				function(/*Control*/ c) {
				
				}
			]
		}	
	
	});
		
	
	return ControlVisual;
	
});	
