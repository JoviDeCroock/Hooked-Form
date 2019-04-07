---
id: error
title: Error
sidebar_label: Error
---

The Error component is used to inject the error of a certain field into the passed component.

## Input properties

- component - A react component.
- fieldId - The name for this field.

## Injected properties

- error: `string` - If this field has an error this will be passed.

## Example

```js
import React from 'react';
import { ErrorMessage, Form } from 'hooked-form';

const ErrorContainer = ({ error }) => <p>{error}</p>

const FormComponent = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <ErrorMessage fieldId="name" component={ErrorContainer} />
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
})(FormComponent);
```

