export function move(input: Array<any>, from: number, to: number): Array<any> {
  const copy = [...(input || [])];
  copy.splice(from, 1);
  copy.splice(to, 0, input[from]);
  return copy;
}

export function insert(input: Array<any>, at: number, element: object): Array<any> {
  const copy = [...(input || [])];
  copy.splice(at, 0, element);
  return copy;
}

export function replace(input: Array<any>, at: number, element: object): Array<any> {
  const copy = [...(input || [])];
  copy[at] = element;
  return copy;
}

export function swap(input: Array<any>, first: number, second: number): Array<any> {
  const copy = [...(input || [])];
  copy[first] = input[second];
  copy[second] = input[first];
  return copy;
}

export function add(input: Array<any>, element: object): Array<any> {
  return [...(input || []), element];
}

export function remove(input: Array<any>, toDelete: object | number): Array<any> {
  if (typeof toDelete === 'number') {
    return (input || []).filter(x => x !== input[toDelete]);
  }
  return (input || []).filter(x => x !== toDelete);
}
