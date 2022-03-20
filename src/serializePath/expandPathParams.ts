import { DataTypeProblem } from '$errors/WrongDataTypeError';
import { Params } from '$types';

// support old browsers without .replaceAll without polyfill.
const replaceAllPathParam: (str: string, pattern: string, replaceWith: string) => string = (
  String.prototype.replaceAll
    ? (str, pattern, replaceWith) => str.replaceAll(`{${pattern}}`, replaceWith)
    : (str, pattern, replaceWith) => str.replace(new RegExp(`{${pattern}}`, 'g'), replaceWith)
);

type InternalHandler = (paramValue: unknown, paramName: string, paramDataTypeProblems: DataTypeProblem[]) => string | null;

const handleString: InternalHandler = (paramValue, paramName, paramDataTypeProblems) => {
  if (typeof paramValue === 'string') {
    return paramValue;
  }

  if (typeof paramValue === 'number') { // @todo integer vs number? needs schema then...
    return paramValue.toString();
  }

  if (paramValue instanceof Date) {
    return paramValue.toISOString();
  }

  paramDataTypeProblems.push({
    expected: 'string',
    name: paramName,
    value: paramValue,
  });

  return null;
};

type Props = {
  path: string,
  params: Params,
  paramDataTypeProblems: DataTypeProblem[],
};

const expandPathParams = ({ path, params, paramDataTypeProblems }: Props): string => {
  let serializedPath = path;

  const paramNames = Object.keys(params);
  for (let i = 0; i < paramNames.length; i += 1) {
    const paramName = paramNames[i];
    const paramValue = handleString(params[paramName], paramName, paramDataTypeProblems);
    if (paramValue) {
      serializedPath = replaceAllPathParam(serializedPath, paramName, encodeURI(paramValue));
    }
  }

  return serializedPath;
};

export default expandPathParams;
