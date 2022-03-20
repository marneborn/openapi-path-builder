import { OpenAPIV3 } from 'openapi-types';
import {
  MissingPathParamError,
  UnsupportedVersionError,
} from '$errors';
import generateSerializePath from './index';

describe('serializePath', () => {
  describe('openapi v2', () => {
    let document: OpenAPIV3.Document;
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
      } as unknown as OpenAPIV3.Document;
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

      it('should encodeuri the params', () => {
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
        const params = { petId: '123 with space' };
        expect(serializePath({ method: 'get', params, path: '/pets/{petId}' })).toBe('/pets/123%20with%20space');
      });

      it('should allow integers', () => {
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
        const params = { petId: 572};
        expect(serializePath({ method: 'get', params, path: '/pets/{petId}' })).toBe('/pets/572');
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

      it('should replace a path param multiple times', () => {
        document.paths = {
          '/pets/{petId}/{petId}': {
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
        expect(serializePath({ method: 'get', params, path: '/pets/{petId}/{petId}' })).toBe('/pets/123/123');
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

      it('should throw MissingPathParamError if there are missing path params', () => {
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
        const params = {};
        try {
          serializePath({ method: 'get', params, path: '/pets/{petId}' });
          throw new Error('Should have thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(MissingPathParamError);
          expect((error as MissingPathParamError).data).toEqual({
            missingParams: ['petId'],
            path: '/pets/{petId}',
          });
        }
      });
    });
  });
});
