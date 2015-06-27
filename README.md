Gulp Simple Task Loader
=======================

[![NPM](https://nodei.co/npm/gulp-simple-task-loader.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.com/package/gulp-simple-task-loader)

[![npm version](https://badge.fury.io/js/gulp-simple-task-loader.svg)](http://badge.fury.io/js/gulp-simple-task-loader)
[![Coverage Status](https://coveralls.io/repos/reaganthomas/gulp-simple-task-loader/badge.svg)](https://coveralls.io/r/reaganthomas/gulp-simple-task-loader)
[![Build Status](https://travis-ci.org/reaganthomas/gulp-simple-task-loader.svg)](https://travis-ci.org/reaganthomas/gulp-simple-task-loader)
[![Dependency Status](https://david-dm.org/reaganthomas/gulp-simple-task-loader.svg)](https://david-dm.org/reaganthomas/gulp-simple-task-loader)
[![Codacy Badge](https://www.codacy.com/project/badge/1df06ca33c3d430992798f311eab6577)](https://www.codacy.com/public/reaganmthomas/gulp-simple-task-loader)

[![Pull Requests Status](http://issuestats.com/github/reaganthomas/gulp-simple-task-loader/badge/pr?style=flat)](http://issuestats.com/github/reaganthomas/gulp-simple-task-loader/badge/pr?style=flat)
[![Issues Status](http://issuestats.com/github/reaganthomas/gulp-simple-task-loader/badge/issue?style=flat)](http://issuestats.com/github/reaganthomas/gulp-simple-task-loader/badge/issue?style=flat)
[![Tips Status](http://img.shields.io/gratipay/reaganthomas.svg)](http://img.shields.io/gratipay/reaganthomas.svg)

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/reaganthomas/)

Easily modularize gulp tasks and minify your gulpfile. Works well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

## Installation

```sh
npm install gulp-simple-task-loader --save-dev
```

## Test

To test this package clone it and run the following command:

```sh
npm test
```

## Usage

```js
var taskLoader = require('gulp-simple-task-loader');
taskLoader(options);
```

This will load and register tasks for all files defined in your `taskDirectory`.

## Options
You can pass in an options object as shown below. The values shown below are the defaults.

```js
taskLoader({
  taskDirectory: 'gulp-tasks', // the directory your tasks are stored in
  plugins: {},                 // the plugins to expose to your tasks
  filenameDelimiter: '',       // a character or string of characters to replace in task filenames
  taskDelimiter: '',           // a character or string of characters to insert in place of removed filenameDelimiter
  config: {}                   // an object to store configuration for use in tasks
});
```

### Task Directory

Only put gulp tasks in your `taskDirectory`. All `.js` files in this directory will be attempted to be read as gulp tasks. Nested directories are supported as of `v1.0.29`.

### Delimiters

The purpose of the delimiters is to allow flexibility in task naming. A common convention for task names is to delimit using the `:` character, however `:`'s are not generally used or allowed in file names. A common usage of the delimiters is as follows:

```js
taskLoader({
  filenameDelimiter: '-',
  taskDelimiter: ':'
});
```

These options would convert a filename such as `move-all.js` to a task with the name `move:all`.

### Plugins

##### Using gulp-load-plugins

You can use [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) to easily lazy-load your gulp plugins. Use gulp-load-plugins in conjunction with gulp-simple-task-loader to minimize your gulpfile.

```js
'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = require('gulp-load-plugins')();

taskLoader({ plugins: plugins });
```

##### Passing in plugins manually

If not using gulp-load-plugins you must specify which plugins you want made available to your tasks.

```js
'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = {
  bump: require('gulp-bump'),
  mocha: require('gulp-mocha')
};

taskLoader({ plugins: plugins });
```

## Structuring a task

All tasks should be functions that receive the parameters `gulp`, `config`, and `plugins`.

There are 2 ways to structure a task -- returning a function that executes the task, or returning an object that contains dependencies, parameters, and the function that executes the task.

### Basic tasks

This is a typical function as you are used to with gulp.

```js
'use strict';

module.exports = function(gulp, config, plugins) {
  return function([callback]) {}; // the task functionality -- callback optional
};
```

### Tasks with dependencies

All 3 object keys (`deps`, `params`, and `fn`) are optional. This allows you to create a task that strictly calls other tasks, a task that is parameterized, or a task that just acts like a normal task. 

If there are no dependencies or parameters for the task you can use the above "Basic task" format for creating a basic task.

The values shown below are the defaults.

```js
'use strict';

module.exports = function(gulp, config, plugins) {
  return {
    deps: [],                   // an array of task names to execute before this task
    params: [],                 // an array of parameters to send to `fn`
    fn: function([callback]) {} // the task functionality -- callback optional
  };
};
```

Please note that if you use the `params` key your `fn` must be of the following form:

```js
params: [ 'a', 'b' ],
fn: function(param, cb) {} // where param is an item from the params array,
                           // and cb is a callback to be called at the end of your function
```

## Complete examples

### Using gulp-load-plugins

```js
(gulpfile.js)

'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = require('gulp-load-plugins');

taskLoader({
  filenameDelimiter: '-',
  tasknameDelimiter: ':',
  plugins: plugins
});
```

```js
(tasks/lint-all.js)

'use strict';

module.exports = function(gulp, config, plugins) {
  return {
    deps: [ 'lint:client', 'lint:server' ]
  };
};
```

```js
(tasks/lint-client.js)

'use strict';

module.exports = function(gulp, config, plugins) {
  return function() {
    return gulp.src('./client/**/*.js')
      .pipe(plugins.jshint);
  };
};
```

```js
(tasks/lint-server.js)

'use strict';

module.exports = function(gulp, config, plugins) {
  return function() {
    return gulp.src('./server/**/*.js')
      .pipe(plugins.jshint);
  };
};
```

### Parameterize tasks

```js
(gulpfile.js)

'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = require('gulp-load-plugins');

taskLoader({
  filenameDelimiter: '-',
  tasknameDelimiter: ':',
  plugins: plugins
});
```

```js
(tasks/parameterized.js)

'use strict';

module.exports = function(gulp, config, plugins) {
  return {
    params: [ '1', '2' ],
    fn: function(param, cb) {
      console.log(param);
      cb();  // note that the callback must be called in order for the task
             // to finish iterating through your params array
    }
  };
};
```

The task in `parameterized.js` would produce the following output:
```bash
1
2
```