import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';


const formatNumber: Formatter<number> = (value, options) => {
  if (typeof value === 'number') {
    return value.toString();
  }

  if (!options.strict && typeof value === 'string') {
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