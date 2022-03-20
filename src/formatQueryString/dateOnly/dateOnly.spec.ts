import { WrongDataTypeError } from '$errors';
import formatDateOnly from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/dateOnly', () => {
  let options: Parameters<typeof formatDateOnly>[1];

  beforeEach(() => {
    options = {
      name: 'aParam',
      path: '/foo',
    };
  });

  it('should pass through 2020-01-10', () => {
    expect(formatDateOnly('2020-01-10', options)).toBe('2020-01-10');
  });

  it('should convert a Date to YYY-MM-DD', () => {
    jest.spyOn(Date.prototype, 'getFullYear').mockImplementation((): number => 2022);
    jest.spyOn(Date.prototype, 'getMonth').mockImplementation((): number => 2);
    jest.spyOn(Date.prototype, 'getDate').mockImplementation((): number => 19);
    expect(formatDateOnly(new Date(), options)).toBe('2022-03-19');
  });

  it('should throw an error if the value is boolean', () => {
    const value = true;
    const error = getThrownError(() => formatDateOnly(value as any, options)); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        expected: 'string:date',
        name: options.name,
        value,
      }],
    });
  });

  it('should throw an error if the value is a string that is not formatted correctly', () => {
    const value = '10';
    const error = getThrownError(() => formatDateOnly(value as any, options)); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        expected: 'string:date',
        name: options.name,
        value,
      }],
    });
  });
});
