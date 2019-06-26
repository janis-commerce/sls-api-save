'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { ApiResponse } = require('@janiscommerce/sls-api-response');
const { Dispatcher } = require('@janiscommerce/api-view');

const { SlsApiSaveData } = require('..');

describe('SlsApiSaveData', () => {

	describe('getDispatcher', () => {

		it('Should throw when correct params are not given', () => {
			assert.throws(() => SlsApiSaveData.getDispatcher());
		});

		it('Should return a Dispatcher instance when correct params are given', () => {

			const dispatcher = SlsApiSaveData.getDispatcher({
				entity: 'some-entity',
				action: 'some-action',
				method: 'some-method'
			});

			assert(dispatcher instanceof Dispatcher);
		});

	});

	describe('Handler', () => {

		afterEach(() => {
			sandbox.restore();
		});

		it('Should pass the request arguments to the Dispatcher and map the dispatcher result', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);
			dispatcherStub.dispatch.resolves({
				code: 200,
				body: {
					foo: 'bar'
				}
			});

			const getDispatcherStub = sandbox.stub(SlsApiSaveData, 'getDispatcher');
			getDispatcherStub.returns(dispatcherStub);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiSaveData.handler({
				path: {
					entity: 'some-entity',
					entityId: 'the-entity-id'
				},
				headers: {
					'x-foo': 'bar'
				}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				entityId: 'the-entity-id',
				action: 'save',
				method: 'data',
				headers: {
					'x-foo': 'bar'
				}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 200,
				body: {
					foo: 'bar'
				}
			});
		});

		it('Should return an error if the Dispatcher throws', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);

			dispatcherStub.dispatch.throws(new Error('Some error'));

			const getDispatcherStub = sandbox.stub(SlsApiSaveData, 'getDispatcher');
			getDispatcherStub.returns(dispatcherStub);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiSaveData.handler({
				path: {
					entity: 'some-entity',
					entityId: 'the-entity-id'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				entityId: 'the-entity-id',
				action: 'save',
				method: 'data',
				headers: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 500,
				body: {
					message: 'Some error'
				}
			});
		});

		it('Should return an error with a custom statusCode if the Dispatcher throws with a code', async () => {

			const error = new Error('Some error');
			error.code = 503;

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);
			dispatcherStub.dispatch.throws(error);

			const getDispatcherStub = sandbox.stub(SlsApiSaveData, 'getDispatcher');
			getDispatcherStub.returns(dispatcherStub);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiSaveData.handler({
				path: {
					entity: 'some-entity',
					entityId: 'the-entity-id'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				entityId: 'the-entity-id',
				action: 'save',
				method: 'data',
				headers: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 503,
				body: {
					message: 'Some error'
				}
			});
		});
	});

});
