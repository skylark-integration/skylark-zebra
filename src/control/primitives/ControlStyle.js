define([
	"qscript/lang/Enum"
],function(Enmu) {
	
	//ControlStyle �v���p�e�B�́C�R���g���[�����}�E�X�C�x���g���L���v�`�����邩�ǂ����C�R���g���[�����Œ�T�C�Y���ǂ����Ȃǂ�
	//�R���g���[���̊e��̑����𒲂ׂ邱�Ƃ��ł��܂��BControlStyle �v���p�e�B�ɂ͂����̑�����������A�̃X�^�C���t���O�������Ă��܂��B
	//CaptureMouse:�}�E�X���N���b�N�����Ƃ��C�R���g���[���̓}�E�X�C�x���g���L���v�`������B
	//
	var ControlStyle =  Enum.declare({
		"-options-"	:	["CaptureMouse","Movable","Focusable","Scrollable","CanHaveChildren","CanHaveOneChild"]
		});

	return ControlStyle;
	
});	
