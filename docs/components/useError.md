---
id: useError
title: UseError
sidebar_label: UseError
---

This hook allows you to pass a `fieldId` and will return the error for this field,
this will only rerender if the field changes.

example: 

```jsx
const NameError = () => {
  const err = useError('name');
  return err ? `You have errored: ${err}` : null;
}
```
