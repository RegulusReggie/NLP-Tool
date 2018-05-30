// Define 'attribute-view' component

const attrMap = {
	'entity': {
		attr_level1: {
			1: '疾病、表征、生理状态',
			2: '处理、治疗办法与效果',
			3: '周围环境、条件与活动'
		},
		attr_level2: {
			1: 	{
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
			},
			2: {
				1: '处理/治疗办法',
				2: '处理/治疗效果',
				3: '化验/检查办法',
				4: '化验/检查结果',
				5: '药物类型与名称',
				6: '用药方式',
				7: '用药频率和周期'
			},
			3: {
				1: '饮食与生活习惯',
				2: '周围环境',
				3: '物理动作与活动'
			}
		}
	},
	'sentence': {
		logic_type: {
			1: '疑问句',
			2: '肯定答复',
			3: '否定答复'
		},
		confidence: {
			0: '确定',
			1: '不确定'
		},
		time_point: {
			1: '过去',
			2: '假设'
		}
	}
}

function AttributeViewController(setActiveBtnInBtnGroup, EntitySet) {
	var self = this;

	self.$onChanges = function(changesObj) {
		if (changesObj.mode) {
			self.setAttrMap(changesObj.mode.currentValue);
		} else if (changesObj.entities) {
			self.setAttrMap(self.mode);
		}
	}

	// output functions
	self.update = function($event, attr, value) {
		setActiveBtnInBtnGroup($event.currentTarget);
		self.onUpdateEntity({entitySet: self.entities, attr: attr, value: value});	
	}
	self.changeMode = function(mode) {
		self.onChangeMode({mode: mode});
	}

	// attrMap functions
	self.setAttrMap = function(mode) {
		if (mode == 'sentence') {
			self.attrMap = attrMap[mode];
		} else {
			self.attrMap = {}
			self.attrMap.attr_level1 = attrMap[mode].attr_level1;
			if (self.entity
			 && self.entity.attributes
			 && self.entity.attributes['attr_level1'])
				self.attrMap.attr_level2 = attrMap[mode].attr_level2[self.entity.attributes['attr_level1']];
		}
	}
	self.updateAttrMap = function(attr, value) {
		if (attr == "attr_level1" && self.mode == 'entity') {
			self.attrMap.attr_level2 = attrMap[self.mode].attr_level2[value];
		}
	}

	// css functions
	self.isActiveButton = function(attr, value) {
		if (!self.entities || !self.entities.size()) return "";
		var numMatch = self.entities.numAttrMatch(attr, value);
		if (numMatch == self.entities.size())
			return "active";
		else if (numMatch == 0)
			return "";
		return "semi-active";
	}
	self.isHidden = function() {
		if (!self.entities || !self.entities.size()) return "hidden";
		return "";
	}
}

angular.
	module('attributeView').
	component('attributeView', {
		templateUrl: 'attribute-view/attribute-view.template.html',
		controller: ['setActiveBtnInBtnGroup', 'EntitySet', AttributeViewController],
		bindings: {
			mode: '<',
			entities: '<',
			onUpdateEntity: '&',
			onChangeMode: '&'
		}
	})