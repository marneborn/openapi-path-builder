import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

export const isV2 = (doc: any): doc is OpenAPIV2.Document => {
  const version = doc?.swagger;
  return version && /^2\./.test(version);
}

export const isV3_0 = (doc: any): doc is OpenAPIV3.Document => {
  const version = doc?.openapi;
  return version && /^3\.0/.test(version);
}

export const isV3_1 = (doc: any): doc is OpenAPIV3_1.Document => {
  const version = doc?.openapi;
  return version && /^3\.1/.test(version);
}
