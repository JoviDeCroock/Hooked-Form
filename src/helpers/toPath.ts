// This is the lodash.toPath function but slightly altered.
// There were a lot of issues using lodash.toPath with TypeScript.
const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  '[^.[\\]]+' + '|' +
  '\\[(?:' +
    '([^"\'].*)' + '|' +
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
, 'g');

const toPathArray = (input: string) => {
  const result: Array<string> = [];
  if (input.charCodeAt(0) === charCodeOfDot) { result.push(''); }
  input.replace(rePropName, (match: string, expression: any, quote: any, subString: string) => {
    let key = match;
    if (quote) { key = subString.replace(reEscapeChar, '$1'); }
    else if (expression) { key = expression.trim(); }
    result.push(key);
    return key;
  });
  return result;
}

export default toPathArray;
