define([
	"qscript/lang/Class",
	"qscript/lang/Stateful",
	"qfacex/windows/controlss/_Layoutable"
],function(Class,Statefu,_Layoutable) {
    var MOVE_ACTION = 1, SIZE_ACTION = 2;

	var WindowTitleView = Class.declare(UIElement,{
		constructor	: function(x,y) {
            this.radius = 6;
            this.gap = this.radius;
            this.bg = bg ? bg : "#66CCFF";
		},
        paint : function(g,x,y,w,h,d) {
            this.outline(g,x,y,w,h,d);
            g.setColor(this.bg);
            g.fill();
        },
        outline : function (g,x,y,w,h,d) {
            g.beginPath();
            g.moveTo(x + this.radius, y);
            g.lineTo(x + w - this.radius*2, y);
            g.quadraticCurveTo(x + w, y, x + w, y + this.radius);
            g.lineTo(x + w, y + h);
            g.lineTo(x, y + h);
            g.lineTo(x, y + this.radius);
            g.quadraticCurveTo(x, y, x + this.radius, y);
            return true;
        }

	});

	var Window = Class.declare(ContentControl,{
		minSize    : 40,
		isSizeable     : true,
		
		constructor	: function(x,y) {
		},


        mouseDragStarted : function(e){
            this.px = e.x;
            this.py = e.y;
            this.psw = this.width;
            this.psh = this.height;
            this.action = this.insideCorner(this.px, this.py) ? (this.isSizeable ? SIZE_ACTION : -1): MOVE_ACTION;
            if (this.action > 0) this.dy = this.dx = 0;
        },

        mouseDragged : function(e) {
            if (this.action > 0){
                if (this.action != MOVE_ACTION){
                    var nw = this.psw + this.dx, nh = this.psh + this.dy;
                    if(nw > this.minSize && nh > this.minSize) this.setSize(nw, nh);
                }
                this.dx = (e.x - this.px);
                this.dy = (e.y - this.py);
                if (this.action == MOVE_ACTION){
                    this.invalidate();
                    this.setLocation(this.x + this.dx, this.y + this.dy);
                }
            }
        },

        mouseDragEnded : function(e) {
            if (this.action > 0){
                if (this.action == MOVE_ACTION){
                    this.invalidate();
                    this.setLocation(this.x + this.dx, this.y + this.dy);
                }
                this.action = -1;
            }
        },
        
        
        insideCorner : function(px,py){
            return this.getComponentAt(px, py) == this.sizer;
        },

        getCursorType : function(target,x,y){
            return (this.isSizeable && this.insideCorner(x, y)) ? pkg.Cursor.SE_RESIZE : -1;
        },

        catchInput : function(c) {
            var tp = this.caption;
            return c == tp || (L.isAncestorOf(tp, c) && zebra.instanceOf(c, pkg.Button) === false) ||
                   this.sizer== c;
        },

        winOpened : function(winLayer,target,b) {
            var state = b?"active":"inactive";
            if (this.caption != null && this.caption.setState) {
                this.caption.setState(state);
            }
            this.setState(state);
        },

        winActivated : function(winLayer, target,b) {
            this.winOpened(winLayer, target,b);
        },

        mouseClicked : function(e) {
            var x = e.x, y = e.y, cc = this.caption;
            if (e.clicks == 2 && this.isSizeable && x > cc.x &&
                x < cc.y + cc.width && y > cc.y && y < cc.y + cc.height)
            {
                if(this.prevW < 0) this.maximize();
                else this.restore();
            }
        },

        isMaximized : function() { 
        	 return this.prevW != -1;; 
        },

        kidAdded : function (index,constr,l){
            pkg.events.performComp(CL.COMP_ADDED, this, constr, l);
            if(l.width > 0 && l.height > 0) l.repaint();
            else this.repaint(l.x, l.y, 1, 1);
        },

        kidRemoved : function(i,l){
            pkg.events.performComp(CL.COMP_REMOVED, this, null, l);
            if (l.isVisible) this.repaint(l.x, l.y, l.width, l.height);
        },

        relocated : function(px,py){ 
        	pkg.events.performComp(CL.COMP_MOVED, this, px, py); 
        },
        
        resized  : function(pw,ph){ 
        	pkg.events.performComp(CL.COMP_SIZED, this, pw, ph); 
        },
        
        hasFocus : function(){ 
        	return pkg.focusManager.hasFocus(this); 
        },
        
        requestFocus : function(){ 
        	pkg.focusManager.requestFocus(this); 
        },

        setVisible : function (b){
            if (this.isVisible != b) {
                this.isVisible = b;
                this.invalidate();
                pkg.events.performComp(CL.COMP_SHOWN, this, -1,  -1);
            }
        },

        setEnabled : function (b){
            if (this.isEnabled != b){
                this.isEnabled = b;
                pkg.events.performComp(CL.COMP_ENABLED, this, -1,  -1);
                if (this.kids.length > 0) {
                    for(var i = 0;i < this.kids.length; i++) this.kids[i].setEnabled(b);
                }
            }
        },

        setPaddings : function (top,left,bottom,right){
            if (this.top != top       || this.left != left  ||
                this.bottom != bottom || this.right != right  )  {
                this.top = top;
                this.left = left;
                this.bottom = bottom;
                this.right = right;
                this.vrp();
            }
        },

        setPadding : function(v) { 
        	this.setPaddings(v,v,v,v); 
        },

        setBorder = function (v){
            var old = this.border;
            v = pkg.$view(v);
            if (v != old){
                this.border = v;
                this.notifyRender(old, v);

                if ( old == null || v == null         ||
                     old.getTop()    != v.getTop()    ||
                     old.getLeft()   != v.getLeft()   ||
                     old.getBottom() != v.getBottom() ||
                     old.getRight()  != v.getRight())  {
                    this.invalidate();
                }

                if (v && v.activate) {
                    v.activate(this.hasFocus() ?  "function": "focusoff" );
                } 

                this.repaint();
            }
        },

        setBackground : function (v){
            var old = this.bg;
            v = pkg.$view(v);
            if (v != old) {
                this.bg = v;
                this.notifyRender(old, v);
                this.repaint();
            }
        },

        setKids : function(a) {
            if (arguments.length == 1 && Array.isArray(a)) {
                a = a[0];
            }

            if (instanceOf(a, pkg.Panel)) {
                for(var i=0; i<arguments.length; i++) {
                    var kid = arguments[i];
                    this.insert(i, kid.constraints, kid);
                }
            }
            else {
                var kids = a;
                for(var k in kids) {
                    if (kids.hasOwnProperty(k)) {
                        if (L[k] != null && zebra.isNumber(L[k])) {
                            this.add(L[k], kids[k]);
                        }
                        else this.add(k, kids[k]);
                    }
                }
            }
        },

        focused : function() {
            if (this.border && this.border.activate) {
                var id = this.hasFocus() ? "focuson" : "focusoff" ;
                if (this.border.views[id]) {
                    this.border.activate(id);
                    this.repaint();
                }
            }
        },

        repaint : function(x,y,w,h){
            if (arguments.length == 0) {
                x = y = 0;
                w = this.width;
                h = this.height;
            }
            if (this.parent != null && this.width > 0 && this.height > 0 && pkg.paintManager != null){
                pkg.paintManager.repaint(this, x, y, w, h);
            }
        },

        removeAll : function (){
            if (this.kids.length > 0){
                var size = this.kids.length, mx1 = Number.MAX_VALUE, my1 = mx1, mx2 = 0, my2 = 0;
                for(; size > 0; size--){
                    var child = this.kids[size - 1];
                    if (child.isVisible){
                        var xx = child.x, yy = child.y;
                        mx1 = mx1 < xx ? mx1 : xx; 
                        my1 = my1 < yy ? my1 : yy; 
                        mx2 = Math.max(mx2, xx + child.width);
                        my2 = Math.max(my2, yy + child.height);
                    }
                    this.removeAt(size - 1);
                }
                this.repaint(mx1, my1, mx2 - mx1, my2 - my1);
            }
        },

        toFront : function(){
            if (this.parent.kids[this.parent.kids.length-1] != this){
                this.parent.kids.splice(this.parent.indexOf(this), 1);
                this.parent.kids.push(this);
                this.repaint();
            }
        },

        toPreferredSize : function (){
            var ps = this.getPreferredSize();
            this.setSize(ps.width, ps.height);
        }
	});
	
	
	return Window;
	
});	
