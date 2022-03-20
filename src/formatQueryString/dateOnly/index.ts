import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

const RE = /\d{4}-\d{2}-\d{2}/;
const toTwoDigitString = (n: number ): string => n < 10 ? `0${n.toFixed(0)}` : n.toFixed(0);

const formatDateOnly: Formatter<string | Date> = (value, options) => {
  let asString;
  if (typeof value === 'string') {
    asString = value;
  }
  if (value instanceof Date) {
    asString = `${value.getFullYear()}-${toTwoDigitString(value.getMonth() + 1)}-${toTwoDigitString(value.getDate())}`
  }

  if (RE.test(asString)) {
    return asString;
  }

  throw new WrongDataTypeError(options.path, {
    name: options.name,
    value,
    expected: 'string:date',
  });  
}

export default formatDateOnly;