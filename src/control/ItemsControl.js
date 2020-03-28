define([
	"qscript/lang/Class",
	"qfacex/windows/control/Control",
	"qscript/data/collection/Collection"
],function(Class,Control,Collection) {

	var ItemsControl = Class.declare(Control,{
		//<<summary
		//アイテムのコレクションの表現に使用できるコントロールを表します。
		//Represents a control that can be used to present a collection of items.
		//summary>>
		"-protected-" : {
		},
		
		"-attributes-" : {
			hasItems	: {
				//ItemsControlに項目が含まれているかどうかを示す値を取得します。
				//Gets a value that indicates whether the ItemsControl contains items.
				type : Boolean
			},
			isTextSearchCaseSensitive : {
				//項目を検索するときにケースが条件であるかどうかを示す値を取得又は設定します。
				//Gets or sets a value that indicates whether case is a condition when searching for items.
				type : Boolean
			}
			
			isTextSearchEnabled : function(){
				//Gets or sets a value that indicates whether TextSearch is enabled on the ItemsControl instance.
				type : Boolean
			},
			
			"itemGap"	:	{
				"type"	:	Number
			},
			
			items : {
				//<summary>
				// ItemsControlコンテンツを生成するために使用する項目を取得します。
				//</summary>
				type	:	Collection 
			},
			
			
			itemTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return ItemsControl;
	
});	
