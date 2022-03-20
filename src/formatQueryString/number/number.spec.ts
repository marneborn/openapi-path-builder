import { WrongDataTypeError } from '$errors';
import formatNumber from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/number', () => {
  let options: Parameters<typeof formatNumber>[1];

  beforeEach(() => {
    options = {
      name: 'aParam',
      path: '/foo',
    };
  });

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
    const value = false;
    const error = getThrownError(() => formatNumber(value as any, options)); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        expected: 'number',
        name: options.name,
        value,
      }],
    });
  });
});
