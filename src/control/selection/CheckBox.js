define( [
	"qscript/lang/Class",
	"qscript/lang/Object",
	"qscriptx/layout/Alignment",
	"qscriptx/layout/RowLayout",
	"qfacex/windows/controls/ContentControl",
	"qfacex/windows/controls/primitives/PanelVisual",
	"qfacex/windows/controls/primitives/TextVisual",
	"qfacex/windows/controls/primitives/selection/CheckBoxBoxVisual",
],	function(
	Class,
	Object,
	Alignment,
	RowLayout,
	ContentControl,
	PanelVisual,
	TextVisual,
	CheckBoxBoxVisual
){

	var CheckBox = Class.declare([ContentControl], {
		"-protected-"	:	{
		
			"-methods-"	:	{
			
				"_buildContent"	:	function(){
				}
			}
		},
		
	
		"-public-"		:	{
			"-attributes-"	:	{
				"checked"	:	{
					"type"		:	Boolean,
					"default"	:	false
				},
				
				"template"			:	{
					"type"		:	PlainObject,
					"default"	:	{
						"layout"	:	{
							"type"	:	RowLayout,
							"halign":	Alignment.Horz.Left,
							"gap"	:	6
						},	
						"children"	:	[
							{
								"name"	:	"box",
								"type"	:	CheckBoxBoxVisual,
								"valign":	Alignment.Vert.Center
							},
							{
								"name"	:	"content"
								"type"	:	PanelVisual,
								"valign":	Alignment.Vert.Center
							}
						
						]
					}				
				},
				"contentTemplate"	:	{
					"type"		:	TextlVisual
				}
			}
		},	
		
		"-constructor-"	:	{
		}
	});
	
	
	return CheckBox;
});
