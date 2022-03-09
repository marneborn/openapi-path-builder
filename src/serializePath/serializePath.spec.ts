import generateSerializePath from './index';

describe('serializePath', () => {
  describe('path params', () => {
    it('just pass through the path', () => {
      const serializePath = generateSerializePath({
        definition: {
          openapi: '3',
          "info": {
            "version": "1.0.0",
            "title": "Swagger Petstore",
          },
          paths: {
            '/pets': {
              get: {
                description: 'Returns all pets from the system that the user has access to',
                operationId: 'findPets',
                parameters: [],
                responses: {},
              },
            },
          },
        },
      });

      expect(serializePath({ method: 'GET', path: '/pets' })).toBe('/pets');
    });

    it('should prepend the basePath', () => {
      // openapi v3 has a server: ServerObject[] instead of hostname + baseUrl
      const serializePath = generateSerializePath({
        basePath: '/api',
        definition: {
          openapi: '3',
          "info": {
            "version": "1.0.0",
            "title": "Swagger Petstore",
          },
          paths: {
            '/pets': {
              get: {
                description: 'Returns all pets from the system that the user has access to',
                operationId: 'findPets',
                parameters: [],
                responses: {},
              },
            },
          },
        },
      });

      expect(serializePath({ method: 'GET', path: '/pets' })).toBe('/api/pets');
    });

    it('should replace a path param', () => {});
    it('should replace multiple path params', () => {});
    it('should call onError if there are unresolved path params', () => {})
  });

  describe('querystring', () => {
    it('should add query params', () => {})
  });

  describe('by operationId or whatever that is called', () => {
    
  })
});
/*

const serializePath = generateSerializePath({
  definition: {
    basePath: '/api',
    consumes: [
      'application/json',
    ],
    paths: {
      '/pets': {
        get: {
          description: 'Returns all pets from the system that the user has access to',
          operationId: 'findPets',
          parameters: [
            {
              description: 'tags to filter by',
              in: 'query',
              items: {
                type: 'string',
              },
              collectionFormat: 'csv',
              name: 'tags',
              required: false,
              type: 'array',
            },
            {
              description: 'maximum number of results to return',
              format: 'int32',
              in: 'query',
              name: 'limit',
              required: false,
              type: 'integer',
            },
          ],
          produces: [
            'application/json',
            'application/xml',
            'text/xml',
            'text/html',
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                items: {
                  $ref: '#/definitions/Pet',
                },
                type: 'array',
              },
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel',
              },
            },
          },
        },
        post: {
          description: 'Creates a new pet in the store.  Duplicates are allowed',
          operationId: 'addPet',
          parameters: [
            {
              description: 'Pet to add to the store',
              in: 'body',
              name: 'pet',
              required: true,
              schema: {
                $ref: '#/definitions/NewPet',
              },
            },
          ],
          produces: [
            'application/json',
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                $ref: '#/definitions/Pet',
              },
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel',
              },
            },
          },
        },
      },
      '/pets/{id}': {
        delete: {
          description: 'deletes a single pet based on the ID supplied',
          operationId: 'deletePet',
          parameters: [
            {
              description: 'ID of pet to delete',
              format: 'int64',
              in: 'path',
              name: 'id',
              required: true,
              type: 'integer',
            },
          ],
          responses: {
            204: {
              description: 'pet deleted',
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel',
              },
            },
          },
        },
        get: {
          description: 'Returns a user based on a single ID, if the user does not have access to the pet',
          operationId: 'findPetById',
          parameters: [
            {
              description: 'ID of pet to fetch',
              in: 'path',
              format: 'int64',
              name: 'id',
              required: true,
              type: 'integer',
            },
          ],
          produces: [
            'application/json',
            'application/xml',
            'text/xml',
            'text/html',
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                $ref: '#/definitions/Pet',
              },
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel',
              },
            },
          },
        },
      },
    },
  },
});
*/