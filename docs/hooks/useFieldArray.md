---
id: useFieldArray
title: useFieldArray
sidebar_label: useFieldArray
---

This is a helper method for controlling arrays of fields, this can be done manually
but who doens't like a little abstraction to make the day?

```js
const Friends = () => {
  const [
    { add, remove },
    { value, error },
  ] = useFieldArray('friends');
  return (
    <Fragment>
      {value.map((f, i) => (
        <Fragment key={f.id}>
          <StringField fieldId={`friends[${i}].name`} />
          <button onClick={() => remove(i)}>Remove friend</button>
        </Fragment>
      ))}
      <button onClick={() => add({ id: value.length })}>Add friend</button>
    </Fragment>
  )
};
```

As you can see the first argument of your payload gives you the functions to control the array state

- add, appends the argument you pass into it at the back of the array.
- insert, accepts a number as the first argument and an element as the second and will put that element at the specified position.
- remove, Accepts a number and will remove the element at that position.

The second part is your actual state

- error, if `validation` indicates that this particular field contains an error it will be visible in this property
- value, the current value for this field
