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
const componentVersion = "data-h2-" + component + "-" + version;

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

  // Transpile via Babel.
  function transpileScripts() {
    return src("src/scripts/h2-component-" + component + ".js")
    .pipe(replace("data-h2-" + component + "_VERSION", componentVersion))
    .pipe(replace("_VERSION", version))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename(function(path) {
      path.basename = "h2-temp-component-" + component + "";
    }))
    .pipe(dest("tests/cache"));
  }

  // Compile via Browserify.
  function browserifyScripts() {
    return browserify("tests/cache/h2-temp-component-" + component + ".js")
    .bundle()
    .pipe(source("h2-component-" + component + ".js"))
    .pipe(dest("tests/cache"));
  }

  // Remove the temp file.
  function cleanScripts() {
    return del("tests/cache/h2-temp-component-" + component + ".js");
  }

  // Create the task series.
  const makeScripts = series(
    transpileScripts,
    browserifyScripts,
    cleanScripts
  );

// Move and compile Sass.

  // Move the core system Sass from the module to the server cache.
  function importCoreSass() {
    return src("node_modules/@hydrogen-design-system/core/dist/latest/styles/*.scss")
    .pipe(dest("tests/cache/core"));
  }

  // Move the component Sass from dev to the server cache.
  function moveComponentSass() {
    return src("src/styles/_component-" + component + ".scss")
    .pipe(dest("tests/cache"));
  }

  // Move the versioned Sass from dev to the server cache.
  function moveVersionSass() {
    return src("src/styles/h2-version-component-" + component + ".scss")
    .pipe(replace("_VERSION", "-" + version))
    .pipe(rename(function(path) {
      path.basename = "h2-component-" + component + "";
    }))
    .pipe(dest("tests/cache"));
  }

  // Compile the cached Sass into CSS.
  function compileSass() {
    return src("tests/cache/h2-component-" + component + ".scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(dest("tests/cache"));
  }

  // Create the task series.
  const makeSass = series(
    importCoreSass,
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