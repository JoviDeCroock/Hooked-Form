import toPath from './toPath';

export interface Source {
  [key: string]: any;
}

// TODO: consider TCO conversion (while).
export function get(source: Source, key: any): any {
  return getHelper(source, toPath(key), 0);
}

function getHelper(source: Source, path: Array<string>, index: number): any {
  if (!source || path.length <= index) return source;
  return getHelper(source[path[index]], path, index + 1);
}

// TODO: consider TCO conversion (while).
export function set(source: Source | Array<any>, key: string, value: any): any {
  return setHelper(source, value, toPath(key), 0);
}

function setHelper(
  source: Source | Array<any>, value: any, pathArray: Array<string>, currentIndex: number,
): any {
  if (currentIndex >= pathArray.length) return value;

  const currentPath = pathArray[currentIndex];

  // At this point we could be dealing with a FieldArray
  // so be cautious not to use Stringed keys, if not it's an object.
  const continuedPath: any = setHelper(
    source &&
      (Array.isArray(source) ? source[Number(currentPath)] : source[currentPath]),
      value, pathArray, currentIndex + 1,
    );

  if (!source) return { [currentPath]: continuedPath };

  // FieldArray copying.
  if (Array.isArray(source)) {
    source[Number(currentPath)] = continuedPath;
    return source;
  }

  return Object.assign({}, source, { [currentPath]: continuedPath });
}
