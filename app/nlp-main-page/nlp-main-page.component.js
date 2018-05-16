// Register 'nlp-main-page' component
function NlpMainPageController() {
	var self = this;
	self.dialog = getDialog()
	self.updateEntity = function(entity, attr, value) {
		entity.attributes[attr] = value;
	}
	self.selectEntity = function(entity) {
		if (self.toolState != 'select-word') return;
		self.selectedEntity = entity;
	}
	self.annotateEntity = function(sentenceIdx) {
		if (self.toolState != 'annotate-word') return;
		var sel = window.getSelection();
		if (isValidSelection(sel)) {
			var entities = self.dialog[sentenceIdx].entities;
			var range = sel.getRangeAt(0);
			var startEntityIdx
				= parseInt(range.startContainer.parentElement.getAttribute('entity-idx'), 10);
			var endEntityIdx 
				= parseInt(range.endContainer.parentElement.getAttribute('entity-idx'), 10);
			var startOffset = range.startOffset;
			var endOffset = range.endOffset;
			/* preprocess */
			// no actual text from dialog is selected.
			if ((startEntityIdx == entities.length - 1
			  && startOffset == getEntityLength(entities[startEntityIdx]))
			  || endEntityIdx == -1)
				return;
			// If selection starts from the very beginning,
			// it's the same as it starts from the 0 offset of 1st entity.
			if (startEntityIdx == -1) {
				startEntityIdx = 1;
				startOffset = 0;
			}
			// If selection starts from the very end of the entity except the last entity,
			// it's the same as it starts from the beginning of next entity.
			if (startOffset == getEntityLength(entities[startEntityIdx])) {
				startEntityIdx += 1;
				startOffset = 0;
			}
			// If the selection passes the end of a entity and reaches the very beginning
			// of the next entity, set it to the end of that entity.
			if (endOffset > getEntityLength(entities[endEntityIdx])) {
				endOffset = getEntityLength(entities[endEntityIdx]);
			}

			/* generate new entities */
			var insertIdx = startEntityIdx;
			var deleteIdx = endEntityIdx + 1;
			var newSelectedEntity = {
				start: entities[startEntityIdx].start + startOffset,
				end: entities[endEntityIdx].start + endOffset,
				attributes: {}
			}
			var newEntities = [newSelectedEntity];
			// calculate the remaining start entity position.
			if (startOffset != 0) {
				newEntities.unshift({
					start: entities[startEntityIdx].start,
					end: entities[startEntityIdx].start + startOffset,
					attributes: {}
				});
			}
			// calculate the remaining end entity position.
			if (endOffset != getEntityLength(entities[endEntityIdx])) {
				newEntities.push({
					start: endOffset + entities[endEntityIdx].start,
					end: entities[endEntityIdx].end,
					attributes: {}
				});
			}
			/* remove old entities and add new entities */
			entities.splice(insertIdx, deleteIdx - insertIdx);
			for (var i = newEntities.length - 1; i >= 0; i--)
				entities.splice(insertIdx, 0, newEntities[i]);
			self.selectedEntity = newSelectedEntity;
		}
	}
}

// for dev only, change it to service later
// begin
function getDialog() {
	var text1 = '我是一句非常长的话你要好好对我。';
	var text2 = '为什么你是一句很长的话呢，我看不懂。';
	var text3 = '看不懂就对了因为我是医生，我写的字都很长。';
	return [
		{
			speaker: '医生',
			text: text1, 
			entities: [
				{
					start: 0,
					end: 1,
					attributes: {}
				},
				{
					start: 1,
					end: 3,
					attributes: {}
				},
				{
					start: 3,
					end: text1.length,
					attributes: {}
				},
			],
			show: true
		},
		{
			speaker: '患者',
			text: text2, 
			entities: [
				{
					start: 0,
					end: text2.length,
					attributes: {}
				}
			],
			show: true
		},
		{
			speaker: '医生',
			text: text3,
			entities: [
				{
					start: 0,
					end: text3.length,
					attributes: {}
				}
			],
			show: true
		}
	]	
}
// end

function isValidSelection(sel) {
	return !sel.isCollapsed 
		 && sel.anchorNode.nodeType == Node.TEXT_NODE
		 && sel.focusNode.nodeType == Node.TEXT_NODE
		 && sel.rangeCount;
}

function getEntityLength(entity) {
	return entity.end - entity.start;
}

angular.
	module('nlpMainPage').
	component('nlpMainPage', {
		templateUrl: 'nlp-main-page/nlp-main-page.template.html',
		controller: NlpMainPageController
	})