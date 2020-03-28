define([
	"qscript/lang/Enum"
],function(Enmu) {
	
	//Creating:
	//LButtonDown:
	//Clicked
	//Focusing
	//Destroying
	//
	//
	var ControlState = Enum.declare({
		"-options-"	:	["LButtonDown","Clicked","Focused","Disabled","Moving","Resizing","Dragging"]
		});

	return ControlState;
	
});	
