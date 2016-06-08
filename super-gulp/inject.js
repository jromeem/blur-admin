'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('super-inject-reload', ['super-inject'], function () {
  browserSync.reload();
});

gulp.task('super-inject', ['super-scripts', 'super-styles', 'super-injectAuth', 'super-inject404', 'super-copyVendorImages'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/super-admin/main.css'),
    path.join('!' + conf.paths.tmp, '/serve/super-admin/vendor.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/assets/js/**/*.js'),
    path.join(conf.paths.src, '/super-admin/**/*.module.js'),
    path.join(conf.paths.src, '/super-admin/**/*.js'),
    path.join('!' + conf.paths.src, '/super-admin/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/super-admin/**/*.mock.js'),
  ])
    /*.pipe($.angularFilesort())*/.on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/index.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('super-injectAuth', ['super-stylesAuth'], function () {
  return injectAlone({
    css: [path.join('!' + conf.paths.tmp, '/serve/super-admin/vendor.css'), path.join(conf.paths.tmp, '/serve/super-admin/auth.css')],
    paths: [path.join(conf.paths.src, '/auth.html'), path.join(conf.paths.src, '/reg.html')]
  })
});

gulp.task('super-inject404', ['super-styles404'], function () {
  return injectAlone({
    css: [path.join('!' + conf.paths.tmp, '/serve/super-admin/vendor.css'), path.join(conf.paths.tmp, '/serve/super-admin/404.css')],
    paths: path.join(conf.paths.src, '/404.html')
  })
});

var injectAlone = function (options) {
  var injectStyles = gulp.src(
    options.css
    , {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(options.paths)
    .pipe($.inject(injectStyles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
};