// Hydrogen / Components / Production Tasks

"use strict";

// Requirements
const { series, src, dest } = require('gulp');
const autoprefixer = require('autoprefixer');
const babel = require("gulp-babel");
const browserify = require("browserify");
const cssnano = require('cssnano');
const del = require('del');
const fs = require('fs');
const gzip = require('gulp-gzip');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
var source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

// Set the sass compiler (dart sass)
sass.compiler = require('sass');

// Access the package.json file to pull the component's version number.
var json = JSON.parse(fs.readFileSync('./package.json'));

// Set component and version variables.
const component = json.component;
const version = json.version.replace(/\./g, "");
const componentVersion = "data-h2-" + component + "-" + version;

// System Files
// These scripts prepare the component so that it can be properly imported and process by Hydrogen's system repository.

  // Move, transpile, and compile JavaScript.

  // Move component scripts untouched.
  function moveSystemScripts() {
  return src("src/scripts/h2-component-" + component + ".js")
    .pipe(replace("data-h2-component-" + component + "_VERSION", "data-h2-" + component))
    .pipe(replace("_VERSION", ""))
    .pipe(dest("dist/system/scripts"));
  }

  // Move Sass files.

    // Move the component Sass from dev to dist.
    function moveSystemComponentSass() {
      return src("src/styles/_component-" + component + ".scss")
      .pipe(dest("dist/system/styles"));
    }

    // Move the system Sass from dev to dist.
    function moveSystemSass() {
      return src("src/styles/h2-system-component-" + component + ".scss")
      .pipe(rename(function(path) {
        path.basename = "h2-component-" + component + "";
      }))
      .pipe(dest("dist/system/styles"));
    }

  // Create the task series.
  const makeSystem = series(
    moveSystemScripts,
    moveSystemComponentSass,
    moveSystemSass
  );

