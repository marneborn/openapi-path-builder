import { WrongDataTypeError } from '$errors';
import getThrownError from '../../../test/getThrownError';
import formatBoolean from './index';

describe('formatQueryString/boolean', () => {
  let options: Parameters<typeof formatBoolean>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
      strict: true,
    };
  });

  describe('strict: true', () => {
    it('should convert true to "true"', () => {
      expect(formatBoolean(true, options)).toBe('true');
    });

    it('should convert false to "false"', () => {
      expect(formatBoolean(false, options)).toBe('false');
    });

    it('should throw an error if the value is not a string', () => {
      const value = 10;
      const error = getThrownError(() => formatBoolean(value as any, options));
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'boolean',
        }],
      });
    });
  });

  it('should convert false to "true"', () => {
    expect(formatBoolean(true, options)).toBe('true');
  });

  describe('strict: false', () => {
    beforeEach(() => {
      options.strict = false;
    });

    it('should convert false to "false"', () => {
      expect(formatBoolean(false, options)).toBe('false');
    });
  
    it('should convert false to "true"', () => {
      expect(formatBoolean(true, options)).toBe('true');
    });
  
    it('should convert undefined to "false"', () => {
      expect(formatBoolean(undefined, options)).toBe('false');
    });
  
    it('should convert null to "false"', () => {
      expect(formatBoolean(null, options)).toBe('false');
    });
  
    it('should convert "" to "false"', () => {
      expect(formatBoolean('' as any, options)).toBe('false');
    });
  
    it('should convert "false" to "true"', () => {
      expect(formatBoolean('false' as any, options)).toBe('true');
    });

  });
});