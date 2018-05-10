// Register 'nlp-main-page' component
function NlpMainPageController() {
	var self = this;
	self.entityList = [
		{
			text: 'Some Text',
			attributes: {}
		},
		{
			text: 'Some More Text',
			attributes: {}
		},
		{
			text: 'Some Final Text',
			attributes: {}
		}
	]
	self.updateEntity = function(entity, attr, value) {
		entity.attributes[attr] = value
		console.log(entity)
		console.log(self.entityList)
	}
}

angular.
	module('nlpMainPage').
	component('nlpMainPage', {
		templateUrl: 'nlp-main-page/nlp-main-page.template.html',
		controller: NlpMainPageController
	})