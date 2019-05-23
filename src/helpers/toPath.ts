export default (() => {
  const resultMapping: { [value: string]: Array<string> } = {};
  return function toPathArray(value: string) {
    if (resultMapping[value]) return resultMapping[value];
    return resultMapping[value] = value.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.');
  };
})();
