import BasicError from './BasicError';

export class MissingPathParamError extends BasicError {
  private missingParams: string[];

  constructor(...params: string[]) {
    super('Missing required path params');
    this.missingParams = [...params];
  }

  get data() {
    return { missingParams: this.missingParams };
  }
}
