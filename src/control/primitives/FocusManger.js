define([
	"qscript/lang/Class"
],function(Class) {    
    
    var FocusManager = Class.declare(null,{
    	focusedVisual	 : null,
    	preFocusedVisual : null,
    	
    	requestFocus : function() {
    	},
    	
        focus : function (/*Visual*/v){
            if (v != this.focusedVisual && (v == null || this.isFocusable(v))){
                var oldFocusedVisual = this.focusedVisual;
                this.focusedVisual = v;
                this.preFocusedVisual = oldFocusOwner;
                
                if (oldFocusOwner  != null) {
                    performInput(new LostFocusEvent()); 
                }

                if (this.focusedVisual != null) {
                    performInput(new GetFocusEvent()); 
                }

                return this.focusedVisual;
            }
            return null;
        },
        
        isFocusable	:	function(/*Visual*/v) {
        	return true;
        }
    });
    
    return FocusManager;

});

