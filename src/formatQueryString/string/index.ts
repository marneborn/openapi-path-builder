import isDate from '$is/isDate';
import { Formatter } from '../typings';

const formatString: Formatter<unknown> = (value) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined || value === null) {
    return '';
  }

  if (isDate(value)) {
    return value.toISOString();
  }

  return `${value}`;
};

export default formatString;
