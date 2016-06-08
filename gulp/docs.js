'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('super-wintersmith-generate', $.shell.task([
  'wintersmith build'
], { cwd: 'docs' }));

gulp.task('super-deploy-docs', ['super-wintersmith-generate'], function() {
  return gulp.src('./docs/build/**/*')
      .pipe($.ghPages());
});