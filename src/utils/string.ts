type PrefixSide = 'left' | 'right' | 'both';
export const withPrefix = <T extends Record<string, string>>(
  prefix: string,
  value: T,
  side: PrefixSide = 'left'
): T => {
  return Object.keys(value).reduce((acc, key) => {
    acc[key] =
      side === 'left'
        ? `${prefix}${value[key]}`
        : side === 'right'
        ? `${value[key]}${prefix}`
        : `${prefix}${value[key]}${prefix}`;
    return acc;
  }, {} as Record<string, string>) as T;
};
