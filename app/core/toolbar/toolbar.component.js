// Register 'toolbar' component
const toolMap = {
	'entity': {
		'annotate': 'AW',
		'select': 'SW'
	},
	'sentence': {
		'annotate': 'AS',
		'select': 'SS'
	}
}

function ToolbarController(setActiveBtnInBtnGroup) {
	var self = this;
	self.$onChanges = function(changesObj) {
		// on mode change, reset the tool state
		if (changesObj.mode && changesObj.mode.currentValue != changesObj.mode.previousValue) {
			self.toolMap = toolMap[self.mode];
			self.onUpdate({toolState: "empty"});
			var buttons = document
				.getElementById("toolbar")
				.getElementsByTagName("button");
			for (var idx in buttons) {
				var button = buttons[idx];
				if (button.classList && button.classList.contains("active")) {
					button.className = button.className.replace(" active", "");
				}
					
			}	
		}
		
	}

	self.$onInit = function() {
		self.toolMap = toolMap[self.mode];	
	}
	
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
			mode: '<',
			onUpdate: '&',
			onDelete: '&'
		}
	})