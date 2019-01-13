interface Props {
  efficient?: boolean;
  watchAbleProps?: Array<string>;
  [fieldId: string]: any;
}

export const areEqualMemoizedField = (prev: Props, next: Props) => {
  if (next.efficient) {
    if (!next.watchableProps || next.watchableProps.length === 0) { return true }
    return next.watchableProps.some((prop:string) => prev[prop] !== next[prop])
  }
  return false;
}
