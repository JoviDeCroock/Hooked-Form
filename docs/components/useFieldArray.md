---
id: useFieldArray
title: UseFieldArray
sidebar_label: UseFieldArray
---

We export a hook that provides you with the building blocks to construct your own custom components.

This accepts one parameter and that's a `fieldId`, analogue to the `FieldArray` component.

In return it will offer you an array with the first element being an object of operations and the second being an object of information about the field

First object:

- add
- insert
- move
- remove
- replace
- reset
- swap

Second object:

- error: an error string if there's an error present.
- value: the current value of this field, with enhanced map function `(value: object, fieldId: string, index: number)`

Example

```javascript
const MyArray = ({ fieldId }) => {
  const [
    {
      add
    },
    { value, error }
  ] = useFieldArray(fieldId);

  return (
    <React.Fragment>
      {value.map((object, fieldId, index) => {
        const [{ onChange, onBlur }, { value: fieldValue, touched, error: fieldError }] = useField(fieldId);
        return (
          <input onChange={onChange} onBlur={onBlur} value={fieldValue} />
          {touched && fieldError && <p>{fieldError}</p>}
        )
      })}
      <Button onClick={add} label="add" />
    </React.Fragment>
  );
}
```
