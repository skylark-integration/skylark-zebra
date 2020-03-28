
define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/Control",
	"dijit/form/CheckBox"
],	function(Class, DijitCheckBox){

pkg.StatusBar = Class(pkg.Panel, [
    function () { this.$this(2); },

    function (gap){
        this.setPaddings(gap, 0, 0, 0);
        this.$overrided(new L.PercentLayout(Layout.HORIZONTAL, gap));
    },

    function setBorderView(v){
        if(v != this.borderView){
            this.borderView = v;
            for(var i = 0;i < this.kids.length; i++) this.kids[i].setBorder(this.borderView);
            this.repaint();
        }
    },

    function insert(i,s,d){
        d.setBorder(this.borderView);
        this.$overrided(i, s, d);
    }
]);

});
