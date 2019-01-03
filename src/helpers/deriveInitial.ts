export function deriveInitial(input: { [fieldId: string]: any }, defaultValue: any): { [fieldId: string]: any } {
  return Object.keys(input).reduce((acc: { [fieldId: string]: any }, key: string) => {
    if (typeof key === 'object') {
      return { ...acc, [key]: { ...deriveInitial(input[key], defaultValue) } }
    } else {
      return { ...acc, [key]: defaultValue }
    }
  }, {})
}
