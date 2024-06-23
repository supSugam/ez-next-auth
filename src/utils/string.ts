export const withPrefix = <T extends string | Array<string>>(
  prefix: string,
  value: T
): T => {
  if (Array.isArray(value)) {
    return value.map((val) => `${prefix}${val}`) as T;
  }
  return `${prefix}${value}` as T;
};
