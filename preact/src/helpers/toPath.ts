const resultMapping: { [value: string]: Array<string> } = {};
function toPathArray(value: string) {
  return resultMapping[value] ||
    (resultMapping[value] = value.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'));
}

export default toPathArray;
