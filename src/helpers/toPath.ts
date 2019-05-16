export default (() => {
  const resultMapping: { [value: string]: Array<string> } = {};

  return function toPathArray(value: string) {
    if (resultMapping[value]) return resultMapping[value];
    const result: Array<string> = [];

    value.split('.').forEach((part: string) => {
      if (part.includes('[')) {
        const { 0: firstPart, 1: temp } = part.split('[');
        result.push(firstPart);
        const { 0: secondPart } = temp.split(']');
        result.push(secondPart);
      } else result.push(part);
    });

    return resultMapping[value] = result;
  };
})();
