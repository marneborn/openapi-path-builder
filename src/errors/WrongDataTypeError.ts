import BasicError, { Data } from './BasicError';

export type DataTypeProblem = {
  name: string;
  expected: string;
  value: unknown;
};

export default class WrongDataTypeError extends BasicError {
  private path: string;
  private problems: DataTypeProblem[];

  constructor(path: string, ...problems: DataTypeProblem[]) {
    super('Wrong data type for param');
    this.path = path;
    this.problems = problems;
  }

  get data(): Data {
    return { 
      path: this.path,
      problems: this.problems,
     };
  }
}
