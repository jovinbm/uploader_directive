var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass       = require('gulp-sass');
var cache      = require('memory-cache');
var expect     = require('gulp-expect-file');
var ngAnnotate = require('gulp-ng-annotate');
var concat     = require('gulp-concat');
var browserify = require('browserify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var assign     = require('lodash/assign');
var gutil      = require('gulp-util');
var buffer     = require('gulp-buffer');
var es         = require('event-stream');

function watch_is_active(name) {
  if (cache.get(name)) {
    return true;
  }
  else {
    console.info('Adding watch: ' + name);
    cache.put(name, 'gulp');
    return false;
  }
}

gulp.task('build:globals:js', function () {
  
  var NAME = 'build:globals:js';
  var DEST = './public/dist/js/vendor';
  
  var paths = [
    'bower_components/bluebird/js/browser/bluebird.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/object-fit/dist/polyfill.object-fit.js',
    'bower_components/cuid/dist/browser-cuid.js',
    // angular
    'bower_components/angular/angular.js',
    // angular-animate
    'bower_components/angular-animate/angular-animate.js',
    // ng file upload
    'bower_components/ng-file-upload/ng-file-upload-shim.js',
    'bower_components/ng-file-upload/ng-file-upload.js',
    // angular loading bar
    'bower_components/angular-loading-bar/build/loading-bar.js'
  ];
  
  if (!watch_is_active(NAME)) {
    gulp.watch(paths, [NAME]);
  }
  
  return gulp.src(paths)
    .pipe(expect(paths))
    .pipe(sourcemaps.init())
    .pipe(concat('globals.js'))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST));
  
});

gulp.task('build:globals:css', function () {
  var NAME = 'build:globals:css';
  var DEST = './public/dist/css/vendor';
  
  var paths = [
    'bower_components/normalize-css/normalize.css',
    'bower_components/animate.css/animate.css',
    'bower_components/object-fit/dist/polyfill.object-fit.css',
    // angular loading bar
    'bower_components/angular-loading-bar/src/loading-bar.css'
  ];
  
  if (!watch_is_active(NAME)) {
    gulp.watch(paths, [NAME]);
  }
  
  return gulp.src(paths)
    .pipe(expect(paths))
    .pipe(sourcemaps.init())
    .pipe(concat('globals.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST));
});

gulp.task('build:css', function () {
  
  var NAME = 'build:css';
  var DEST = './public/dist/css';
  
  var paths = [
    'public/_src/css/**/*.scss'
  ];
  
  if (!watch_is_active(NAME)) {
    gulp.watch(paths, [NAME]);
  }
  
  return gulp.src(paths)
    .pipe(expect(paths))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST));
});

gulp.task('build:js', function () {
  
  var NAME = 'build:js';
  var DEST = './public/dist/js/';
  
  var paths = [
    'index.js'
  ];
  
  var tasks = paths.map(function (entry) {
    
    var opts   = {
      entries: ['./public/_src/js/' + entry],
      debug  : true
    };
    var w_opts = assign({}, watchify.args, opts);
    var b      = watchify(browserify(w_opts));
    
    b.transform(["browserify-shim"]);
    
    b.on('update', bundle);
    b.on('log', gutil.log);
    
    function bundle() {
      return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(gulp.dest(DEST));
    }
    
    return bundle();
    
  });
  
  return es.merge.apply(null, tasks);
  
});

gulp.task('default', [
  'build:globals:js',
  'build:globals:css',
  'build:css',
  'build:js'
]);
