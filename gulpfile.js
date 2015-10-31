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
  return gulp.src(['project/static/bower_components/angular/angular.js',
                  'project/static/bower_components/angular-route/angular-route.min.js',
                  'project/static/bower_components/angular-sanitize/angular-sanitize.js',
                  'project/static/bower_components/d3/d3.js',
                  'project/static/js/nv.d3.min.js', 
                  'project/static/js/d3angular.js',
                  'project/static/js/angular-pageslide-directive.min.js',
                  'project/static/js/app.js',
                  'project/static/js/factories/*.js',
                  'project/static/js/controllers/*.js' ])
    // .pipe(sourcemaps.init())
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write())
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