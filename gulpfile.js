//'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function () {
  return gutil.log('Gulp is running!');
});

gulp.task('jshint', function () {
  return gulp.src('project/static/js/*/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function () {
  gulp.watch('project/static/js/*/*.js', ['jshint']);
});


gulp.task('build-js', function () {
  return gulp.src([
                  'project/static/js/app.js',
                  'project/static/js/factories/*.js',
                  'project/static/js/controllers/*.js',
                  'project/static/js/filters/*.js',
                  'project/static/js/directives/poseidonDirective.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('project/static/tinyFiles'));
});

//This concats but does not minify for some reason...
gulp.task('min-css', function () {
  return gulp.src('project/static/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(concatCss('styles.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('project/static/tinyFiles'));
});

gulp.task('gzip', function () {
  return gulp.src('project/static/tinyFiles/*.css')
    .pipe(gzip({}))
    .pipe(gulp.dest('project/static/tinyFiles'));
});