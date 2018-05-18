// Register 'toolbar' component
const toolMap = {
	'annotate-word': 'AW',
	'select-word': 'SW'
}

function ToolbarController(setActiveBtnInBtnGroup) {
	var self = this;
	self.toolMap = toolMap;
	self.changeTool = function($event, toolKey) {
		var btnElement = $event.currentTarget
		if (btnElement.classList.contains("active")) {
			btnElement.className = btnElement.className.replace(" active", "");
			self.onUpdate({toolState: "empty"});
		} else {
			setActiveBtnInBtnGroup(btnElement);	
			self.onUpdate({toolState: toolKey});
		}
	};
	self.delete = function() {
		self.onDelete();
	}
}

angular.
	module('core.toolbar').
	component('appToolbar', {
		templateUrl: 'core/toolbar/toolbar.template.html',
		controller: ['setActiveBtnInBtnGroup', ToolbarController],
		bindings: {
			onUpdate: '&',
			onDelete: '&'
		}
	})