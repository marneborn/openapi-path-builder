import isISO8601 from 'validator/lib/isISO8601';
import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

const formatDateTime: Formatter<string | Date> = (value, options) => {
  let asString;
  if (typeof value === 'string') {
    asString = value;
  }
  if (value instanceof Date) {
    asString = value.toISOString();
  }

  if (isISO8601(asString)) {
    return asString;
  }

  throw new WrongDataTypeError(options.path, {
    name: options.name,
    value,
    expected: 'string:date',
  });  
}

export default formatDateTime;