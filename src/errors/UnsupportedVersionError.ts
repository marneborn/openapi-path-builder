import BasicError from './BasicError';
import { SUPPORTED_VERSIONS } from '../checkVersion';

export default class UnsupportedVersionError extends BasicError {
  private version: string;

  constructor(version: string) {
    super('Missing required path params');
    this.version = version;
  }

  get data() {
    return {
      supportedVersions: SUPPORTED_VERSIONS,
      version: this.version,
    };
  }
}
