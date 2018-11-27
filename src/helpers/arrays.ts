export function move(input: Array<any> = [], from: number, to: number) {
  const copy = [...input]
  copy.splice(from, 1)
  copy.splice(to, 0, input[from])
  return copy
}

export function insert(input: Array<any> = [], at: number, element: object) {
  const copy = [...input]
  copy.splice(at, 0, element)
  return copy
}

export function replace(input: Array<any> = [], at: number, element: object) {
  const copy = [...input]
  copy[at] = element
  return copy
}

export function swap(input: Array<any> = [], first: number, second: number) {
  const copy = [...input]
  copy[first] = input[second]
  copy[second] = input[first]
  return copy
}

export function add(input: Array<any> = [], element: object) {
  return [...input, element]
}

export function remove(input: Array<any> = [], toDelete: object | number) {
  if (typeof toDelete === 'number') { return input.filter(x => x !== input[toDelete]) }
  else { return input.filter(x => x !== toDelete) }
}
