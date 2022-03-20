import BasicError, { Data } from './BasicError';

export default class MissingQueryParam extends BasicError {
  private path: string;
  private missingParams: string[];

  constructor(path: string, ...params: string[]) {
    super('Missing required query params');
    this.path = path;
    this.missingParams = [...params];
  }

  get data(): Data {
    return { 
      path: this.path, 
      missingParams: this.missingParams,
    };
  }
}
