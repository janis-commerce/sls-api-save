'use strict';

const SlsApiSave = require('./sls-api-save');

class SlsApiSaveData extends SlsApiSave {

	static get apiMethod() {
		return 'data';
	}

}

module.exports = SlsApiSaveData;
