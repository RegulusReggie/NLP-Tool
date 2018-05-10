// Register 'navbar' component

angular.
	module('core.navbar').
	component('appNavbar', {
		templateUrl: 'core/navbar/navbar.template.html',
		controller: function NavbarController() {
			var self = this;
		}
	})