import { WrongDataTypeError } from '$errors';
import formatInteger from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/dateOnly', () => {
  let options: Parameters<typeof formatInteger>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
      strict: true,
    };
  });

  describe('strict: true', () => {
    it('should pass through 2020-01-10', () => {
      expect(formatInteger('2020-01-10', options)).toBe('2020-01-10');
    });
  
    it('should convert a Date', () => {
      jest.spyOn(Date.prototype, 'getFullYear').mockImplementation((): number => 2022);
      jest.spyOn(Date.prototype, 'getMonth').mockImplementation((): number => 2);
      jest.spyOn(Date.prototype, 'getDate').mockImplementation((): number => 19);
      expect(formatInteger(new Date(), options)).toBe('2022-03-19');
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
          expected: 'string:date',
        }],
      });
    });

    it('should throw an error if the value is a string that is not formatted correctly', () => {
      const value = '10';
      const error = getThrownError(() => formatInteger(value as any, options))
      expect(error).toBeInstanceOf(WrongDataTypeError);
      expect((error as WrongDataTypeError).data).toEqual({
        path: options.path,
        problems: [{
          value,
          name: options.name,
          expected: 'string:date',
        }],
      });
    });
  });

  describe('strict: false', () => {
    // date-only formatting has no strict: false handling.
    it('should pass through 2020-01-10', () => {
      expect(formatInteger('2020-01-10', options)).toBe('2020-01-10');
    });
  });
});
