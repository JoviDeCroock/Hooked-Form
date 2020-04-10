# Releases

## 4.3.3

- Ensure data safety on FieldArray operations

## 4.3.2

- Fix potential issue with registering validators
- Save bytes

## 4.3.1

- Fix issue where changing the `fieldId` wouldn't rebind the `validate`/`onChange` (relates to arrays and insertions)
- Fix reordering of `errors` and `touched` with array operations

## 4.3.0

- Add second argument to `useField` used to validate fields.

## 4.2.3

- Every `Form` isntance will now have it's own `emitter`
- Validation will now be checked for equality and not emit if it hasn't changed deeply

## 4.2.2

- Perf improvements (internal emitter uses Set)

## 4.2.1

- Size improvements

## 4.2.0

- Remove the deprecation of `Form`
- Add render props to `HookedForm`

## 4.1.0

- The `useSpy` now returns an object with the observed Field data `{ value, error, touched }`

## 4.0.0

### Breaking

- The components have made place for a full hooks implementation (`Field`, `FieldArray` and `Error` are gone).
- `useFieldArray.remove` now only accepts a numerical index instead of an object or an index.
- `validateOnBlur` is now default `false` in `<HookedForm />`
- `validateOnBlur` is still `true` in `Form` to support moving over.

### Deprecation

- The `Form` HOC has been deprecated in favor of the `<HookedForm />` component.

### Features

- `<HookedForm>` component which abstracts the `<form>` field away, you can pass in props just as you would normally do.
- `onSuccess` now receives a `SuccessBag` containing `resetForm`
- `useSpy` hook that allows you to spy on arbitrary form values and execute a callback with access to context.

## 3.0.0

- Update onSubmit to contain an object of props and errorSetters
- Rename FieldArray.render to FieldArray.children

## 2.3.0

- Use `use-context-selector` to drastically improve performance

## 2.2.0

- Added generics for `useField`, `useFieldArray` and `Form` by [Pruxis](https://github.com/Pruxis) in [PR #41](https://github.com/JoviDeCroock/hooked-form/pull/41)

## 2.1.0

- Performance improvements

## 2.0.0

- A lot of internal changes with a bundle size goal.

### Form

- don't pass validate values and touched to the Component, if needed they can be retrived through useFormConnect.

### FieldArray + useFieldArray

- lose `Element` postfix on operations
- values -> value
- resetField got depreacated

### Field + useField

- resetField got deprecated

## 1.6.0

- update redundant if-statements by [Pruxis](https://github.com/Pruxis) in [PR #22](https://github.com/JoviDeCroock/hooked-form/pull/22)
- provide useFormConnect to replace deprecated feature
- rewrite to a more performant deriveInitial
- add isDirty param injected in context and formWrapper
- fix bug where toPath would not work with two numbers

## 1.5.2

- Bug fixed where an array of non-object values would fail in deriving initial

## 1.5.1

- Linter applied to all files now, bug in previous config
- Performance improvement in deriving initial input by [Pruxis](https://github.com/Pruxis) in [PR #20](https://github.com/JoviDeCroock/hooked-form/pull/20)
- Bug fixed where null would fail in deriving initial
