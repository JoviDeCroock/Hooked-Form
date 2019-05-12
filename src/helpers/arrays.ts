export function move(value: Array<any>, from: number, to: number): Array<any> {
  const result = [...value];
  result.splice(from, 1);
  result.splice(to, 0, value[from]);
  return result;
}

export function insert(value: Array<any>, at: number, element: any): Array<any> {
  const result = [...value];
  result.splice(at, 0, element);
  return result;
}

export function replace(value: Array<any>, at: number, element: any): Array<any> {
  const result = [...value];
  result[at] = element;
  return result;
}

export function swap(value: Array<any>, from: number, to: number): Array<any> {
  const result = [...value];
  result[from] = value[to];
  result[to] = value[from];
  return result;
}

export function add(value: Array<any>, element: any): Array<any> {
  return [...value, element];
}

export function remove(value: Array<any>, element: any | number): Array<any> {
  if (typeof element == 'number') return value.filter(x => x !== value[element]);  // tslint:disable-line
  return value.filter(x => x !== element);
}
