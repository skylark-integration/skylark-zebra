define([
	"qscript/lang/Class",
	"qscriptx/layout/Region"
	"qscriptx/layout/BorderLayout",
	"qfacex/windows/control/primitives/PanelVisual"
],function(Class,Region,BorderLayout,PanelVisual) {
	var ScrollBarVisual = Class.declare(PanelVisual,{
		"-protected-"	:	{
			"_incBtnClicked"	:	function(ve){
				ve.stopPropagation();
				this.position = this.position + this.smallChange;
			},
			"_decBtnClicked"	:	function(ve){
				ve.stopPropagation();
				this.position = this.position - this.smallChange;
			},
			"_knobBtnClicked"	:	function(ve){
				ve.stopPropagation();
				this.position = this.position - this.smallChange;
			},
			"_knobBtnMoving"	:	function(ve){
				
			},
			"_clicked"	:	function(ve){
			},
	        "_layout" : function(target){
	            this.decBtn.size = this._calcDecBtnSize();
	            this.decBtn.location = Location.x0y0;

	            this.incBtn.size = this._calcIncBtnSize();
	            this.incBt.location = this._calcIncBtnLocation();
	            
	            this.knobBtn.size = this._calcKnobBtnSize();
	            this.knobBtn.location = this._calcIncBtnLocation();
	        }
		
		},
		
		"-attributes-"	:	{
	        "min"	:	{
	        	default	:	0
	        },
	        "max"	:	{
	        	default	:	100
	        },
	        "range"	:	{
	        	//max-min
	        
	        },
	        "smallChange" :	{
	        	default	:	1
	        },
	        "largeChange" :	{
	        	default	:	10
	        },
	        "pageSize" :	{
	        	default	:	20
	        },
	        "position" :	{
	        	default	:	0
	        }
		},
		
		"-methods-"	:	{
		},
		
		constructor	:	function(t){
		}
	
	});
	
	return ScrollBarVisual;
	
});	
