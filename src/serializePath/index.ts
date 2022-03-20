import getBasePath from '$getBasePath';
import { onlySupported, SupportedDocuments } from '$checkVersion';
import {
  MissingPathParamError,
  WrongDataTypeError,
} from '$errors';
import { DataTypeProblem } from '$errors/WrongDataTypeError';
import type {
  HttpMethodLiterals,
  Params,
} from '$types';
import expandPathParams from './expandPathParams';

type GenerateInput = {
  document: SupportedDocuments;
};
type SerializePathInput = {
  method: HttpMethodLiterals,
  path: string,
  params?: Params,
};
type SerializePath = (args: SerializePathInput) => string | null;

const generateSerializePath = ({ document }: GenerateInput): SerializePath => {
  onlySupported(document);
  const basePath = getBasePath(document);

  return ({ path, params = {} }) => {
    const paramDataTypeProblems: DataTypeProblem[] = [];
    const serializedPath = expandPathParams({ paramDataTypeProblems, params, path });

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
