import { OpenAPIV3 } from 'openapi-types';
import { 
  MissingPathParamError,
  UnsupportedVersionError,
  WrongDataTypeError,
 } from '$errors';
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
        } catch(error) {
          expect(error).toBeInstanceOf(MissingPathParamError);
          expect((error as MissingPathParamError).data).toEqual({
            path: '/pets/{petId}',
            missingParams: ['petId'],
          })
        }
      });
    });

    describe('querystring', () => {
      beforeEach(() => {
        document.paths['/pets']['get'].parameters.push({
          name: 'foo',
          in: 'query',
        });
      });

      describe('basics', () => {

        it('should add query params', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: 'bar' } })).toContain('?foo=bar');
        });

        it('should ignore missing optional params', () => {
          const serializePath = generateSerializePath({ document });
          const params = {};
  
          serializePath({ method: 'get', params, path: '/pets' });
        });


        it('should throw a MissingPathParamError if any required params are missing', () => {
          const serializePath = generateSerializePath({ document });
          const params = {};
          
          try {
            serializePath({ method: 'get', params, path: '/pets/{petId}' });
            throw new Error('Did not throw');
          } catch(error) {
            expect(error).toBeInstanceOf(MissingPathParamError);
            expect((error as MissingPathParamError).data).toEqual({
              path: '/pets/{petId}',
              missingParams: ['petId'],
            })
          }
        });

        it('should throw  a WrongTypeError if the path param is not a string', () => {
          const serializePath = generateSerializePath({ document });
          const params = { petId: 10 };
  
          try {
            serializePath({ method: 'get', params, path: '/pets/{petId}' });
            throw new Error('Did not throw');
          } catch(error) {
            expect(error).toBeInstanceOf(WrongDataTypeError);
            expect((error as WrongDataTypeError).data).toEqual({
              path: '/pets/{petId}',
              problems: [{
                name: 'petId',
                expected: 'string',
                value: 10,
              }],
            });
          }
        });
      });

      describe('type=boolean', () => {
        beforeEach(() => {
          (document.paths['/pets']['get'].parameters[0] as OpenAPIV3.ParameterObject).schema = {
            type: 'boolean'
          };
        });

        it('should say "true" for true', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: true } })).toContain('?foo=true');
        });

        it('should say "false" for false', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: false } })).toContain('?foo=false');
        });

        it('should say "false" for false if the is no schema', () => {
          // delete document.paths['/pets']['get'].parameters[0] as OpenAPIV3.ParameterObject).schema;
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: false } })).toContain('?foo=false');
        });

        it('should say "true" for true if the is no schema', () => {
          // delete document.paths['/pets']['get'].parameters[0] as OpenAPIV3.ParameterObject).schema;
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: false } })).toContain('?foo=false');
        });

        it('should throw an error for ""', () => {
          try {
            const serializePath = generateSerializePath({ document });
            serializePath({ method: 'get', params: { foo: '' }, path: '/pets/{petId}' });
            throw new Error('Did not throw');
          } catch(error) {
            expect(error).toBeInstanceOf(WrongDataTypeError);
            expect((error as WrongDataTypeError).data).toEqual({
              path: '/pets/{petId}',
              problems: [{
                name: 'petId',
                expected: 'string',
                value: 10,
              }],
            });
          }

          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: '' } })).toContain('?foo=10');
        });
      });

      describe('type=integer', () => {
        it('should cast a number to a string', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: 10 } })).toContain('?foo=10');
        });
        it('should round a 10.1 down', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: 10.1 } })).toContain('?foo=10');
        });
        it('should round a 10.9 up', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: 10.9 } })).toContain('?foo=10');
        });
      });

      describe('type=number', () => {
        it('should cast a number to a string', () => {
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { foo: 10 } })).toContain('?foo=10');
        });
      });

      describe.skip('format=date', () => {
        it('should cast a Date to to a date string', () => {
          document.paths['/pets']['get'].parameters[0] = {
            name: 'start',
            in: 'query',
            schema: {
              type: 'string',
              format: 'date',
            }
          };
          const serializePath = generateSerializePath({ document });
          expect(serializePath({ method: OpenAPIV3.HttpMethods.GET, path: '/pets', params: { start: new Date('2022-03-19T08:00:00Z') } })).toContain('?start=2022-03-19');
        });
      });
    });

    describe('by operationId or whatever that is called', () => {
    });
  });
});
