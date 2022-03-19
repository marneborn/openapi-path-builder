import {
  OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1,
} from 'openapi-types';
import UnsupportedVersionError from '../errors/UnsupportedVersionError';

export const getVersion = (doc: OpenAPI.Document): string | undefined => (doc as OpenAPIV2.Document)?.swagger || (doc as OpenAPIV3.Document)?.openapi;

export const isV2 = (doc: OpenAPI.Document): doc is OpenAPIV2.Document => {
  const version = getVersion(doc);
  return Boolean(version) && /^2\./.test(version);
};

export const isV3_0 = (doc: OpenAPI.Document): doc is OpenAPIV3.Document => {
  const version = getVersion(doc);
  return Boolean(version) && /^3\.0/.test(version);
};

export const isV3_1 = (doc: OpenAPI.Document): doc is OpenAPIV3_1.Document => {
  const version = getVersion(doc);
  return Boolean(version) && /^3\.1/.test(version);
};

export const isSupported = (doc: OpenAPI.Document): doc is OpenAPIV3.Document | OpenAPIV3_1.Document => isV3_0(doc) || isV3_1(doc);

export const onlySupported = (doc: OpenAPI.Document): void => {
  if (!isSupported(doc)) {
    const version = getVersion(doc);
    throw new UnsupportedVersionError(version);
  }
};

export const SUPPORTED_VERSIONS = 'v3.*.*';
