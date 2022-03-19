export default class BasicError extends Error {
  constructor(msg = 'An error occured') {
    super(msg);
  }

  get data(): Record<string, unknown> {
    return {};
  }

  get type(): string { return this.constructor.name; }

  toJSON() {
    return {
      data: this.data,
      message: this.message,
    };
  }
}
