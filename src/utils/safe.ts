export const isError = (
  err: unknown | any,
  cb?: (err: Error) => void
): err is Error => {
  if (err instanceof Error) {
    cb?.(err);
    return true;
  }
  return false;
};
