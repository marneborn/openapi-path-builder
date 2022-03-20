import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';


const formatInteger: Formatter<number> = (value, options) => {
  if (typeof value === 'number') {
    return value.toFixed(0);
  }

  if (!options.strict && typeof value === 'string') {
    const n = parseFloat(value);
    if (!Number.isNaN(n)) {
      return n.toFixed(0);
    }
  }

  throw new WrongDataTypeError(options.path, {
    name: options.name,
    value,
    expected: 'integer',
  });  
}

export default formatInteger;