const isDate = (value: unknown): value is Date => (value as unknown) instanceof Date;
export default isDate;
