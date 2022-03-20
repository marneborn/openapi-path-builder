type Options = {
  name: string;
  path: string;
  strict: boolean;
};

export type Formatter<T> = (value: T, options: Options) => string;