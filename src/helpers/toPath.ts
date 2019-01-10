export function memoize(func: (input: string) => Array<string>) {
  const resultMapping: { [input: string]: Array<string> } = {}
  return (input: string) => {
    if (!resultMapping[input]) { resultMapping[input] = func(input) }
    return resultMapping[input]
  }
}

const toPathArray = (input: string) => {
  const parts = input.split('.')
  const result: Array<string> = []
  parts.forEach((part: string) => {
    if (part.includes('[')) {
      const { 0: firstPart, 1: temp } = part.split('[')
      result.push(firstPart)
      const { 0: secondPart } = temp.split(']')
      result.push(secondPart)
    } else { result.push(part) }
  })
  return result
}

export default memoize(toPathArray)
