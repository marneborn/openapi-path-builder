import type { OpenAPIV3 } from 'openapi-types';
import { MissingPathParamError } from '../errors';

type GenerateInput = {
  basePath?: string;
  definition: OpenAPIV3.Document;
  onError?: (err: Error) => void | Promise<void>;
}
type Methods = keyof typeof OpenAPIV3.HttpMethods
type SerializePathInput = {
  method: Methods,
  path: string,
  params?: Record<string, string>,
}
type Output = (args: SerializePathInput) => string | null;

const getDefByPathAndMethod = (definition: OpenAPIV3.Document, method: Methods, path: string): OpenAPIV3.PathItemObject => {
  const paths = definition?.paths;
  const pathObj = paths && paths[path]

  if (!pathObj) {
    return null;
  }
  const lcMethod = method.toLowerCase();
  const pathMethods = Object.keys(pathObj);
};

const isParameterObject = (obj: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): obj is OpenAPIV3.ParameterObject => {
  return !(obj as OpenAPIV3.ReferenceObject)['$ref'];
}

const buildPathMethodLookup = (definition: OpenAPIV3.Document) => {
  const paths = definition?.paths;
  if (!paths) {
    return {};
  }
  const lu: Record<string, { [K in Methods]?: OpenAPIV3.ParameterObject[] }> = {};
  const pathNames = Object.keys(paths);
  for (let i = 0; i < pathNames.length; i += 1) {
    const pathName = pathNames[i];
    const pathObj = paths[pathName];
    const methods = Object.keys(pathObj);
    const ucMethods = methods.map(m => m.toUpperCase() as Methods);
    if (!lu[pathName]) {
      lu[pathName] = {}
    }
    for (let j = 0; j < ucMethods.length; j += 1) {
      const method = methods[j];
      const ucMethod = ucMethods[j];
      // @todo - handle ReferenceObject
      lu[pathName][ucMethod] = ((pathObj as OpenAPIV3.PathsObject)[method as string]?.parameters || [])
        .filter(isParameterObject)
        .filter(obj => obj.in === 'path')
    }
  }
  return lu;
}

const generateSerializePath = ({ basePath = '', definition, onError }: GenerateInput): Output => {
  const pathMethodLookup = buildPathMethodLookup(definition);
  console.log('pa', JSON.stringify(pathMethodLookup, null, 2));
  return ({ method, path, params = {} }) => {
    const ucMethod = method.toUpperCase() as Methods;
    const pathParams = pathMethodLookup[path][method] || []

    for (pathParams) {
      url = url.replace(`{${key}}`, params[key]);
    }
  
    if (onError) {
      onError(new MissingPathParamError('Oops'));
    }
    return `${basePath}${path}`;
  }
};
export default generateSerializePath;