// Collections
// These scripts prepare the component so that its markup, styles, and scripts are ready to be imported individually, categorized by language support.

  // Markup

    // HTML

      // Move standard markup.
      function moveCollectionHTML() {
        return src("src/markup/html/**/*.html")
        .pipe(replace("_VERSION", ""))
        .pipe(dest("dist/component/markup/html"));
      }

      // Move versioned markup.
      function moveCollectionVersionedHTML() {
        return src("src/markup/html/**/*.html")
        .pipe(replace("_VERSION", "-" + version))
        .pipe(dest("dist/component-" + version + "/markup/html"));
      }

      // Create the task series.
      const makeHTML = series(
        moveCollectionHTML,
        moveCollectionVersionedHTML
      );

    // PHP / Twig

      // Move standard markup.
      function moveCollectionTwig() {
        return src("src/markup/twig/**/*.twig")
        .pipe(replace("_VERSION", ""))
        .pipe(dest("dist/component/markup/twig"));
      }

      // Move versioned markup.
      function moveCollectionVersionedTwig() {
        return src("src/markup/twig/**/*.twig")
        .pipe(replace("_VERSION", "-" + version))
        .pipe(dest("dist/component-" + version + "/markup/twig"));
      }

      // Create the task series.
      const makeTwig = series(
        moveCollectionTwig,
        moveCollectionVersionedTwig
      );

    // JS / React

      // Move markup and versioned markup.
      // function prodCollectionReactMarkup() {
      //   return src("src/markup/react/**/*.js")
      //   .pipe(replace("[data-h2-component-" + component + "_VERSION]", "[data-h2-" + component + "]"))
      //   .pipe(replace("_VERSION", ""))
      //   .pipe(dest("dist/collections/react"));
      // }
      // function prodCollectionVersionedReactMarkup() {
      //   return src("src/markup/react/**/*.js")
      //   .pipe(replace("[data-h2-component-" + component + "_VERSION]", componentVersion))
      //   .pipe(replace("_VERSION", version))
      //   .pipe(dest("dist/collections/react"));
      // }

      // Move, compile, minify, and GZIP Sass and versioned Sass.

      // Move, transpile, compile, minify, and GZIP JavaScript and versioned JavaScript.

      // Create the task series.
      // const makeReact = series(
      //   prodCollectionReactMarkup,
      //   prodCollectionVersionedReactMarkup
      // );

  // Compile JavaScript

    // Move standard scripts.
    function moveCollectionScript() {
      return src("src/scripts/h2-component-" + component + ".js")
      .pipe(replace("data-h2-" + component + "_VERSION", "data-h2-" + component))
      .pipe(replace("_VERSION", ""))
      .pipe(rename(function(path) {
        path.basename = "h2-component-" + component + "-module";
      }))
      .pipe(dest("dist/component/scripts"));
    }
    function moveCollectionVersionedScript() {
      return src("src/scripts/h2-component-" + component + ".js")
      .pipe(replace("data-h2-" + component + "_VERSION", componentVersion))
      .pipe(replace("_VERSION", version))
      .pipe(rename(function(path) {
        path.basename = "h2-component-" + component + "-module";
      }))
      .pipe(dest("dist/component-" + version + "/scripts"));
    }

    // Transpile with Babel to a temporary file that can be compiled.
    function transpileCollectionScript() {
      return src("dist/component/scripts/h2-component-" + component + "-module.js")
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(rename(function(path) {
        path.basename = "h2-temp-component-" + component + "";
      }))
      .pipe(dest("dist/component/scripts"));
    }
    function transpileCollectionVersionedScript() {
      return src("dist/component-" + version + "/scripts/h2-component-" + component + "-module.js")
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(rename(function(path) {
        path.basename = "h2-temp-component-" + component + "";
      }))
      .pipe(dest("dist/component-" + version + "/scripts"));
    }

    // Compile the temporary file to browser-ready scripts with Browserify.
    function compileCollectionScript() {
      return browserify("dist/component/scripts/h2-temp-component-" + component + ".js")
      .bundle()
      .pipe(source("h2-component-" + component + ".js"))
      .pipe(dest("dist/component/scripts"));
    }
    function compileCollectionVersionedScript() {
      return browserify("dist/component-" + version + "/scripts/h2-temp-component-" + component + ".js")
      .bundle()
      .pipe(source("h2-component-" + component + ".js"))
      .pipe(dest("dist/component-" + version + "/scripts"));
    }

    // Remove the temp file.
    function cleanCollectionScripts() {
      return del([
        "dist/component/scripts/h2-temp-component-" + component + ".js",
        "dist/component-" + version + "/scripts/h2-temp-component-" + component + ".js"
      ]);
    }

    // Minify
    function minifyCollectionScript() {
      return src("dist/component/scripts/h2-component-" + component + ".js")
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.extname = ".min.js";
      }))
      .pipe(dest("dist/component/scripts"));
    }
    function minifyCollectionVersionedScript() {
      return src("dist/component-" + version + "/scripts/h2-component-" + component + ".js")
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.extname = ".min.js";
      }))
      .pipe(dest("dist/component-" + version + "/scripts"));
    }

    // GZIP
    function gzipCollectionScript() {
      return src("dist/component/scripts/h2-component-" + component + ".min.js")
      .pipe(gzip())
      .pipe(dest("dist/component/scripts"));
    }
    function gzipCollectionVersionedScript() {
      return src("dist/component-" + version + "/scripts/h2-component-" + component + ".min.js")
      .pipe(gzip())
      .pipe(dest("dist/component-" + version + "/scripts"));
    }

    // Create the task series.
    const makeScripts = series(
      moveCollectionScript,
      moveCollectionVersionedScript,
      transpileCollectionScript,
      transpileCollectionVersionedScript,
      compileCollectionScript,
      compileCollectionVersionedScript,
      cleanCollectionScripts,
      minifyCollectionScript,
      minifyCollectionVersionedScript,
      gzipCollectionScript,
      gzipCollectionVersionedScript
    );

  // Compile Sass

    // Import the core Sass into the component.
    function importCoreSass() {
      return src("node_modules/@hydrogen-design-system/core/dist/system/styles/*.scss")
      .pipe(dest("dist/component/styles/core"));
    }
    function importVersionedCoreSass() {
      return src("node_modules/@hydrogen-design-system/core/dist/system/styles/*.scss")
      .pipe(dest("dist/component-" + version + "/styles/core"));
    }

    // Move the component Sass from dev to dist.
    function moveCollectionComponentSass() {
      return src("src/styles/_component-" + component + ".scss")
      .pipe(dest("dist/component/styles"));
    }
    function moveCollectionVersionedComponentSass() {
      return src("src/styles/_component-" + component + ".scss")
      .pipe(dest("dist/component-" + version + "/styles"));
    }

    // Move the versioned Sass from dev to dist.
    function moveCollectionSass() {
      return src("src/styles/h2-version-component-" + component + ".scss")
      .pipe(replace("_VERSION", ""))
      .pipe(rename(function(path) {
        path.basename = "h2-component-" + component + "";
      }))
      .pipe(dest("dist/component/styles"));
    }
    function moveCollectionVersionedSass() {
      return src("src/styles/h2-version-component-" + component + ".scss")
      .pipe(replace("_VERSION", "-" + version))
      .pipe(rename(function(path) {
        path.basename = "h2-component-" + component + "";
      }))
      .pipe(dest("dist/component-" + version + "/styles"));
    }

    // Compile
    function compileCollectionSass() {
      return src("dist/component/styles/h2-component-" + component + ".scss")
      .pipe(sass())
      .pipe(postcss([autoprefixer()]))
      .pipe(dest("dist/component/styles"));
    }
    function compileCollectionVersionedSass() {
      return src("dist/component-" + version + "/styles/h2-component-" + component + ".scss")
      .pipe(sass())
      .pipe(postcss([autoprefixer()]))
      .pipe(dest("dist/component-" + version + "/styles"));
    }

    // Minify
    function minifyCollectionSass() {
      return src("dist/component/styles/h2-component-" + component + ".css")
      .pipe(postcss([cssnano()]))
      .pipe(rename(function(path) {
        path.extname = ".min.css";
      }))
      .pipe(dest("dist/component/styles"));
    }
    function minifyCollectionVersionedSass() {
      return src("dist/component-" + version + "/styles/h2-component-" + component + ".css")
      .pipe(postcss([cssnano()]))
      .pipe(rename(function(path) {
        path.extname = ".min.css";
      }))
      .pipe(dest("dist/component-" + version + "/styles"));
    }

    // GZIP
    function gzipCollectionSass() {
      return src("dist/component/styles/h2-component-" + component + ".min.css")
      .pipe(gzip())
      .pipe(dest("dist/component/styles"));
    }
    function gzipCollectionVersionedSass() {
      return src("dist/component-" + version + "/styles/h2-component-" + component + ".min.css")
      .pipe(gzip())
      .pipe(dest("dist/component-" + version + "/styles"));
    }

    // Create the task series.
    const makeSass = series(
      importCoreSass,
      importVersionedCoreSass,
      moveCollectionComponentSass,
      moveCollectionVersionedComponentSass,
      moveCollectionSass,
      moveCollectionVersionedSass,
      compileCollectionSass,
      compileCollectionVersionedSass,
      minifyCollectionSass,
      minifyCollectionVersionedSass,
      gzipCollectionSass,
      gzipCollectionVersionedSass
    );

// Utility Tasks

  // Reset dist before a new build.
  function cleanDist() {
    return del("dist/**/*")
  }

// Exports

  // gulp build
  exports.exportBuild = series(cleanDist, makeSystem, makeHTML, makeTwig, makeScripts, makeSass);