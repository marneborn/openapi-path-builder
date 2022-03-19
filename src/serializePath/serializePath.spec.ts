import { OpenAPIV3 } from 'openapi-types';
import { MissingPathParamError } from '../errors';
import generateSerializePath from './index';

describe('serializePath', () => {
  describe('openapi v3', () => {
    describe('path params', () => {
      it('just pass through the path', () => {
        const serializePath = generateSerializePath({
          definition: {
            openapi: '3',
            paths: {
              '/pets': {
                get: {
                  parameters: [],
                  responses: {},
                },
              },
            },
          } as unknown as OpenAPIV3.Document,
        });

        expect(serializePath({ method: 'GET', path: '/pets' })).toBe('/pets');
      });

      it('should prepend the basePath', () => {
        // openapi v3 has a server: ServerObject[] instead of hostname + baseUrl
        // use getBasePath to extract the basePath from the definition in v3
        const serializePath = generateSerializePath({
          definition: {
            openapi: '3',
            servers: ['http://petstore.com/api',
            paths: {
              '/pets': {
                get: {
                  parameters: [],
                  responses: {},
                },
              },
            },
          } as unknown as OpenAPIV3.Document
        });

        expect(serializePath({ method: 'GET', path: '/pets' })).toBe('/api/pets');
      });

      it('should replace a path param', () => {
        const serializePath = generateSerializePath({
          definition: {
            openapi: '3',
            paths: {
              '/pets/{petId}': {
                get: {
                  parameters: [
                    {
                      description: 'ID of pet to fetch',
                      in: 'path',
                      name: 'id',
                      required: true,
                      schema: {
                        type: 'string',
                      },
                    },
                  ],
                  responses: {},
                },
              },
            },
          } as unknown as OpenAPIV3.Document
        });

        expect(serializePath({ method: 'GET', path: '/pets/{petId}', params: { petId: '123' } })).toBe('/pets/123');
      });

      it('should replace multiple path params', () => {
        const serializePath = generateSerializePath({
          definition: {
            openapi: '3',
            paths: {
              '/owners/{ownerId}/pets/{petId}': {
                get: {
                  parameters: [
                    {
                      description: 'ID of pet to fetch',
                      in: 'path',
                      name: 'id',
                      required: true,
                      schema: {
                        type: 'string',
                      },
                    },
                  ],
                  responses: {},
                },
              },
            },
          } as unknown as OpenAPIV3.Document
        });

        const params = {
          petId: '123',
          ownerId: '456'
        };

        expect(serializePath({ method: 'GET', path: '/owners/{ownerId}/pets/{petId}', params })).toBe('/owners/456/pets/123');
      });

      it('should call onError if there are unresolved path params', () => {
        const onError = jest.fn();
        const serializePath = generateSerializePath({
          onError,
          definition: {
            openapi: '3',
            paths: {
              '/pets/{petId}': {
                get: {
                  parameters: [
                    {
                      description: 'ID of pet to fetch',
                      in: 'path',
                      name: 'id',
                      required: true,
                      schema: {
                        type: 'string',
                      },
                    },
                  ],
                  responses: {},
                },
              },
            },
          } as unknown as OpenAPIV3.Document,
        });

        serializePath({ method: 'GET', path: '/pets/{petId}' });
        expect(onError).toBeCalledTimes(1);
        const err = onError.mock.calls[0][0];
        expect(err).toBeInstanceOf(MissingPathParamError);
      })
    });

    describe('querystring', () => {
      it('should add query params', () => {})
      it('should call onError if any required params are missing', () => {})
    });

    describe('by operationId or whatever that is called', () => {
      
    });

    it('should call onError with any params missing params?? ', () => {})
  });
});
