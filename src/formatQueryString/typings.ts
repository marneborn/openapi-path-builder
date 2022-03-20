type Options = {
  name: string;
  path: string;
};

export type Formatter<T> = (value: T, options: Options) => string;
