'use strict';

const { ApiResponse } = require('@janiscommerce/sls-api-response');
const { Dispatcher } = require('@janiscommerce/api-view');

class SlsApiSave {

	static get apiMethod() {
		throw	new Error('apiMethod getter not implemented');
	}

	static getDispatcher(...args) {
		return new Dispatcher(...args); //
	}

	static async handler(event) {

		const { entity, entityId } = event.path;

		const dispatcher = this.getDispatcher({
			entity,
			entityId,
			action: 'save',
			method: this.apiMethod,
			headers: event.headers
		});

		let result;

		try {
			result = await dispatcher.dispatch();
		} catch(e) {
			return ApiResponse.send({
				statusCode: e.code || 500,
				body: {
					message: e.message
				}
			});
		}

		return ApiResponse.send({
			statusCode: result.code,
			body: result.body
		});
	}

}

module.exports = SlsApiSave;
