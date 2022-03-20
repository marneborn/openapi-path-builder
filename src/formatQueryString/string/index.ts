import { WrongDataTypeError } from '$errors';
import isDate from '$is/isDate';
import { Formatter } from '../typings';

const handleNonString = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  if (isDate(value)) {
    return value.toISOString();
  }

  return '' + value;
};

const formatString: Formatter<string> = (value, options) => {
  if (typeof value === 'string') {
    return value;
  }

  if (options.strict) {
    throw new WrongDataTypeError(options.path, {
      name: options.name,
      expected: 'string',
      value,        
    })
  }

  return handleNonString(value);
}

export default formatString;