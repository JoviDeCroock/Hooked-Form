export function deriveInitial(input: { [fieldId: string]: any }, defaultValue: any): { [fieldId: string]: any } {
  return Object.keys(input).reduce((acc: { [fieldId: string]: any }, key: string) => {
    if (Array.isArray(input[key])) {
      return { ...acc, [key]: input[key].map((value: any) => deriveInitial(value, defaultValue)) }
    } else if (typeof input[key] === 'object') {
      return { ...acc, [key]: deriveInitial(input[key], defaultValue) }
    } else {
      return { ...acc, [key]: defaultValue }
    }
  }, {})
}
