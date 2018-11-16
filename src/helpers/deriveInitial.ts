export function deriveInitial(input: object, defaultValue: any): object {
  return Object.keys(input).reduce((acc: object, key: string) => {
    if (typeof key === 'object') {
      return {
        ...acc,
        [key]: {
          ...deriveInitial(input[key], defaultValue),
        }
      }
    } else {
      return {
        ...acc,
        [key]: defaultValue,
      }
    }
  }, {});
}
