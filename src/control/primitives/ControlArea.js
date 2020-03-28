define([
	"qscript/lang/Enum"
],function(Enmu) {
	
	//
	var ControlArea = Enum.declare({
		"-options-"	:	["LeftBorder","TopBorder","RightBorder","BottomBorder",
									"LeftTopCorner","LeftBottomCorner","RightTopCorner","RightBottomCorner",
									"HorzScrollBar","VertScrollBar","TitleBar","StatusBar",
									"Client"]
	});

	return ControlArea;
	
});	
