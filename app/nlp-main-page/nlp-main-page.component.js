// Register 'nlp-main-page' component
function NlpMainPageController() {
	var self = this;
	self.dialog = getDialog()
	self.changeToolState = function(toolState) {
		self.toolState = toolState;
		if (toolState == 'empty') {
			self.selectedEntity = null;
			self.selectedEntitySentenceIdx = -1;
		}
	}
	self.updateEntity = function(entity, attr, value) {
		entity.attributes[attr] = value;
	}
	self.selectEntity = function(entity, sentenceIdx) {
		if (self.toolState != 'select-word') return;
		self.selectedEntity = entity;
		self.selectedEntitySentenceIdx = sentenceIdx;
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
			// process end delimiter only because we have (delimiter_i, text_i) structure 
			// selection ends at the right side of the delimiter
			if (range.endContainer.parentElement.hasAttribute('delimiter')) {
				if (endOffset == 1) {
					endEntityIdx -= 1;
					// the selection ends on the first delimit: nothing selected
					if (endEntityIdx < 0) return;
					endOffset = entities[endEntityIdx].end - entities[endEntityIdx].start;
				}
			}
			// selection starts from the last delimiter
			if (startEntityIdx == entities.length) return;

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
	self.deleteSelectedEntity = function() {
		if (self.selectedEntity && self.selectedEntitySentenceIdx != -1) {
			var entities = self.dialog[self.selectedEntitySentenceIdx].entities;
			var selEntityIdx = entities.indexOf(self.selectedEntity);
			if (selEntityIdx == -1) return;
			if (selEntityIdx > 0) {
				self.selectedEntity.start = entities[selEntityIdx - 1].start;
				entities.splice(selEntityIdx - 1, 1);
				selEntityIdx -= 1;
			}
			if (selEntityIdx < entities.length - 1) {
				self.selectedEntity.end = entities[selEntityIdx + 1].end;
				entities.splice(selEntityIdx + 1, 1);
			}
			self.selectedEntity.attributes = {};
			self.selectedEntity = null;
			self.selectedEntitySentenceIdx = -1;
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
	var anchorParentEle = sel.anchorNode.parentElement;
	var focusParentEle = sel.focusNode.parentElement;
	return !sel.isCollapsed
		 && sel.rangeCount
		 && anchorParentEle.tagName.toLowerCase() == "span"
		 && anchorParentEle.hasAttribute('entity-idx')
		 && focusParentEle.tagName.toLowerCase() == "span"
		 && focusParentEle.hasAttribute('entity-idx')
		 && anchorParentEle.parentElement === focusParentEle.parentElement;
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