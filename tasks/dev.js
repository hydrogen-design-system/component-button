// Hydrogen / Components / Development Tasks

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const babel = require("gulp-babel");
const browserify = require("browserify");
const browsersync = require('browser-sync').create();
const del = require('del');
const fs = require('fs');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
var source = require('vinyl-source-stream');

// Set the sass compiler (dart sass)
sass.compiler = require('sass');

// Access the package.json file to pull the component's version number.
var json = JSON.parse(fs.readFileSync('./package.json'));

// Set component and version variables.
const component = json.component;
const version = json.version.replace(/\./g, "");
const dataH2ComponentDefault = "data-h2-" + component + "_VERSION";
const dataH2ComponentVersion = "data-h2-" + component + "-" + version;

// Move and prepare the HTML.

  // Move the component's markup.
  function prepMarkup() {
    return src("tests/index.html")
    .pipe(replace("_VERSION", "-" + version))
    .pipe(dest("tests/cache"));
  }

  // Create the task series.
  const makeMarkup = series(prepMarkup);

// Move, transpile, compile, and refresh JavaScript. 

  // Import and Babel the core module.
  function moveCoreModule() {
    return src("node_modules/@hydrogen-design-system/core/dist/scripts/module.js")
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename(function(path) {
      path.basename = "core";
    }))
    .pipe(dest("tests/cache"));
  }

  // Move the component module.
  function moveModule() {
    return src("src/scripts/module.js")
    .pipe(replace(dataH2ComponentDefault, dataH2ComponentVersion))
    .pipe(replace("_VERSION", version))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest("tests/cache"));
  }

  // Move move the component instance.
  function moveComponent() {
    return src("src/scripts/instance.js")
    .pipe(replace(dataH2ComponentDefault, dataH2ComponentVersion))
    .pipe(replace("_VERSION", version))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest("tests/cache"));
  }

  // Compile via Browserify.
  function browserifyScripts() {
    return browserify("tests/cache/instance.js")
    .bundle()
    .pipe(source(component + ".js"))
    .pipe(dest("tests/cache"));
  }

  // Create the task series.
  const makeScripts = series(
    moveCoreModule,
    moveModule,
    moveComponent,
    browserifyScripts
  );

// Move and compile Sass.

  // Move the core system Sass from the module to the server cache.
  function moveCoreSass() {
    return src("node_modules/@hydrogen-design-system/core/dist/styles/*.scss")
    .pipe(dest("tests/cache/core/styles"));
  }

  // Move the component Sass from dev to the server cache.
  function moveComponentSass() {
    return src("src/styles/_" + component + ".scss")
    .pipe(dest("tests/cache"));
  }

  // Move the versioned Sass from dev to the server cache.
  function moveVersionSass() {
    return src("src/styles/instance.scss")
    .pipe(replace("_VERSION", "-" + version))
    .pipe(dest("tests/cache"));
  }

  // Compile the cached Sass into CSS.
  function compileSass() {
    return src("tests/cache/instance.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename(function(path) {
      path.basename = component;
    }))
    .pipe(dest("tests/cache"));
  }

  // Create the task series.
  const makeSass = series(
    moveCoreSass,
    moveComponentSass,
    moveVersionSass,
    compileSass
  );

// Set utility scripts.

  // Reset the server cache before a new build.
  function cleanCache() {
    return del("tests/cache/**/*")
  }

// Dev Prep Task
const dev = series(
  cleanCache, 
  makeMarkup,
  makeScripts,
  makeSass
);

// Set up Browser-sync and live reloading.

  // Initialize Browser-sync.
  function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "tests/cache"
      },
    });
    done();
  }

  // Set up Browser-sync page reloading.
  function browserSyncReload(done) {
    return src("tests/cache/*.html")
    .pipe(browsersync.reload({
      stream: true
    }));
  }

  // Watch dev and test files for changes.
  function watchDevFiles() {
    watch(["src/**/*", "tests/*.html"], series(dev, browserSyncReload));
  }

// Export development scripts.

  // gulp dev
  exports.exportDev = series(dev, parallel(browserSync, watchDevFiles));