export function deriveInitial(
  value: { [fieldId: string]: any },
  defaultValue: any
): { [fieldId: string]: any } {
  const result: { [fieldId: string]: any } = {};

  for (const key in value) {
    if (Array.isArray(value[key])) {
      result[key] = value[key].map((val: any) =>
        typeof val === 'object'
          ? deriveInitial(val, defaultValue)
          : defaultValue
      );
    } else if (value[key] && typeof value[key] === 'object') {
      result[key] = deriveInitial(value[key], defaultValue);
    } else {
      result[key] = defaultValue;
    }
  }

  return result;
}
