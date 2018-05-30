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

/*
=======EntitySet=======
*/
coreModule.factory('EntitySet', function() {
	function EntitySet() {
		this.set = new Set();
	}
	EntitySet.prototype = {
		size: function() { return this.set.size; },
		add: function(entity) { this.set.add(entity); },
  		remove: function(entity) { this.set.delete(entity); },
  		contains: function(entity) { return this.set.has(entity); },
  		clear: function() { this.set.clear(); },
  		deleteAttributes: function() {
  			this.set.forEach(entity => {
				entity.attributes = {};
			});
  		},
  		numAttrMatch: function(attr, value) {
  			var count = 0;
  			for (var entity of this.set) {
  				if (entity.attributes && entity.attributes[attr] == value)
					count += 1;
  			}
			return count;
  		},
  		update: function(attr, value) {
  			this.set.forEach(entity => {
  				if (entity.attributes[attr] == value) return;
  				entity.attributes[attr] = value;
  				if (attr == 'attr_level1')
  					entity.attributes['attr_level2'] = null;
  			});
  		}
	};

	return EntitySet;
});