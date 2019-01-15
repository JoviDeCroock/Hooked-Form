# TODO

## Build

- look at babel to reduce bundlesize

## Library

- Add invariant
- Add Field performance enhancer

  ```js
  react.memo(({ efficient }) => {
    const fieldProps = useRef();
    return efficient ?
      React.useMemo(() => React.createElement(component, props), [value, error, onChange, isFieldTouched, ...(watchableProps || [])]) :
      React.createElement(component, props)
  }, (prev, next) => {
    if (next.efficient) {
      if (!next.watchableProps || next.watchableProps.length === 0) {
        return true;
      }
      return next.watchableProps.some((prop) => prev[prop] !== next[prop])
    } else {
      return false;
    }
  })
  ```

There are quite a few uncertainties in the case above, I'm not sure if this will
cause the component to rerender or not.
Logically speaking if it involves the same scheduler as State it should not be
subject to the propsRerender check, but since this revolves around being in the
function body i'm not quite sure as to what will happen.

With <Context.Consumer> you are sure of the rerender since the children() counts
as a seperate function and is not subject to the components above rerendering or
not. It just gets a "broadcast-poke" and decides to rerender with the new value.

In essence this should be possible for `useContext` but i'm not sure yet.

TODO: test
