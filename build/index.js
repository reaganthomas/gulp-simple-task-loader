"use strict";

var fs = require("fs");
var _ = require("lodash");
var gulp = require("gulp");
var debug = require("debug")("gulp-simple-task-loader");
var path = require("path");

var defaultOptions = {
  taskDirectory: "gulp-tasks",
  plugins: {},
  filenameDelimiter: "",
  taskDelimiter: ""
};

module.exports = function (options) {
  options = _.assign(defaultOptions, options);

  if (typeof options.taskDirectory !== String) {
    options.taskDirectory = defaultOptions.taskDirectory;
  }

  if (options.taskDirectory[0] !== path.sep && options.taskDirectory.slice(0, 2) !== "." + path.sep) {
    options.taskDirectory = path.join(process.cwd(), options.taskDirectory);
  }

  var dirStat = fs.statSync(options.taskDirectory);
  if (!dirStat.isDirectory()) {
    throw new Error("Error: " + options.taskDirectory + " is not a directory");
  }

  fs.readdirSync(options.taskDirectory).forEach(function (filename) {
    var file = path.join(options.taskDirectory, filename);
    var stat = fs.statSync(file);

    if (stat.isFile() && filename.slice(-3) !== ".js") {
      return;
    }

    var taskname = filename.slice(0, -3);
    taskname = taskname.split(options.filenameDelimiter).join(options.taskDelimiter);
    var taskinfo = require(file)(gulp, options, options.plugins);

    gulp.task.apply(gulp, [taskname].concat(taskinfo));
  });
};