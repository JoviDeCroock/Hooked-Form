---
id: useSpy
title: useSpy
sidebar_label: useSpy
---

Have you ever had this use case where an arbitrary change in an unrelated
field should trigger some network-request, validation, ...? Well `useSpy`
could become your new best friend.

This hook accepts a `fieldId` whenever the value for this field changes the hook will get notified.

This notification happens in the form of the second argument, a callback, being
triggered with the new `value` and the [context](./useFormConnect.md) as arguments.

```jsx
const MyComponent = () => {
  useSpy('age', (newAge, { setFieldError }) => {
    if (newAge < 18) {
      setFieldError('age', 'you must be 18 or older');
    }
  });
  return <div>Irrelevant</div>;
}
```

The example can be done with `validate` too but this can also hide/show elements this way by calling
a callback from a `useState` you yourself define.
