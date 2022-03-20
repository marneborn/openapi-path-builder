import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

const boolean: Formatter<boolean> = (value, options) => {
  if (options.strict && typeof value !== 'boolean') {
    throw new WrongDataTypeError(options.path, {
      name: options.name,
      value,
      expected: 'boolean',
    });
  }
  
  return value ? 'true' : 'false'
}
export default boolean;