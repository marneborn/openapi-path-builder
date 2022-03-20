import { WrongDataTypeError } from '$errors';
import getThrownError from '../../../test/getThrownError';
import formatBoolean from './index';

describe('formatQueryString/boolean', () => {
  let options: Parameters<typeof formatBoolean>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
    };
  });

  it('should convert true to "true"', () => {
    expect(formatBoolean(true, options)).toBe('true');
  });

  it('should convert false to "false"', () => {
    expect(formatBoolean(false, options)).toBe('false');
  });

  it('should throw an error if the value is not a boolean', () => {
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