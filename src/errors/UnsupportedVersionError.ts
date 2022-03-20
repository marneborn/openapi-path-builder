import { SUPPORTED_VERSIONS } from '$checkVersion';
import BasicError, { Data } from './BasicError';

export default class UnsupportedVersionError extends BasicError {
  private version: string;

  constructor(version: string) {
    super('Missing required path params');
    this.version = version;
  }

  get data(): Data {
    return {
      supportedVersions: SUPPORTED_VERSIONS,
      version: this.version,
    };
  }
}
