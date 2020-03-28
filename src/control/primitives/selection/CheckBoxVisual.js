define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/primitives/PanelView",
	"qfacex/windows/controls/primitives/ControlView",
],	function(Class, PanelView,ControlView){

	var CheckBoxBoxVisual = Class.declare(PanelView,{
		"-protected-"	:	{
	        "_drawContent" : function(gdi){
	        	var p = this.parent;
	        	if (!p) {
	        		return;
	        	}	
	        	var c = p.control;
	        	if ( c.checked) {
		        	var x = this.clientLeft,
		        		y = this.clientTop,
		        		w = this.clientWidth,
		        		h = this.clentHeight;
		        		
		            gdi.beginPath();
		            gdi.strokeStyle = this.foreground;
		            gdi.lineWidth = 2;
		            gdi.moveTo(x + 1, y + 2);
		            gdi.lineTo(x + w - 3, y + h - 3);
		            gdi.stroke();
		            gdi.beginPath();
		            gdi.moveTo(x + w - 2, y + 2);
		            gdi.lineTo(x + 2, y + h - 2);
		            gdi.stroke();
		            gdi.lineWidth = 1;
		        }    
	        }
		}
		
	});
	
	var CheckBoxVisual = Class.declare(ControlView,{
	
		"-protected-"	:	{
		
		},
		
		"-public-"	:	{
			"-attributes-"	:	{
				"template"	:	{
					
					"default"	:	{
						"layout"	:	ColumnLayout,
						"children"	:	[
							{
								"name"	:	"box",
								"type"	:	CheckBoxBoxVisual
							},
							{
								"name"	:	"label"
								"type"	:	LabelVisual
							
							}
						
						]
					}
				}
			}
		}
	
	});
	
	return CheckBoxBoxVisual;
});
