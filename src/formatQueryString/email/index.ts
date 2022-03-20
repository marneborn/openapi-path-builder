import isEmail from 'validator/lib/isEmail';
import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

const formatEmail: Formatter<string | Date> = (value, options) => {
  let asString = '';
  if (typeof value === 'string') {
    asString = value;
  }

  if (isEmail(asString)) {
    return asString;
  }

  throw new WrongDataTypeError(options.path, {
    name: options.name,
    value,
    expected: 'string:email',
  });  
}

export default formatEmail;