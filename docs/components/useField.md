---
id: useField
title: UseField
sidebar_label: UseField
---

We export a hook that provides you with the building blocks to construct your own custom components.

This accepts one parameter and that's a `fieldId`, analogue to the `Field` component.

In return it will offer you an array with the first element being an object of operations and the second being an object of information about the field

First object:

- onBlur: this indicates that the fieldId will be touched
- onChange: when passed a value it will change the value of this field
- onFocus: used to untouch the field
- setFieldValue: accepts a fieldId and a value, so you can change other fields as a reaction to this one
- resetField: resets the field to its initial value

Second object:

- error: an error string if there's an error present.
- touched: a boolean indicating whether or not this field has been touched
- value: the current value of this field

Example

```javascript
const StringField = ({ fieldId }) => {
  const [
    { onChange, onBlur },
    { value, error, touched }
  ] = useField(fieldId);

  return (
    <React.Fragment>
      <input onChange={onChange} onBlur={onBlur} value={value} />
      {touched && error && <p>{error}</p>}
    </React.Fragment>
  );
}
```
