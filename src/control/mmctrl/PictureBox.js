define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
],	function(Class, Control){
	var PictureBoxVisual = Class.declare(Control.ControlVisual,{
        paint : function(g,x,y,w,h,d){        
	        if (this.target != null && w > 0 && h > 0){
	            var img = this.target;
	            if (this.buffer) {
	                img = this.buffer;
	                if (img.width <= 0) {
	                    var ctx = img.getContext("2d");
	                    if (this.width > 0) {
	                        img.width  = this.width;
	                        img.height = this.height;
	                        ctx.drawImage(this.target, this.x, this.y, this.width,
	                                      this.height, 0, 0, this.width, this.height);
	                    }
	                    else {
	                        img.width  = this.target.width;
	                        img.height = this.target.height;
	                        ctx.drawImage(this.target, 0, 0);
	                    }
	                }
	            }

	            if (this.width > 0 && !this.buffer) {
	                g.drawImage(img, this.x, this.y,
	                            this.width, this.height, x, y, w, h);
	            }
	            else {
	                g.drawImage(img, x, y, w, h);
	            }
	        }
        }
	});
	
	var PictureBox = Class.declare([Control], {
        getPreferredSize : function(){
            var img = this.target;
            return img == null ? { width:0, height:0 }
                               : (this.width > 0) ? { width:this.width, height:this.height }
                                                  : { width:img.width, height:img.height };
        }
	});
	
	return PictureBox;
});
