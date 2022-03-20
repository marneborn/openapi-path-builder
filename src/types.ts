import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

export type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
export type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;
export type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
export type HttpMethods = OpenAPIV3.HttpMethods;
export type HttpMethodLiterals = `${HttpMethods}`;
export type Params<P = Record<string, unknown>> = P;
