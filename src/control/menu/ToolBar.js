
define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
	"dijit/form/CheckBox"
],	function(Class, DijitCheckBox){

pkg.Toolbar = Class(pkg.Panel, pkg.ChildrenListener, [
    function $clazz() {
        this.Constraints = function(isDec, str) {
            this.isDecorative = arguments.length > 0 ? isDec : false;
            this.stretched = arguments.length > 1 ? str : false;
        };
    },

    function $prototype() {
        var OVER = "over", OUT = "out", PRESSED = "pressed";

        this.isDecorative = function(c){ return c.constraints.isDecorative; };

        this.childInputEvent = function(e){
            if (e.UID == pkg.InputEvent.MOUSE_UID){
                var dc = L.getDirectChild(this, e.source);
                if (this.isDecorative(dc) === false){
                    switch(e.ID) {
                        case ME.ENTERED : this.select(dc, true); break;
                        case ME.EXITED  : if (this.selected != null && L.isAncestorOf(this.selected, e.source)) this.select(null, true); break;
                        case ME.PRESSED : this.select(this.selected, false);break;
                        case ME.RELEASED: this.select(this.selected, true); break;
                    }
                }
            }
        };

        this.recalc = function(){
            var v = this.views, vover = v[OVER], vpressed = v[PRESSED];
            this.leftShift   = Math.max(vover     != null && vover.getLeft      ? vover.getLeft()     : 0,
                                        vpressed  != null && vpressed.getLeft   ? vpressed.getLeft()  : 0);
            this.rightShift  = Math.max(vover     != null && vover.getRight     ? vover.getRight()    : 0 ,
                                        vpressed  != null && vpressed.getRight  ? vpressed.getRight() : 0 );
            this.topShift    = Math.max(vover     != null && vover.getTop       ? vover.getTop()      : 0 ,
                                        vpressed  != null && vpressed.getTop    ? vpressed.getTop()   : 0 );
            this.bottomShift = Math.max(vover     != null && vover.getBottom    ? vover.getBottom()   : 0 ,
                                        vpressed  != null && vpressed.getBottom ? vpressed.getBottom(): 0 );
        };

        this.paint = function(g) {
            for(var i = 0;i < this.kids.length; i++){
                var c = this.kids[i];
                if (c.isVisible && this.isDecorative(c) === false){
                    var v = this.views[(this.selected == c) ? (this.isOver ? OVER : PRESSED) : OUT];
                    if (v != null) {
                        v.paint(g, c.x, this.getTop(),
                                   c.width, this.height - this.getTop() - this.getBottom(), this);
                    }
                }
            }
        };

        this.calcPreferredSize = function(target){
            var w = 0, h = 0, c = 0, b = (this.orient == L.HORIZONTAL);
            for(var i = 0;i < target.kids.length; i++ ){
                var l = target.kids[i];
                if(l.isVisible){
                    var ps = l.getPreferredSize();
                    if (b) {
                        w += (ps.width + (c > 0 ? this.gap : 0));
                        h = ps.height > h ? ps.height : h;
                    }
                    else {
                        w = ps.width > w ? ps.width : w;
                        h += (ps.height + (c > 0 ? this.gap : 0));
                    }
                    c++;
                }
            }
            return { width:  (b ? w + c * (this.leftShift + this.rightShift)
                                : w + this.topShift + this.bottomShift),
                     height: (b ? h + this.leftShift + this.rightShift
                                : h + c * (this.topShift + this.bottomShift)) };
        };

        this.doLayout = function(t){
            var b = (this.orient == L.HORIZONTAL), x = t.getLeft(), y = t.getTop(),
                av = this.topShift + this.bottomShift, ah = this.leftShift + this.rightShift,
                hw = b ? t.height - y - t.getBottom() : t.width - x - t.getRight();

            for (var i = 0;i < t.kids.length; i++){
                var l = t.kids[i];
                if (l.isVisible){
                    var ps = l.getPreferredSize(), str = l.constraints.stretched;
                    if (b) {
                        if (str) ps.height = hw;
                        l.setLocation(x + this.leftShift, y + ((hw - ps.height) / 2  + 0.5) | 0);
                        x += (this.gap + ps.width + ah);
                    }
                    else {
                        if (str) ps.width = hw;
                        l.setLocation(x + (hw - ps.width) / 2, y + this.topShift);
                        y += (this.gap + ps.height + av);
                    }
                    l.setSize(ps.width, ps.height);
                }
            }
        };

        this.select = function (c, state){
            if (c != this.selected || (this.selected != null && state != this.isOver)) {
                this.selected = c;
                this.isOver = state;
                this.repaint();
                if (state === false && c != null) this._.fired(this, c);
            }
        };
    },

    function () { this.$this(L.HORIZONTAL, 4); },

    function (orient,gap){
        if (orient != L.HORIZONTAL && orient != L.VERTICAL) throw new Error("Interface orientation");

        this.selected = null;
        this.isOver = false;
        this._ = new Listeners();
        this.leftShift = this.topShift = this.bottomShift = this.rightShift = 0;

        this.views = {};
        this.orient = orient;
        this.gap = gap;
        this.$overrided();
    },

    function addDecorative(c){ this.add(new pkg.Toolbar.Constraints(true), c); },

    function addRadio(g,c){
        var cbox = new pkg.Radiobox(c, g);
        cbox.setCanHaveFocus(false);
        this.add(cbox);
        return cbox;
    },

    function addSwitcher(c){
        var cbox = new pkg.Checkbox(c);
        cbox.setCanHaveFocus(false);
        this.add(cbox);
        return cbox;
    },

    function addImage(img){
        this.validateMetric();
        var pan = new pkg.ImagePan(img);
        pan.setPaddings(this.topShift, this.leftShift + 2, this.bottomShift, this.rightShift+2);
        this.add(pan);
        return pan;
    },

    function addCombo(list){
        var combo = new pkg.Combo(list);
        this.add(new pkg.Toolbar.Constraints(false), combo);
        combo.setPaddings(1, 4, 1, 1);
        return combo;
    },

    function addLine(){
        var line = new pkg.Line(L.VERTICAL);
        this.add(new pkg.Toolbar.Constraints(true, true), line);
        return line;
    },

    function insert(i,id,d){
        if (id == null) id = new pkg.Toolbar.Constraints();
        return this.$overrided(i, id, d);
    }
]);
pkg.Toolbar.prototype.setViews = pkg.$ViewsSetter;


});
