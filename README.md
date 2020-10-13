# Hydrogen's button component

<a href="https://www.npmjs.com/package/@hydrogen-design-system/component-button" title="Visit this package on NPM." target="_blank" rel="noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/v/@hydrogen-design-system/component-button?color=9864e8&label=release">
</a>

## Installation

You can install this component as a standalone package using `npm install @hydrogen-design-system/component-button --save-dev`

This component can also be installed as a part of Hydrogen in its entirety. [Learn more](https://hydrogen.design).

## Usage

For standard usage, please see [Hydrogen's documentation](https://hydrogen.design).

## Contributing

Hydrogen's components are built using [Gulp](https://gulpjs.com/), [Sass](https://sass-lang.com), [Autoprefixer](https://github.com/postcss/autoprefixer), and [CSSnano](https://cssnano.co/).

Hydrogen components require [Cash](https://kenwheeler.github.io/cash/) to work properly. Cash is a lightweight jQuery alternative and will eventually be phased out of Hydrogen in favour of vanilla JavaScript.

This component module contains the following in the `dist` folder:
- the component's code that is imported by @hydrogen-design-system/system
- a versioned, isolated copy of the component that can be used independently of the system, either imported by a Sass project, or pulled as compiled CSS

This component currently supports the following markup and/or frameworks:
- HTML

**Please ensure that work on this component updates all supported markup where possible.**

The code for this component can be found in:
- `src/markup/`
- `src/scripts/`
- `src/styles/`

You will need:
- [Node](https://nodejs.org/en/)

### Important commands
- `npm install`
  - installs all development dependencies
- `npm run dev`
  - builds the versioned instance of the component and opens the test file in your browser with browser-sync running so that you can moderate your changes
- `npm run build`
  - runs the build command to process all files for production
  - this will automatically build the system and instanced versions of the component
- `npm publish`
  - builds the component
  - publishes it to the public package repository