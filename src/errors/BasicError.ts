export type Data = Record<string, unknown>;
export default class BasicError extends Error {
  constructor(msg = 'An error occured') {
    super(msg);
  }

  get data(): Record<string, unknown> {
    return {};
  }

  get type(): string { return this.constructor.name; }

  toJSON(): { data: Data, message: string } {
    return {
      data: this.data,
      message: this.message,
    };
  }
}
