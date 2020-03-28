define([
	"dojo/_base/declare", // declare
	"dijit/form/Button"
], function(Class,DijitButton){

	return Class.declare([DijitButton], {
	});

pkg.Slider = Class(pkg.Panel, KeyListener, MouseListener, Actionable, [
    function $prototype() {
        this.max = this.min = this.value = this.roughStep = this.exactStep = 0;
        this.netSize = this.gap = 3;
        this.correctDt = this.scaleStep = this.psW = this.psH = 0;
        this.intervals = this.pl = null;

        this.paintNums = function(g,loc){
            if(this.isShowTitle)
                for(var i = 0;i < this.pl.length; i++ ){
                    var render = this.provider.getView(this, this.getPointValue(i)),
                        d = render.getPreferredSize();

                    if (this.orient == L.HORIZONTAL) {
                        render.paint(g, this.pl[i] - ~~(d.width / 2), loc, d.width, d.height, this);
                    }
                    else {
                        render.paint(g, loc, this.pl[i] - ~~(d.height / 2),  d.width, d.height, this);
                    }
                }
        };

        this.getScaleSize = function(){
            var bs = this.views["bundle"].getPreferredSize();
            return (this.orient == L.HORIZONTAL ? this.width - this.getLeft() -
                                                  this.getRight() - bs.width
                                                : this.height - this.getTop() -
                                                  this.getBottom() - bs.height) - 2;
        };

        this.getScaleLocation = function(){
            var bs = this.views["bundle"].getPreferredSize();
            return (this.orient == L.HORIZONTAL ? this.getLeft() + ~~(bs.width / 2)
                                                : this.getTop()  + ~~(bs.height/ 2)) + 1;
        };

        this.mouseDragged = function(e){
            if(this.dragged) {
                this.setValue(this.findNearest(e.x + (this.orient == L.HORIZONTAL ? this.correctDt : 0),
                                               e.y + (this.orient == L.HORIZONTAL ? 0 : this.correctDt)));
            }
        };

        this.paint = function(g){
            if(this.pl == null){
                this.pl = Array(this.intervals.length);
                for(var i = 0, l = this.min;i < this.pl.length; i ++ ){
                    l += this.intervals[i];
                    this.pl[i] = this.value2loc(l);
                }
            }
            var left = this.getLeft(), top = this.getTop(), right = this.getRight(), bottom = this.getBottom(),
                bnv = this.views["bundle"], gauge = this.views["gauge"],
                bs = bnv.getPreferredSize(), gs = gauge.getPreferredSize(),
                w = this.width - left - right - 2, h = this.height - top - bottom - 2;

            if (this.orient == L.HORIZONTAL){
                var topY = top + ~~((h - this.psH) / 2) + 1, by = topY;
                if(this.isEnabled) {
                    gauge.paint(g, left + 1, topY + ~~((bs.height - gs.height) / 2), w, gs.height, this);
                }
                else{
                    g.setColor("gray");
                    g.strokeRect(left + 1, topY + ~~((bs.height - gs.height) / 2), w, gs.height);
                }
                topY += bs.height;
                if (this.isShowScale){
                    topY += this.gap;
                    g.setColor(this.isEnabled ? this.scaleColor : "gray");
                    g.beginPath();
                    for(var i = this.min;i <= this.max; i += this.scaleStep){
                        var xx = this.value2loc(i) + 0.5;
                        g.moveTo(xx, topY);
                        g.lineTo(xx, topY + this.netSize);
                    }

                    for(var i = 0;i < this.pl.length; i ++ ) {
                        g.moveTo(this.pl[i] + 0.5, topY);
                        g.lineTo(this.pl[i] + 0.5, topY + 2 * this.netSize);
                    }
                    g.stroke();
                    topY += (2 * this.netSize);
                }
                this.paintNums(g, topY);
                bnv.paint(g, this.getBundleLoc(this.value), by, bs.width, bs.height, this);
            }
            else {
                var leftX = left + ~~((w - this.psW) / 2) + 1, bx = leftX;
                if (this.isEnabled) {
                    gauge.paint(g, leftX + ~~((bs.width - gs.width) / 2), top + 1, gs.width, h, this);
                }
                else {
                    g.setColor("gray");
                    g.strokeRect(leftX + ~~((bs.width - gs.width) / 2), top + 1, gs.width, h);
                }

                leftX += bs.width;
                if (this.isShowScale){
                    leftX += this.gap;
                    g.setColor(this.scaleColor);
                    g.beginPath();
                    for(var i = this.min;i <= this.max; i += this.scaleStep){
                        var yy = this.value2loc(i) + 0.5;
                        g.moveTo(leftX, yy);
                        g.lineTo(leftX + this.netSize, yy);
                    }
                    for(var i = 0;i < this.pl.length; i ++ ) {
                        g.moveTo(leftX, this.pl[i] + 0.5);
                        g.lineTo(leftX + 2 * this.netSize, this.pl[i] + 0.5);
                    }
                    g.stroke();
                    leftX += (2 * this.netSize);
                }
                this.paintNums(g, leftX);
                bnv.paint(g, bx, this.getBundleLoc(this.value), bs.width, bs.height, this);
            }
            if (this.hasFocus() && this.views["marker"]) this.views["marker"].paint(g, left, top, w + 2, h + 2, this);
        };

        this.findNearest = function(x,y){
            var v = this.loc2value(this.orient == L.HORIZONTAL ? x : y);
            if(this.isIntervalMode){
                var nearest = Number.MAX_VALUE, res = 0;
                for(var i = 0;i < this.intervals.length; i ++ ){
                    var pv = this.getPointValue(i), dt = Math.abs(pv - v);
                    if(dt < nearest){
                        nearest = dt;
                        res = pv;
                    }
                }
                return res;
            }
            v = this.exactStep * ~~((v + v % this.exactStep) / this.exactStep);
            if(v > this.max) v = this.max;
            else if(v < this.min) v = this.min;
            return v;
        };

        this.value2loc = function (v){
            return ~~((this.getScaleSize() * (v - this.min)) / (this.max - this.min)) +
                   this.getScaleLocation();
        };

        this.loc2value = function(xy){
            var sl = this.getScaleLocation(), ss = this.getScaleSize();
            if(xy < sl) xy = sl;
            else if(xy > sl + ss) xy = sl + ss;
            return this.min + ~~(((this.max - this.min) * (xy - sl)) / ss);
        };

        this.nextValue = function(value,s,d){
            if(this.isIntervalMode) return this.getNeighborPoint(value, d);
            
            var v = value + (d * s);
            if(v > this.max) v = this.max;
            else if(v < this.min) v = this.min;
            return v;
        };

        this.getBundleLoc = function(v){
            var bs = this.views["bundle"].getPreferredSize();
            return this.value2loc(v) - (this.orient == L.HORIZONTAL ? ~~(bs.width / 2)
                                                                    : ~~(bs.height / 2));
        };

        this.getBundleBounds = function (v){
            var bs = this.views["bundle"].getPreferredSize();
            return this.orient == L.HORIZONTAL ? { x:this.getBundleLoc(v),
                                                   y:this.getTop() + ~~((this.height - this.getTop() - this.getBottom() - this.psH) / 2) + 1,
                                                   width:bs.width, height:bs.height }
                                               : { x:this.getLeft() + ~~((this.width - this.getLeft() - this.getRight() - this.psW) / 2) + 1,
                                                   y:this.getBundleLoc(v), width:bs.width, height:bs.height };
        };

        this.getNeighborPoint = function (v,d){
            var left = this.min + this.intervals[0], right = this.getPointValue(this.intervals.length - 1);
            if (v < left) return left;
            else if (v > right) return right;
            if (d > 0) {
                var start = this.min;
                for(var i = 0;i < this.intervals.length; i ++ ){
                    start += this.intervals[i];
                    if(start > v) return start;
                }
                return right;
            }
            else {
                var start = right;
                for(var i = this.intervals.length - 1;i >= 0; i--) {
                    if (start < v) return start;
                    start -= this.intervals[i];
                }
                return left;
            }
        };

        this.calcPreferredSize = function(l) { return { width:this.psW + 2, height: this.psH + 2 }; };

        this.recalc = function(){
            var ps = this.views["bundle"].getPreferredSize(),
                ns = this.isShowScale ? (this.gap + 2 * this.netSize) : 0,
                dt = this.max - this.min, hMax = 0, wMax = 0;

            if(this.isShowTitle && this.intervals.length > 0){
                for(var i = 0;i < this.intervals.length; i ++ ){
                    var d = this.provider.getView(this, this.getPointValue(i)).getPreferredSize();
                    if (d.height > hMax) hMax = d.height;
                    if (d.width  > wMax) wMax = d.width;
                }
            }
            if(this.orient == L.HORIZONTAL){
                this.psW = dt * 2 + ps.width;
                this.psH = ps.height + ns + hMax;
            }
            else{
                this.psW = ps.width + ns + wMax;
                this.psH = dt * 2 + ps.height;
            }
        };

        this.setValue = function(v){
            if(v < this.min || v > this.max) throw new Error("Value is out of bound");
            var prev = this.value;
            if(this.value != v){
                this.value = v;
                this._.fired(this, prev);
                this.repaint();
            }
        };

        this.getPointValue = function (i){
            var v = this.min + this.intervals[0];
            for(var j = 0; j < i; j++, v += this.intervals[j]);
            return v;
        };

        this.keyPressed = function(e){
            var b = this.isIntervalMode;
            switch(e.code)
            {
                case KE.UP:
                case KE.LEFT:
                    var v = this.nextValue(this.value, this.exactStep,-1);
                    if(v >= this.min) this.setValue(v);
                    break;
                case KE.DOWN:
                case KE.RIGHT:
                    var v = this.nextValue(this.value, this.exactStep, 1);
                    if(v <= this.max) this.setValue(v);
                    break;
                case KE.HOME: this.setValue(b ? this.getPointValue(0) : this.min);break;
                case KE.END:  this.setValue(b ? this.getPointValue(this.intervals.length - 1) : this.max);break;
            }
        };

        this.mousePressed = function (e){
            if(e.isActionMask()){
                var x = e.x, y = e.y, bb = this.getBundleBounds(this.value);
                if (x < bb.x || y < bb.y || x >= bb.x + bb.width || y >= bb.y + bb.height) {
                    var l = ((this.orient == L.HORIZONTAL) ? x : y), v = this.loc2value(l);
                    if(this.value != v)
                        this.setValue(this.isJumpOnPress ? v
                                                         : this.nextValue(this.value, this.roughStep, v < this.value ? -1:1));
                }
            }
        };

        this.mouseDragStarted = function(e){
            var r = this.getBundleBounds(this.value);
            if(e.x >= r.x && e.y >= r.y && e.x < r.x + r.width && e.y < r.y + r.height){
                this.dragged = true;
                this.correctDt = this.orient == L.HORIZONTAL ? r.x + ~~(r.width  / 2) - e.x
                                                             : r.y + ~~(r.height / 2) - e.y;
            }
        };

        this.mouseDragEnded = function(e){ this.dragged = false; };

        this.canHaveFocus = function() { return true; };

        this.getView = function(d,o){
            this.render.target.setValue(o != null ? o.toString() : "");
            return this.render;
        };
    },

    function() { this.$this(L.HORIZONTAL); },

    function (o){
        this._ = new Listeners();
        this.views = {};
        this.isShowScale = this.isShowTitle = true;
        this.dragged = this.isIntervalMode = false;
        this.render = new pkg.BoldTextRender("");
        this.render.setColor("gray");
        this.orient = o;
        this.setValues(0, 20, [0, 5, 10], 2, 1);
        this.setScaleStep(1);

        this.$overrided();
        this.views["bundle"] = (o == L.HORIZONTAL ? this.views["hbundle"] : this.views["vbundle"]);

        this.provider = this;
    },

    function focused() { 
        this.$overrided();
        this.repaint(); 
    },
    
    function setScaleGap(g){
        if (g != this.gap){
            this.gap = g;
            this.vrp();
        }
    },

    function setScaleColor(c){
        if (c != this.scaleColor) {
            this.scaleColor = c;
            if (this.provider == this) this.render.setColor(c);
            this.repaint();
        }
    },

    function setScaleStep(s){
        if (s != this.scaleStep){
            this.scaleStep = s;
            this.repaint();
        }
    },

    function setShowScale(b){
        if (isShowScale != b){
            this.isShowScale = b;
            this.vrp();
        }
    },

    function setShowTitle(b){
        if (this.isShowTitle != b){
            this.isShowTitle = b;
            this.vrp();
        }
    },

    function setViewProvider(p){
        if (p != this.provider){
            this.provider = p;
            this.vrp();
        }
    },

    function setValues(min,max,intervals,roughStep,exactStep){
        if(roughStep <= 0 || exactStep < 0 || min >= max || 
           min + roughStep > max || min + exactStep > max  ) 
        { 
            throw new Error();
        }

        for(var i = 0, start = min;i < intervals.length; i ++ ){
            start += intervals[i];
            if(start > max || intervals[i] < 0) throw new Error();
        }
        this.min = min;
        this.max = max;
        this.roughStep = roughStep;
        this.exactStep = exactStep;
        this.intervals = Array(intervals.length);
        for(var i=0; i<intervals.length; i++) this.intervals[i] = intervals[i];
        if(this.value < min || this.value > max) {
            this.setValue(this.isIntervalMode ? min + intervals[0] : min);
        }
        this.vrp();
    },

    function invalidate(){
        this.pl = null;
        this.$overrided();
    }
]);
pkg.Slider.prototype.setViews = pkg.$ViewsSetter;


});

