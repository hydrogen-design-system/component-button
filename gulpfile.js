// Hydrogen / Component / Gulpfile

"use strict";

// Requirements
const { series } = require('gulp');
const importDev = require("./tasks/dev");
const importBuild = require("./tasks/build");

// Exports

  // gulp dev
  exports.dev = series(importDev.exportDev);

  // gulp build
  exports.build = series(importBuild.exportBuild);