// Define 'attribute-view' component
function AttributeViewController() {
	var self = this;
	self.update = function(attr, value) {
		self.onUpdate({entity: self.entity, attr: attr, value: value});
	}
	self.$onChanges = function(changesObj) {
		//console.log(self.entity)
	}
}

angular.
	module('attributeView').
	component('attributeView', {
		templateUrl: 'attribute-view/attribute-view.template.html',
		controller: AttributeViewController,
		bindings: {
			entity: '<',
			onUpdate: '&'
		}
	})