"use strict";

var fs = require("fs");
var _ = require("lodash");
var gulp = require("gulp");
var path = require("path");

var defaultOptions = {
  taskDirectory: "gulp-tasks",
  plugins: {},
  filenameDelimiter: "",
  tasknameDelimiter: "",
  config: {}
};

function voidFunction() {
  return;
}

module.exports = function (options) {
  options = _.assign(defaultOptions, options);

  if (typeof options.taskDirectory !== "string") {
    throw new Error("Task directory must be a string containing the relative path to a task directory");
  }

  if (options.taskDirectory.slice(0, 2) === "." + path.sep) {
    options.taskDirectory = options.taskDirectory.slice(2);
  }

  options.taskDirectory = path.join(process.cwd(), options.taskDirectory);

  var dirStat = fs.statSync(options.taskDirectory);
  if (!dirStat.isDirectory()) {
    throw new Error(options.taskDirectory + " is not a directory");
  }

  function processDirectory(dir) {
    fs.readdirSync(dir).filter(function (filename) {
      var file = path.resolve(dir, filename);
      var extname = path.extname(filename);
      return extname === ".js" || extname === ".coffee" || fs.statSync(file).isDirectory();
    }).map(function (filename) {
      var file = path.resolve(dir, filename);

      if (fs.statSync(file).isDirectory()) {
        return { directory: true, filename: filename };
      } else {
        var taskname = path.basename(filename, path.extname(filename));
        taskname = taskname.split(options.filenameDelimiter).join(options.tasknameDelimiter);

        return { file: file, filename: filename, taskname: taskname };
      }
    }).forEach(function (obj) {
      if (obj.directory) {
        processDirectory(dir + "/" + obj.filename);
      } else {
        var taskinfo = require(obj.file)(gulp, _.defaults(options.config, _.omit(options, ["config", "plugins"])), options.plugins);
        var taskdeps = taskinfo.deps || [];
        var taskfn = taskinfo.deps || taskinfo.fn ? taskinfo.fn || voidFunction : taskinfo;

        gulp.task(obj.taskname, taskdeps, taskfn);
      }
    });
  }

  processDirectory(options.taskDirectory);
};