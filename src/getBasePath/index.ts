import { OpenAPI } from 'openapi-types';
import { onlySupported } from '../checkVersion';

const getBasePath = (doc: OpenAPI.Document): string => {
  onlySupported(doc);
  return '';
};

export default getBasePath;