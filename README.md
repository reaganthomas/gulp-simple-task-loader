Gulp Simple Task Loader
=======================

Easily modularize gulp tasks and minify your gulpfile. Works well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

## Installation

```sh
npm install gulp-simple-task-loader --save-dev
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

Only put gulp tasks in your `taskDirectory`. All files in this directory will be attempted to be read as gulp tasks. Currently there is no support for nested tasks -- all tasks must be at the root level of your `taskDirectory`.

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

There are 2 ways to structure a task -- returning a function that executes the task, or returning an object that contains dependencies and the function that executes the task.

### Basic tasks

```js
'use strict';

module.exports = function(gulp, config, plugins) {
  return function([callback]) {}; // the task functionality -- callback optional
};
```

### Tasks with dependencies

Both `deps` and `fn` are optional. This allows you to create a task that strictly calls other tasks, or a task that doesn't have dependencies. If there are no dependencies for the task you can use the above format for creating a basic task.

The values shown below are the defaults.

```js
'use strict';

module.exports = function(gulp, config, plugins) {
  return {
    deps: [],                   // an array of task names to execute before this task
    fn: function([callback]) {} // the task functionality -- callback optional
  };
};
```

## Complete example using gulp-load-plugins

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
