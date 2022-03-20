import { WrongDataTypeError } from '$errors';
import formatEmail from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/dateOnly', () => {
  let options: Parameters<typeof formatEmail>[1];

  beforeEach(() => {
    options = {
      path: '/foo',
      name: 'aParam',
    };
  });

  it('should pass through a valid email', () => {
    expect(formatEmail('an@email.com', options)).toBe('an@email.com');
  });

  it('should throw an error if the value is a string, but not a valid email', () => {
    const value = 'foobar';
    const error = getThrownError(() => formatEmail(value as any, options))
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        value,
        name: options.name,
        expected: 'string:email',
      }],
    });
  });

  it('should throw an error if the value is boolean', () => {
    const value = true;
    const error = getThrownError(() => formatEmail(value as any, options))
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        value,
        name: options.name,
        expected: 'string:email',
      }],
    });
  });
});
