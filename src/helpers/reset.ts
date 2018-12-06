function reset(value: any) {
  switch (typeof value) {
    case 'string': return ''
    case 'number': return 0
    case 'boolean': return false
    case 'object': {
      if (value instanceof Date) {
        return new Date()
      }
      return {}
    }
    default: return undefined
  }
}

export default reset
