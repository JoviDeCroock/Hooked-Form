---
id: useFormConnect
title: useFormConnect
sidebar_label: useFormConnect
---

This hook will return you the current `context` and be updated on every change
within that context.

| name            | type-signature                              | description                                         |
|-----------------|---------------------------------------------|-----------------------------------------------------|
| errors          | object                                      | The current errors in your form                     |
| formError       | string                                      | The current formError                               |
| isSubmitting    | boolean                                     | The state of your submit                            |
| resetForm       | () => void                                  | Resets the form to initialValues or an empty object |
| setFieldError   | (fieldId: string, error: string) => void    | Set a field level error                             |
| setFieldValue   | (fieldId: string, value: any) => void       | Set the value for a field                           |
| setFieldTouched | (fieldId: string, touched: boolean) => void | Set the touched state of a field                    |
| submit          | () => void                                  | Manually triggers a submit                          |
| touched         | object                                      | The touched state of your form                      |
| validate        | () => Errors                                | Manually calls a validate                           |
| values          | object                                      | The vlaues in your form                             |
