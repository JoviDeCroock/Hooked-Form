---
id: useFieldArray
title: UseFieldArray
sidebar_label: UseFieldArray
---

We export a hook that provides you with the building blocks to construct your own custom components.

This accepts one parameter and that's a `fieldId`, analogue to the `FieldArray` component.

In return it will offer you an array with the first element being an object of operations and the second being an object of information about the field

## Properties

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
- value: the current value of this field

For generics check the staticTyping chapter part.

## Example

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
      {value.map((object, i) => {
        const [{ onChange, onBlur }, { value: fieldValue, touched, error: fieldError }] = useField(`${fieldId}[${i}]`);
        return (
          <div>
            <input onChange={onChange} onBlur={onBlur} value={fieldValue} />
            {touched && fieldError && <p>{fieldError}</p>}
          </div>
        )
      })}
      <Button onClick={add} label="add" />
    </React.Fragment>
  );
}
```
