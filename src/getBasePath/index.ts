import { OpenAPI, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import UnsupportedVersionError from '../errors/UnsupportedVersionError';
import { getVersion, isSupported, onlySupported } from '../checkVersion';

const getFirstServer = (doc: OpenAPIV3.Document | OpenAPIV3_1.Document): string | null => {
  if (!doc || !doc.servers) {
    return null;
  }
  if (Array.isArray(doc.servers) && doc.servers.length > 0) {
    return doc.servers[0].url;
  }
  if (typeof doc.servers === 'string') {
    return doc.servers;
  }
  return null;
};

const getBasePath = (doc: OpenAPI.Document): string => {
  if (isSupported(doc)) {
    const firstServer = getFirstServer(doc);
    if (!firstServer) {
      return '';
    }

    console.log('aaa', firstServer);
    const parsed = new URL(firstServer);
    console.log('bbb', parsed);
    return (parsed?.pathname || '')
      .replace(/\/+$/, '')
      .replace(/^\/+/, '/');
  }
  const thisVersion = getVersion(doc);
  throw new UnsupportedVersionError(thisVersion);
};

export default getBasePath;
