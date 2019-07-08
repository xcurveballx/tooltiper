'use strict';
const browserify = require('browserify');
const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const path = require('path');
const cached = require('gulp-cached');
const remember = require('gulp-remember');

const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCSS = require('gulp-clean-css');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const folders = {
	      src: './src/',
	      dst: './dst/'
      };

gulp.task('css', function() {
  return gulp.src(folders.src + 'sass/**/main.sass')
    .pipe(cached('css'))
    .pipe(remember('css'))
    .pipe(sass({outputStyle: 'compressed', includePaths: ['node_modules']}).on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest(folders.dst + 'css'));
});

gulp.task('js', function() {
  return browserify(folders.src + 'js/main.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest(folders.dst + 'js'));
});

gulp.task('watch', function() {

  gulp.watch(folders.src + 'js/**/*.js', gulp.series('js'));

  gulp.watch(folders.src + 'sass/**/*.sass', gulp.series('css')).on('unlink', function(filepath) {
    remember.forget('css', path.resolve(filepath));
    delete cached.caches.css[path.resolve(filepath)];
  });
});

gulp.task('default', gulp.series(gulp.parallel('css', 'js'), 'watch'));
