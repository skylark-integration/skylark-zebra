define([
	"qscript/lang/Class",
	"qfacex/windows/controlss/Control"
],function(Class,Control) {

	var ContentKind = ContentControl.ContentKind = Enum.declare({
		"-options-"	:	["Text","Container"]
		});

	var ContentControl = Class.declare(Control,{
		"-public-"	:	{
			"-attributes-" : {
				content : {
					type : Object
				},
				contentKind : {
					type : ContentKind
				},
			}
		},	
		
		"-constructor-"	: {
			"initialize"	:	function() {
			}
		}	
	});
	
	
	return ContentControl;
	
});	
