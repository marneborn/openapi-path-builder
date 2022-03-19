import BasicError, { Data } from './BasicError';

export default class MissingPathParamError extends BasicError {
  private missingParams: string[];

  constructor(...params: string[]) {
    super('Missing required path params');
    this.missingParams = [...params];
  }

  get data(): Data {
    return { missingParams: this.missingParams };
  }
}
