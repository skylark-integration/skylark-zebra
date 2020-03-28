define( [
	"qscript/lang/Class",
	"qfacex/windows/controls/ContentControl",
],	function(Class, Control){

	var Button = Class.declare([ContentControl], {
		"-attributes-"	:	{
			"text"	:	{
				type	:	String
			}	
		
		}
	});
	
	return Button;
});
