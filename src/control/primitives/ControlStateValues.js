define([
	"qscript/lang/Class",
	"qscript/data/styles/Hashable",
	"qfacex/windows/control/primitives/ControlState"
],function(Class,Hashable) {
	var ControlStateValues	= Class.declare(null,{
		"-attributes-"	:	{
			"states"	:	{
				type	:	Hashable,
				readOnly:	true
			}
		},
		"-methods-"	:	{
			setStateValue	:	function(/*ControlState*/state,value){
				this._states.put(state.getText(),value);
			},
			getStateValue	:	function(/*ControlState*/state){
				return this._states.get(state,true);
			},
			removeStateValue	:	function(/*ControlState*/state){
				this._states.remove(state);
			}
		},
		
		constructor	:	function(){
			this._states = new Hashable();
		},
		
		destroy	:	function(){
			this._states.clear();
			this._states = null;
		
		}
	
	});

	return ControlStateValues;
	
});	
