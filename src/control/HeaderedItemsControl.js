define([
	"qscript/lang/Class",
	"qfacex/windows/control/ItemsControl"
],function(Class,ItemsControl) {
	
	var HeaderedItemsControl  = Class.declare(ItemsControl,{
		//<<summary
		//複数の項目で構成され、ヘッダーを持つコントロールを表します。
		//summary>>
		"-protected-" : {
		},
		
		"-attributes-" : {
			"hasHeader"	: {
				//<<summary
				//この HeaderedItemsControl にヘッダーがあるかどうかを示す値を取得します。
				//summary>>
				type : Boolean
			},
			"header" : {
				//<<summary
				//コントロールにラベルを付ける項目を取得または設定します。
				//summary>>
				type : Object
			},
			
			headerTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return HeaderedItemsControl;
	
});	
