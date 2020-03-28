define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
],	function(Class, Control){
	var CheckBoxVisual = Class.declare(Control.ControlVisual,{
        paint : function(g,x,y,w,h,d){        
            g.beginPath();
            g.strokeStyle = this.color;
            g.lineWidth = 2;
            g.moveTo(x + 1, y + 2);
            g.lineTo(x + w - 3, y + h - 3);
            g.stroke();
            g.beginPath();
            g.moveTo(x + w - 2, y + 2);
            g.lineTo(x + 2, y + h - 2);
            g.stroke();
            g.lineWidth = 1;
        }
	});
	
	var CheckBox = Class.declare([Control], {
	});
	
	return CheckBox;
});
