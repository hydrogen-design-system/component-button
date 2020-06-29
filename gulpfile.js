// Hydrogen / Components / Button / Gulpfile

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const del = require('del');
const gzip = require('gulp-gzip');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

sass.compiler = require('sass');

// Test Scripts

    // Concatenate and Move Scripts
    function concatTestScripts() {
        return src([
            // Core
            'node_modules/@hydrogen-design-system/core/dist/scripts/h2-core.min.js',
            // Component
            'dev/scripts/h2-component-button.js'
        ])
        .pipe(concat('h2-component-button.js'))
        .pipe(dest('tests/cache/scripts'));
    }

    // Compile and Move Sass
    function compileTestSass() {
        return src('dev/styles/h2-component-button.scss')
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('tests/cache/styles'));
    }

    // Clean Cache
    function cleanCache() {
        return del('tests/cache/**/*')
    }

    // Watch
    function watchTestFiles() {
        watch(['dev/**/*', 'tests/**/*.html'], series(cleanCache, concatTestScripts, compileTestSass, browserSyncReload));
    }

    // Browsersync
    function browserSync(done) {
        browsersync.init({
            server: {
                baseDir: 'tests'
            },
        });
        done();
    }
    function browserSyncReload(done) {
        return src('tests/*.html')
        .pipe(browsersync.reload({
            stream: true
        }));
    }

    // Default Task
    exports.default = series(cleanCache, concatTestScripts, compileTestSass, parallel(browserSync, watchTestFiles));

// Development Scripts

    // Concatenate and Compress Scripts

        // Concatenated, Raw
        function concatScripts() {
            return src([
                // Core
                'node_modules/@hydrogen-design-system/core/dist/scripts/h2-core.min.js',
                // Component
                'dev/scripts/h2-component-button.js'
            ])
            .pipe(concat('h2-component-button.js'))
            .pipe(dest('dist/scripts'));
        }

        // Concatenated, Uglified
        function uglifyScripts() {
            return src([
                // Core
                'node_modules/@hydrogen-design-system/core/dist/scripts/h2-core.min.js',
                // Component
                'dev/scripts/h2-component-button.js'
            ])
            .pipe(concat('h2-component-button.js'))
            .pipe(uglify())
            .pipe(rename(function(path) {
                path.extname = ".min.js";
            }))
            .pipe(dest('dist/scripts'));
        }

        // Concatenated, Uglified, GZipped
        function gzipScripts() {
            return src([
                // Core
                'node_modules/@hydrogen-design-system/core/dist/scripts/h2-core.min.js',
                // Component
                'dev/scripts/h2-component-button.js'
            ])
            .pipe(concat('h2-component-button.js'))
            .pipe(uglify())
            .pipe(rename(function(path) {
                path.extname = ".min.js";
            }))
            .pipe(gzip())
            .pipe(dest('dist/gzip'));
        }

    // Move and Compile Sass

        // Move Sass for Production
        function moveSass() {
            return src('dev/styles/*.scss')
            .pipe(dest('dist/styles'));
        }

        // Compiled, Raw
        function compileSass() {
            return src('dev/styles/h2-component-button.scss')
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            .pipe(dest('dist/styles'));
        }

        // Compiled, Nanoed
        function nanoSass() {
            return src('dev/styles/h2-component-button.scss')
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            .pipe(postcss([cssnano()]))
            .pipe(rename(function(path) {
                path.extname = ".min.css";
            }))
            .pipe(dest('dist/styles'));
        }

        // Compiled, Nanoed, GZipped
        function gzipSass() {
            return src('dev/styles/h2-component-button.scss')
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            .pipe(postcss([cssnano()]))
            .pipe(rename(function(path) {
                path.extname = ".min.css";
            }))
            .pipe(gzip())
            .pipe(dest('dist/gzip'));
        }

    // Clean Dist
    function cleanDist() {
        return del('dist/**/*')
    }

    // Exports

        // gulp build
        exports.build = series(cleanDist, concatScripts, uglifyScripts, gzipScripts, moveSass, compileSass, nanoSass, gzipSass);