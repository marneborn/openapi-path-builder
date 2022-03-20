import getBasePath from '$getBasePath';
import { onlySupported, SupportedDocuments } from '$checkVersion';
import {
  MissingPathParamError,
  WrongDataTypeError,
} from '$errors';
import { DataTypeProblem } from '$errors/WrongDataTypeError';
import type {
  HttpMethodLiterals,
} from '$types';

type GenerateInput = {
  document: SupportedDocuments;
};
type SerializePathInput = {
  method: HttpMethodLiterals,
  path: string,
  params?: Record<string, unknown>,
};
type SerializePath = (args: SerializePathInput) => string | null;

const replaceAllPathParam: (str: string, pattern: string, replaceWith: string) => string = (
  String.prototype.replaceAll
    ? (str, pattern, replaceWith) => str.replaceAll(`{${pattern}}`, replaceWith)
    : (str, pattern, replaceWith) => str.replace(new RegExp(`{${pattern}}`, 'g'), replaceWith)
);

const generateSerializePath = ({ document }: GenerateInput): SerializePath => {
  onlySupported(document);
  const basePath = getBasePath(document);

  return ({ path, params = {} }) => {
    const paramNames = Object.keys(params);
    let serializedPath = path;
    const paramDataTypeProblems: DataTypeProblem[] = [];

    for (let i = 0; i < paramNames.length; i += 1) {
      const paramName = paramNames[i];
      const paramValue = params[paramName];
      if (paramValue) {
        // @todo - handle more than just strings, eg id can be a number.
        if (typeof paramValue !== 'string') {
          paramDataTypeProblems.push({
            expected: 'string',
            name: paramName,
            value: paramValue,
          });
        }
        serializedPath = replaceAllPathParam(serializedPath, paramName, encodeURI(paramValue as string));
      }
    }

    if (paramDataTypeProblems.length > 0) {
      throw new WrongDataTypeError(path, ...paramDataTypeProblems);
    }

    const missingParamsMatch = serializedPath.match(/{[a-zA-Z0-9_-]+}/g);
    if (missingParamsMatch) {
      throw new MissingPathParamError(path, ...missingParamsMatch.map((s) => s.replace(/[{}]/g, '')));
    }

    return `${basePath}${serializedPath}`;
  };
};
export default generateSerializePath;
