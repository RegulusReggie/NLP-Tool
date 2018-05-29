// Define 'editable-btn' component

function EditableBtnController() {
	var self = this;
	self.$onInit = function() {
		self.newButtonText = "新结论";	
	}
	self.acceptNewButton = function() {
		self.onAccept({conclusion: self.newButtonText});
	}
	self.rejectNewButton = function() {
		self.onReject();
	}
	self.changeButtonText = function($event) {
		self.newButtonText = $event.currentTarget.innerHTML;
	}
}

angular.
	module('core.editable-btn').
	component('editableBtn', {
		templateUrl: 'core/editable-btn/editable-btn.template.html',
		controller: EditableBtnController,
		bindings: {
			onAccept: '&',
			onReject: '&'
		}
	});