interface Props {
  watchAbleProps?: Array<string>;
  [fieldId: string]: any;
}

export const areEqualMemoizedField = ({
  watchableProps: prevWatchable, ...prev }: Props,
  { watchAbleProps: nextWatchable = ['className', 'disabled'], ...next }: Props
) => nextWatchable.every((prop: string) => prev[prop] === next[prop]);
