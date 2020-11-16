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
const componentPath = "h2-component-" + component;
const componentVersion = "data-h2-" + component + "-" + version;

// Markup

  // Latest
  function prepLatestMarkup() {
    return src([
      "src/markup/**/*.html",
      "src/markup/**/*.twig"
    ])
    .pipe(replace("_VERSION", ""))
    .pipe(dest("dist/latest/markup"));
  }

  // Current Version
  function prepVersionMarkup() {
    return src([
      "src/markup/**/*.html",
      "src/markup/**/*.twig"
    ])
    .pipe(replace("_VERSION", "-" + version))
    .pipe(dest("dist/" + version + "/markup"));
  }

// Scripts

  // Latest

    // Copy the script as is.
    function copyLatestScript() {
      return src("src/scripts/**/*.js")
      .pipe(replace("data-h2-" + component + "_VERSION", "data-h2-" + component))
      .pipe(replace("_VERSION", ""))
      .pipe(rename(function(path) {
        path.basename = componentPath + ".module";
      }))
      .pipe(dest("dist/latest/scripts"))
    }

    // Use Babel to convert the script.
    function transpileLatestScript() {
      return src("dist/latest/scripts/" + componentPath + ".module.js")
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(rename(function(path) {
        path.basename = componentPath + ".babel";
      }))
      .pipe(dest("dist/latest/scripts"));
    }

    // Use Browserify to compile the script into browser-ready code.
    function compileLatestScript() {
      return browserify("dist/latest/scripts/" + componentPath + ".babel.js")
      .bundle()
      .pipe(source(componentPath + ".js"))
      .pipe(dest("dist/latest/scripts"));
    }

    // Minify the script.
    function minifyLatestScript() {
      return src("dist/latest/scripts/" + componentPath + ".js")
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.extname = ".min.js";
      }))
      .pipe(dest("dist/latest/scripts"));
    }

    // Gzip the script.
    function gzipLatestScript() {
      return src("dist/latest/scripts/" + componentPath + ".min.js")
      .pipe(gzip())
      .pipe(dest("dist/latest/scripts"));
    }

    // Export the a task series.
    const prepLatestScripts = series(
      copyLatestScript,
      transpileLatestScript,
      compileLatestScript,
      minifyLatestScript,
      gzipLatestScript
    );

  // Current Version

    // Copy the script as is.
    function copyVersionScript() {
      return src("src/scripts/**/*.js")
      .pipe(replace("data-h2-" + component + "_VERSION", componentVersion))
      .pipe(replace("_VERSION", version))
      .pipe(rename(function(path) {
        path.basename = componentPath + ".module";
      }))
      .pipe(dest("dist/" + version + "/scripts"))
    }

    // Use Babel to convert the script.
    function transpileVersionScript() {
      return src("dist/" + version + "/scripts/" + componentPath + ".module.js")
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(rename(function(path) {
        path.basename = componentPath + ".babel";
      }))
      .pipe(dest("dist/" + version + "/scripts"));
    }

    // Use Browserify to compile the script into browser-ready code.
    function compileVersionScript() {
      return browserify("dist/" + version + "/scripts/" + componentPath + ".babel.js")
      .bundle()
      .pipe(source(componentPath + ".js"))
      .pipe(dest("dist/" + version + "/scripts"));
    }

    // Minify the script.
    function minifyVersionScript() {
      return src("dist/" + version + "/scripts/" + componentPath + ".js")
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.extname = ".min.js";
      }))
      .pipe(dest("dist/" + version + "/scripts"));
    }

    // Gzip the script.
    function gzipVersionScript() {
      return src("dist/" + version + "/scripts/" + componentPath + ".min.js")
      .pipe(gzip())
      .pipe(dest("dist/" + version + "/scripts"));
    }

    // Export the a task series.
    const prepVersionScripts = series(
      copyVersionScript,
      transpileVersionScript,
      compileVersionScript,
      minifyVersionScript,
      gzipVersionScript
    );

