define([
	"qscript/lang/Class",
	"qfacex/windows/control/ItemsControl"
],function(Class,ItemsControl) {
	
	var HeaderedItemsControl  = Class.declare(ItemsControl,{
		//<<summary
		//�����̍��ڂō\������A�w�b�_�[�����R���g���[����\���܂��B
		//summary>>
		"-protected-" : {
		},
		
		"-attributes-" : {
			"hasHeader"	: {
				//<<summary
				//���� HeaderedItemsControl �Ƀw�b�_�[�����邩�ǂ����������l���擾���܂��B
				//summary>>
				type : Boolean
			},
			"header" : {
				//<<summary
				//�R���g���[���Ƀ��x����t���鍀�ڂ��擾�܂��͐ݒ肵�܂��B
				//summary>>
				type : Object
			},
			
			headerTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return HeaderedItemsControl;
	
});	
