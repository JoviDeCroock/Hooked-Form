---
id: form
title: Form
sidebar_label: Form
---

Form is used to wrap your component, you can pass options in and that will result in your pased component getting a few extra properties.

## Options

- initialValues?: `object` - These values will be used to initialize your form.
- onError?: `(error: object, setFormError: (error: string) => void) => void` - When an error occurs while submitting this function will run.
- onSuccess?: `(result?: any) => void` - When the submit is successfull this function will be executed with your result.
- mapPropsToValues: `(props: object) => object` - This function allows you to
  take your props and set the initialValues with them.
- onSubmit: `(values: object, props:any) => any` - This function will be used to submit the properties inside the form.
- shouldSubmitWhenInvalid? : `boolean` = false - Indicates whether or not submit should be executed when your form is invalid.
- validate?: `(values: object, touched: object) => object` - The function used to validate your form.
- validateOnBlur?: `boolean` - Indicates that validation should be executed onBlur.
- validateOnChange?: `boolean` - Indicates the validation should be executed on every change.

## Properties

- formError `string` - A formErorr that can be set in the `onSubmit` or `onError` function.
- handleSubmit `() => void` - You can pass this to your Form or use it in a function.
- validate `() => void` - When you want to manually validate all fields.
- isSubmitting: `boolean` - A value indicating whether or not our form is in the process of submitting.
- resetForm `() => void` - A function to return to our initialValues.
- change: `(fieldId: string, value: any) => void` - A function used to manually change a fields value.

## Example

```js
import React from 'react';
import { Form } from 'hooked-form';

const FormComponent = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} />
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
