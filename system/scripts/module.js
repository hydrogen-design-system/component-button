// Hydrogen / Component / Module JS
// This file is designed to be the location in which all scripting for the component's functionality exists. This file should export all relevant functionality so that it can be imported by Hydrogen and other systems.
// Development Notes:
// - please ensure all functions are defined with "" at the end of their name.
// - please ensure all references to the parent component's selector also include "" (e.g. [data-h2-accordion])
//   This is so that when the component is built, it produces a version-locked set of code that can me manually imported to override newer versions.
// - please ensure that when event listeners are added to a trigger, that the script is checking for the system variable (see an example below).
"use strict";