// Hydrogen / Components / Button / Gulpfile

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const gzip = require('gulp-gzip');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

sass.compiler = require('sass');

// Component
const component = "component-button";

// Version
const verCSS = "0-0-4";
const verJS = verCSS.replace("-", "").replace("-", "");

// Development Tasks

    // Markup Prep
    
        // Move HTML
        function moveDevMarkup() {
            return src("tests/index.html")
            .pipe(replace("$H2VER", verCSS))
            .pipe(dest("tests/cache"));
        }

    // Script Prep

        // Move the component scripts from dev to the server cache.
        function moveDevComponentScripts() {
            return src("dev/scripts/h2-" + component + ".js")
            .pipe(replace("$H2VERCSS", "-" + verCSS))
            .pipe(replace("$H2VERJS", verJS))
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
            .pipe(replace("$H2VER", verCSS))
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
        exports.dev = series(devPrep, parallel(browserSync, watchDevFiles));

// Production Tasks

    // System Prep

        // Markup Prep

            // Move component markup for system reference.
            function moveProdComponentSystemMarkup() {
                return src("dev/markup/**/*")
                .pipe(dest("dist/reference"));
            }

        // Script Prep

            // Move component scripts untouched.
            function prepProdComponentSystemScript() {
                return src("dev/scripts/h2-" + component + ".js")
                .pipe(replace("$H2VERCSS", ""))
                .pipe(replace("$H2VERJS", ""))
                .pipe(dest("dist/system/scripts"));
            }

        // Style Prep

            // Move component Sass partial from dev to dist.
            function moveProdComponentPartialSystemSass() {
                return src("dev/styles/_" + component + ".scss")
                .pipe(dest("dist/system/styles"));
            }

            // Move component Sass from dev to dist.
            function moveProdComponentSystemSass() {
                return src("dev/styles/h2-system-" + component + ".scss")
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "";
                }))
                .pipe(dest("dist/system/styles"));
            }

        // System Prep Task
        const prodSystemPrep = series(moveProdComponentSystemMarkup, prepProdComponentSystemScript, moveProdComponentPartialSystemSass, moveProdComponentSystemSass);

    // Version Prep

        // Markup Prep

        // Script Prep

            // Move component scripts untouched.
            function prepProdComponentVersionScript() {
                return src("dev/scripts/h2-" + component + ".js")
                .pipe(replace("$H2VERCSS", "-" + verCSS))
                .pipe(replace("$H2VERJS", verJS))
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "-" + verCSS;
                }))
                .pipe(dest("dist/version/scripts"));
            }

            // Compress component scripts.
            function compressProdComponentVersionScript() {
                return src("dist/version/scripts/h2-" + component + "-" + verCSS + ".js")
                .pipe(uglify())
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "-" + verCSS;
                    path.extname = ".min.js";
                }))
                .pipe(dest("dist/version/scripts"));
            }

            // GZip component scripts.
            function gzipProdComponentVersionScript() {
                return src("dist/version/scripts/h2-" + component + "-" + verCSS + ".min.js")
                .pipe(gzip())
                .pipe(dest("dist/version/scripts"));
            }

        // Style Prep

            // Move core Sass from the module to dist.
            function moveProdCoreVersionSass() {
                return src("node_modules/@hydrogen-design-system/core/dist/system/styles/*.scss")
                .pipe(dest("dist/version/styles/core"));
            }

            // Move component Sass partials from dev to dist.
            function moveProdComponentPartialVersionSass() {
                return src("dev/styles/_" + component + ".scss")
                .pipe(dest("dist/version/styles"));
            }

            // Move component Sass from dev to dist.
            function moveProdComponentVersionSass() {
                return src("dev/styles/h2-version-" + component + ".scss")
                .pipe(replace("$H2VER", verCSS))
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "-" + verCSS;
                }))
                .pipe(dest("dist/version/styles"));
            }

            // Compile Sass from dist.
            function compileProdComponentVersionSass() {
                return src("dist/version/styles/h2-" + component + "-" + verCSS + ".scss")
                .pipe(sass())
                .pipe(postcss([autoprefixer()]))
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "-" + verCSS;
                }))
                .pipe(dest("dist/version/styles"));
            }

            // Nano Sass from dist.
            function nanoProdComponentVersionSass() {
                return src("dist/version/styles/h2-" + component + "-" + verCSS + ".css")
                .pipe(postcss([cssnano()]))
                .pipe(rename(function(path) {
                    path.basename = "h2-" + component + "-" + verCSS;
                    path.extname = ".min.css";
                }))
                .pipe(dest("dist/version/styles"));
            }

            // GZip Sass from dist.
            function gzipProdComponentVersionSass() {
                return src("dist/version/styles/h2-" + component + "-" + verCSS + ".min.css")
                .pipe(gzip())
                .pipe(dest("dist/version/styles"));
            }

        // Version Prep Task
        const prodVersionPrep = series(prepProdComponentVersionScript, compressProdComponentVersionScript, gzipProdComponentVersionScript, moveProdCoreVersionSass, moveProdComponentPartialVersionSass, moveProdComponentVersionSass, compileProdComponentVersionSass, nanoProdComponentVersionSass, gzipProdComponentVersionSass);

    // Utility Tasks

        // Reset dist before a new build.
        function cleanDist() {
            return del("dist/**/*")
        }

    // Exports

        // gulp build
        exports.build = series(cleanDist, prodSystemPrep, prodVersionPrep);