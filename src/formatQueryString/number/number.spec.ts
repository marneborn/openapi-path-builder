import { WrongDataTypeError } from '$errors';
import formatNumber from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/number', () => {
  let options: Parameters<typeof formatNumber>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
      strict: true,
    };
  });

  describe('strict: true', () => {
    it('should pass through 10', () => {
      expect(formatNumber(10, options)).toBe('10');
    });
  
    it('should pass through 10.1', () => {
      expect(formatNumber(10.1, options)).toBe('10.1');
    });

    it('should passThrough 10.9', () => {
      expect(formatNumber(10.9, options)).toBe('10.9');
    });

    it('should throw an error if the value is not a string', () => {
      const value = '10';
      const error = getThrownError(() => formatNumber(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'number',
        }],
      });
    });
  });

  describe('strict: false', () => {
    beforeEach(() => {
      options.strict = false;
    });

    it('should pass through "11"', () => {
      expect(formatNumber('11' as any, options)).toBe('11');
    });

    it('should pass through "11.1"', () => {
      expect(formatNumber('11.1' as any, options)).toBe('11.1');
    });

    it.only('should pass through "11.9"', () => {
      expect(formatNumber('11.9' as any, options)).toBe('11.9');
    });

    it('should throw an error if the value is boolean', () => {
      const value = true;
      const error = getThrownError(() => formatNumber(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'number',
        }],
      });
    });
  });
});
