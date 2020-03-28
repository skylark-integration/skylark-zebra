define([
	"dojo/_base/declare", // declare
	"dojo/dom-class",
	"dijit/form/ToggleButton"
], function(Class,domClass,DjtToggleButton){

	return Class.declare([DjtToggleButton], {

		_setCheckedAttr: function(){
			this.inherited(arguments);
			var newStateClasses = (this.baseClass+' '+this["class"]).replace(/(\S+)\s*/g, "$1Checked ").split(" ");
			domClass[this.checked ? "add" : "remove"](this.focusNode || this.domNode, newStateClasses);
		}
	
	});


});

