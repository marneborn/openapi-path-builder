import { WrongDataTypeError } from '$errors';
import formatEmail from './index';
import getThrownError from '../../../test/getThrownError';

describe('formatQueryString/dateOnly', () => {
  let options: Parameters<typeof formatEmail>[1];

  beforeEach(() => {
    options = {
      name: 'aParam',
      path: '/foo',
    };
  });

  it('should pass through a valid email', () => {
    expect(formatEmail('an@email.com', options)).toBe('an@email.com');
  });

  it('should throw an error if the value is a string, but not a valid email', () => {
    const value = 'foobar';
    const error = getThrownError(() => formatEmail(value as any, options)); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        expected: 'string:email',
        name: options.name,
        value,
      }],
    });
  });

  it('should throw an error if the value is boolean', () => {
    const value = true;
    const error = getThrownError(() => formatEmail(value as any, options)); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(error).toBeInstanceOf(WrongDataTypeError);
    expect((error as WrongDataTypeError).data).toEqual({
      path: options.path,
      problems: [{
        expected: 'string:email',
        name: options.name,
        value,
      }],
    });
  });
});
