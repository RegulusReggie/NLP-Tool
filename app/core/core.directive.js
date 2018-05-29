// Define common directives

var coreModule = angular.module('core');

/*
=======contenteditable directive=======
Description:
	this directive overrides the default contenteditable attribute and make any element able to bind with ngModel
Usage:
	<div contenteditable="true" ng-model="some-model"></div>
*/
coreModule.directive('contenteditable', function() {
	return {
		require: 'ngModel',
	    restrict: 'A',
	    link: function(scope, elm, attr, ngModel) {
			function updateViewValue() {
				ngModel.$setViewValue(this.innerHTML);
			}
	        
			elm.on('keyup', updateViewValue);
				
			scope.$on('$destroy', function() {
				elm.off('keyup', updateViewValue);
			});

			ngModel.$render = function(){
				elm.html(ngModel.$viewValue);
			}
		}
    }	
});