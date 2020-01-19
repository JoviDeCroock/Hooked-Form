---
id: form
title: Form
sidebar_label: Form
---

Form is used to wrap your component, you can pass options in and that will result in your pased component getting a few extra properties.

## Options

- mapPropsToValues: `(props: object) => object` - This function allows you to take your props and set the initialValues with them.

## Properties

These properties are injected to the component you pass in as the second argument to this HOC.

- formError `string` - A formErorr that can be set in the `onSubmit` or `onError` function.
- handleSubmit `() => void` - You can pass this to your Form or use it in a function.
- isSubmitting: `boolean` - A value indicating whether or not our form is in the process of submitting.
- resetForm `() => void` - A function to return to our initialValues.
- change: `(fieldId: string, value: any) => void` - A function used to manually change a fields value.
- isDirty: `boolean` - Whether the field is dirty or not.

For generics check the staticTyping chapter part.

## Example

```js
import React from 'react';
import { Form } from 'hooked-form';

const FormComponent = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} />
);

export default Form({
  onSubmit: console.log(values),
  mapPropsToValues: (props) => ({
    name: props.name,
  })
})(FormComponent);
```
