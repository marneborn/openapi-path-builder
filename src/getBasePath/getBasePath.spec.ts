import { OpenAPI } from 'openapi-types';
import getBasePath from './index';

describe.only('getBasePath', () => {
  describe('v2', () => {
    it('should throw an error', () => {
      expect(getBasePath({ swagger: '2.0.0' } as OpenAPI.Document)).toThrow('dd');
    });
  });

  describe('v3', () => {
    it('should return "" if servers is undefined', () => {
      expect(getBasePath({ openapi: '3.0.0' } as OpenAPI.Document)).toBe('');
    });

    it('should return "" if servers are no servers', () => {
      expect(getBasePath({ openapi: '3.0.0', servers: [] } as OpenAPI.Document)).toBe('');
    });

    it('should return the path of the server', () => {
      const server1 = { url: 'https://development.gigantic-server.com/v2' };
      expect(getBasePath({ openapi: '3.0.0', servers: [server1] } as OpenAPI.Document)).toBe('/v2');
    });

    it('should return "/api" if the path in the first server is /api', () => {
      const server1 = { url: 'https://development.gigantic-server.com/api' };
      const server2 = { url: 'https://development.gigantic-server.com/v1' };
      expect(getBasePath({ openapi: '3.0.0', servers: [server1, server2] } as OpenAPI.Document)).toBe('/api');
    });
    
    it('should strip off any trailing slashes', () => {
      const server1 = { url: 'https://development.gigantic-server.com/api/' };
      expect(getBasePath({ openapi: '3.0.0', servers: [server1] } as OpenAPI.Document)).toBe('/api');
    })
    
    it('should return "" if there is a / at the end of the server', () => {
      const server1 = { url: 'https://development.gigantic-server.com/' };
      expect(getBasePath({ openapi: '3.0.0', servers: [server1] } as OpenAPI.Document)).toBe('');
    })
  });
});