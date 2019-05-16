import toPath from './toPath';

export interface Source {
  [key: string]: any;
}

export function get(source: Source, key: any): any {
  return getHelper(source, toPath(key), 0);
}

function getHelper(source: Source, path: Array<string>, index: number): any {
  if (!source || path.length <= index) return source;
  return getHelper(source[path[index]], path, index + 1);
}

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
  const currentValue = source &&
    (Array.isArray(source) ? source[Number(currentPath)] : source[currentPath]);

  const continuedPath: any = setHelper(currentValue, value, pathArray, currentIndex + 1);

  if (!source) {
    // if (typeof currentPath == 'number') { // tslint:disable-line
    //   const array = [];
    //   array[Number(currentPath)] = continuedPath;
    //   return array;
    // }
    return { [currentPath]: continuedPath };
  }

  // FieldArray copying.
  if (Array.isArray(source)) {
    source[Number(currentPath)] = continuedPath;
    return source;
  }

  return { ...source, [currentPath]: continuedPath };
}
