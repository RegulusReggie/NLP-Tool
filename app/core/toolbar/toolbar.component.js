// Register 'toolbar' component

angular.
	module('core.toolbar').
	component('appToolbar', {
		templateUrl: 'core/toolbar/toolbar.template.html',
		controller: function ToolbarController() {
			var self = this;
		}
	})