// Register 'nlp-main-page' component

const delimiterMap = {
	'entity': '/',
	'sentence': '//'
}

function NlpMainPageController() {
	var self = this;

	self.$onInit = function() {
		self.dialog = getDialog();
		self.mode = "entity";
		self.delimiterMap = delimiterMap;
		self.case = {};
	}
	self.changeMode = function(mode) {
		if (mode != self.mode)
			self.clearSelected();
		self.mode = mode;
	}
	self.changeToolState = function(toolState) {
		self.toolState = toolState;
		if (toolState == 'empty')
			self.clearSelected();
	}
	self.clearSelected = function() {
		self.selectedEntity = null;
		self.selectedEntityTextIdx = -1;
	}

	/*** Entity annotation and manipulation functions ***/
	self.updateEntity = function(entity, attr, value) {
		if (entity.attributes[attr] == value) return;
		entity.attributes[attr] = value;
		if (self.mode == 'entity' && attr == 'attr_level1')
			entity.attributes['attr_level2'] = null;
	}
	self.selectEntity = function(entity, textIdx) {
		// TODO: add shift multi select
		if (self.toolState != 'select') return;
		self.selectedEntity = entity;
		self.selectedEntityTextIdx = textIdx;
	}
	self.annotate = function(textIdx) {
		if (self.toolState != 'annotate') return;
		var sel = window.getSelection();
		if (isValidSelection(sel)) {
			var entities = self.dialog[textIdx][self.mode].entities;
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
				if (endOffset >= 1) {
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

	self.delete = function() {
		self.selectedEntity.attributes = {};
	}

	/*** case attributes functions ***/
	self.updateCase = function(attr, value) {
		if (attr == "conclusions") {
			if (!self.case[attr])
				self.case[attr] = new Set();
			// TODO: rewrite 0 to some constant
			if (value == "0") {
				self.case[attr].clear();
				self.case[attr].add(value);
			} else if (self.case[attr].has(value))
				self.case[attr].delete(value);
			else {
				self.case[attr].add(value);
				self.case[attr].delete("0");
			}
		} else
			self.case[attr] = value;
	}

	/*** Output functions ***/
	self.saveCheckpoints = function() {
		if (self.checkOutputValidity()) {

		} else {

		}
	}

	self.checkOutputValidity = function() {
		return true;
	}

	self.toJSON = function() {
		/* every text has one json
			{
				tag: from html
				org_context: from original split
				rev_context: from new split
				sen_label: from new sentence split
				entity: [
					("entityText", type e.g. 1-1 2-3, position: start, value: matching text value)
				]
				sentences: [
					(type e.g. 1-1 2-3, position: start, value: matching text value)
					consider change
				]
			}
		*/
		return {}
	}

	/*** deprecated functions, kept for future use ***/
	self.deleteSelectedEntity = function() {
		if (self.selectedEntity && self.selectedEntityTextIdx != -1) {
			var entities = self.dialog[self.selectedEntityTextIdx].entities;
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
			self.selectedEntityTextIdx = -1;
		}
	}
}

// for dev only, change it to service later
// begin
function getDialog() {
	var texts = [
		'医生：我是一句非常长的话你要好好对我。',
		'患者：为什么你是一句很长的话呢，我看不懂。',
		'医生：看不懂就对了因为我是医生，我写的字都很长。'
	];
	return texts.map(text => {
		var textInfo = {
			speaker: text.split('：')[0],
			entity: {
				text: text.split('：')[1]
			},
			sentence: {
				entities: []
			},
			show: true
		};
		textInfo.entity.entities = [{
			start: 0,
			end: textInfo.entity.text.length,
			attributes: {}
		}];
		textInfo.sentence.text = textInfo.entity.text.replace(/。|，|？/g, "");
		var textAsSentence = textInfo.entity.text.replace(/。|，|？/g, "//");
		var sentences = textAsSentence.split('//');
		// when the sentence ends on a delimiter
		if (!sentences[sentences.length - 1])
			sentences.splice(sentences.length - 1, 1);
		var offset = 0;
		for (var i = 0; i < sentences.length; i++) {
			textInfo.sentence.entities.push({
				start: offset,
				end: offset + sentences[i].length,
				attributes: {}
			});
			offset += sentences[i].length;
		}
		return textInfo;
	});
}

function autoMatch() {
	// auto match selected entity with entities in DB
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