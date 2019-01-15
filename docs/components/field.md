---
id: field
title: Field
sidebar_label: Field
---

The Field component is used to inject the values of a certain field into the passed formfield component.

## Input properties

- component - A react component.
- fieldId - The name for this field.
- innerRef - The ref to pass through to your custom component.
- watchableProps - The props that will be causing a rerender when changed, this will
  default to `['className', 'disabled']`.

## Injected properties

- error: `string` - If this field has an error this will be passed.
- onBlur: `() => void` - You can pass this into the onBlur of your field to accurately represent the touched status of this field.
- onChange: `(value: any) => void` - This function will be used to change the value of said field.
- onFocus: `() => void` - This function sets the touched to false to hide errors.
- reset: `() => void` - Will reset this one field to its initialValue or null.
- value: `any` - The current value of the field.

## Example

```js
import React from 'react';
import { Form, Field } from 'hooked-form';

const StringField = ({ myOwnCustomProp, onChange, onBlur, error, value }) => (
  <React.Fragment>
    <p>{myOwnCustomProp}</p>
    <input onchange={(e) => onChange(e.currentTarget.value)} onBlur={onBlur} value={value} />
    <p>{error}</p>
  </React.Fragment>
);

const FormContainer = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field
      component={StringField}
      fieldId="name"
      myOwnCustomProp="hey"  
    />
  </form>
);

export default Form({
  onSubmit: (values) => console.log(values),
  validate: (values, touched) => {
    const errors = {};
    if (touched.name && values.name.length < 3) {
      errors.name = 'Too short';
    }
    return errors;
  }
})(FormContainer);
```
