define([
	"qscript/lang/Class",
	"qscript/data/geom/Geometry",
	"qscript/data/geom/Rect",
	"qscript/data/geom/Ellipse",
	"qscript/data/geom/Line",
	"qscript/data/geom/Polyline",
	"qscript/data/geom/Arrow",
	"qscript/data/styles/Pen",
	"qscript/data/styles/Brush",
	"qscript/data/styles/Border",
	"qscript/data/styles/Padding",
	"qfacex/windows/control/primitives/PanelVisual"
],function(
	Class,
	Geometry,
	Rect,
	Ellipse,
	Line,
	Polyline,
	Arrow,
	Pen,
	Brush,
	Border,
	Padding,
	PanelVisual
) {


/**
 * Text render that expects and draws a text model or a string as its target
 * @class zebra.ui.TextRender
 * @constructor 
 * @extends zebra.ui.Render
 * @param  {String|zebra.data.TextModel} text a text as string or text model object
 */
pkg.TextRender = Class(pkg.Render, zebra.util.Position.Metric, [
    function $prototype() {
        /**
         * UI component that holds the text render
         * @attribute owner
         * @default null
         * @readOnly
         * @protected
         * @type {zebra.ui.Panel}
         */
        this.owner = null;

        /**
         * Get a line indent 
         * @default 1
         * @return {Integer} line indent
         * @method getLineIndent
         */
        this.getLineIndent = function() {
            return 1;
        };

        /**
         * Get number of lines of target text
         * @return   {Integer} a number of line in the target text
         * @method getLines
         */
        this.getLines = function() {
            return this.target.getLines();
        };

        this.getLineSize   = function(l) {
            return this.target.getLine(l).length + 1;
        };

        /**
         * Get the given line height in pixels
         * @param {Integer} l a line number
         * @return {Integer} a line height in pixels
         * @method getLineHeight
         */
        this.getLineHeight = function(l) { return this.font.height; };

        this.getMaxOffset  = function()  { return this.target.getTextLength(); };
        
        /**
         * Called whenever an owner UI component has been changed
         * @param  {zebra.ui.Panel} v a new owner UI component
         * @method ownerChanged
         */
        this.ownerChanged  = function(v) { this.owner = v; };
        
        /**
         * Paint the specified text line
         * @param  {2DContext} g graphical 2D context
         * @param  {Integer} x x coordinate
         * @param  {Integer} y y coordinate
         * @param  {Integer} line a line number
         * @param  {zebra.ui.Panel} d an UI component on that the line has to be rendered
         * @method paintLine
         */
        this.paintLine = function(g,x,y,line,d) { 
            g.fillText(this.getLine(line), x, y + this.font.ascent);
        };
        
        /**
         * Get text line by the given line number
         * @param  {Integer} r a line number
         * @return {String} a text line
         * @method getLine
         */
        this.getLine = function(r) {
            return this.target.getLine(r);
        };

        this.targetWasChanged = function(o,n){
            if (o != null) o._.remove(this);
            if (n != null) {
                n._.add(this);
                this.invalidate(0, this.getLines());
            }
            else this.lines = 0;
        };

        /**
         * Get the rendered target text as string object
         * @return {String} rendered text
         * @method getValue
         */
        this.getValue = function(){
            var text = this.target;
            return text == null ? null : text.getValue();
        };

        /**
         * Get the given text line width in pixels
         * @param  {Integer} line a text line number
         * @return {Inetger} a text line width in pixels
         * @method lineWidth
         */
        this.lineWidth = function(line){
            this.recalc();
            return this.target.getExtraChar(line);
        };

        /**
         * Called every time the target text metrics has to be recalculated
         * @method recalc
         */
        this.recalc = function(){
            if (this.lines > 0 && this.target != null){
                var text = this.target;
                if (text != null) {
                    if (this.lines > 0) {
                        for(var i = this.startLine + this.lines - 1;i >= this.startLine; i-- ){
                            text.setExtraChar(i, this.font.stringWidth(this.getLine(i)));
                        }
                        this.startLine = this.lines = 0;
                    }
                    this.textWidth = 0;
                    var size = text.getLines();
                    for(var i = 0;i < size; i++){
                        var len = text.getExtraChar(i);
                        if (len > this.textWidth) this.textWidth = len;
                    }
                    this.textHeight = this.getLineHeight() * size + (size - 1) * this.getLineIndent();
                }
            }
        };

        /**
         * Text model update listener handler 
         * @param  {zebra.data.TextModel} src text model object
         * @param  {Boolean} b 
         * @param  {Integer} off an offset starting from that 
         * the text has been updated 
         * @param  {Integer} size a size (in character) of text part that 
         * has been updated 
         * @param  {Integer} ful a first affected by the given update line
         * @param  {Integer} updatedLines a number of text lines that have 
         * been affected by text updating 
         * @method textUpdated
         */
        this.textUpdated = function(src,b,off,size,ful,updatedLines){
            if (b === false) {
                if (this.lines > 0) {
                    var p1 = ful - this.startLine, 
                        p2 = this.startLine + this.lines - ful - updatedLines;
                    this.lines = ((p1 > 0) ? p1 : 0) + ((p2 > 0) ? p2 : 0) + 1;
                    this.startLine = this.startLine < ful ? this.startLine : ful;
                }
                else {
                    this.startLine = ful;
                    this.lines = 1;
                }
                if (this.owner != null) this.owner.invalidate();
            }
            else {
                if (this.lines > 0){
                    if (ful <= this.startLine) this.startLine += (updatedLines - 1);
                    else {
                        if (ful < (this.startLine + size)) size += (updatedLines - 1);
                    }
                }
                this.invalidate(ful, updatedLines);
            }
        };

        /**
         * Invalidate metrics for the specified range of lines. 
         * @param  {Integer} start first line to be invalidated
         * @param  {Integer} size  number of lines to be invalidated 
         * @method invalidate
         * @private
         */
        this.invalidate = function(start,size){
            if (size > 0 && (this.startLine != start || size != this.lines)) {
                if (this.lines === 0){
                    this.startLine = start;
                    this.lines = size;
                }
                else {
                    var e = this.startLine + this.lines;
                    this.startLine = start < this.startLine ? start : this.startLine;
                    this.lines     = Math.max(start + size, e) - this.startLine;
                }

                if (this.owner != null) {
                    this.owner.invalidate();
                }
            }
        };

        this.getPreferredSize = function(){
            this.recalc();
            return { width:this.textWidth, height:this.textHeight };
        };

        this.paint = function(g,x,y,w,h,d) {
            var ts = g.getTopStack();
            if (ts.width > 0 && ts.height > 0) {
                var lineIndent = this.getLineIndent(), lineHeight = this.getLineHeight(), lilh = lineHeight + lineIndent;
                w = ts.width  < w ? ts.width  : w;
                h = ts.height < h ? ts.height : h;
                var startLine = 0;
                if (y < ts.y) {
                    startLine = ~~((lineIndent + ts.y - y) / lilh);
                    h += (ts.y - startLine * lineHeight - startLine * lineIndent);
                }
                else if (y > (ts.y + ts.height)) return;

                var size = this.target.getLines();
                if (startLine < size){
                    var lines =  ~~((h + lineIndent) / lilh) + (((h + lineIndent) % lilh > lineIndent) ? 1 : 0);
                    if (startLine + lines > size) lines = size - startLine;
                    y += startLine * lilh;

                    g.setFont(this.font);
                    if (d == null || d.isEnabled === true){
                        var fg = this.color;
                        g.setColor(fg);
                        for(var i = 0;i < lines; i++){
                            if (d && d.getStartSelection) {
                                var p1 = d.getStartSelection();
                                if (p1 != null){
                                    var p2 = d.getEndSelection(), line = i + startLine;
                                    if ((p1[0] != p2[0] || p1[1] != p2[1]) && line >= p1[0] && line <= p2[0]){
                                        var s = this.getLine(line), lw = this.lineWidth(line), xx = x;
                                        if (line == p1[0]) {
                                            var ww = this.font.charsWidth(s, 0, p1[1]);
                                            xx += ww;
                                            lw -= ww;
                                            if (p1[0] == p2[0]) lw -= this.font.charsWidth(s, p2[1], s.length - p2[1]);
                                        }
                                        else {
                                            if (line == p2[0]) lw = this.font.charsWidth(s, 0, p2[1]);
                                        }
                                        this.paintSelection(g, xx, y, lw === 0 ? 1 : lw, lilh, line, d);
                                        // restore foreground color after selection has been rendered
                                        g.setColor(fg);
                                    }
                                }
                            }
                            this.paintLine(g, x, y, i + startLine, d);
                            y += lilh;
                        }
                    }
                    else {
                        var c1 = pkg.disabledColor1, c2 = pkg.disabledColor2;
                        for(var i = 0;i < lines; i++){
                            if (c1 != null){
                                g.setColor(c1);
                                this.paintLine(g, x, y, i + startLine, d);
                            }
                            if (c2 != null){
                                g.setColor(c2);
                                this.paintLine(g, x + 1, y + 1, i + startLine, d);
                            }
                            y += lilh;
                        }
                    }
                }
            }
        };


        /**
         * Set the text model content 
         * @param  {String} s a text as string object
         * @method setValue
         */
        this.setValue = function (s) {
            this.target.setValue(s);
        };

        /**
         * Set the rendered text font.  
         * @param  {String|zebra.ui.Font} f a font as CSS string or zebra.ui.Font class instance 
         * @method setFont
         */
        this.setFont = function(f){
            var old = this.font;
            if (f && zebra.isString(f)) f = new pkg.Font(f);
            if (f != old && (f == null || f.s != old.s)){
                this.font = f;
                this.invalidate(0, this.getLines());
            }
        };

        /**
         * Set rendered text color 
         * @param  {String} c a text color
         * @method setColor
         */
        this.setColor = function(c){
            if (c != this.color) {
                this.color = c;
                return true;
            }
            return false;
        };
    },

    function(text) {
        /**
         * Text color
         * @attribute color
         * @type {String}
         * @default zebra.ui.fontColor
         * @readOnly
         */
        this.color = pkg.fontColor;

        /**
         * Text font
         * @attribute font
         * @type {String|zebra.ui.Font}
         * @default zebra.ui.font
         * @readOnly
         */
        this.font  = pkg.font;

        this.textWidth = this.textHeight = this.startLine = this.lines = 0;
        //!!!
        //!!! since text is widely used structure we do slight hack - don't call parent constructor
        //!!!
        this.setTarget(zebra.isString(text) ? new zebra.data.Text(text) : text);
    }
]);

	var TextVisual = Class.declare(PanelVisual, {
		// summary:
		//		a Shape object, which knows how to apply
		//		graphical attributes and transformations
		
		"-protected-"	:	{
			
			"_drawContent"	:	function(gdi){
			
			}
		},
		
		"-public-"	:	{

			"-attributes-" : {
				"lineIndent"	:	{
					"type"		:	Number,
					"default"	:	1
				}
			},
			
			"-methods-"	:	{
		        /**
		         * Paint the specified text selection of the given line. The area 
		         * where selection has to be rendered is denoted with the given
		         * rectangular area.
		         * @param  {2DContext} g a canvas graphical context
		         * @param  {Integer} x a x coordinate of selection rectangular area  
		         * @param  {Integer} y a y coordinate of selection rectangular area  
		         * @param  {Integer} w a width of of selection rectangular area  
		         * @param  {Integer} h a height of of selection rectangular area  
		         * @param  {Integer} line [description]
		         * @param  {zebra.ui.Panel} d a target UI component where the text 
		         * is rendered
		         * @protected
		         * @method paintSelection
		         */
		        paintSelection : function(gdi, x, y, w, h, line, d){
		            gdi.setColor(d.selectionColor);
		            gdi.fillRect(x, y, w, h);
		        },
			}
		}	

	
		"-constructor-"	:	{
		}
	});
		
	return TextVisual;
	
});	
