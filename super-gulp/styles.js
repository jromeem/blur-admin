'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('super-styles-reload', ['super-styles'], function () {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('super-styles', function () {
  return buildStyles();
});

gulp.task('super-stylesAuth', function () {
  return buildSingleScss(path.join(conf.paths.src, '/super-sass/auth.scss'));
});
gulp.task('super-styles404', function () {
  return buildSingleScss(path.join(conf.paths.src, '/super-sass/404.scss'));
});

var buildStyles = function () {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/super-sass/**/_*.scss'),
    '!' + path.join(conf.paths.src, '/super-sass/theme/conf/**/*.scss'),
    '!' + path.join(conf.paths.src, '/super-sass/404.scss'),
    '!' + path.join(conf.paths.src, '/super-sass/auth.scss')
  ], {read: false});

  var injectOptions = {
    transform: function (filePath) {
      filePath = filePath.replace(conf.paths.src + '/super-sass/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src([
    path.join(conf.paths.src, '/super-sass/main.scss')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/super-admin/')));
};

var buildSingleScss = function (paths) {
  var sassOptions = {
    style: 'expanded'
  };

  return gulp.src([paths])
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/super-admin/')));
};
