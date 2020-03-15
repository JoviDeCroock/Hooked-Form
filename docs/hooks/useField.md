---
id: useField
title: useField
sidebar_label: useField
---

This is the bread and butter hook for hooked-form, this hook allows you to
control the values on a field.

```js
const StringField = ({ fieldId }) => {
  const [{ onChange, onBlur, onFocus }, { value, touched, error }] = useField(fieldId);
  return (
    <Fragment>
      <input onBlur={onBlur} onFocus={onFocus} onChange={e => onChange(e.target.value)} value={value} />
      {touched && error && <p>{error}</p>}
    </Fragment>
  )
};
```

As you can see the first argument of your payload gives you the functions to control the state

- onBlur, when tabbed will set the `touched` state for this field to `true`.
- onChange, accepts a value that will make your new state.
- onBlur, when focussed will set the `touched` state for this field to `false`.

The second part is your actual state

- error, if `validation` indicates that this particular field contains an error it will be visible in this property
- value, the current value for this field
- touched, whether or not your user has visited this field.

The `useField` hook accepts a second argument, a validation function.

```js
const StringField = ({ fieldId }) => {
  const [{ onChange, onBlur, onFocus }, { value, touched, error }] = useField(fieldId, (value) => value === 'x' ? 'error': undefined);
  return (
    <Fragment>
      <input onBlur={onBlur} onFocus={onFocus} onChange={e => onChange(e.target.value)} value={value} />
      {touched && error && <p>{error}</p>}
    </Fragment>
  )
};
```

You can return an error-string or `undefined` this will set the error after the `Form.validate` so you can combine the two for simple
and complex validation.
