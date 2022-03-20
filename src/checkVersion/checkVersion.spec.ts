import { OpenAPI } from 'openapi-types';
import { MissingPathParamError, UnsupportedVersionError } from '$errors';
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

  describe('.isV30', () => {
    it('should say that swagger: 2.1.0 is not v3_0', () => {
      expect(checkVersion.isV30({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not v3_0', () => {
      expect(checkVersion.isV30({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not v3_0', () => {
      expect(checkVersion.isV30({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.0.0 is v3_0', () => {
      expect(checkVersion.isV30({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(true);
    });

    it('should say that openapi: 3.1.1 is not v3_0', () => {
      expect(checkVersion.isV30({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(false);
    });
  });

  describe('.isV31', () => {
    it('should say that swagger: 2.1.0 is not v3_1', () => {
      expect(checkVersion.isV31({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not v3_1', () => {
      expect(checkVersion.isV31({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not v3_1 (though probably should not since it should be openapi: "3..")', () => {
      expect(checkVersion.isV31({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(true);
    });

    it('should say that openapi: 3.0.0 is not v3_1', () => {
      expect(checkVersion.isV31({ openapi: '3.0.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that openapi: 3.1.1 is v3_1', () => {
      expect(checkVersion.isV31({ openapi: '3.1.1' } as OpenAPI.Document)).toBe(true);
    });
  });

  describe('.isSupported', () => {
    it('should say that swagger: 2.1.0 is not supported', () => {
      expect(checkVersion.isSupported({ swagger: '2.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 1.1.0 is not supported', () => {
      expect(checkVersion.isSupported({ swagger: '1.1.0' } as OpenAPI.Document)).toBe(false);
    });

    it('should say that swagger: 3.1.0 is not supported (though probably should not since it should be openapi: "3..")', () => {
      expect(checkVersion.isSupported({ swagger: '3.1.0' } as OpenAPI.Document)).toBe(true);
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
      expect(() => checkVersion.onlySupported({ swagger: '2.1.0' } as OpenAPI.Document)).toThrow(UnsupportedVersionError);
    });

    it('should say that swagger: 1.1.0 is not supported', () => {
      expect(() => checkVersion.onlySupported({ swagger: '1.1.0' } as OpenAPI.Document)).toThrow(UnsupportedVersionError);
    });

    it('should say that swagger: 3.1.0 is supported (though probably should not since it should be openapi: "3..")', () => {
      expect(() => checkVersion.onlySupported({ swagger: '3.1.0' } as OpenAPI.Document)).not.toThrow();
    });

    it('should say that openapi: 3.0.0 is supported', () => {
      expect(() => checkVersion.onlySupported({ openapi: '3.0.0' } as OpenAPI.Document)).not.toThrow();
    });

    it('should say that openapi: 3.1.1 is supported', () => {
      expect(() => checkVersion.onlySupported({ openapi: '3.1.1' } as OpenAPI.Document)).not.toThrow();
    });
  });
});
