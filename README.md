# Hooked-Form

[![npm version](https://badgen.net/npm/v/hooked-form)](https://www.npmjs.com/package/hooked-form)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![Build Status](https://travis-ci.com/JoviDeCroock/hooked-form.svg?branch=main)](https://travis-ci.com/JoviDeCroock/hooked-form)
[![Bundle size](https://badgen.net/bundlephobia/minzip/hooked-form)](https://badgen.net/bundlephobia/minzip/hooked-form)
[![codecov](https://codecov.io/gh/JoviDeCroock/Hooked-Form/branch/main/graph/badge.svg)](https://codecov.io/gh/JoviDeCroock/Hooked-Form)

[Documentation](https://jovidecroock.github.io/Hooked-Form/)

[Example](https://codesandbox.io/s/sweet-poincare-3km8r4k16)

## 🌍 Installation

**yarn**

```bash
  yarn add hooked-form
```

**npm**

```bash
  npm i --save hooked-form
```

**UMD**

_dev_:

```html
<script src="https://unpkg.com/hooked-form@latest/dist/hooked-form.umd.js"></script>
```

## 🎨 Example

```jsx
import React from 'react';
import { HookedForm, useField } from 'hooked-form';

const StringField = ({ fieldId, label }) => {
  const [{ onChange }, { touched, error, value }] = useField(fieldId);
  const onInput = React.useCallback(e => onChange(e.currentTarget.value), [
    onChange,
  ]);
  return (
    <label>
      {label + ' '}
      <input value={value} onChange={onInput} />
      {touched && error && <div>{error}</div>}
    </label>
  );
};

const App = () => {
  return (
    <HookedForm
      onSubmit={console.log}
      validateOnBlur
      initialValues={React.useMemo(() => ({ name: '' }), [])}
      validate={values => (values.name ? {} : { name: 'Required' })}
    >
      <h3>Hooked Form</h3>
      <StringField label="Name:" fieldId="name" />
      <input type="submit" value="Submit" />
    </HookedForm>
  );
};

render(<App />, document.body);
```

## 💿 Modern build

This library offers a modern build (ES2015 output), this is smaller and parses faster in the browser.
So if you don't plan to target older browsers feel free to use this.

### Webpack

```json
  "resolve": {
    "alias": {
      "hooked-form": "hooked-form/dist/hooked-form.modern.js"
    }
  }
```

### Parcel

```json
  "alias": {
    "hooked-form": "hooked-form/dist/hooked-form.modern.js"
  }
```

## 📢 Credits

- [Microbundle](https://github.com/developit/microbundle)
- [Performance-comparison](https://codesandbox.io/s/react-form-library-stress-test-81swz)

## 😍Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.faktion.com"><img src="https://avatars1.githubusercontent.com/u/6225486?v=4" width="100px;" alt=""/><br /><sub><b>Laurens Lavaert</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=Pruxis" title="Code">💻</a></td>
    <td align="center"><a href="https://www.jovidecroock.com/"><img src="https://avatars3.githubusercontent.com/u/17125876?v=4" width="100px;" alt=""/><br /><sub><b>Jovi De Croock</b></sub></a><br /><a href="#infra-JoviDeCroock" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=JoviDeCroock" title="Tests">⚠️</a> <a href="https://github.com/JoviDeCroock/Hooked-Form/pulls?q=is%3Apr+reviewed-by%3AJoviDeCroock" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=JoviDeCroock" title="Documentation">📖</a> <a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=JoviDeCroock" title="Code">💻</a></td>
    <td align="center"><a href="https://www.faktion.com/"><img src="https://avatars3.githubusercontent.com/u/17174776?v=4" width="100px;" alt=""/><br /><sub><b>Jonathan Callewaert</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/issues?q=author%3AJonathanCa97" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/arempe93"><img src="https://avatars1.githubusercontent.com/u/4637120?v=4" width="100px;" alt=""/><br /><sub><b>Andrew Rempe</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=arempe93" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tatchi"><img src="https://avatars2.githubusercontent.com/u/5595092?v=4" width="100px;" alt=""/><br /><sub><b>Corentin Leruth</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/commits?author=tatchi" title="Code">💻</a></td>
    <td align="center"><a href="http://lishine.github.io"><img src="https://avatars3.githubusercontent.com/u/6741645?v=4" width="100px;" alt=""/><br /><sub><b>Pavel Ravits</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/issues?q=author%3Alishine" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://tegan.lol"><img src="https://avatars0.githubusercontent.com/u/13814048?v=4" width="100px;" alt=""/><br /><sub><b>Tegan Churchill</b></sub></a><br /><a href="https://github.com/JoviDeCroock/Hooked-Form/issues?q=author%3Arawrmonstar" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
