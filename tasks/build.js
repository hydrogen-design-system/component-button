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
const dataH2ComponentDefault = "data-h2-" + component + "_VERSION";
const dataH2Component = "data-h2-" + component;
const dataH2ComponentVersion = "data-h2-" + component + "-" + version;

// Build the system files.

  // Markup
  function moveSystemMarkup() {
    return src("src/markup/**/*")
    .pipe(replace("_VERSION", ""))
    .pipe(dest("system/markup"))
  }

  // Scripts
  function prepSystemScripts() {
    return src("src/scripts/module.js")
    .pipe(replace(dataH2ComponentDefault, dataH2Component))
    .pipe(replace("_VERSION", ""))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest("system/scripts"))
  }

  // Styles
  function moveSystemSass() {
    return src([
      "src/styles/_" + component + ".scss",
      "src/styles/system.scss"
    ])
    .pipe(dest("system/styles"))
  }

  // Create the system task series.
  const createSystem = series(
    moveSystemMarkup,
    prepSystemScripts,
    moveSystemSass
  );

// Build the production files.

  // Importable Files

    // Markup
    function moveImportLatestMarkup() {
      return src("src/markup/**/*")
      .pipe(replace("_VERSION", ""))
      .pipe(dest("dist/import/latest/markup"))
    }
    function moveImportInstancedMarkup() {
      return src("src/markup/**/*")
      .pipe(replace("_VERSION", "-" + version))
      .pipe(dest("dist/import/" + version + "/markup"))
    }

    // Scripts

      // Default Module
      function moveImportLatestModule() {
        return src("src/scripts/module.js")
        .pipe(replace(dataH2ComponentDefault, dataH2Component))
        .pipe(replace("_VERSION", ""))
        .pipe(dest("dist/import/latest/scripts"))
      }
      function moveImportInstancedModule() {
        return src("src/scripts/module.js")
        .pipe(replace(dataH2ComponentDefault, dataH2ComponentVersion))
        .pipe(replace("_VERSION", version))
        .pipe(dest("dist/import/" + version + "/scripts"))
      }

      // Babelified Module
      function babelifyImportLatestModule() {
        return src("dist/import/latest/scripts/module.js")
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(rename(function(path) {
          path.basename = "module.babel";
        }))
        .pipe(dest("dist/import/latest/scripts"))
      }
      function babelifyImportInstancedModule() {
        return src("dist/import/" + version + "/scripts/module.js")
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(rename(function(path) {
          path.basename = "module.babel";
        }))
        .pipe(dest("dist/import/" + version + "/scripts"))
      }
    
    // Styles

      // Move the core's styles.
      function moveImportLatestCoreSass() {
        return src("node_modules/@hydrogen-design-system/core/dist/styles/**/*")
        .pipe(dest("dist/import/latest/styles/core"))
      }
      function moveImportInstancedCoreSass() {
        return src("node_modules/@hydrogen-design-system/core/dist/styles/**/*")
        .pipe(dest("dist/import/" + version + "/styles/core"))
      }

      // Move the component Sass.
      function moveImportLatestComponentSass() {
        return src("src/styles/_" + component + ".scss")
        .pipe(dest("dist/import/latest/styles"))
      }
      function moveImportInstancedComponentSass() {
        return src("src/styles/_" + component + ".scss")
        .pipe(dest("dist/import/" + version + "/styles"))
      }

      // Move the instanced Sass.
      function moveImportLatestIntanceSass() {
        return src("src/styles/instance.scss")
        .pipe(replace("_VERSION", ""))
        .pipe(dest("dist/import/latest/styles"))
      }
      function moveImportInstancedIntanceSass() {
        return src("src/styles/instance.scss")
        .pipe(replace("_VERSION", "-" + version))
        .pipe(dest("dist/import/" + version + "/styles"))
      }

    // Create the task series.
    const importLatest = series(
      moveImportLatestMarkup,
      moveImportLatestModule,
      babelifyImportLatestModule,
      moveImportLatestCoreSass,
      moveImportLatestComponentSass,
      moveImportLatestIntanceSass
    );
    const importInstanced = series(
      moveImportInstancedMarkup,
      moveImportInstancedModule,
      babelifyImportInstancedModule,
      moveImportInstancedCoreSass,
      moveImportInstancedComponentSass,
      moveImportInstancedIntanceSass
    );

  // Compiled Files

    // Scripts

      // Move, Babel Core
      function moveCompiledLatestCoreScript() {
        return src("node_modules/@hydrogen-design-system/core/dist/scripts/module.js")
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(rename(function(path) {
          path.basename = "core";
        }))
        .pipe(dest("dist/compile/latest"));
      }
      function moveCompiledInstancedCoreScript() {
        return src("node_modules/@hydrogen-design-system/core/dist/scripts/module.js")
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(rename(function(path) {
          path.basename = "core";
        }))
        .pipe(dest("dist/compile/" + version));
      }

      // Move, Babel Module
      function moveCompiledLatestModuleScript() {
        return src("src/scripts/module.js")
        .pipe(replace(dataH2ComponentDefault, dataH2Component))
        .pipe(replace("_VERSION", ""))
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(dest("dist/compile/latest"));
      }
      function moveCompiledInstancedModuleScript() {
        return src("src/scripts/module.js")
        .pipe(replace(dataH2ComponentDefault, dataH2ComponentVersion))
        .pipe(replace("_VERSION", version))
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(dest("dist/compile/" + version));
      }

      // Move, Babel Instance
      function moveCompiledLatestInstanceScript() {
        return src("src/scripts/instance.js")
        .pipe(replace(dataH2ComponentDefault, dataH2Component))
        .pipe(replace("_VERSION", ""))
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(dest("dist/compile/latest"));
      }
      function moveCompiledInstancedInstanceScript() {
        return src("src/scripts/instance.js")
        .pipe(replace(dataH2ComponentDefault, dataH2ComponentVersion))
        .pipe(replace("_VERSION", version))
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(dest("dist/compile/" + version));
      }

      // Browserify
      function browserifyCompiledLatestScript() {
        return browserify("dist/compile/latest/instance.js")
        .bundle()
        .pipe(source(component + ".js"))
        .pipe(dest("dist/compile/latest"));
      }
      function browserifyCompiledInstancedScript() {
        return browserify("dist/compile/" + version + "/instance.js")
        .bundle()
        .pipe(source(component + ".js"))
        .pipe(dest("dist/compile/" + version));
      }

      // Minify
      function minifyCompiledLatestScript() {
        return src("dist/compile/latest/" + component + ".js")
        .pipe(uglify())
        .pipe(rename(function(path) {
          path.extname = ".min.js";
        }))
        .pipe(dest("dist/compile/latest"));
      }
      function minifyCompiledInstancedScript() {
        return src("dist/compile/" + version + "/" + component + ".js")
        .pipe(uglify())
        .pipe(rename(function(path) {
          path.extname = ".min.js";
        }))
        .pipe(dest("dist/compile/" + version));
      }

      // Delete Files
      function deleteCompiledLatestScripts() {
        return del([
          "dist/compile/latest/core.js",
          "dist/compile/latest/module.js",
          "dist/compile/latest/instance.js",
          "dist/compile/latest/" + component + ".js"
        ])
      }
      function deleteCompiledInstancedScripts() {
        return del([
          "dist/compile/" + version + "/core.js",
          "dist/compile/" + version + "/module.js",
          "dist/compile/" + version + "/instance.js",
          "dist/compile/" + version + "/" + component + ".js"
        ])
      }

    // Styles

      // Move Core
      function moveCompiledLatestCoreSass() {
        return src("node_modules/@hydrogen-design-system/core/dist/styles/*.scss")
        .pipe(dest("dist/compile/latest/core/styles"));
      }
      function moveCompiledInstancedCoreSass() {
        return src("node_modules/@hydrogen-design-system/core/dist/styles/*.scss")
        .pipe(dest("dist/compile/" + version + "/core/styles"));
      }

      // Move Component
      function moveCompiledLatestComponentSass() {
        return src("src/styles/_" + component + ".scss")
        .pipe(dest("dist/compile/latest"));
      }
      function moveCompiledInstancedComponentSass() {
        return src("src/styles/_" + component + ".scss")
        .pipe(dest("dist/compile/" + version));
      }

      // Move Instance
      function moveCompiledLatestInstanceSass() {
        return src("src/styles/instance.scss")
        .pipe(replace("_VERSION", ""))
        .pipe(dest("dist/compile/latest"));
      }
      function moveCompiledInstancedInstanceSass() {
        return src("src/styles/instance.scss")
        .pipe(replace("_VERSION", "-" + version))
        .pipe(dest("dist/compile/" + version));
      }

      // Compile and Nano
      function compileCompiledLatestSass() {
        return src("dist/compile/latest/instance.scss")
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(postcss([cssnano()]))
        .pipe(rename(function(path) {
          path.basename = component;
          path.extname = ".min.css";
        }))
        .pipe(dest("dist/compile/latest"));
      }
      function compileCompiledInstancedSass() {
        return src("dist/compile/" + version + "/instance.scss")
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(postcss([cssnano()]))
        .pipe(rename(function(path) {
          path.basename = component;
          path.extname = ".min.css";
        }))
        .pipe(dest("dist/compile/" + version));
      }

      // Delete Files
      function deleteCompiledLatestSass() {
        return del([
          "dist/compile/latest/core",
          "dist/compile/latest/_" + component + ".scss",
          "dist/compile/latest/instance.scss"
        ])
      }
      function deleteCompiledInstancedSass() {
        return del([
          "dist/compile/" + version + "/core",
          "dist/compile/" + version + "/_" + component + ".scss",
          "dist/compile/" + version + "/instance.scss"
        ])
      }

    // Create the task series.
    const compileLatest = series(
      moveCompiledLatestCoreScript,
      moveCompiledLatestModuleScript,
      moveCompiledLatestInstanceScript,
      browserifyCompiledLatestScript,
      minifyCompiledLatestScript,
      deleteCompiledLatestScripts,
      moveCompiledLatestCoreSass,
      moveCompiledLatestComponentSass,
      moveCompiledLatestInstanceSass,
      compileCompiledLatestSass,
      deleteCompiledLatestSass
    );
    const compileInstanced = series(
      moveCompiledInstancedCoreScript,
      moveCompiledInstancedModuleScript,
      moveCompiledInstancedInstanceScript,
      browserifyCompiledInstancedScript,
      minifyCompiledInstancedScript,
      deleteCompiledInstancedScripts,
      moveCompiledInstancedCoreSass,
      moveCompiledInstancedComponentSass,
      moveCompiledInstancedInstanceSass,
      compileCompiledInstancedSass,
      deleteCompiledInstancedSass
    );

  // GZIP Files
  function gzipScript() {
    return src("dist/compile/latest/" + component + ".min.js")
    .pipe(gzip())
    .pipe(dest("system/compressed"));
  }
  function gzipCSS() {
    return src("dist/compile/latest/" + component + ".min.css")
    .pipe(gzip())
    .pipe(dest("system/compressed"));
  }
  const GZIP = series(
    gzipScript,
    gzipCSS
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
    createSystem,
    importLatest,
    importInstanced,
    compileLatest,
    compileInstanced,
    GZIP
  );