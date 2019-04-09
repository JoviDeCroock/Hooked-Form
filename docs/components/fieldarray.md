---
id: fieldarray
title: FieldArray
sidebar_label: FieldArray
---

The FieldArray component is used to inject the values of a certain field into the passed formfield component.

## Input properties

- component - A react component.
- render - A function to pass the properties to.
- fieldId - The name for this field.

## Injected properties

- add: `(element = {}) => void` - A function to add an element to the back of your array.
- error: `string` - If this fieldArray has an error this will be passed.
- fieldId: `string` - The passed fieldId so it's available in your function.
- insert: `(at: number, element: object) => void` - Inserts given object at that spot.
- move: `(from: number, to: number) => void` - Moves from given location to the other location.
- remove: `(toDelete: number | object) => void` - The function to remove an element form your array, it accepts an element or an index.
- replace: `(at: number, element: object) => void` - Replaces the object at the index with given new element.
- reset: `() => void` - Will reset this one field to its initialValue or an empty array.
- swap: `(from: number, to: number) => void` - will swap the two objects on the indexes from place.
- value: `[any]` - The current value of the field.

## map

The values has an altered .map function, this will be `(element, fieldId, index) => element`. The fieldId will automatically be `${FieldArrayFieldId}[${currentIndex}]`.

## Example

```js
import React from 'react';
import { Form, Field } from 'hooked-form';

const StringField = ({ myOwnCustomProp = 'label', onChange, onBlur, error, value }) => (
  <React.Fragment>
    <p>{myOwnCustomProp}</p>
    <input onchange={(e) => onChange(e.currentTarget.value)} onBlur={onBlur} value={value} />
    <p>{error}</p>
  </React.Fragment>
);

const Friends = ({ removeE, value, add }) => (
  <React.Fragment>
    {value.map((element, fieldId, i) => (
      <Field
        component={StringField}
        fieldId={`${fieldId}.name`}
      />
      <button onClick={remove.bind(this, i)}>Remove</button>
    ))}
    <button onClick={() => add()}>Add</button>
  </React.Fragment>
)

const FormComponent = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <FieldArray
      component={Friends}
      fieldId="friends"
      myOwnCustomProp="hey"  
    />
  </form>
);

export default Form({
  onSubmit: console.log,
})(FormComponent);
```
