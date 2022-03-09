import type { OpenAPIV3 } from 'openapi-types';
type GenerateInput = {
  basePath?: string;
  definition: OpenAPIV3.Document
}
type SerializePathInput = {
  method: keyof typeof OpenAPIV3.HttpMethods,
  path: string,
  params?: Record<string, string>,
}
type Output = (args: SerializePathInput) => string | null;

const generateSerializePath = ({ basePath = '', definition }: GenerateInput): Output => {
  return ({ method, path, params = {} }) => {
    return `${basePath}${path}`;
  }
};
export default generateSerializePath;
