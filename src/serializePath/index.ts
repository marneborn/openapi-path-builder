import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import getBasePath from '../getBasePath';
import { onlySupported, SupportedDocuments } from '../checkVersion';
import { 
  MissingPathParamError,
  WrongDataTypeError,
 } from '../errors';

type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;
type PathsObject = OpenAPIV3.PathsObject | OpenAPIV3_1.PathsObject;
type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type HttpMethods = OpenAPIV3.HttpMethods;
type HttpMethodLiterals = `${HttpMethods}`;

type GenerateInput = {
  document: SupportedDocuments;
};
type SerializePathInput = {
  method: HttpMethodLiterals,
  path: string,
  params?: Record<string, unknown>,
};
type SerializePath = (args: SerializePathInput) => string | null;

const isQueryParam = (param: ParameterObject | ReferenceObject): param is ParameterObject => (param as ParameterObject).in === 'query';

const generateSerializePath = ({ document }: GenerateInput): SerializePath => {
  onlySupported(document);
  const basePath = getBasePath(document);

  const queryParamsLookup: Record<string, Record<HttpMethodLiterals, ParameterObject[]>> = {};
  const getQueryParams = (path: string, method: HttpMethodLiterals) => {
    if (!queryParamsLookup[path]) {
      queryParamsLookup[path] = {} as Record<HttpMethodLiterals, ParameterObject[]>;
    }
    if (!queryParamsLookup[path][method]) {
      const pathObj: PathItemObject = (document?.paths || {})[path] || {};
      const methods = Object.keys(pathObj) as HttpMethodLiterals[];
      for (let i = 0; i < methods.length; i += 1) {
        const xcMethod = methods[i];
        const lcMethod = xcMethod.toLowerCase() as HttpMethodLiterals;
        if (method === lcMethod) {
          // @todo - support references
          queryParamsLookup[path][method] = (pathObj[lcMethod]?.parameters || [])
            .filter(isQueryParam)
        }
      }
    }
    return queryParamsLookup[path][method] || []
  };

  return ({ method, path, params = {} }) => {
    const paramNames = Object.keys(params);
    let serializedPath = path;
    const paramDataTypeProblems = [];
    for (let i = 0; i < paramNames.length; i += 1) {
      const paramName = paramNames[i];
      const paramValue = params[paramName];
      if (paramValue) {
        if (typeof paramValue !== 'string') {
          paramDataTypeProblems.push({
            name: paramName,
            expected: 'string',
            value: paramValue,
          });
        }
        serializedPath = serializedPath.replace(`{${paramName}}`, encodeURI(paramValue as string))
      }
    }

    const missingParamsMatch = serializedPath.match(/{[a-zA-Z0-9_-]+}/g);
    if (missingParamsMatch) {
      throw new MissingPathParamError(path, ...missingParamsMatch.map(s => s.replace(/[\{\}]/g, '')));
    }

    // const queryParams = getQueryParams(path, method);

    if (paramDataTypeProblems.length > 0) {
      throw new WrongDataTypeError(path, ...paramDataTypeProblems);
    }

    return `${basePath}${serializedPath}`;
  };
};
export default generateSerializePath;