// Styles

  // Latest

    // Import H2's core styles into the component.
    function importLatestCoreSass() {
      return src("node_modules/@hydrogen-design-system/core/dist/latest/styles/**/*.scss")
      .pipe(dest("dist/latest/styles/core"));
    }

    // Copy the primary component styles.
    function copyLatestPrimarySass() {
      return src("src/styles/_component-" + component + ".scss")
      .pipe(dest("dist/latest/styles"));
    }

    // Copy the import stylesheet.
    function copyLatestSystemSass() {
      return src("src/styles/h2-system-component-" + component + ".scss")
      .pipe(replace("_VERSION", ""))
      .pipe(rename(function(path) {
        path.basename = "h2-system-" + component;
      }))
      .pipe(dest("dist/latest/styles"));
    }

    // Copy the version stylesheet for compiling.
    function copyLatestVersionSass() {
      return src("src/styles/h2-version-component-" + component + ".scss")
      .pipe(replace("_VERSION", ""))
      .pipe(rename(function(path) {
        path.basename = componentPath;
      }))
      .pipe(dest("dist/latest/styles"));
    }

    // Compile the Sass into CSS.
    function compileLatestSass() {
      return src("dist/latest/styles/" + componentPath + ".scss")
      .pipe(sass())
      .pipe(postcss([autoprefixer()]))
      .pipe(dest("dist/latest/styles"));
    }

    // Minify the CSS.
    function minifyLatestSass() {
      return src("dist/latest/styles/" + componentPath + ".css")
      .pipe(postcss([cssnano()]))
      .pipe(rename(function(path) {
        path.extname = ".min.css";
      }))
      .pipe(dest("dist/latest/styles"));
    }

    // Gzip the CSS.
    function gzipLatestSass() {
      return src("dist/latest/styles/" + componentPath + ".min.css")
      .pipe(gzip())
      .pipe(dest("dist/latest/styles"));
    }

    // Export the task series.
    const prepLatestSass = series(
      importLatestCoreSass,
      copyLatestPrimarySass,
      copyLatestSystemSass,
      copyLatestVersionSass,
      compileLatestSass,
      minifyLatestSass,
      gzipLatestSass
    );

  // Current Version

    // Import H2's core styles into the component.
    function importVersionCoreSass() {
      return src("node_modules/@hydrogen-design-system/core/dist/latest/styles/**/*.scss")
      .pipe(dest("dist/" + version + "/styles/core"));
    }

    // Copy the primary component styles.
    function copyVersionPrimarySass() {
      return src("src/styles/_component-" + component + ".scss")
      .pipe(dest("dist/" + version + "/styles"));
    }

    // Copy the version stylesheet for compiling.
    function copyVersionVersionSass() {
      return src("src/styles/h2-version-component-" + component + ".scss")
      .pipe(replace("_VERSION", "-" + version))
      .pipe(rename(function(path) {
        path.basename = componentPath;
      }))
      .pipe(dest("dist/" + version + "/styles"));
    }

    // Compile the Sass into CSS.
    function compileVersionSass() {
      return src("dist/" + version + "/styles/" + componentPath + ".scss")
      .pipe(sass())
      .pipe(postcss([autoprefixer()]))
      .pipe(dest("dist/" + version + "/styles"));
    }

    // Minify the CSS.
    function minifyVersionSass() {
      return src("dist/" + version + "/styles/" + componentPath + ".css")
      .pipe(postcss([cssnano()]))
      .pipe(rename(function(path) {
        path.extname = ".min.css";
      }))
      .pipe(dest("dist/" + version + "/styles"));
    }

    // Gzip the CSS.
    function gzipVersionSass() {
      return src("dist/" + version + "/styles/" + componentPath + ".min.css")
      .pipe(gzip())
      .pipe(dest("dist/" + version + "/styles"));
    }

    // Export the task series.
    const prepVersionSass = series(
      importVersionCoreSass,
      copyVersionPrimarySass,
      copyVersionVersionSass,
      compileVersionSass,
      minifyVersionSass,
      gzipVersionSass
    );

// Utility Tasks

  // Reset dist before a new build.
  function cleanDist() {
    return del("dist/**/*")
  }

// Exports

  // gulp build
  exports.exportBuild = series(
    cleanDist, 
    prepLatestMarkup, 
    prepLatestScripts, 
    prepLatestSass, 
    prepVersionMarkup, 
    prepVersionScripts, 
    prepVersionSass
  );