import type { OpenAPIV3 } from 'openapi-types';
import { MissingPathParamError } from '../errors';

type GenerateInput = {
  basePath?: string;
  definition: OpenAPIV3.Document;
  onError?: (err: Error) => void | Promise<void>;
}
type SerializePathInput = {
  method: keyof typeof OpenAPIV3.HttpMethods,
  path: string,
  params?: Record<string, string>,
}
type Output = (args: SerializePathInput) => string | null;

const generateSerializePath = ({ basePath = '', definition, onError }: GenerateInput): Output => {
  return ({ method, path, params = {} }) => {
    if (onError) {
      onError(new MissingPathParamError('Oops'));
      return;
    }
    return `${basePath}${path}`;
  }
};
export default generateSerializePath;
