// Hydrogen / Component / Instance JS

// This file is designed to be the location in which the component's module is imported and executed. When the component JavaScript is compiled for production, this file is what is compiled, producing a browser ready file that operates the component. All functional capabilities of the component should exist in module.js, which is loaded into the system repository.

// Development Notes:
// - please ensure all functions are defined with "_VERSION" at the end of their name.
// - please ensure all references to the parent component's selector also include "_VERSION" (e.g. [data-h2-accordion_VERSION])
// This is so that when the component is built, it produces a version-locked set of code that can me manually imported to override newer versions.

// Import the document ready function from the core.
// import { h2CoreDocumentReady } from "./core";

// Import functions from the component's module.js.
// import {} from "./module";

// Set the system variable to null so that the compiled code is namespaced within the instance. This variable shouldn't be changed in the component repository and is set to a different value by Hydrogen's system repository when the component is imported. Pass this variable to any functions in module.js that require the component to be instanced within the system.
// var system;

// Execute code when the document has finished loading.
// h2CoreDocumentReady(function(){
//   // Do Stuff
// });