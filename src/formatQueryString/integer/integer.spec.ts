import { WrongDataTypeError } from '$errors';
import formatInteger from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/integer', () => {
  let options: Parameters<typeof formatInteger>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
      strict: true,
    };
  });

  describe('strict: true', () => {
    it('should pass through 10', () => {
      expect(formatInteger(10, options)).toBe('10');
    });
  
    it('should round down 10.1', () => {
      expect(formatInteger(10.1, options)).toBe('10');
    });

    it('should round down 10.9', () => {
      expect(formatInteger(10.9, options)).toBe('11');
    });

    it('should throw an error if the value is not a string', () => {
      const value = '10';
      const error = getThrownError(() => formatInteger(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'integer',
        }],
      });
    });
  });

  describe('strict: false', () => {
    beforeEach(() => {
      options.strict = false;
    });

    it('should pass through "11"', () => {
      expect(formatInteger('11' as any, options)).toBe('11');
    });

    it('should round down "11.1"', () => {
      expect(formatInteger('11.1' as any, options)).toBe('11');
    });

    it('should round up "11.9"', () => {
      expect(formatInteger('11.9' as any, options)).toBe('12');
    });

    it('should throw an error if the value is boolean', () => {
      const value = true;
      const error = getThrownError(() => formatInteger(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'integer',
        }],
      });
    });
  });
});
