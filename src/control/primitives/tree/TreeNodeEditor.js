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
	"qfacex/windows/control/primitives/PanelVisual"
],function(Class,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Brush,PanelVisual) {

var DefEditors = Class.declare(null,{
	"-attributes-"	:	{
	},
	
	"-methods-"	:	{
		getEditor : function(src,item){
			var o = item.value;
			this.tf.setValue((o == null) ? "" : o.toString());
			return this.tf;
		},

		fetchEditedValue : function(src,editor){ 
			return editor.view.target.getValue(); 
		},

		shouldStartEdit : function(src,e){
			return (e.ID == ui.MouseEvent.CLICKED && e.clicks > 1) ||
			       (e.ID == KE.PRESSED && e.code == KE.ENTER);
		}
	
	},


    constructor	:	function (){
        this.tf = new ui.TextField(new zebra.data.SingleLineTxt(""));
        this.tf.setBackground("white");
        this.tf.setBorder(null);
        this.tf.setPadding(0);
    },

});
		
	
	return TreeNodeEditor;
	
});	
