# JavaScript TDD

This will cover unit tests and end-to-end testing, general javascript, node, and AngularJS.

## Resources

- [AngularJS Unit Testing – For Real, Though (quickleft.com)](https://quickleft.com/blog/angularjs-unit-testing-for-real-though/)

## Jasmine (unit testing)

We'll be using **Jasmine** as our unit test framework.

Install jasmine globally so we can access the jasmine command-line tool:

```bash
npm install -g jasmine
```

Now initialize your project:

```bash
jasmine init
```

This creates the following folder structure:

```
|-- spec
|   |-- support
|   |   |-- jasmine.json
```

The config file, **jasmine.json**, is where you can specify the location of your tests, etc.

Create the first spec at **spec/square.spec.js**:

```js
var square = require('../src/square.js') ;

describe('square', function() {
    it('should return the quare of the number it is passed', function() {
        expect(square(0)).toBe(0 * 0);
        expect(square(1)).toBe(1 * 1);
        expect(square(5)).toBe(5 * 5);
        expect(square(279217897291798792)).toBe(279217897291798792 * 279217897291798792);
        expect(square(-7)).toBe(-7 * -7);
    });
});
```

Create **src/square.js**:

```js
module.exports = function () {};
```

Now we can run our tests:

```bash
jasmine
```

The tests should fail, which is always the first step of writing TDD.

Now fix **square.js**:

```js
module.exports = function (num) {
    return num * num;
};
```

## Karma

### Setup

To make things easier, we're going to add use karma to run our tests. Go ahead and remove the **spec** folder, but leave the **test** folder and **square.spec.js**.

If you don't have a **package.json** set up yet, run `npm init`. Then install Karma:

```bash
npm install --save-dev karma karma-jasmine karma-phantomjs-launcher
```

This gives us Karma, the Karma Jasmine adapter, and the Karma PhantomJS launcher.

To make Karma easier to run, install the command-line utility globally:

```bash
npm install -g karma-cli
```

Now, we need to generate the Karma config file:

```bash
karma init
```

You'll be prompted with a few questions:

```
Which testing framework do you want to use ?
> jasmine

Do you want to use Require.js ?
> no

Do you want to capture any browsers automatically ?
> PhantomJS

What is the location of your source and test files ?
> src/**/*.js
> spec/**/*[sS]pec.js

Should any of the files included by the previous patterns be excluded ?
>

Do you want Karma to watch all the files and run the tests on change ?
> yes
```

### Handling CommonJS modules with Browserify

Now that were using a browser (PhantomJS) to test, we need a way to resolve our modules. In **square.js**, we use `module.exports` and browsers generally don't know how to deal with that. **Browserify** can solve that issue for us. It compiles all our JS into a single file.

#### Organization

Our current setup:

```
|-- src
|   |-- square.js
```

Organization is up to you. The only requirement for working with Browserify is that you add a file that will be the entry point (**main.js** in this example) that will require our modules (i.e. **square.js**).

```
|-- dist
|-- src
|   |-- js
|   |   |-- main.js
|   |   |   |-- modules
|   |   |   |   |-- general
|   |   |   |   |   |-- square.js
```
So to follow this example, create the folders, move **square.js** and create **main.js**:

```js
window.square = require('./modules/general/square.js');
```

We're putting `square` on `window` so that everything has access to it (including our tests). But this we'll change that when we turn this into an AngularJS project later.

#### Bundling

If you install browserify globally, `npm install -g browserify`, you can bundle your javascript manually:

```bash
browserify src/js/main.js -o dist/bundle.js
```

But, a better solution is to use a task runner like Gulp.

Create **gulpfile.js** ([source](https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md)):

```js
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
```

Before you can run gulp, you need to install it and all the other libaries we're using in our **gulpfile.js**:

```bash
npm install --save-dev lodash.assign browserify vinyl-buffer gulp gulp-util vinyl-source-stream gulp-sourcemaps watchify
```

Notice that we use `--save-dev` since we only will be running gulp during development. You may need to adjust the Browserify entry point and output file in your **gulpfile.js** if you're organizing your project differently.

Now you can run gulp:

```bash
gulp
```

Since we're using **watchify** in our **gulpfile.js**, gulp won't exit. Instead it watches for changes to the files it bundled and rebundles as needed. Watchify is a special watcher built to work with Browserify. Instead of rebundling your whole bundle, it only recompiles what has changed. This cuts down on the processing time significantly.

You should have a new **bundle.js** and **bundle.js.map** in your **dist** folder.

The sourcemap (**bundle.js.map**) is optional. You can remove that part of the gulpfile if you'd like. But maps are very useful for debugging.

There are two more steps before Karma will run correctly. Update the sources in **karama.conf.js**. Replace `src/**/*.js` with `dist/bundle.js`. And lastly, remove the `require` line from the beginning of **spec/square.spec.js**.

### Running Karama

Run Karma:

```bash
karma start
```

We should have a passing test. Just to make sure it's working correctly, you might change what **square.js** returns and make sure it breaks. And just like gulp, karma has a watcher and will re-run the tests when it notices you've made a change.

### Karama Reporters

The ouput you see on the command line when Karama runs is produced by the "progress" reporter. You can pick a differerent built-in reporter (like "dots"), install a new reporter (look [here](https://www.npmjs.com/browse/keyword/karma-reporter)), or create your own. They don't all output to the command line either. You can get HTML or XML output for instance.

My preferred reporter is the [Nyan reporter](https://www.npmjs.com/package/karma-nyan-reporter):

![nyan reporter](https://raw.githubusercontent.com/dgarlitt/image-repo/master/karma-nyan-reporter/v0.2.2/karma-nyan-reporter.gif)