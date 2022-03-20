const getThrownError = (fn: () => unknown): Error | void => {
  try {
    fn();
  } catch(error) {
    return error as Error
  }
}

export default getThrownError;