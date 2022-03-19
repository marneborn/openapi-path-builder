import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import UnsupportedVersionError from '../errors/UnsupportedVersionError';
import MissingPathParamError from '../errors/MissingPathParamError';
import generateSerializePath from './index';

describe('serializePath', () => {
  describe('openapi v2', () => {
    let document: any;
    beforeEach(() => {
      document = {
        info: { title: 'test', version: 'v1' },
        paths: {
          '/pets': {
            get: {
              parameters: [],
              responses: {},
            },
          },
        },
        swagger: '2.0.0',
      };
    });

    it('should throw UnsupportedVersion', () => {
      expect(() => generateSerializePath({ document })).toThrow(UnsupportedVersionError);
    });
  });

  describe('openapi v3', () => {
    let document: OpenAPIV3.Document;
    beforeEach(() => {
      document = {
        info: { title: 'test', version: 'v1' },
        openapi: '3.0.0',
        paths: {
          '/pets': {
            get: {
              parameters: [],
              responses: {},
            },
          },
        },
      };
    });

    describe('path params', () => {
      it('just pass through the path', () => {
        const serializePath = generateSerializePath({
          document,
        });

        expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets' })).toBe('/pets');
      });

      it('should prepend the path from the server', () => {
        document.servers = [{ url: 'https://petshop.com/api' }];
        const serializePath = generateSerializePath({
          document,
        });

        expect(serializePath({ method: 'get', path: '/pets' })).toBe('/api/pets');
      });

      it('should replace a path param', () => {
        document.paths = {
          '/pets/{petId}': {
            get: {
              parameters: [
                {
                  in: 'path',
                  name: 'petId',
                },
              ],
              responses: {},
            },
          },
        };
        const serializePath = generateSerializePath({
          document,
        });
        const params = { petId: '123' };
        expect(serializePath({ method: 'get', params, path: '/pets/{petId}' })).toBe('/pets/123');
      });

      it('should replace multiple path params', () => {
        document.paths = {
          '/owners/{ownerId}/pets/{petId}': {
            get: {
              parameters: [
                {
                  in: 'path',
                  name: 'ownerId',
                },
                {
                  in: 'path',
                  name: 'petId',
                },
              ],
              responses: {},
            },
          },
        };

        const serializePath = generateSerializePath({
          document,
        });

        const params = {
          ownerId: '456',
          petId: '123',
        };

        expect(serializePath({ method: 'get', params, path: '/owners/{ownerId}/pets/{petId}' })).toBe('/owners/456/pets/123');
      });

      it('should not need parameter definitions', () => {
        document.paths = {
          '/pets/{petId}': {
            get: {
              parameters: [],
              responses: {},
            },
          },
        };
        const serializePath = generateSerializePath({
          document,
        });
        const params = { petId: '123' };
        expect(serializePath({ method: 'get', params, path: '/pets/{petId}' })).toBe('/pets/123');
      });

      it('should call onError with a MissingPathParamError if there are missing path params', () => {
        const onError = jest.fn();
        document.paths = {
          '/pets/{petId}': {
            get: {
              parameters: [
                {
                  in: 'path',
                  name: 'petId',
                },
              ],
              responses: {},
            },
          },
        };
        const serializePath = generateSerializePath({
          document,
          onError,
        });
        const params = {};

        serializePath({ method: 'get', params, path: '/pets/{petId}' });
        expect(onError).toBeCalledTimes(1);
        const err = onError.mock.calls[0][0];
        expect(err).toBeInstanceOf(MissingPathParamError);
      });
    });

    describe('querystring', () => {
      it('should add query params', () => {});

      it('should call onError if any required params are missing', () => {});
    });

    describe('by operationId or whatever that is called', () => {

    });

    it('should call onError with any params missing params?? ', () => {});
  });
});
