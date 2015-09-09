var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

// Configure Browserify with custom options
var options = {
    entries: ['./src/js/main.js'],
    debug: true
};
// Merge your custom options with the options that watchify specifies for browserify
var options = assign({}, watchify.args, options);
// Create the browserify instance with watchify
var bundler = watchify(browserify(options));
// Add transformations here
// i.e. bundler.transform(coffeeify);
/**
 * Process all the JS
 */
function bundle() {
    return bundler.bundle()
        // Log errors
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        // Source stream into a file named "bundle.js".
        .pipe(source('bundle.js'))
        // Optional, remove if you don't need to buffer file contents.
        .pipe(buffer())
        // Optional, remove if you dont want sourcemaps.
        // Loads map from browserify file.
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.

        // Writes .map file
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}

gulp.task('js', bundle);
bundler.on('update', bundle);
// Output build logs to terminal
bundler.on('log', gutil.log);
gulp.task('default', ['js']);