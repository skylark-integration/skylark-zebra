define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/primitives/PanelView",
],	function(Class, PanelView){

	var RadioButtonBoxView = Class.declare(PanelView,{
		"-protected-"	:	{
	        "_drawContent" : function(gdi){   
	        	var x = this.clientLeft,
	        		y = this.clientTop,
	        		w = this.clientWidth,
	        		h = this.clentHeight;
	        		
	            gdi.beginPath();            

	            gdi.fillStyle = this.color1;
	            gdi.arc(x + w/2, y + h/2 , w/3 , 0, 2* Math.PI, 1, false);
	            gdi.fill();

	            gdi.beginPath();
	            gdi.fillStyle = this.color2;
	            gdi.arc(x + w/2, y + h/2 , w/4 , 0, 2* Math.PI, 1, false);
	            gdi.fill();
	        }
		
		}
	});
	
	
	return RadioButtonBoxView;
});
