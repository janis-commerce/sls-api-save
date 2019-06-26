'use strict';

const assert = require('assert');

const SlsApiSave = require('../lib/sls-api-save');

describe('SlsApiSave', () => {

	describe('apiMethod getter', () => {

		it('Should throw when it\'s not overriden', () => {
			assert.throws(() => SlsApiSave.apiMethod, {
				message: 'apiMethod getter not implemented'
			});
		});
	});
});
