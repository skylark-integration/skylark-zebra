

define( [
	"qscript/lang/Class",
	"qscriptx/input/InputManager",
	"qscriptx/input/MouseDownEvent",
	"qscriptx/input/MouseMoveEvent",
	"qscriptx/input/MouseUpEvent",
	"qscriptx/input/MouseEnterEvent",
	"qscriptx/input/MouseLeaveEvent",
	"qscriptx/input/ClickEvent",
	"qscriptx/input/DoubleClickEvent",
	"qscriptx/input/KeyDownEvent",
	"qscriptx/input/KeyUpEvent",
	"qscriptx/input/CharInputEvent",
	"qscriptx/input/DragStartEvent",
	"qscriptx/input/DragMoveEvent",
	"qscriptx/input/DragEndEvent",
	"qscriptx/input/DragEnterEvent",
	"qscriptx/input/DragLeaveEvent"
	"qscriptx/input/DragOverEvent",
	"qscriptx/input/DragDropEvent",
	"qscriptx/input/GetFocusEvent",
	"qscriptx/input/LostFocusEvent"
], function(
	Class,
	InputManager,
	MouseDownEvent,
	MouseMoveEvent,
	MouseUpEvent,
	MouseEnterEvent,
	MouseLeaveEvent,
	ClickEvent,
	DoubleClickEvent,
	KeyDownEvent,
	KeyUpEvent,
	CharInputEvent,
	DragStartEvent,
	DragMoveEvent,
	DragEndEvent,
	DragEnterEvent,
	DragLeaveEvent,
	DragOverEvent,
	DragDropEvent,
	GetFocusEvent,
	LostFocusEvent
){

	var EventManager = Class.declare(null,{
		"-protected-"	:	{
	       "_focusHandler" : function(evtArgs){
	        	this.focusedVisual = this.display;
        		var event = new GetFocusEvent({
        				"target"	:	this.focusedVisual,
        				"bubbles"	:	true
        			});
            	this.perform(event);
	        },
	        
	        "_blurHandler" : function(evtArgs){
	        	if (this.focusedVisual) {
	        		var event = new LostFocusEvent({
	        				"target"	:	this.focusedVisual,
	        				"bubbles"	:	true
	        			});
	            	this.perform(event);
	        	}
	        	this.focusedVisual = this.preFocusedVisual = null;
	        },
	        

	       "_keyDownHandler" : function(evtArgs){	
	            var fv = this.focusedVisual;
	            if (fv) {
	            	evtArgs.target = fv;
		        	evtArgs.bubbles = true;
	            	var event = new KeyDownEvent(evtArgs);
	            	this.perform(event);
	            }
	        },

	        "_keyUpHandler" : function(evtArgs){
	            var fv = this.focusedVisual;
	            if (fv) {
	            	evtArgs.target = fv;
		        	evtArgs.bubbles = true;
	            	var event = new KeyUpEvent(evtArgs);
	            	this.perform(event);
	            }
	        },


	        "_keypPessHandler" : function(evtArgs){
	            var fv = this.focusedVisual;
	            if (fv) {
	            	evtArgs.target = fv;
		        	evtArgs.bubbles = true;
	            	var event = new CharInputEvent(evtArgs);
	            	this.perform(event);
	            }
	        },

	        "_mouseEnterHandler" : function(evtArgs) {
	        	evtArgs.target = this.mouseInVisual =  this.display;
            	var event = new MouseEnterEvent(evtArgs);
            	this.perform(event);
	        	
	        },

	        "_mouseLeaveHandler" : function (id, e) {
	        	this.mouseInVisual = this.prevMouseInVisual = null;
	        	evtArgs.target = this.display;
	        	evtArgs.bubbles = true;
            	var event = new MouseLeaveEvent(evtArgs);
            	this.perform(event);
            	
	        },

	        "_mouseDownHandler" : function(evtArgs) {
	        	var display = this.display;
	        	this.mousedown = true;
	        	this.mouseDownVisual = evtArgs.position;
	        	this.mouseDownVisul = display.findVisual(this.mouseDownPosition);
	        	
	        	evtArgs.target = this.mouseDownVisual;
	        	evtArgs.bubbles = true;
            	var event = new MouseDownEvent(evtArgs);
            	this.perform(event);            	
	        },

	        "_mouseMoveHandler" : function(evtArgs){
	        	var display = this.display,
	        	    v = display.findVisual(evtArgs.position);

	        	evtArgs.bubbles = true;
	        	
	        	if (v != this.mouseInVisual) {
	        		var v1 = this.preMouseInVisual = this.mouseInVisual,
	        			v2 = this.mouseInVisual = v,
	        			v2toRoot = [];
	        		while (v2) {
	        			v2toRoot.push(v2);
	        			v2 = v2.parent;
	        		}
	        		var p = v1,
	        			pIdx = -1;

	        		while (p) {
	        			pIdx = v2toRoot.indexOf(p);
	        			if (pIdx > -1 ) {
	        				break;
	        			}	
	        			p = p.parent;
	        		}

	        		while (v1 != p) {
	        			evtArgs.target = v1;
	        			var event = new MouseLeaveEvent(evtArgs);
	        			this.perform(event);
	        			v1 = v1.parent;
	        		}
	        		if (pIdx > -1) {
	        			while (--pIdx > -1) {
		        			evtArgs.target = v2toRoot[pIdx];
		        			var event = new MouseEnterEvent(evtArgs);
		        			this.perform(event);
	        			}
	        		}
	        		
	        		
	        	}    
	        	evtArgs.target = this.mouseInVisual;
            	var event = new MouseMoveEvent(evtArgs);
            	this.perform(event);            	
	        	
	        },

	        "_mouseUpHandler" : function(evtArgs){
	        	var display = this.display;
	        	
	        	evtArgs.target = display.findVisual(evtArgs.position);
	        	evtArgs.bubbles = true;
            	var event = new MouseUpEvent(evtArgs);
            	this.perform(event);            	

	        	this.mousedown = false;
	        	this.mouseDownVisual = null;
	        },
	        
	        "_dragStartHandler"	:	function(evtArgs){
	        	var mdv = this.mouseDownVisual;
	        	if (mdv) {
		        	evtArgs.bubbles = true;
		        	evtArgs.target = mdv;
		        	evtArgs.bubbles = true;
		        	evtArgs.cancelable = true;
	            	var event = new DragStart(evtArgs);
	            	this.perform(event);            	
	        		if (!event.cancelled) {
	        			this.draggingVisual = mdv;
	        		}
	        		evtArgs.cancelled = event.cancelled;
	        	}
	        },
	        
	        "_dragHandler"	:	function(evtArgs){
	        	var dgv = this.draggingVisual;
	        	if (dgv) {
		        	evtArgs.bubbles = true;
		        	evtArgs.target = dgv;
		        	evtArgs.bubbles = true;
	            	var event = new DragMove(evtArgs);
	            	this.perform(event);            	
	        		
	        	}
	        },
	        
	        "_dragEndHandler"	:	function(evtArgs){
	        	var dgv = this.dragVisual;
	        	if (dgv) {
		        	evtArgs.target = dgv;
		        	evtArgs.bubbles = true;
	            	var event = new DragEnd(evtArgs);
	            	this.perform(event);            	
	        		this.draggingVisual = null;
	        	}
	        },
	        
	        "_dragEnterHandler"	:	function(evtArgs){
	        },
	        
	        "_dragLeaveHandler"	:	function(evtArgs){
	        },
	        
	        "_dragOverHandler"	:	function(evtArgs){
	        	var display = this.display,
	        	    v = display.findVisual(evtArgs.position);

	        	evtArgs.bubbles = true;
	        	
	        	if (v != this.dragOverVisual) {
	        		var v1 = this.preDragOverVisual = this.dragOverVisual,
	        			v2 = this.dragOverVisual = v,
	        			v2toRoot = [];
	        		while (v2) {
	        			v2toRoot.push(v2);
	        			v2 = v2.parent;
	        		}
	        		var p = v1,
	        			pIdx = -1;

	        		while (p) {
	        			pIdx = v2toRoot.indexOf(p);
	        			if (pIdx > -1 ) {
	        				break;
	        			}	
	        			p = p.parent;
	        		}

	        		while (v1 != p) {
	        			evtArgs.target = v1;
	        			var event = new DragLeaveEvent(evtArgs);
	        			this.perform(event);
	        			v1 = v1.parent;
	        		}
	        		if (pIdx > -1) {
	        			while (--pIdx > -1) {
		        			evtArgs.target = v2toRoot[pIdx];
		        			var event = new DragEnterEvent(evtArgs);
		        			this.perform(event);
	        			}
	        		}
	        	}    
	        	evtArgs.target = this.dragOverVisual;
            	var event = new DragOverEvent(evtArgs);
            	this.perform(event);            	
	        	
	        },
	        
	        "_dragDropHandler"	:	function(evtArgs){
	        	var dov = this.dragOverVisual;
	        	if (dov) {
		        	evtArgs.target = dov;
		        	evtArgs.bubbles = true;
	            	var event = new DragDrop(evtArgs);
	            	this.perform(event);            	
	        		this.dragOverVisual = null;
	        	}
	        	
	        },
	        
			"_dispatch"	:	function(event){
				var v = event.target;
				while (v) {
					event.currentTarget = v;

					v.emit(event);
					
					if (!event.bubbles || event.propagationStopped) {
						break;
					}
					v = v.parent;
				}
			}
		
		},
		
		"-attributes-"	:	{
		
		},
		
		"-methods-"	:	{
		},
		
		"-initialize-"	:	{
			"initialize"	:	function(/*Display*/display){
				this._set("display",display);
			}
		
		}
		
		"-finalize-"	:	{
		}
	
	});
	
	
	return DisplayInputManager;

]);

