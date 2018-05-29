// Define 'case-view' component

function CaseViewController($scope, $compile) {
	var self = this;

	self.conclusionsMap = getConclusions();

	// output functions
	self.update = function(attr, value) {
		self.onUpdateCase({attr: attr, value: value});	
	}

	self.addEditableBtn = function($event) {
		// editable button text
		var conclusionDiv = $event.currentTarget.parentNode;
		var html = '<editable-btn ' + 
				   	'on-accept="$ctrl.addConclusion(conclusion)" ' +
				   	'on-reject="$ctrl.removeEditableBtn()">' +
				   '</editable-btn>';
		var newButton = angular.element($compile(html)($scope))[0];
		self.newButton = newButton;
		conclusionDiv.appendChild(newButton);
	}

	self.addConclusion = function(conclusion) {
		self.conclusionsMap[conclusion] = conclusion;
		self.removeEditableBtn();
	}

	self.removeEditableBtn = function() {
		self.newButton.remove();
		self.newButton = null;
	}
}

function getConclusions(){
	var conclusionsMap = {
		1: "痘印",
		2: "痤疮",
		3: "酒糟鼻",
		0: "未确诊"
	}
	return conclusionsMap;
}

angular.
	module('caseView').
	component('caseView', {
		templateUrl: 'case-view/case-view.template.html',
		controller: CaseViewController,
		bindings: {
			case: '<',
			onUpdateCase: '&'
		}
	})