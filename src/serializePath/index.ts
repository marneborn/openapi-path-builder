import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import getBasePath from '../getBasePath';
import { onlySupported, SupportedDocuments } from '../checkVersion';
import MissingPathParamError from '../errors/MissingPathParamError';

type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;
type PathsObject = OpenAPIV3.PathsObject | OpenAPIV3_1.PathsObject;
type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type HttpMethods = OpenAPIV3.HttpMethods;
type HttpMethodLiterals = `${HttpMethods}`;

type GenerateInput = {
  document: SupportedDocuments;
  onError?: (err: Error) => void | Promise<void>;
};
type SerializePathInput = {
  method: HttpMethodLiterals,
  path: string,
  params?: Record<string, string>,
};
type SerializePath = (args: SerializePathInput) => string | null;

const isPathParam = (param: ParameterObject | ReferenceObject): param is ParameterObject => Boolean((param as ParameterObject).in);

const generateSerializePath = ({ document, onError }: GenerateInput): SerializePath => {
  onlySupported(document);
  const basePath = getBasePath(document);

  /*
  const pathMethodLookup: Record<string, Record<HttpMethodLiterals, ParameterObject[]>> = {};
  const getParamDefs = (path: string, method: HttpMethodLiterals) => {
    if (!pathMethodLookup[path]) {
      pathMethodLookup[path] = {} as Record<HttpMethodLiterals, ParameterObject[]>;
    }
    if (!pathMethodLookup[path][method]) {
      const pathObj: PathItemObject = (document?.paths || {})[path] || {};
      const methods = Object.keys(pathObj) as HttpMethodLiterals[];
      for (let i = 0; i < methods.length; i += 1) {
        const xcMethod = methods[i];
        const lcMethod = xcMethod.toLowerCase() as HttpMethodLiterals;
        if (method === lcMethod) {
          // @todo - support references
          pathMethodLookup[path][method] = (pathObj[lcMethod]?.parameters || [])
            .filter(isPathParam)
        }
      }
    }
    return pathMethodLookup[path][method] || []
  };
  */

  return ({ method, path, params = {} }) => {
    const paramNames = Object.keys(params);
    let serializedPath = path;
    for (let i = 0; i < paramNames.length; i += 1) {
      const paramName = paramNames[i];
      const paramValue = params[paramName];
      if (paramValue) {
        serializedPath = serializedPath.replace(`{${paramName}}`, paramValue);
      }
    }

    const missingParamsMatch = serializedPath.match(/{[a-zA-Z0-9_-]+}/g);
    if (missingParamsMatch) {
      if (onError) {
        onError(new MissingPathParamError(...missingParamsMatch.map(s => s.replace(/[\{\}]/g, ''))));
      }
    }
    return `${basePath}${serializedPath}`;
  };
};
export default generateSerializePath;
