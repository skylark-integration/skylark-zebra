define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
],	function(Class, Control){

pkg.VideoPan = Class(pkg.Panel,  [
    function $prototype() {
        this.paint = function(g) {
            g.drawImage(this.video, 0, 0);
        };

        this.run = function() {
            this.repaint();
        };
    },

    function(src) {
        var $this = this;
        this.video = document.createElement("video");
        this.video.setAttribute("src", src);
        this.volume = 0.5;
        this.video.addEventListener("canplaythrough", function() { zebra.util.timer.start($this, 500, 40); }, false);
        this.video.addEventListener("ended", function() { zebra.util.timer.stop($this); $this.ended(); }, false);
        this.$overrided();
    },

    function ended() {}
]);


});
