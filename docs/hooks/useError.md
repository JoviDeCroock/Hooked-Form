---
id: useError
title: useError
sidebar_label: useError
---

This hook allows you to pass a `fieldId` and will return the error for this field.

example: 

```jsx
const NameError = () => {
  const err = useError('name');
  return err ? `You have errored: ${err}` : null;
}
```
