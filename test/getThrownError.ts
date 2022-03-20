const getThrownError = (fn: () => unknown): Error | undefined => {
  try {
    fn();
  } catch(error) {
    return error as Error
  }
}

export default getThrownError;