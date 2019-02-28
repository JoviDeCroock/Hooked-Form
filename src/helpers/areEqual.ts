interface Props {
  watchAbleProps?: Array<string>;
  [fieldId: string]: any;
}

export const areEqualMemoizedField = ({
  watchableProps: prevWatchable, ...prev }: Props,
  { watchAbleProps: nextWatchable, ...next }: Props,
) => (nextWatchable || ['className', 'disabled']).every(
  (prop: string) => prev[prop] === next[prop]);
