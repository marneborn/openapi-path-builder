import { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import UnsupportedVersionError from '../errors/UnsupportedVersionError';
import * as checkVersion from './index';

describe('checkVersion', () => {
  describe('.isV2', () => {
    it('should say that swagger: 2.1.0 is v2', () => {
      expect(checkVersion.isV2({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(true);
    });

    it('should say that swagger: 1.1.0 is not v2', () => {
      expect(checkVersion.isV2({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not v2', () => {
      expect(checkVersion.isV2({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.0.0 is not v2', () => {
      expect(checkVersion.isV2({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.1.1 is not v2', () => {
      expect(checkVersion.isV2({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(false);
    });
  });

  describe('.isV3_0', () => {
    it('should say that swagger: 2.1.0 is not v3_0', () => {
      expect(checkVersion.isV3_0({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not v3_0', () => {
      expect(checkVersion.isV3_0({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not v3_0', () => {
      expect(checkVersion.isV3_0({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.0.0 is v3_0', () => {
      expect(checkVersion.isV3_0({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(true);
    });

    it('should say that openapi: 3.1.1 is not v3_0', () => {
      expect(checkVersion.isV3_0({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(false);
    });
  });

  describe('.isV3_1', () => {
    it('should say that swagger: 2.1.0 is not v3_1', () => {
      expect(checkVersion.isV3_1({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not v3_1', () => {
      expect(checkVersion.isV3_1({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not v3_1', () => {
      expect(checkVersion.isV3_1({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.0.0 is not v3_1', () => {
      expect(checkVersion.isV3_1({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.1.1 is v3_1', () => {
      expect(checkVersion.isV3_1({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(true);
    });
  });

  describe('.isSupported', () => {
    it('should say that swagger: 2.1.0 is not supported', () => {
      expect(checkVersion.isSupported({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not supported', () => {
      expect(checkVersion.isSupported({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not supported', () => {
      expect(checkVersion.isSupported({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.0.0 is supported', () => {
      expect(checkVersion.isSupported({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(true);
    });

    it('should say that openapi: 3.1.1 is supported', () => {
      expect(checkVersion.isSupported({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(true);
    });
  });

  describe('.onlySupported', () => {
    it('should say that swagger: 2.1.0 is not supported', () => {
      expect(checkVersion.onlySupported({ swagger: '2.1.0' } as OpenAPI.Document)).toThrow(UnsupportedVersionError);
    });

    it('should say that swagger: 1.1.0 is not supported', () => {
      expect(checkVersion.onlySupported({ swagger: '1.1.0' } as OpenAPI.Document)).toThrow(UnsupportedVersionError);
    });

    it('should say that swagger: 3.1.0 is not supported', () => {
      expect(checkVersion.onlySupported({ swagger: '3.1.0' } as OpenAPI.Document)).toThrow(UnsupportedVersionError);
    });

    it('should say that openapi: 3.0.0 is supported', () => {
      expect(checkVersion.onlySupported({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(undefined);
    });

    it.only('should say that openapi: 3.1.1 is supported', () => {
      expect(checkVersion.onlySupported({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(undefined);
    });
  });
});