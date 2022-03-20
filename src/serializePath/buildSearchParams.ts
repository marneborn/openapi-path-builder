import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type { DataTypeProblem } from '$errors/WrongDataTypeError';

console.log('duplicated ....')
type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;

const isRefParam = (param: ParameterObject | ReferenceObject): param is ReferenceObject => (param as ReferenceObject)['$ref'] === 'query';

const buildSearchParams = (params: OpenAPIV3.ParameterObject[] = [], values: Record<string, unknown>): [URLSearchParams, DataTypeProblem[]] => {
  const queryObject: Record<string, string> = {};
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    if (isRefParam(param)) {
      throw new Error('$refs should have been refereneced already');
    }
    const name = param.name;
    const value = values[name];
    queryObject[name] = value as string;
  }
  return [new URLSearchParams(queryObject), []];
}

export default buildSearchParams