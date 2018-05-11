// Register 'toolbar' component
const toolMap = {
	'delete': '<i class="fa fa-trash"></i>',
	'annotate-word': 'AW',
	'select-word': 'SW',
	'annotate-sentence': 'AS',
	'default': 'D'
}

function ToolbarController(setActiveBtnInBtnGroup) {
	var self = this;
	self.toolMap = toolMap
	self.changeTool = function($event, toolKey) {
		setActiveBtnInBtnGroup($event.currentTarget);
		self.onUpdate({toolState: toolKey});
	};
}

angular.
	module('core.toolbar').
	component('appToolbar', {
		templateUrl: 'core/toolbar/toolbar.template.html',
		controller: ['setActiveBtnInBtnGroup', ToolbarController],
		bindings: {
			onUpdate: '&'
		}
	})