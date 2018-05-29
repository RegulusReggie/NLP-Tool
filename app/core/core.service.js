// Define common services

var coreModule = angular.module('core');

/*
=======setActiveBtnInBtnGroup=======
Description:
	Set only one button to show as active in a group of buttons.
Params:
	btnElement : the button that will be active.
Requirements in HTML:
	buttons are grouped under the same div.
	For CSS to work, add btn-group class to the parent div.
*/ 
coreModule.factory('setActiveBtnInBtnGroup', function() {
		return function(btnElement) {
			var current = btnElement.parentNode.getElementsByClassName("active");
			if (current.length > 0) {
				current[0].className = current[0].className.replace(" active", "");
			}
			btnElement.className += " active";	
		};
	});