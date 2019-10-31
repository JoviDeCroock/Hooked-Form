---
id: hookedForm
title: HookedForm
sidebar_label: HookedForm
---

This component is meant to indicate the tree under it is a form, this will inject a
`<form>` tag for you.

We can pass several options to this component where only `onSubmit` is mandatory.

```jsx
import { HookedForm } from 'hooked-form';

const MyForm = () => {
  return (
    <HookedForm onSubmit={console.log} />
  )
}
```

Other options

| name                    | type-signature                                         | description                                                                                   |
|-------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| enableReinitialize      | boolean                                                | Indicates that a change in InitialValues should trigger a reset in formValues                 |
| initialValues           | object                                                 | The values to be used to initialize the formstate                                             |
| noForm                  | boolean                                                | Whether or not to render a `<form>` tag for the user                                          |
| onError                 | (result: any, callbag: ErrorBag) => void               | This callback will be executed when the `onSubmit` results in an erroneous situation          |
| onSuccess               | (result: any, callbag: SuccessBag) => void             | This callback will be executed when the `onSubmit` results in an success                      |
| onSubmit                | (values: Partial<T>, callbag: CallBag) => Promise<any> | The callback to be executed when a submit-event bubbles up                                    |
| shouldSubmitWhenInvalid | boolean                                                | Indicates the form should submit even when validate returns errors                            |
| validate                | (values: Partial<T>) => object                         | This will validate your values and expects an object back, an empty object implies no errors  |
| validateOnBlur          | boolean                                                | Whether or not to call validate when blurring the form field                                  |
| validateOnChange        | boolean                                                | Whether or not to call validate when changing the form field                                  |

Every additional prop will be used for the `<form>` tag this way you can apply `className`, ...

So for example:

```jsx
import { HookedForm } from 'hooked-form';
import styled from 'styled-components';

const StyledForm = styled(HookedForm)`
  background: blue;
`;

const MyForm = () => {
  return (
    <StyledForm onSubmit={console.log} />
  )
}
```

Will apply the style to that form-element.

CallBag:
SuccessBag:
ErrorBag:
