class BaseError extends Error {
  get data(): Record<string, unknown> {
    return {}
  }
  toJSON() {
    return {
      message: this.message,
      data: this.data
    }
  }
}

export class MissingPathParamError extends BaseError {
  private missingParams: string[];
  constructor(...params: string[]) {
    super('Missing required path params');
    this.missingParams = [...params];
  }
  get data() {
    return { missingParams: this.missingParams }
  }
};