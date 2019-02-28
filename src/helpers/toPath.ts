export function memoize(func: (input: string) => Array<string>) {
  let resultMapping: { [input: string]: Array<string> } = {};
  let count = 0;
  return function memoizedFunc(input: string) {
    if (!resultMapping[input]) {
      resultMapping[input] = func(input);
      count = count + 1;
      if (count >= 600) { resultMapping = {}; }
    }
    return resultMapping[input];
  };
}

const toPathArray = (input: string) => {
  const parts = input.split('.');
  const result: Array<string> = [];
  parts.forEach((part: string) => {
    if (part.includes('[')) {
      const { 0: firstPart, 1: temp } = part.split('[');
      result.push(firstPart);
      const { 0: secondPart } = temp.split(']')[0];
      result.push(secondPart);
    } else { result.push(part); }
  });
  return result;
};

export default memoize(toPathArray);
