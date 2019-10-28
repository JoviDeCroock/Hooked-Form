const resultMapping: { [value: string]: Array<string> } = {};
function toPathArray(value: string) {
  if (resultMapping[value]) return resultMapping[value];
  return resultMapping[value] = value.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.');
}

export default toPathArray;
