define([
	"qscript/lang/Class",
	"qscript/lang/PlainObject",
	"qfacex/windows/controlss/Control"
],function(
	Class,
	PlainObject,
	Control
) {

	var ContainControl = Class.declare(Control,{
	    /// <summary>
	    ///     The base class for all controls with a single piece of content.
	    /// </summary>
	    /// <remarks>
	    ///     ContentControl adds Content, ContentTemplate, ContentTemplateSelector and Part features to a Control.
	    /// </remarks>

		"-protected-"	:	{
		
			"-methods-"	:	{
			
				"_buildContent"	:	function(){
				},
				
				"_buildRendering"	:	function(){
					this.overrided();
					this._buildContent();
				},
				
				"_draw"	:	function(gdi){
					this.overrided(gdi);
				}
			}
		},
	    "-public-"	:	{
			"-attributes-" : {
				"layoutType" : {
					"type" 		: 	constructor(Layout),
					"default"	:	FormLayout 
					
				}
			}
		},	
		
		"-constructor-"	:  {
		}
	});
	
	
	return ContainControl;
	
});	
