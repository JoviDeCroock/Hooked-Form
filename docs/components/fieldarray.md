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

- addElement: (element = {}) - A function to add an element to the back of your array.
- error: string - If this fieldArray has an error this will be passed.
- fieldId: string - The passed fieldId so it's available in your function
- removeElement: (toDelete: number | object) => void - The function to remove an element form your array, it accepts an element or an index.
- reset: () => void - Will reset this one field to its initialValue or an empty array.
- values: [any] - The current value of the field.

## map

The values has an altered .map function, this will be (element, fieldId, index) => element. The fieldId will automatically be `${FieldArrayFieldId}[${currentIndex}]`.

## Example

```javascript
import React from 'react';
import { Form, Field } from 'hooked-form';

const StringField = ({ myOwnCustomProp = 'label', onChange, onBlur, error, value }) => (
  <React.Fragment>
    <p>{myOwnCustomProp}</p>
    <input onchange={(e) => onChange(e.currentTarget.value)} onBlur={onBlur} value={value} />
    <p>{error}</p>
  </React.Fragment>
);

const Friends = ({ values, addElement }) => (
  <React.Fragment>
    {values.map((element, fieldId, i) => (
      <Field
        component={StringField}
        fieldId={`${fieldId}.name`}
      />
      <button onClick={removeElement.bind(this, i)}>Remove</button>
    ))}
    <button onClick={() => addElement()}>Add</button>
  </React.Fragment>
)

const FormContainer = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <FieldArray
      component={Friends}
      fieldId="friends"
      myOwnCustomProp="hey"  
    />
  </form>
);

export default Form({
  onSubmit: (values) => console.log(values),
})(FormContainer);
```
