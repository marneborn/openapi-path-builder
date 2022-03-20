import { Formatter } from '../typings';

const boolean: Formatter<boolean> = (value, options) => {

  return value ? 'true' : 'false'
}
export default boolean;