// Hydrogen / Components / Setup Tasks

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
var argv = require('yargs')
    .command('init', 'Initialize a component for the first time.', function (yargs) {
        return yargs
            .option('component', {
                alias: 'c',
                demandOption: 'Please provide a name for your component to continue.',
                describe: 'Name your component.'
            })
    })
    .version(false)
    .help()
    .argv;

// Dev Tasks

    // Replace Dev Files
    function initDevStylePartialReplace() {
        return src("src/styles/_component.scss")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("src/styles"));
    }
    function initDevStyleSystemReplace() {
        return src("src/styles/h2-system-component.scss")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("src/styles"));
    }
    function initDevStyleVersionReplace() {
        return src("src/styles/h2-version-component.scss")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("src/styles"));
    }

    // Rename Dev Files

    function initDevMarkUpRename() {
        return src("src/markup/h2-component.html")
        .pipe(rename(function(path) {
            path.basename = "h2-component-" + argv.c;
        }))
        .pipe(dest("src/markup"));
    }
    function initDevMarkupDelete() {
        return del("src/markup/h2-component.html");
    }

    function initDevScriptRename() {
        return src("src/scripts/h2-component.js")
        .pipe(rename(function(path) {
            path.basename = "h2-component-" + argv.c;
        }))
        .pipe(dest("src/scripts"));
    }
    function initDevScriptDelete() {
        return del("src/scripts/h2-component.js");
    }

    function initDevStylePartialRename() {
        return src("src/styles/_component.scss")
        .pipe(rename(function(path) {
            path.basename = "_component-" + argv.c;
        }))
        .pipe(dest("src/styles"));
    }
    function initDevStylePartialDelete() {
        return del("src/styles/_component.scss");
    }

    function initDevStyleSystemRename() {
        return src("src/styles/h2-system-component.scss")
        .pipe(rename(function(path) {
            path.basename = "h2-system-component-" + argv.c;
        }))
        .pipe(dest("src/styles"));
    }
    function initDevStyleSystemDelete() {
        return del("src/styles/h2-system-component.scss");
    }

    function initDevStyleVersionRename() {
        return src("src/styles/h2-version-component.scss")
        .pipe(rename(function(path) {
            path.basename = "h2-version-component-" + argv.c;
        }))
        .pipe(dest("src/styles"));
    }
    function initDevStyleVersionDelete() {
        return del("src/styles/h2-version-component.scss");
    }

// Test Tasks

    // Replace Vars in Test Files
    function initTestMarkupReplace() {
        return src("tests/index.html")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("tests"));
    }

// Gulp Tasks

    // Replace Vars in Gulpfiles
    function initGulpDevReplace() {
        return src("tasks/dev.js")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("tasks"));
    }
    function initGulpBuildReplace() {
        return src("tasks/build.js")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("tasks"));
    }

// NPM Tasks

    // Replace Vars in NPM
    function initNpmReplace() {
        return src("./npm.js")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("./"));
    }

// Package Tasks

    // Replace Vars in package.json
    function initPackageReplace() {
        return src("./package.json")
        .pipe(replace("component-comp", "component-" + argv.c))
        .pipe(dest("./"));
    }

// README Tasks

    // Replace Vars in README.md
    function initReadMeReplace() {
        return src("./README.md")
        .pipe(replace("$COMP", argv.c))
        .pipe(dest("./"));
    }

// Exports

    // gulp init --c=name
    exports.exportInit = series(initDevStylePartialReplace, initDevStyleSystemReplace, initDevStyleVersionReplace, initDevMarkUpRename, initDevMarkupDelete, initDevScriptRename, initDevScriptDelete, initDevStylePartialRename, initDevStylePartialDelete, initDevStyleSystemRename, initDevStyleSystemDelete, initDevStyleVersionRename, initDevStyleVersionDelete, initTestMarkupReplace, initGulpDevReplace, initGulpBuildReplace, initNpmReplace, initPackageReplace, initReadMeReplace);