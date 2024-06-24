type PrefixSide = 'left' | 'right' | 'both';
export const withPrefix = <T extends Record<string, string> | string>(
  prefix: string,
  value: T,
  side: PrefixSide = 'left'
): T => {
  const insertPrefix = (value: string) => {
    return side === 'left'
      ? `${prefix}${value}`
      : side === 'right'
      ? `${value}${prefix}`
      : `${prefix}${value}${prefix}`;
  };
  if (typeof value === 'string') {
    return insertPrefix(value) as T;
  }
  return Object.keys(value).reduce((acc, key) => {
    acc[key] = insertPrefix(value[key]);
    return acc;
  }, {} as Record<string, string>) as T;
};

type TimePostFix = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y';
type TimeAsStr = `${number}${TimePostFix}`;

const timeUnitsToMilliseconds: Record<TimePostFix, number> = {
  ms: 1,
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
  mo: 1000 * 60 * 60 * 24 * 30, // Approximate month duration
  y: 1000 * 60 * 60 * 24 * 365, // Approximate year duration
};

export const absoluteTime = (time: TimeAsStr, to: TimePostFix): number => {
  // Extract numeric value and unit from the input time string
  const value = parseFloat(time);
  const unit = time.replace(`${value}`, '') as TimePostFix;

  // Convert input time to milliseconds
  const timeInMilliseconds = value * timeUnitsToMilliseconds[unit];

  // Convert milliseconds to the target unit
  const result = timeInMilliseconds / timeUnitsToMilliseconds[to];

  return result;
};
