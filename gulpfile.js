// Hydrogen / Component / Gulpfile

"use strict";

// Requirements
const { series, parallel, src, dest, watch } = require('gulp');
const importInit = require("./tasks/init");
const importDev = require("./tasks/dev");
const importBuild = require("./tasks/build");

// Exports

    // gulp init --c=name
    exports.init = series(importInit.exportInit);

    // gulp dev
    exports.dev = series(importDev.exportDev);

    // gulp build
    exports.build = series(importBuild.exportBuild);