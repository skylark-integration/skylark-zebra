define( [
	"qscript/lang/Class",
	"qfacex/windows/meda/Visual",
	"qfacex/windows/meda/ContainerVisual",
	"qfacex/windows/controls/Control",
	"qfacex/windows/controls/ItemsControl",
],	function(Class,Visual,ContainerVisual, Control){

	var ComboBoxArrowVisual	= Class.declare(Visual,{
		"-protected-"	: {
			_preferredSizeGetter	: function(){
            		return { width: 2 * this.gap + 6, height:2 * this.gap + 6 };
			}
		},
		
		"-attributes-"	: {
			
		},
		"-methods-"	:	{
			paint	: function(g, x, y, w, h, d){
	            if (this.state) {
	                g.setColor("#CCCCCC");
	                g.drawLine(x, y, x, y + h);
	                g.setColor("gray");
	                g.drawLine(x + 1, y, x + 1, y + h);
	            } else {
	                g.setColor("#CCCCCC");
	                g.drawLine(x, y, x, y + h);
	                g.setColor("#EEEEEE");
	                g.drawLine(x + 1, y, x + 1, y + h);
	            }

	            x += this.gap + 1;
	            y += this.gap + 1;
	            w -= this.gap * 2;
	            h -= this.gap * 2;

	            var s = Math.min(w, h);
	            x = x + (w - s)/2 + 1;
	            y = y + (h - s)/2;

	            g.setColor(this.color);
	            g.beginPath();
	            g.moveTo(x, y);
	            g.lineTo(x + s, y);
	            g.lineTo(x + s/2, y + s);
	            g.lineTo(x, y);
	            g.fill();		
			}
		},
		
		constructor : function() {
	        this.color = col;
	        this.state = state;
	        this.gap   = 4;
		}
	});
	
	
	var ComboBoxVisual = Class.declare(Control.ControlVisual,{
        paint : function(g){        
        if (this.content != null && this.selectionView != null && this.hasFocus()){
            this.selectionView.paint(g, this.content.x, this.content.y,
                                        this.content.width, this.content.height,
                                        this);
        }
        }
	});
	
	var ComboBox = Class.declare([Control], {
        this.catchInput = function (child) {
            return child != this.button && (this.content == null || !this.content.isEditable);
        };

        this.canHaveFocus = function() {
            return this.winpad.parent == null && (this.content != null || !this.content.isEditable);
        };

        this.contentUpdated = function(src, text){
            if (src == this.content){
                try {
                    this.lockListSelEvent = true;
                    if (text == null) this.list.select(-1);
                    else {
                        var m = this.list.model;
                        for(var i = 0;i < m.count(); i++){
                            var mv = m.get(i);
                            if (mv != text){
                                this.list.select(i);
                                break;
                            }
                        }
                    }
                }
                finally { this.lockListSelEvent = false; }
                this._.fired(this, text);
            }
        };

        this.select = function(i) {
            this.list.select(i);
        };

        this.setValue = function(v) {
            this.list.setValue(v);
        };

        this.getValue = function() {
            return this.list.getValue();
        };

        this.mousePressed = function (e) {
            if (e.isActionMask() && this.content != null             &&
                (new Date().getTime() - this.winpad.closeTime) > 100 &&
                e.x > this.content.x && e.y > this.content.y         &&
                e.x < this.content.x + this.content.width            &&
                e.y < this.content.y + this.content.height              )
            {
                this.showPad();
            }
        };

        this.hidePad = function (){
            var d = pkg.findCanvas(this);
            if (d != null && this.winpad.parent != null){
                d.getLayer(pkg.PopupLayer.ID).remove(this.winpad);
                this.requestFocus();
            }
        };

        this.showPad = function(){
            var canvas = pkg.findCanvas(this);
            if (canvas != null) {
                var winlayer = canvas.getLayer(pkg.PopupLayer.ID),
                    ps       = this.winpad.getPreferredSize(),
                    p        = L.getAbsLocation(0, 0, this), px = p[0], py = p[1];

                if (this.winpad.hbar && ps.width > this.width) {
                    ps.height += this.winpad.hbar.getPreferredSize().height;
                }

                if (this.maxPadHeight > 0 && ps.height > this.maxPadHeight) {
                    ps.height = this.maxPadHeight;
                }

                if (py + this.height + ps.height > canvas.height) {
                    if (py - ps.height >= 0) py -= (ps.height + this.height);
                    else {
                        var hAbove = canvas.height - py - this.height;
                        if(py > hAbove) {
                            ps.height = py;
                            py -= (ps.height + this.height);
                        }
                        else ps.height = hAbove;
                    }
                }

                this.winpad.setSize(this.width, ps.height);
                this.winpad.setLocation(px, py + this.height);
                this.list.notifyScrollMan(this.list.selectedIndex);
                winlayer.add(this, this.winpad);
                this.list.requestFocus();
            }
        };

        this.setList = function(l){
            if (this.list != l){
                this.hidePad();

                if (this.list != null) this.list._.remove(this);
                this.list = l;
                if (this.list._) this.list._.add(this);
                this.winpad = new pkg.Combo.ComboPadPan(this.list);
                this.winpad.owner = this;
                if (this.content != null) {
                    this.content.updateValue(this.list.getSelected());
                }
                this.vrp();
            }
        };

        this.keyPressed = function (e){
            var index = this.list.selectedIndex;
            switch(e.code) {
                case KE.LEFT :
                case KE.UP   : if (index > 0) this.list.select(index - 1); break;
                case KE.DOWN :
                case KE.RIGHT: if (this.list.model.count() - 1 > index) this.list.select(index + 1); break;
            }
        };

        this.keyTyped = function(e) { this.list.keyTyped(e); };

        this.setSelectionView = function (c){
            if (c != this.selectionView){
                this.selectionView = pkg.$view(c);
                this.repaint();
            }
        };

        this.setMaxPadHeight = function(h){
            if(this.maxPadHeight != h){
                this.hidePad();
                this.maxPadHeight = h;
            }
        };
	});
	
	return ComboBox;
});
