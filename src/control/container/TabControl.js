define([
	"qscript/lang/Class",
	"qscript/lang/Stateful",
	"qfacex/windows/controlss/_Layoutable"
],function(Class,Statefu,_Layoutable) {

pkg.Tabs = Class(pkg.Panel, MouseListener, KeyListener, [
    function $prototype() {
        this.mouseMoved = function(e) {
            var i = this.getTabAt(e.x, e.y);
            if (this.overTab != i) {
                //!!! var tr1 = (this.overTab >= 0) ? this.getTabBounds(this.overTab) : null;
                //!!!var tr2 = (i >= 0) ? this.getTabBounds(i) : null;
                //!!!if (tr1 && tr2) zebra.util.unite();
                this.overTab = i;
                if (this.views["tabover"] != null) {
                    this.repaint(this.tabAreaX, this.tabAreaY, this.tabAreaWidth, this.tabAreaHeight);
                }
            }
        };

        this.mouseDragEnded = function(e) {
            var i = this.getTabAt(e.x, e.y);
            if (this.overTab != i) {
                this.overTab = i;
                if (this.views["tabover"] != null) {
                    this.repaint(this.tabAreaX, this.tabAreaY, this.tabAreaWidth, this.tabAreaHeight);
                }
            }
        };

        this.mouseExited = function(e) {
            if (this.overTab >= 0) {
                this.overTab = -1;
                if (this.views["tabover"] != null) {
                    this.repaint(this.tabAreaX, this.tabAreaY, this.tabAreaWidth, this.tabAreaHeight);
                }
            }
        };

        this.next =  function (page, d){
            for(; page >= 0 && page < ~~(this.pages.length / 2); page += d) {
                if (this.isTabEnabled(page)) return page;
            }
            return -1;
        };

        this.getTitleInfo = function(){
            var b = (this.orient == L.LEFT || this.orient == L.RIGHT),
                res = b ? { x:this.tabAreaX, y:0, width:this.tabAreaWidth, height:0, orient:this.orient }
                        : { x:0, y:this.tabAreaY, width:0, height:this.tabAreaHeight, orient:this.orient };
            if(this.selectedIndex >= 0){
                var r = this.getTabBounds(this.selectedIndex);
                if(b){
                    res[1] = r.y;
                    res[3] = r.height;
                }
                else{
                    res[0] = r.x;
                    res[2] = r.width;
                }
            }
            return res;
        };

        this.canHaveFocus = function(){ return true; };

        this.getTabView = function (index){
            var data = this.pages[2 * index];
            if (data.paint) return data;
            this.textRender.target.setValue(data.toString());
            return this.textRender;
        };

        this.isTabEnabled = function (index){ return this.kids[index].isEnabled; };

        this.paint = function(g){
            //!!!var ts = g.getTopStack(), cx = ts.x, cy = ts.y, cw = ts.width, ch = ts.height;

            if(this.selectedIndex > 0){
                var r = this.getTabBounds(this.selectedIndex);
                //!!!! if(this.orient == L.LEFT || this.orient == L.RIGHT)
                //     g.clipRect(r.x, this.tabAreaY, r.width, r.y - this.tabAreaY);
                // else
                //     g.clipRect(this.tabAreaX, r.y, r.x - this.tabAreaX, r.height);
            }

            for(var i = 0;i < this.selectedIndex; i++) this.paintTab(g, i);

            if(this.selectedIndex >= 0){
                //!!!g.setClip(cx, cy, cw, ch);
                var r = this.getTabBounds(this.selectedIndex);
                //!!!! if(this.orient == L.LEFT || this.orient == L.RIGHT)
                //     g.clipRect(r.x, r.y + r.height, r.width, this.height - r.y - r.height);
                // else
                //     g.clipRect(r.x + r.width, r.y, this.width - r.x - r.width, r.height);
            }

            for(var i = this.selectedIndex + 1;i < ~~(this.pages.length / 2); i++) this.paintTab(g, i);

            //!!!!if (cw > 0 && ch > 0) g.setClip(cx, cy, cw, ch);

            if(this.selectedIndex >= 0){
                this.paintTab(g, this.selectedIndex);
                if (this.hasFocus()) this.drawMarker(g, this.getTabBounds(this.selectedIndex));
            }
        };

        this.drawMarker = function(g,r){
            var marker = this.views["marker"];
            if(marker != null){
                var bv = this.views["tab"];
                marker.paint(g, r.x + bv.getLeft(), r.y + bv.getTop(),
                                r.width - bv.getLeft() - bv.getRight(),
                                r.height - bv.getTop() - bv.getBottom(), this);
            }
        };

        this.paintTab = function (g, pageIndex){
            var b = this.getTabBounds(pageIndex), page = this.kids[pageIndex], vs = this.views,
                tab = vs["tab"], tabover = vs["tabover"], tabon = vs["tabon"];

            if(this.selectedIndex == pageIndex && tabon != null) {
                tabon.paint(g, b.x, b.y, b.width, b.height, page);
            }
            else {
                tab.paint(g, b.x, b.y, b.width, b.height, page);
            }

            if (this.overTab >= 0 && this.overTab == pageIndex && tabover != null) {
                tabover.paint(g, b.x, b.y, b.width, b.height, page);
            }

            var v = this.getTabView(pageIndex),
                ps = v.getPreferredSize(), px = b.x + L.xAlignment(ps.width, L.CENTER, b.width),
                py = b.y + L.yAlignment(ps.height, L.CENTER, b.height);

            v.paint(g, px, py, ps.width, ps.height, page);
            if (this.selectedIndex == pageIndex) {
                v.paint(g, px + 1, py, ps.width, ps.height, page);
            }
        };

        this.getTabBounds = function(i){ return this.pages[2 * i + 1]; };

        this.calcPreferredSize = function(target){
            var max = L.getMaxPreferredSize(target);
            if(this.orient == L.BOTTOM || this.orient == L.TOP){
                max.width = Math.max(2 * this.sideSpace + max.width, this.tabAreaWidth);
                max.height += this.tabAreaHeight;
            }
            else{
                max.width += this.tabAreaWidth;
                max.height = Math.max(2 * this.sideSpace + max.height, this.tabAreaHeight);
            }
            max.width  += (this.hgap * 2);
            max.height += (this.vgap * 2);
            return max;
        };

        this.doLayout = function(target){
            var right = this.getRight(), top = this.getTop(), 
                bottom = this.getBottom(), left = this.getLeft(),
                b = (this.orient == L.TOP || this.orient == L.BOTTOM);
          
            if (b) {
                this.tabAreaX = left;
                this.tabAreaY = (this.orient == L.TOP) ? top : this.height - bottom - this.tabAreaHeight;
            }
            else {
                this.tabAreaX = (this.orient == L.LEFT) ? left : this.width - right - this.tabAreaWidth;
                this.tabAreaY = top;
            }
            var count = ~~(this.pages.length / 2), sp = 2*this.sideSpace,
                xx = b ? (this.tabAreaX + this.sideSpace)
                       : ((this.orient == L.LEFT) ? (this.tabAreaX + this.upperSpace) : this.tabAreaX + 1),
                yy = b ? (this.orient == L.TOP ? this.tabAreaY + this.upperSpace : this.tabAreaY + 1)
                       : (this.tabAreaY + this.sideSpace);

            for(var i = 0;i < count; i++ ){
                var r = this.getTabBounds(i);
                if(b){
                    r.x = xx;
                    r.y = yy;
                    xx += r.width;
                    if(i == this.selectedIndex) xx -= sp;
                }
                else{
                    r.x = xx;
                    r.y = yy;
                    yy += r.height;
                    if(i == this.selectedIndex) yy -= sp;
                }
            }

            for(var i = 0;i < count; i++){
                var l = this.kids[i];
                if(i == this.selectedIndex){
                    if(b) {
                        l.setSize(this.width - left - right - 2 * this.hgap,
                                  this.height - this.tabAreaHeight - top - bottom - 2 * this.vgap);
                        l.setLocation(left + this.hgap,
                                     ((this.orient == L.TOP) ? top + this.tabAreaHeight : top) + this.vgap);
                    }
                    else {
                        l.setSize(this.width - this.tabAreaWidth - left - right - 2 * this.hgap,
                                  this.height - top - bottom - 2 * this.vgap);
                        l.setLocation(((this.orient == L.LEFT) ? left + this.tabAreaWidth : left) + this.hgap,
                                      top + this.vgap);
                    }
                }
                else l.setSize(0, 0);
            }

            if (this.selectedIndex >= 0){
                var r = this.getTabBounds(this.selectedIndex), dt = 0;
                if(b){
                    r.x -= this.sideSpace;
                    r.y -= (this.orient == L.TOP) ? this.upperSpace : this.brSpace;
                    dt = (r.x < left) ? left - r.x
                                      : (r.x + r.width > this.width - right) ? this.width - right - r.x - r.width : 0;
                }
                else{
                    r.x -= (this.orient == L.LEFT) ? this.upperSpace : this.brSpace;
                    r.y -= this.sideSpace;
                    dt = (r.y < top) ? top - r.y
                                     : (r.y + r.height > this.height - bottom) ? this.height - bottom - r.y - r.height : 0;
                }
                for(var i = 0;i < count; i ++ ){
                    var br = this.getTabBounds(i);
                    if(b) br.x += dt;
                    else br.y += dt;
                }
            }
        };

        this.recalc = function(){
            var count = ~~(this.pages.length / 2);
            if (count > 0){
                this.tabAreaHeight = this.tabAreaWidth = 0;
                var bv = this.views["tab"], b = (this.orient == L.LEFT || this.orient == L.RIGHT), max = 0,
                    hadd = 2 * this.hTabGap + bv.getLeft() + bv.getRight(),
                    vadd = 2 * this.vTabGap + bv.getTop() + bv.getBottom();

                for(var i = 0;i < count; i++){
                    var ps = this.getTabView(i).getPreferredSize(), r = this.getTabBounds(i);
                    if(b){
                        r.height = ps.height + vadd;
                        if(ps.width + hadd > max) max = ps.width + hadd;
                        this.tabAreaHeight += r.height;
                    }
                    else{
                        r.width = ps.width + hadd;
                        if(ps.height + vadd > max) max = ps.height + vadd;
                        this.tabAreaWidth += r.width;
                    }
                }
                for(var i = 0; i < count; i++ ){
                    var r = this.getTabBounds(i);
                    if(b) r.width  = max;
                    else  r.height = max;
                }
                if (b) {
                    this.tabAreaWidth = max + this.upperSpace + 1;
                    this.tabAreaHeight += (2 * this.sideSpace);
                }
                else {
                    this.tabAreaWidth += (2 * this.sideSpace);
                    this.tabAreaHeight = this.upperSpace + max + 1;
                }

                if (this.selectedIndex >= 0) {
                    var r = this.getTabBounds(this.selectedIndex);
                    if (b) {
                        r.height += 2 * this.sideSpace;
                        r.width += (this.brSpace + this.upperSpace);
                    }
                    else {
                        r.height += (this.brSpace + this.upperSpace);
                        r.width += 2 * this.sideSpace;
                    }
                }
            }
        };

        this.getTabAt = function (x,y){
            this.validate();
            if(x >= this.tabAreaX && y >= this.tabAreaY &&
                x < this.tabAreaX + this.tabAreaWidth &&
                y < this.tabAreaY + this.tabAreaHeight)
            {
                for(var i = 0; i < ~~(this.pages.length / 2); i++ ) {
                    var tb = this.getTabBounds(i);
                    if (x >= tb.x && y >= tb.y && x < tb.x + tb.width && y < tb.y + tb.height) return i;
                }
            }
            return -1;
        };

        this.keyPressed = function(e){
            if(this.selectedIndex != -1 && this.pages.length > 0){
                switch(e.code) {
                    case KE.UP:
                    case KE.LEFT:
                        var nxt = this.next(this.selectedIndex - 1,  -1);
                        if(nxt >= 0) this.select(nxt);
                        break;
                    case KE.DOWN:
                    case KE.RIGHT:
                        var nxt = this.next(this.selectedIndex + 1, 1);
                        if(nxt >= 0) this.select(nxt);
                        break;
                }
            }
        };

        this.mouseClicked = function(e){
            if (e.isActionMask()){
                var index = this.getTabAt(e.x, e.y);
                if(index >= 0 && this.isTabEnabled(index)) this.select(index);
            }
        };

        this.select = function(index){
            if (this.selectedIndex != index){
                this.selectedIndex = index;
                this._.fired(this, this.selectedIndex);
                this.vrp();
            }
        };

        this.setTitle =  function(pageIndex,data){
            if (this.pages[2 * pageIndex] != data){
                this.pages[pageIndex * 2] = data;
                this.vrp();
            }
        };

        this.setTabSpaces = function(vg,hg,sideSpace,upperSpace,brSpace){
            if (this.vTabGap != vg              || 
                this.hTabGap != hg              || 
                sideSpace    != this.sideSpace  ||
                upperSpace   != this.upperSpace || 
                brSpace      != this.brSpace      )
            {
                this.vTabGap = vg;
                this.hTabGap = hg;
                this.sideSpace = sideSpace;
                this.upperSpace = upperSpace;
                this.brSpace = brSpace;
                this.vrp();
            }
        };

        this.setGaps = function (vg,hg){
            if(this.vgap != vg || hg != this.hgap){
                this.vgap = vg;
                this.hgap = hg;
                this.vrp();
            }
        };

        this.setTitleAlignment = function(o){
            if (o != L.TOP && o != L.BOTTOM && o != L.LEFT && o != L.RIGHT) {
                throw new Error($invalidA);
            }

            if (this.orient != o){
                this.orient = o;
                this.vrp();
            }
        };

        this.enableTab = function(i,b){
            var c = this.kids[i];
            if(c.isEnabled != b){
                c.setEnabled(b);
                if (b === false && this.selectedIndex == i) this.select(-1);
                this.repaint();
            }
        };
    },

    function (){ this.$this(L.TOP); },

    function (o){
        this.brSpace = this.upperSpace = this.vgap = this.hgap = this.tabAreaX = 0;
        this.hTabGap = this.vTabGap = this.sideSpace = 1;

        this.tabAreaY = this.tabAreaWidth = this.tabAreaHeight = 0;
        this.overTab = this.selectedIndex = -1;
        this.orient = L.TOP;
        this._ = new Listeners();
        this.pages = [];
        this.views = {};
        this.textRender = new pkg.TextRender(new zebra.data.SingleLineTxt(""));

        if (pkg.Tabs.font != null) this.textRender.setFont(pkg.Tabs.font);
        if (pkg.Tabs.fontColor != null) this.textRender.setColor(pkg.Tabs.fontColor);

        this.$overrided();

        // since alignment pass as the constructor argument the setter has to be called after $super
        // because $super can re-set title alignment
        this.setTitleAlignment(o);
    },

    function focused(){
        this.$overrided();
        if (this.selectedIndex >= 0){
            var r = this.getTabBounds(this.selectedIndex);
            this.repaint(r.x, r.y, r.width, r.height);
        }
        else {
            if (!this.hasFocus()) {
                this.select(this.next(0, 1));
            }
        }
    },

    function insert(index,constr,c){
        this.pages.splice(index * 2, 0, constr == null ? "Page " + index
                                                       : constr, { x:0, y:0, width:0, height:0 });
        var r = this.$overrided(index, constr, c);
        if (this.selectedIndex < 0) this.select(this.next(0, 1));
        return r;
    },

    function removeAt(i){
        if (this.selectedIndex == i) this.select( -1);
        this.pages.splice(i * 2, 2);
        this.$overrided(i);
    },

    function removeAll(){
        if (this.selectedIndex >= 0) this.select( -1);
        this.pages.splice(0, this.pages.length);
        this.pages.length = 0;
        this.$overrided();
    },

    function setSize(w,h){
        if (this.width != w || this.height != h){
            if (this.orient == L.RIGHT || this.orient == L.BOTTOM) this.tabAreaX =  -1;
            this.$overrided(w, h);
        }
    }
]);
pkg.Tabs.prototype.setViews = pkg.$ViewsSetter;
	
});	
