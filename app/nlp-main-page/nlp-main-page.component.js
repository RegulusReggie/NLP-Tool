// Register 'nlp-main-page' component
function NlpMainPageController() {
	var self = this;
	self.dialog = [
		{
			speaker: '医生',
			entities: [
				{
					text: '我是一句非常长的话你要好好对我。',
					attributes: {}
				}
			],
			show: true
		},
		{
			speaker: '患者',
			entities: [
				{
					text: '为什么你是一句很长的话呢，我看不懂。',
					attributes: {}
				}
			],
			show: true
		},
		{
			speaker: '医生',
			entities: [
				{
					text: '看不懂就对了因为我是医生，我写的字都很长。',
					attributes: {}
				}
			],
			show: true
		}
	]
	self.updateEntity = function(entity, attr, value) {
		entity.attributes[attr] = value
	}
	self.selectEntity = function(entity) {
		if (self.toolState != 'select-word') return;
		self.selectedEntity = entity
	}
}

angular.
	module('nlpMainPage').
	component('nlpMainPage', {
		templateUrl: 'nlp-main-page/nlp-main-page.template.html',
		controller: NlpMainPageController
	})