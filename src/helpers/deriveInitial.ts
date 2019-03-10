export function deriveInitial(
  input: { [fieldId: string]: any }, defaultValue: any,
): { [fieldId: string]: any } {
  return input && Object.keys(input).reduce((acc: { [fieldId: string]: any }, key: string) => {
    if (Array.isArray(input[key])) {
      acc[key] = input[key].map((value: any) =>
        typeof value === 'object' ? deriveInitial(value, defaultValue) : defaultValue);
      return acc;
    }

    if (input[key] && typeof input[key] === 'object') {
      acc[key] = deriveInitial(input[key], defaultValue);
      return acc;
    }

    acc[key] = defaultValue;
    return acc;
  }, {});
}
