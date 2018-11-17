import cloneDeep from 'lodash.clonedeep';
import toPath from 'lodash.topath';

export function get(source: any, key: any) {
  let result = source;
  const path = toPath(key);
  path.forEach((subKey: string) => {
    result = result[subKey];
  });
  return result;
}

export function set(source: any, key: string, value: any) {
  const res: any = {};
  const pathArray = toPath(key);
  let resVal: any = res;
  let i = 0;

  for (; i < pathArray.length - 1; i++) {
    const currentPath: string = pathArray[i];
    const currentObj: any = get(source, pathArray.slice(0, i + 1));

    if (resVal[currentPath]) {
      resVal = resVal[currentPath];
    } else if (currentObj) {
      resVal = resVal[currentPath] = cloneDeep(currentObj);
    } else {
      const nextPath: string = pathArray[i + 1];
      resVal = resVal[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? source : resVal)[pathArray[i]] === value) {
    return source;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  const result = { ...source, ...res };

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete result[pathArray[i]];
  }

  return result;
}

/** @private is the given object an integer? */
export const isInteger = (source: any): boolean =>
  String(Math.floor(Number(source))) === source;
