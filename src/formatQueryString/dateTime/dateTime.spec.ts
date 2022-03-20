import { WrongDataTypeError } from '$errors';
import formatDateTime from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/dateTime', () => {
  let options: Parameters<typeof formatDateTime>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
    };
  });

  it('should pass through 2022-03-20T06:58:25.829Z', () => {
    expect(formatDateTime('2022-03-20T06:58:25.829Z', options)).toBe('2022-03-20T06:58:25.829Z');
  });

  it('should convert a Date to iso time', () => {
    jest.spyOn(Date.prototype, 'toISOString').mockImplementation((): string => '2022-03-20T06:58:25.829Z');
    expect(formatDateTime(new Date(), options)).toBe('2022-03-20T06:58:25.829Z');
  });

  it('should throw an error if the value is boolean', () => {
    const value = true;
    const error = getThrownError(() => formatDateTime(value as any, options));
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        value,
        name: options.name,
        expected: 'string:date-time',
      }],
    });
  });

  it('should throw an error if the value is a string that is not formatted correctly', () => {
    const value = '10';
    const error = getThrownError(() => formatDateTime(value as any, options))
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        value,
        name: options.name,
        expected: 'string:date-time',
      }],
    });
  });
});
