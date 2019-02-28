# Hooked-Form
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

[![npm version](https://badge.fury.io/js/hooked-form.svg)](https://badge.fury.io/js/hooked-form)
[![Build Status](https://travis-ci.org/JoviDeCroock/hooked-form.svg?branch=master)](https://travis-ci.org/JoviDeCroock/hooked-form)
[![Bundle size](https://badgen.net/bundlephobia/minzip/hooked-form)](https://badgen.net/bundlephobia/minzip/hooked-form)
[![codecov](https://codecov.io/gh/JoviDeCroock/Hooked-Form/branch/master/graph/badge.svg)](https://codecov.io/gh/JoviDeCroock/Hooked-Form)

This form library was made only with functional components, making the initial goal
of having reduced bundle size easier to achieve.

I hope to make libraries like these a more recurring theme, since focussing on reduced
bundle size isn't only the concern of the application developer. It is also a
commitment that should be made by library authors.

[Docs](https://jovidecroock.github.io/hooked-form/)

[Example](https://codesandbox.io/s/k8mylo9lo)

[Architecture](https://www.jovidecroock.com/forms/)

## Installation

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

_prod_:

```html
<script src="https://unpkg.com/hooked-form@latest/dist/prod/hooked-form.umd.js"></script>
```

## Modern build

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

## Credits

- [Microbundle](https://github.com/developit/microbundle)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/6225486?v=4" width="100px;" alt="Laurens Lavaert"/><br /><sub><b>Laurens Lavaert</b></sub>](https://www.faktion.com)<br />[💻](https://github.com/JoviDeCroock/hooked-form/commits?author=Pruxis "Code") | [<img src="https://avatars3.githubusercontent.com/u/17125876?v=4" width="100px;" alt="Jovi De Croock"/><br /><sub><b>Jovi De Croock</b></sub>](https://www.jovidecroock.com/)<br />[🚇](#infra-JoviDeCroock "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/JoviDeCroock/hooked-form/commits?author=JoviDeCroock "Tests") [👀](#review-JoviDeCroock "Reviewed Pull Requests") [📖](https://github.com/JoviDeCroock/hooked-form/commits?author=JoviDeCroock "Documentation") [💻](https://github.com/JoviDeCroock/hooked-form/commits?author=JoviDeCroock "Code") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!