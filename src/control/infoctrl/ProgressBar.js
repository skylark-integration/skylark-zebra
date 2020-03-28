
define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
	"dijit/form/CheckBox"
],	function(Class, DijitCheckBox){
	var ProgressBarVisual = Class.declare(Control.ControlVisual,{
        paint : function(g){        
            var left = this.getLeft(), right = this.getRight(), top = this.getTop(), bottom = this.getBottom(),
                rs = (this.orientation == L.HORIZONTAL) ? this.width - left - right : this.height - top - bottom,
                bundleSize = (this.orientation == L.HORIZONTAL) ? this.bundleWidth : this.bundleHeight;

            if (rs >= bundleSize){
                var vLoc = ~~((rs * this.value) / this.maxValue),
                    x = left, y = this.height - bottom, bundle = this.bundleView,
                    wh = this.orientation == L.HORIZONTAL ? this.height - top - bottom
                                                          : this.width - left - right;

                while(x < (vLoc + left) && this.height - vLoc - bottom < y){
                    if(this.orientation == L.HORIZONTAL){
                        bundle.paint(g, x, top, bundleSize, wh, this);
                        x += (bundleSize + this.gap);
                    }
                    else{
                        bundle.paint(g, left, y - bundleSize, wh, bundleSize, this);
                        y -= (bundleSize + this.gap);
                    }
                }

                if (this.titleView != null){
                    var ps = this.bundleView.getPreferredSize();
                    this.titleView.paint(g, L.xAlignment(ps.width, L.CENTER, this.width),
                                            L.yAlignment(ps.height, L.CENTER, this.height),
                                            ps.width, ps.height, this);
                }
            }
        }
	});
	
	var ProcessBar =  Class.declare([Control], {
		"-attributes-" : {
			"min"  : {
				type : Number
			},
			"max"  : {
				type : Number
			    setter : function (m){
			        if(m != this.maxValue){
			            this.maxValue = m;
			            this.setValue(this.value);
			            this.vrp();
			        }
			    },
			},
			"value"  : {
				type : Number
			    setter	: function (p){
			        p = p % (this.maxValue + 1);
			        if (this.value != p){
			            var old = this.value;
			            this.value = p;
			            this._.fired(this, old);
			            this.repaint();
			        }
			    }
			},
			"orientation"  : {
				type : Orientation,
				setter : function(o) {
			        if (o != L.HORIZONTAL && o != L.VERTICAL) {
			            throw new Error($invalidO);
			        }
			        if (o != this.orientation){
			            this.orientation = o;
			            this.vrp();
			        }
			    }    
				
			},
		}
	});
	
	return ProgressBar;
});

/*----------------------------------------------------------------------------
 * Sparrow Framework Version 0.8(DEV)                                         
 * Copyright(c) 2006-2008, SW2 Software Laboratory & PST Inc.                 
 *                                                                            
 *--------------------------------------------------------------------------*/


System.defineClass({
	name		: "sw2.widget.ProgressBar",
	superc		: sw2.widget.Control,
	statics		: {
		ORIENT_HORZ : "HORI",
		ORIENT_VERT : "VERT",
		CSSCLASS	: "ProgressBar",

		_initialize : function() {
			Component.registerComponentTag(this,"ProgessBar");
		},
		_defineProperties	: function(propInfo) {
			W.Control._defineProperties(propInfo);
            propInfo.put("min", Number);
            propInfo.put("max", Number);
            propInfo.put("position", Number);
            propInfo.put("showText", Boolean);
//            propInfo.put("textPattern", String);
            propInfo.put("orientation", String);
		}
		
	},
	instances	: {
		_orientation	: "",
		_min			: 0,
		_max			: 100,
		_position		: 0,
		_label			: "",
		_textPattern	: null,
		_showText		: true,

		_elSlider		: null,
		

		_initialize		: function (orient) {
            System.execMethod(this,"_initialize",null,W.Control);
		},

		_doCreateUIElement	: function() {
			var el = System.execMethod(this,"_doCreateUIElement",[],W.Control);
			UIElement.addCssClass(el,"HProgressBar");
			var heDiv = UIDiv.create(el,"Pointer");
            this.$aL = heDiv;


			heTd = ctx.createElement("TD");
			heTd.className = "BarLabel";
			heTd.align = "center";
			heTd.vAlign = "middle";
			heTr = ctx.createElement("TR");
			heTr.appendChild(heTd);
			heTbody = ctx.createElement("TBODY");
			heTbody.appendChild(heTr);
			heTable = ctx.createElement("TABLE");
			heTable.appendChild(heTbody);
			heTable.style.width = "100%";
			heTable.style.height = "100%";
			heTable.cellPadding = 0;
			heTable.cellSpacing = 0;
			heTable.style.position = "absolute";

			el.appendChild(heTable);
			this._label = heTd;
			this._heTable = heTable;

            this.refresh();
	
			return el;
		},		

		_finialize	: function() {
//			this.unEstablishBinding ();
			this.$aL = null;
			this._heTable = null;
			this._label = null;
		},

		refresh		:function () {
			if (this._max < this._min) {
				this._max = this._min;
			}
			if (this._position < this._min) {
				this._position = this._min;
			};
			if (this._position > this._max) {
				this._position = this._max;
			};
			var $gB = (this._position / (this._max - this._min));
			var width = parseInt($gB * 100) + "%";
			this.$aL.style.width = width;
            this.$aL.style.height = "100%";

			if (this._showText) {
				if (this._textPattern != null) {
					var text = this._textPattern.replace("/ \ $ \ {position \}/ g", this._position);
					text = text.replace("/ \ $ \ {min \}	/ g", this._min);
					text = text.replace("/ \ $ \ {max \}	/ g", this._max);
					UILabel.setText(this._label,text);
				} else {
					UILabel.setText(this._label,this._position + "%");
				}
			}
		},

        getMin		: function() {
			return this._min;
		},

		setMin		: function($zh) {
			this._min = $zh;
			this.refresh();
		},

		getMax		: function() {
			return this._max;
		},

		setMax		: function(max) {
			this._max = max;
			this.refresh();
		},

		getPosition		:function() {
			return this._position;
		},

		setPosition		:function(position) {
//			var position = this._position;
			this._position = parseInt(position + 0.5);
			this.refresh();
			//fireUserEvent(this, "onPositionChanged",[this, position]);
		},

		getShowText		: function() {
			return this._showText;
		},

		setShowText		: function(showText) {
			this._showText = showText;
		},

		getTextPattern	: function() {
			return this._textPattern;
		},

		setTextPattern	: function(textPattern) {
			this._textPattern = textPattern;
		}
	}
});


