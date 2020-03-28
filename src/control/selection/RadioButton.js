define([
	"qscript/lang/Class",
	"qfacex/windows/control/primitives/selection/RadioButtonBoxView"
], function(Class, DjtRadioButton,){
pkg.RadioView = Class(View, [
    function() {
        this.$this("rgb(15, 81, 205)", "rgb(65, 131, 255)");
    },

    function(col1, col2) {
        this.color1 = col1;
        this.color2 = col2;
    },
    
    function $prototype() {
        this.paint = function(g,x,y,w,h,d){
            g.beginPath();            

            g.fillStyle = this.color1;
            g.arc(x + w/2, y + h/2 , w/3 , 0, 2* Math.PI, 1, false);
            g.fill();

            g.beginPath();
            g.fillStyle = this.color2;
            g.arc(x + w/2, y + h/2 , w/4 , 0, 2* Math.PI, 1, false);
            g.fill();
        };
    }
]);

	return Class.declare([DjtRadioButton], {
	});
});
