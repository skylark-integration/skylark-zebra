define([
	"qscript/util/collection/Set",
	"qfacex/windows/control/primitives/ControlState"
],function(Set,ControlState) {
	
	//Creating:
	//LButtonDown:
	//Clicked
	//Focusing
	//Destroying
	//
	//
	//var ControlState = Enum.declare(["Creating","LButtonDown","Clicked","Focusing","Disabled","Destroying",""]);

	return Set.declare({
		"-enum-"	:	ControlState
	});
	
});	
