import { WrongDataTypeError } from '$errors';
import formatString from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/boolean', () => {
  let options: Parameters<typeof formatString>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
      strict: true,
    };
  });

  describe('strict: true', () => {
    it('should pass through "hello"', () => {
      expect(formatString('hello', options)).toBe('hello');
    });
  
    it('should throw an error if the value is not a string', () => {
      const value = 10;
      const error = getThrownError(() => formatString(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        value,
        name: options.name,
      })
    });
  });

  describe('strict: false', () => {
    beforeEach(() => {
      options.strict = false;
    });

    it('should convert false to "false"', () => {
      expect(formatString(false as any, options)).toBe('false');
    });

    it('should convert false to "true"', () => {
      expect(formatString(false as any, options)).toBe('true');
    });

    it('should convert undefined to ""', () => {
      expect(formatString(undefined, options)).toBe('false');
    });

    it('should convert null to ""', () => {
      expect(formatString(null, options)).toBe('');
    });

    it('should pass through "" to ""', () => {
      expect(formatString('', options)).toBe('');
    });

    it('should stringify a number', () => {
      expect(formatString(10.2 as any, options)).toBe('10.2');
    });

    it('should stringify a Date to an iso string', () => {
      const dt = '2022-03-20T04:55:00.682Z';
      expect(formatString(new Date(dt) as any, options)).toBe(dt);
    });

    it('should stringify an object to [object Object]', () => {
      expect(formatString({} as any, options)).toBe('[object Object]');
    });
  });
});
