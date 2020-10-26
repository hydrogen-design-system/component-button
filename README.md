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

### _VERSION
`_VERSION` is used by Hydrogen to process the component's files and generate a versioned instance of the component when it is built. Please ensure that all references to the main component's data-attribute have `_VERSION` appended (e.g. data-h2-accordion_VERSION) in the following places:
- `src/markup`
- `src/scripts`
- `src/styles/h2-version-component.scss`

It is also important to use `_VERSION` when creating a function for your component, as the scripts also need to be namespaced in the event a user imports an older version of your component (to prevent conflicting with the newest version). This can be done by creating functions in `src/scripts` that follow a `function myNewFunctionName_VERSION () {}` pattern.

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