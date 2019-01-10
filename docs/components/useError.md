---
id: useError
title: UseError
sidebar_label: UseError
---

We export an experimental hook that provides you with the building blocks to construct your own custom components.

This accepts one parameter and that's a `fieldId`, analogue to the `Field` component.

In return it will offer you the error string or null.

Example

```javascript
const MyErrorComponent = ({ fieldId }) => {
  const error = useError(fieldId)
  return (
    <React.Fragment>
      {error && <p>{error}</p>}
    </React.Fragment>
  );
}
```
