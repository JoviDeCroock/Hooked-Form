export const deriveKeys = (obj: { [key: string]: any }, parentKey?: string): Array<string> => {
  parentKey = parentKey || '';
  return Object.keys(obj).reduce<Array<string>>((acc, key) => {
    const value = obj[key];

    if (Array.isArray(value)) {
      // @ts-ignore
      value.some((v, i) => {
        typeof v === 'object' ?
          acc.push(...deriveKeys(v, `${parentKey}${key}[${i}].`)) :
          acc.push(`${parentKey}${key}[${i}]`);
      });
    } else if (typeof value === 'object') {
      acc.push(...deriveKeys(value, `${parentKey}${key}.`));
    } else {
      acc.push(parentKey + key);
    }

    return acc;
  }, []);
};