System.defineClass({
	name		: "sw2.widget.VProgressBar",
	superc		: sw2.widget.Control,
	statics		: {
		ORIENT_HORZ : "HORI",
		ORIENT_VERT : "VERT",
		CSSCLASS	: "ProgressBar",

		_initialize : function() {
			Component.registerComponentTag(this,"ProgessBar");
		},
		_defineProperties	: function(propInfo) {
			W.Control._defineProperties(propInfo);
            propInfo.put("min", Number);
            propInfo.put("max", Number);
            propInfo.put("position", Number);
            propInfo.put("showText", Boolean);
//            propInfo.put("textPattern", String);
            propInfo.put("orientation", String);
		}
		
	},
	instances	: {
		_orientation	: "",
		_min			: 0,
		_max			: 100,
		_position		: 0,
		_label			: "",
		_textPattern	: null,
		_showText		: true,

		_elSlider		: null,
		

		_initialize		: function (orient) {
            System.execMethod(this,"_initialize",null,W.Control);
			if (!orient) {
				orient = W.ProgressBar.ORIENT_HORZ;
			}
            if (orient != null && orient != "")
                this.setOrientation(orient);
		},

		_doCreateUIElement	: function() {
			var el = System.execMethod(this,"_doCreateUIElement",[],W.Control);
			UIElement.addCssClass(el,"VProgressBar");

			var heDiv = UIDiv.create(el,"Pointer");
			heDiv.style.width = "100%";
			heDiv.style.height = "100%";

            var heTd, heTr, heTbody;
			heTbody = ctx.createElement("TBODY");
			heTr = ctx.createElement("TR");
			heTd = ctx.createElement("TD");
			heTd.appendChild(heDiv);
            this.$aL = heDiv;
            this.$bL = heTd;
			heTr.appendChild(heTd);
			heTbody.appendChild(heTr);


			heTable = ctx.createElement("TABLE");
			heTable.cellPadding = 0;
			heTable.cellSpacing = 0;
			heTable.style.width = "100%";
			heTable.style.height = "100%";
			heTable.style.tableLayout = "fixed";
            heTable.style.position = "absolute";
			heTable.appendChild(heTbody);

			el.appendChild(heTable);

			heTd = ctx.createElement("TD");
			heTd.className = "BarLabel";
			heTd.align = "center";
			heTd.vAlign = "middle";
			heTr = ctx.createElement("TR");
			heTr.appendChild(heTd);
			heTbody = ctx.createElement("TBODY");
			heTbody.appendChild(heTr);
			heTable = ctx.createElement("TABLE");
			heTable.appendChild(heTbody);
			heTable.style.width = "100%";
			heTable.style.height = "100%";
			heTable.cellPadding = 0;
			heTable.cellSpacing = 0;
			heTable.style.position = "absolute";

			el.appendChild(heTable);
			this._label = heTd;
			this._heTable = heTable;

            this.refresh();
	
			return el;
		},
	

		_finialize	: function() {
//			this.unEstablishBinding ();
			this.$aL = null;
			this._heTable = null;
			this._label = null;
		},

		refresh		:function () {
			if (this._max < this._min) {
				this._max = this._min;
			}
			if (this._position < this._min) {
				this._position = this._min;
			};
			if (this._position > this._max) {
				this._position = this._max;
			};
			var $gB = (this._position / (this._max - this._min));
            var height = parseInt($gB * 100) + "%";
			this.$aL.style.height = height;
			if (this._showText) {
				if (this._textPattern != null) {
					var text = this._textPattern.replace("/ \ $ \ {position \}/ g", this._position);
					text = text.replace("/ \ $ \ {min \}	/ g", this._min);
					text = text.replace("/ \ $ \ {max \}	/ g", this._max);
					UILabel.setText(this._label,text);
				} else {
					UILabel.setText(this._label,this._position + "%");
				}
			}
		},

        getOrientation  : function() {
            return this._orientation;
        },

        setOrientation  : function(orient) {

        },

        getMin		: function() {
			return this._min;
		},

		setMin		: function($zh) {
			this._min = $zh;
			this.refresh();
		},

		getMax		: function() {
			return this._max;
		},

		setMax		: function(max) {
			this._max = max;
			this.refresh();
		},

		getPosition		:function() {
			return this._position;
		},

		setPosition		:function(position) {
//			var position = this._position;
			this._position = parseInt(position + 0.5);
			this.refresh();
			//fireUserEvent(this, "onPositionChanged",[this, position]);
		},

		getShowText		: function() {
			return this._showText;
		},

		setShowText		: function($xD) {
			this._showText = $xD;
		},

		getTextPattern	: function() {
			return this._textPattern;
		},

		setTextPattern	: function($yI) {
			this._textPattern = $yI;
		}
	}
});
