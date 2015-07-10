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

Easily modularize gulp tasks and minify your gulpfile. Works well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

* [Gulp Simple Task Loader](#gulp-simple-task-loader)
  * [Installation](#installation)
  * [Test](#test)
  * [Usage](#usage)
  * [Options](#options)
    * [Task Directory](#options-task-directory)
    * [Delimiters](#options-delimiters)
    * [Plugins](#options-plugins)
      * [Using gulp-load-plugins](#options-plugins-using-gulp-load-plugins)
      * [Passing in plugins manually](#options-plugins-passing-in-plugins-manually)
    * [Config File](#options-config-file)
  * [Structuring a task](#structuring-a-task)
    * [Basic Tasks](#structuring-a-task-basic-tasks)
    * [Tasks with dependencies and/or parameters](#structuring-a-task-tasks-with-dependencies-and-or-parameters)
  * [Complete Examples](#complete-examples)
    * [Using gulp-load-plugins](#complete-examples-using-gulp-load-plugins)
    * [Parameterize tasks](#complete-examples-parameterize-tasks)
  * [Changelog](#changelog)

<h2 id="installation">Installation</h2>

```sh
$ npm install gulp-simple-task-loader --save-dev
```

<h2 id="test">Test</h2>

To test this package clone it and run the following commands:

```sh
$ npm install
$ npm test
```

<h2 id="usage">Usage</h2>

```js
var taskLoader = require('gulp-simple-task-loader');
taskLoader(options);
```

This will load and register tasks for all files defined in your `taskDirectory`.

If your tasks aren't registering (they are, but to the wrong gulp package) you can optionally specify a gulp to register the tasks to.

```js
var gulp = require('gulp');
var taskLoader = require('gulp-simple-task-loader');
taskLoader(options, gulp);
```

<h2 id="options">Options</h2>

You can pass in an options object as shown below. The values shown below are the defaults.

```js
taskLoader({
  taskDirectory: 'gulp-tasks', // the directory your tasks are stored in (relative and absolute paths accepted)
  plugins: {},                 // the plugins to expose to your tasks
  filenameDelimiter: '',       // a character or string of characters to replace in task filenames
  taskDelimiter: '',           // a character or string of characters to insert in place of removed filenameDelimiter
  config: {},                  // an object to store configuration for use in tasks
  configFile: ''               // the relative path to your task configuration file from your task directory
});
```

<h3 id="options-task-directory">Task Directory</h3>

Only put gulp tasks in your `taskDirectory`. All `.js` files in this directory, unless the `configFile` option is being used, will be attempted to be read as gulp tasks. Nested directories are supported as of `v1.0.29`.

<h3 id="options-delimiters">Delimiters</h3>

The purpose of the delimiters is to allow flexibility in task naming. A common convention for task names is to delimit using the `:` character, however `:`'s are not generally used or allowed in file names. A common usage of the delimiters is as follows:

```js
taskLoader({
  filenameDelimiter: '-',
  taskDelimiter: ':'
});
```

These options would convert a filename such as `move-all.js` to a task with the name `move:all`.

<h3 id="options-plugins">Plugins</h3>

<h4 id="options-plugins-using-gulp-load-plugins">Using gulp-load-plugins</h4>

You can use [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) to easily lazy-load your gulp plugins. Use gulp-load-plugins in conjunction with gulp-simple-task-loader to minimize your gulpfile.

```js
'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = require('gulp-load-plugins')();

taskLoader({ plugins: plugins });
```

<h4 id="options-plugins-passing-in-plugins-manually">Passing in plugins manually</h4>

If not using gulp-load-plugins you must specify which plugins you want made available to your tasks.

```js
(gulpfile.js)
'use strict';

var taskLoader = require('gulp-simple-task-loader');
var plugins = {
  bump: require('gulp-bump'),
  mocha: require('gulp-mocha')
};

taskLoader({ plugins: plugins });
```

<h3 id="options-config-file">Config File</h3>

You have the option of passing in the location of a configuration file from within your task directory. Please note that the configuration file takes precedence over the `config` option that you may also pass in, meaning that any key in `config` is overwritten if the same key exists in the config file.

```js
(gulpfile.js)
'use strict';

var taskLoader = require('gulp-simple-task-loader');
var config = { env: 'production' };

taskLoader({ config: config, configFile: 'config.js' });
```

```js
(config.js)
'use strict';

module.exports = {
  // insert configuration options here
};
```

<h2 id="structuring-a-task">Structuring a task</h2>

All tasks should be functions that receive the parameters `gulp`, `config`, and `plugins`.

There are 2 ways to structure a task -- returning a function that executes the task, or returning an object that contains dependencies, parameters, and the function that executes the task.

<h3 id="structuring-a-task-basic-tasks">Basic tasks</h3>

This is a typical function as you are used to with gulp.

```js
'use strict';

module.exports = function(gulp, config, plugins) {
  return function([callback]) {}; // the task functionality -- callback optional
};
```

<h3 id="structuring-a-task-tasks-with-dependencies-and-or-parameters">Tasks with dependencies and/or parameters</h3>

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

<h2 id="complete-examples">Complete examples</h2>

<h3 id="complete-examples-using-gulp-load-plugins">Using gulp-load-plugins</h3>

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

<h3 id="complete-examples-parameterize-tasks">Parameterize tasks</h3>

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
```sh
1
2
```

<h2 id="changelog">Changelog</h2>

Documented below are any significant changes to the package.

* 1.x.x
  * 1.3.x
    * [1.3.0](https://github.com/reaganthomas/gulp-simple-task-loader/commit/39342b76220c8071a7b9a60bc310dff8a8fbadb9) - added feature for passing in configuration file [github issue #6](https://github.com/reaganthomas/gulp-simple-task-loader/issues/6); restructured test suite to section out functionality
  * 1.2.x
    * [1.2.4](https://github.com/reaganthomas/gulp-simple-task-loader/commit/8aceeee667076cb9b86f8022427866820d51ce30) - added table of contents and changelog to README.md
    * [1.2.1](https://github.com/reaganthomas/gulp-simple-task-loader/commit/767318e136aa7cb27925e73587487d11486ed50f) - added testing for `plugins` and `config` options
    * [1.2.0](https://github.com/reaganthomas/gulp-simple-task-loader/commit/768cc7e19488193a2171602a50e17c21f1cf9067) - restructured package to be more modular
  * 1.1.x
    * [1.1.6](https://github.com/reaganthomas/gulp-simple-task-loader/commit/0a042343adc2ee449e5a9e27dbc8fa01add9034b) - added documentation for testing the package
    * [1.1.4](https://github.com/reaganthomas/gulp-simple-task-loader/commit/3af56bd8353834d49a59f50ad49065be768e1e44) - improved documentation for parameterized tasks
    * [1.1.0](https://github.com/reaganthomas/gulp-simple-task-loader/commit/5b86eda1053ea077e9db02e40fb95ff09d2d7409) - added functionality to parameterize tasks - [github issue #9](https://github.com/reaganthomas/gulp-simple-task-loader/issues/9)
  * 1.0.x
    * [1.0.35](https://github.com/reaganthomas/gulp-simple-task-loader/commit/d78e36f06957b78e093a763ca3c3bef35559b3d2) - added support for coffeescript - [@chafnan](https://github.com/chafnan)
    * [1.0.33](https://github.com/reaganthomas/gulp-simple-task-loader/commit/b92f7211e292c76b90df0cff61359b0ac32a2948) - fixed [github issue #8](https://github.com/reaganthomas/gulp-simple-task-loader/issues/8)
    * [1.0.29](https://github.com/reaganthomas/gulp-simple-task-loader/commit/e0b9bf3e2a000c78955a96c61c14b73999ac615c) - added functionality to allow for recursive directory task searching
    * [1.0.17](https://github.com/reaganthomas/gulp-simple-task-loader/commit/e3d28d22ae085b2fd83ca914bfb3341962ab5f27) - added documentation for calling the plugin; added documentation for complete examples
    * [1.0.16](https://github.com/reaganthomas/gulp-simple-task-loader/commit/5ddc6f5b5735538169d1123df5299e2e1cb0f794) - created README.md
    * [1.0.15](https://github.com/reaganthomas/gulp-simple-task-loader/commit/0833009aefb217673891387916642c5ed1a53be9) - added dependency support for tasks
    * [1.0.14](https://github.com/reaganthomas/gulp-simple-task-loader/commit/e178e6ca2dfb5e571ea622cb56d5915ad7954e48) - implemented first set of tests
