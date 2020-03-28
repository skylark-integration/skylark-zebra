define([
	"qscript/lang/Enum"
],function(Enmu) {
	
	//ControlStyle プロパティは，コントロールがマウスイベントをキャプチャするかどうか，コントロールが固定サイズかどうかなどの
	//コントロールの各種の属性を調べることができます。ControlStyle プロパティにはこれらの属性を示す一連のスタイルフラグが入っています。
	//CaptureMouse:マウスをクリックしたとき，コントロールはマウスイベントをキャプチャする。
	//
	var ControlStyle =  Enum.declare({
		"-options-"	:	["CaptureMouse","Movable","Focusable","Scrollable","CanHaveChildren","CanHaveOneChild"]
		});

	return ControlStyle;
	
});	
