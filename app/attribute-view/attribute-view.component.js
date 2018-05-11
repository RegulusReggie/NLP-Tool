// Define 'attribute-view' component

const attrMap = {
	attr_level1: {
		1: '疾病、表征、生理状态',
		2: '处理、治疗办法与效果',
		3: '周围环境、条件与活动'
	},
	attr_level2: {
		1: '疾病/皮损/生理状态',
		2: '过敏史/过敏原',
		3: '身体部位',
		4: '自觉症状',
		5: '皮损大小',
		6: '皮损整体分布',
		7: '皮损形态形状',
		8: '皮损颜色',
		9: '病患/症状出现时间',
		10: '病患严重程度和变化'
	}
}

function AttributeViewController(setActiveBtnInBtnGroup) {
	var self = this;
	self.attrMap = attrMap;
	self.update = function($event, attr, value) {
		setActiveBtnInBtnGroup($event.currentTarget);
		self.onUpdate({entity: self.entity, attr: attr, value: value});
	}
	self.isActiveButton = function(attr, value) {
		return self.entity 
			&& self.entity.attributes
			&& self.entity.attributes[attr] == value
			? "active"
			: ""
	}
	self.isHidden = function() {
		return self.entity
			&& self.entity.attributes
			? ""
			: "hidden"
	}
}

angular.
	module('attributeView').
	component('attributeView', {
		templateUrl: 'attribute-view/attribute-view.template.html',
		controller: ['setActiveBtnInBtnGroup', AttributeViewController],
		bindings: {
			entity: '<',
			onUpdate: '&'
		}
	})