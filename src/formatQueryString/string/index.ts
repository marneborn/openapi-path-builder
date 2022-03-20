import isDate from '$is/isDate';
import { Formatter } from '../typings';

// const handleNonString = (value: unknown): string => {
//   if (value === undefined || value === null) {
//     return '';
//   }

//   if (isDate(value)) {
//     return value.toISOString();
//   }

//   return '' + value;
// };

const formatString: Formatter<unknown> = (value, options) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined || value === null) {
    return '';
  }

  if (isDate(value)) {
    return value.toISOString();
  }

  return '' + value;
}

export default formatString;