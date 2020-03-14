export interface Source {
  [key: string]: any;
}

export function get(source: Source, key: any, index?: number): any {
  return getHelper(
    source,
    key.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'),
    0
  );
}

function getHelper(source: Source, path: Array<string>, index: number): any {
  if (!source || path.length <= index) return source;
  return getHelper(source[path[index]], path, index + 1);
}

export function set(source: Source | Array<any>, key: string, value: any): any {
  return setHelper(
    source,
    value,
    key.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'),
    0
  );
}

function setHelper(
  source: Source | Array<any>,
  value: any,
  pathArray: Array<string>,
  currentIndex: number
): any {
  if (currentIndex >= pathArray.length) return value;

  // At this point we could be dealing with a FieldArray
  // so be cautious not to use Stringed keys, if not it's an object.
  const continuedPath: any = setHelper(
    // @ts-ignore
    source && source[pathArray[currentIndex]],
    value,
    pathArray,
    currentIndex + 1
  );

  if (!source) {
    // @ts-ignore
    if (isNaN(pathArray[currentIndex])) {
      return { [pathArray[currentIndex]]: continuedPath };
    }

    const result: any[] = [];
    // @ts-ignore
    result[pathArray[currentIndex]] = continuedPath;
    return result;
  }

  // FieldArray copying.
  if (Array.isArray(source)) {
    // @ts-ignore
    source[pathArray[currentIndex]] = continuedPath;
    return source;
  }

  return Object.assign({}, source, {
    [pathArray[currentIndex]]: continuedPath,
  });
}
