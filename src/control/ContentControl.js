define([
	"qscript/lang/Class",
	"qscript/lang/PlainObject",
	"qfacex/windows/controlss/Control"
],function(
	Class,
	PlainObject,
	Control
) {

    var ContentKind = ContentControl.ContentKind = Enum.declare(
    	"-options-"	:	["Text","Container"]
    	});

	var ContentControl = Class.declare(Control,{
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
				content : {
					type : Object
				},
				contentTemplate	:	{
					//Gets or sets the data template used to display the content of the ContentControl.
					type	:	PlainObject
					
				}
			}
		},	
		
		"-constructor-"	:  {
		}
	});
	
	
	return ContentControl;
	
});	
