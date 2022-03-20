import { WrongDataTypeError } from '$errors';
import { Formatter } from '../typings';

const boolean: Formatter<boolean> = (value, options) => {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  throw new WrongDataTypeError(options.path, {
    expected: 'boolean',
    name: options.name,
    value,
  });
};

export default boolean;
