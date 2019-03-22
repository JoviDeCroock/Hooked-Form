export function deriveInitial(
  input: { [fieldId: string]: any }, defaultValue: any,
): { [fieldId: string]: any } {
  const result: { [fieldId: string]: any } = {};
  if (!input) return defaultValue;
  for (const key in input) {
    if (Array.isArray(input[key])) {
      result[key] = input[key].map((value: any) =>
        typeof value === 'object' ? deriveInitial(value, defaultValue) : defaultValue,
      );
    } else if (input[key] && typeof input[key] === 'object') {
      result[key] = deriveInitial(input[key], defaultValue);
    } else {
      result[key] = defaultValue;
    }
  }
  return result;
}
