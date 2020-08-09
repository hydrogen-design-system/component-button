// Hydrogen / Components / Development Tasks

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const del = require('del');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');

sass.compiler = require('sass');

// Component
const componentArg = "button";
const component = "component-" + componentArg.replace(/"/g, "");

// Markup Prep

    // Move HTML
    function moveDevMarkup() {
        return src("tests/index.html")
        .pipe(replace("$H2VER", "0-0-0"))
        .pipe(dest("tests/cache"));
    }

// Script Prep

    // Move the component scripts from dev to the server cache.
    function moveDevComponentScripts() {
        return src("dev/scripts/h2-" + component + ".js")
        .pipe(replace("$H2VERCSS", "-" + "0-0-0"))
        .pipe(replace("$H2VERJS", "000"))
        .pipe(dest("tests/cache"));
    }

    // Move Cash.js from the module to the server cache.
    function moveDevCash() {
        return src("node_modules/cash-dom/dist/cash.min.js")
        .pipe(dest("tests/cache"));
    }

// Style Prep

    // Move the core system Sass from the module to the server cache.
    function moveDevCoreSass() {
        return src("node_modules/@hydrogen-design-system/core/dist/system/styles/*.scss")
        .pipe(dest("tests/cache/core"));
    }

    // Move the component partial from dev to the server cache.
    function moveDevComponentPartialSass() {
        return src("dev/styles/_" + component + ".scss")
        .pipe(dest("tests/cache"));
    }

    // Move the component Sass from dev to the server cache.
    function moveDevComponentSass() {
        return src("dev/styles/h2-version-" + component + ".scss")
        .pipe(replace("$H2VER", "0-0-0"))
        .pipe(rename(function(path) {
            path.basename = "h2-" + component + "";
        }))
        .pipe(dest("tests/cache"));
    }

    // Compile the cached Sass into CSS.
    function compileDevSass() {
        return src("tests/cache/h2-" + component + ".scss")
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(dest("tests/cache"));
    }

// Utility Tasks

    // Reset the server cache before a new build.
    function cleanCache() {
        return del("tests/cache/**/*")
    }

// Dev Prep Task
const devPrep = series(cleanCache, moveDevMarkup, moveDevComponentScripts, moveDevCash, moveDevCoreSass, moveDevComponentPartialSass, moveDevComponentSass, compileDevSass);

// Live Reload

    // Initialize Browsersync.
    function browserSync(done) {
        browsersync.init({
            server: {
                baseDir: "tests/cache"
            },
        });
        done();
    }

    // Set up Browsersync page reloading.
    function browserSyncReload(done) {
        return src("tests/cache/*.html")
        .pipe(browsersync.reload({
            stream: true
        }));
    }

    // Watch dev and test files for changes.
    function watchDevFiles() {
        watch(["dev/**/*", "tests/*.html"], series(devPrep, browserSyncReload));
    }

// Exports

    // gulp dev
    exports.exportDev = series(devPrep, parallel(browserSync, watchDevFiles));