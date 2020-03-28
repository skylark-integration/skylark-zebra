define([
	"qscript/lang/Class",
	"qscript/lang/Stateful",
	"qfacex/windows/controlss/_Layoutable"
],function(Class,Statefu,_Layoutable) {

pkg.SplitPan = Class(pkg.Panel, [
    function $clazz() {
        this.Bar = Class(pkg.StatePan, MouseListener, Cursorable, [
            function $prototype() {
                this.mouseDragged = function(e){
                    var x = this.x + e.x, y = this.y + e.y;
                    if (this.target.orientation == L.VERTICAL){
                        if (this.prevLoc != x){
                            x = this.target.normalizeBarLoc(x);
                            if (x > 0){
                                this.prevLoc = x;
                                this.target.setGripperLoc(x);
                            }
                        }
                    }
                    else {
                        if (this.prevLoc != y){
                            y = this.target.normalizeBarLoc(y);
                            if (y > 0){
                                this.prevLoc = y;
                                this.target.setGripperLoc(y);
                            }
                        }
                    }
                };

                this.mouseDragStarted = function (e){
                    var x = this.x + e.x, y = this.y + e.y;
                    if (e.isActionMask()) {
                        if (this.target.orientation == L.VERTICAL){
                            x = this.target.normalizeBarLoc(x);
                            if(x > 0) this.prevLoc = x;
                        }
                        else{
                            y = this.target.normalizeBarLoc(y);
                            if(y > 0) this.prevLoc = y;
                        }
                    }
                };

                this.mouseDragEnded = function(e){
                    var xy = this.target.normalizeBarLoc(this.target.orientation == L.VERTICAL ? this.x + e.x : this.y + e.y);
                    if (xy > 0) this.target.setGripperLoc(xy);
                };

                this.getCursorType = function(t,x,y){
                    return this.target.orientation == L.VERTICAL ? Cursor.W_RESIZE
                                                                 : Cursor.N_RESIZE;
                };
            },

            function(target) {
                this.prevLoc = 0;
                this.target = target;
                this.$overrided();
            }
        ]);
    },

    function $prototype() {
        this.leftMinSize = this.rightMaxSize = 50;
        this.isMoveable = true;
        this.gap = 1;

        this.normalizeBarLoc = function(xy){
            if( xy < this.minXY) xy = this.minXY;
            else if (xy > this.maxXY) xy = this.maxXY;
            return (xy > this.maxXY || xy < this.minXY) ?  -1 : xy;
        };

        this.setGripperLoc = function(l){
            if(l != this.barLocation){
                this.barLocation = l;
                this.vrp();
            }
        };

        this.calcPreferredSize = function(c){
            var fSize = pkg.getPreferredSize(this.leftComp),
                sSize = pkg.getPreferredSize(this.rightComp),
                bSize = pkg.getPreferredSize(this.gripper);

            if(this.orientation == L.HORIZONTAL){
                bSize.width = Math.max(Math.max(fSize.width, sSize.width), bSize.width);
                bSize.height = fSize.height + sSize.height + bSize.height + 2 * this.gap;
            }
            else{
                bSize.width = fSize.width + sSize.width + bSize.width + 2 * this.gap;
                bSize.height = Math.max(Math.max(fSize.height, sSize.height), bSize.height);
            }
            return bSize;
        };

        this.doLayout = function(target){
            var right = this.getRight(), top = this.getTop(), bottom = this.getBottom(),
                left = this.getLeft(), bSize = pkg.getPreferredSize(this.gripper);

            if (this.orientation == L.HORIZONTAL){
                var w = this.width - left - right;
                if (this.barLocation < top) this.barLocation = top;
                else {
                    if (this.barLocation > this.height - bottom - bSize.height) {
                        this.barLocation = this.height - bottom - bSize.height;
                    }
                }

                if(this.gripper != null){
                    if(this.isMoveable){
                        this.gripper.setLocation(left, this.barLocation);
                        this.gripper.setSize(w, bSize.height);
                    }
                    else{
                        this.gripper.setSize(bSize.width, bSize.height);
                        this.gripper.toPreferredSize();
                        this.gripper.setLocation(~~((w - bSize.width) / 2), this.barLocation);
                    }
                }
                if(this.leftComp != null){
                    this.leftComp.setLocation(left, top);
                    this.leftComp.setSize(w, this.barLocation - this.gap - top);
                }
                if(this.rightComp != null){
                    this.rightComp.setLocation(left, this.barLocation + bSize.height + this.gap);
                    this.rightComp.setSize(w, this.height - this.rightComp.y - bottom);
                }
            }
            else {
                var h = this.height - top - bottom;
                if(this.barLocation < left) this.barLocation = left;
                else {
                    if (this.barLocation > this.width - right - bSize.width) {
                        this.barLocation = this.width - right - bSize.width;
                    }
                }

                if (this.gripper != null){
                    if(this.isMoveable){
                        this.gripper.setLocation(this.barLocation, top);
                        this.gripper.setSize(bSize.width, h);
                    }
                    else{
                        this.gripper.setSize(bSize.width, bSize.height);
                        this.gripper.setLocation(this.barLocation, ~~((h - bSize.height) / 2));
                    }
                }

                if (this.leftComp != null){
                    this.leftComp.setLocation(left, top);
                    this.leftComp.setSize(this.barLocation - left - this.gap, h);
                }

                if(this.rightComp != null){
                    this.rightComp.setLocation(this.barLocation + bSize.width + this.gap, top);
                    this.rightComp.setSize(this.width - this.rightComp.x - right, h);
                }
            }
        };

        this.setGap = function (g){
            if(this.gap != g){
                this.gap = g;
                this.vrp();
            }
        };

        this.setLeftMinSize = function (m){
            if(this.leftMinSize != m){
                this.leftMinSize = m;
                this.vrp();
            }
        };

        this.setRightMaxSize = function(m){
            if(this.rightMaxSize != m){
                this.rightMaxSize = m;
                this.vrp();
            }
        };

        this.setGripperMovable = function (b){
            if(b != this.isMoveable){
                this.isMoveable = b;
                this.vrp();
            }
        };
    },

    function (){ this.$this(null, null, L.VERTICAL); },
    function (f,s){ this.$this(f, s, L.VERTICAL); },

    function (f,s,o){
        this.minXY = this.maxXY = 0;
        this.barLocation = 70;
        this.leftComp = this.rightComp = this.gripper = null;
        this.orientation = o;
        this.$overrided();

        if (f != null) this.add(L.LEFT, f);
        if (s != null) this.add(L.RIGHT, s);
        this.add(L.CENTER, new pkg.SplitPan.Bar(this));
    },

    function kidAdded(index,id,c){
        this.$overrided(index, id, c);
        if (L.LEFT == id) this.leftComp = c;
        else {
            if (L.RIGHT == id) this.rightComp = c;
            else {
                if (L.CENTER == id) this.gripper = c;
                else throw new Error($invalidC);
            }
        }
    },

    function kidRemoved(index,c){
        this.$overrided(index, c);
        if (c == this.leftComp) this.leftComp = null;
        else {
            if (c == this.rightComp) this.rightComp = null;
            else {
                if (c == this.gripper) this.gripper = null;
            }
        }
    },

    function resized(pw,ph) {
        var ps = this.gripper.getPreferredSize();
        if (this.orientation == L.VERTICAL){
            this.minXY = this.getLeft() + this.gap + this.leftMinSize;
            this.maxXY = this.width - this.gap - this.rightMaxSize - ps.width - this.getRight();
        }
        else {
            this.minXY = this.getTop() + this.gap + this.leftMinSize;
            this.maxXY = this.height - this.gap - this.rightMaxSize - ps.height - this.getBottom();
        }
        this.$overrided(pw, ph);
    }
]);
	
});	
