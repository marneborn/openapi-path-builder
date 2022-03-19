import BasicError, { Data } from './BasicError';

export default class MissingPathParamError extends BasicError {
  private path: string;
  private missingParams: string[];

  constructor(path: string, ...params: string[]) {
    super('Missing required path params');
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
