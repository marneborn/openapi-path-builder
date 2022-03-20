import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

// @todo - handle other openapi number limits. Eg max and min
const formatNumber: Formatter<number> = (value, options) => {
  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    const n = parseFloat(value);
    if (!Number.isNaN(n)) {
      return n.toString();
    }
  }

  throw new WrongDataTypeError(options.path, {
    name: options.name,
    value,
    expected: 'number',
  });  
}

export default formatNumber;