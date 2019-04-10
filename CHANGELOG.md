# Releases

## 2.0.0

- preact x support with tests (on official release)

### Form

- don't pass validate values and touched to the Component, if needed they can be retrived through useFormConnect.

### FieldArray + useFieldArray

- lose `Element` postfix on operations
- values -> value
- resetField -> reset

### Field + useField

- resetField -> reset

## 1.6.0

- update redundant if-statements by [Pruxis](https://github.com/Pruxis) in [PR #22](https://github.com/JoviDeCroock/hooked-form/pull/2)
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
