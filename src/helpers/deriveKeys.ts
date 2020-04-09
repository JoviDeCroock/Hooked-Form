export const deriveKeys = (
  obj: { [key: string]: any },
  parentKey?: string
): Array<string> => {
  parentKey = parentKey || '';

  return Object.keys(obj).reduce<Array<string>>((acc, key) => {
    if (Array.isArray(obj[key])) {
      obj[key].some((v: any, i: number) => {
        typeof v === 'object'
          ? acc.push(...deriveKeys(v, `${parentKey}${key}[${i}].`))
          : acc.push(`${parentKey}${key}[${i}]`);
      });
    } else if (typeof obj[key] === 'object') {
      acc.push(...deriveKeys(obj[key], `${parentKey}${key}.`));
    } else {
      acc.push(parentKey + key);
    }

    return acc;
  }, []);
};
