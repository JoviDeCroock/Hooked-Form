import { useState } from 'react'

export default (initial: boolean): [(value: boolean) => void, boolean] => {
  const { 0: value, 1: setValue } = useState(initial || false)
  return [setValue, value]
}
