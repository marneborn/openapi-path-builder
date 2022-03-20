import { UnsupportedVersionError } from '$errors';
import { getVersion, isSupported, SupportedDocuments } from '$checkVersion';

const getFirstServer = (doc: SupportedDocuments): string | null => {
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

const getBasePath = (doc: SupportedDocuments): string => {
  if (isSupported(doc)) {
    const firstServer = getFirstServer(doc);
    if (!firstServer) {
      return '';
    }

    const parsed = new URL(firstServer);
    return (parsed?.pathname || '')
      .replace(/\/+$/, '')
      .replace(/^\/+/, '/');
  }
  const thisVersion = getVersion(doc);
  throw new UnsupportedVersionError(thisVersion);
};

export default getBasePath;
