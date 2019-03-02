export function deriveInitial(
  input: { [fieldId: string]: any }, defaultValue: any,
): { [fieldId: string]: any } {
  console.log('input', input);
  return Object.keys(input).reduce((acc: { [fieldId: string]: any }, key: string) => {
    console.log('reduce', key, input[key]);
    if (Array.isArray(input[key])) {
      acc[key] = input[key].map((value: any) => deriveInitial(value, defaultValue));
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
