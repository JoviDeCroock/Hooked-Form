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
- move, Accepts two numbers and will move an element from the first number to the second one.
- remove, Accepts a number and will remove the element at that position.
- replace, Accepts a number and an element and will replace the element on given position with the one specified in arguments.
- swap, Accepts two numbers and swaps these two around in terms of position within the array.

The second part is your actual state

- error, if `validation` indicates that this particular field contains an error it will be visible in this property
- value, the current value for this field
