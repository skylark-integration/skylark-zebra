define([
	"qscript/lang/Class", // declare
	"qfacex/windows/control/ItemsControl"
], function(Class,ItemsControl){

	var ListBox = Class.declare([ItemsControl], {
		"-protected-"	:	{
			"-methods-"	:	{
		        vVisibility : function(){
		            this.validate();
		            var prev = this.vArea;
		            
		            this.vArea = this.calcVisibleArea({});

		            if (this.vArea == null) {
		                this.firstVisible = -1;
		                return;
		            }

		            if (this.visValid === false ||
		                (prev == null || prev.x != this.vArea.x ||
		                 prev.y != this.vArea.y || prev.width != this.vArea.width ||
		                 prev.height != this.vArea.height))
		            {
		                var top = this.getTop(), gap = this.itemGap;
		                if (this.firstVisible >= 0){
		                    var dy = this.scrollTop;
		                    while (this.firstVisibleY + dy >= top && this.firstVisible > 0){
		                        this.firstVisible--;
		                        this.firstVisibleY -= (this.heights[this.firstVisible] + 2 * gap);
		                    }
		                } else {
		                    this.firstVisible = 0;
		                    this.firstVisibleY = top + gap;
		                }

		                if (this.firstVisible >= 0){
		                    var count = this.model.count(), hh = this.height - this.getBottom();

		                    for(; this.firstVisible < count; this.firstVisible++)
		                    {
		                        var y1 = this.firstVisibleY + this.scrollManager.getSY(),
		                            y2 = y1 + this.heights[this.firstVisible] - 1;

		                        if ((y1 >= top && y1 < hh) || (y2 >= top && y2 < hh) || (y1 < top && y2 >= hh)) {
		                            break;
		                        }

		                        this.firstVisibleY += (this.heights[this.firstVisible] + 2 * gap);
		                    }

		                    if (this.firstVisible >= count) this.firstVisible =  -1;
		                }
		                this.visValid = true;
		            }
		        }
			
			
			}
		},
		
		"-public-"	:	{
			"
			"-methods-"	:	{
		        paint : function(g){
		            this.vVisibility();
		            if (this.firstVisible >= 0){
		                var sx = this.scrollManager.getSX(), sy = this.scrollManager.getSY();
		                try {
		                    g.translate(sx, sy);
		                    var gap = this.getItemGap(), y = this.firstVisibleY, x = this.getLeft() + gap,
		                        yy = this.vArea.y + this.vArea.height - sy, count = this.model.count(),
		                        provider = this.provider;

		                    for(var i = this.firstVisible; i < count; i++){
		                        provider.getView(this, this.model.get(i)).paint(g, x, y, this.widths[i], this.heights[i], this);
		                        y += (this.heights[i] + 2 * gap);
		                        if (y > yy) break;
		                    }
		                }
		                catch(e) { throw e; }
		                finally { g.translate(-sx,  -sy); }
		            }
		        },

		        recalc : function(){
		            this.psWidth_ = this.psHeight_ = 0;
		            var count = this.model.count();
		            if (this.heights == null || this.heights.length != count) this.heights = Array(count);
		            if (this.widths  == null || this.widths.length  != count) this.widths  = Array(count);

		            var provider = this.provider;
		            if (provider != null) {
		                for(var i = 0;i < count; i++){
		                    var ps = provider.getView(this, this.model.get(i)).getPreferredSize();
		                    this.heights[i] = ps.height;
		                    this.widths [i] = ps.width;
		                    if (this.widths[i] > this.psWidth_) this.psWidth_ = this.widths[i];
		                    this.psHeight_ += this.heights[i];
		                }
		            }
		        },

		        calcPreferredSize : function(l){
		            var gap = 2 * this.getItemGap();
		            return { width:gap + this.psWidth_, height:gap * this.model.count() + this.psHeight_ };
		        },


		        getItemLocation : function(index){
		            this.validate();
		            var gap = this.getItemGap(), y = this.getTop() + this.scrollManager.getSY() + gap;
		            for(var i = 0;i < index; i++) y += (this.heights[i] + 2 * gap);
		            return { x:this.getLeft() + this.getItemGap(), y:y };
		        },

		        getItemSize : function(i){
		            this.validate();
		            return { width:this.widths[i], height:this.heights[i] };
		        },

		        getItemIdxAt : function(x,y){
		            this.vVisibility();
		            if (this.vArea != null && this.firstVisible >= 0) {
		                var yy    = this.firstVisibleY + this.scrollManager.getSY(),
		                    hh    = this.height - this.getBottom(),
		                    count = this.model.count(), gap = this.getItemGap() * 2;

		                for(var i = this.firstVisible; i < count; i++) {
		                    if (y >= yy && y < yy + this.heights[i]) return i;
		                    yy += (this.heights[i] + gap);
		                    if (yy > hh) break;
		                }
		            }
		            return  -1;
		        }
		   }     
		
		}
	});
	
	
	return ListBox;


});

