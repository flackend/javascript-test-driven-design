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
    it('should return the square of the number it is passed', function() {
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
|   |   |-- modules
|   |   |   |-- general
|   |   |   |   |-- square.js
```
So to follow this example, create the folders, move **square.js** and create **main.js**:

```js
window.square = require('./modules/general/square.js');
```

We're putting `square` on `window` so that everything has access to it (including our tests). But we'll change that when we turn this into an AngularJS project later.

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

Notice that we use `--save-dev` since we only ever run gulp during development. You may need to adjust the Browserify entry point and output file in your **gulpfile.js** if you're organizing your project differently.

Now you can run gulp:

```bash
gulp
```

Since we're using **watchify** in our **gulpfile.js**, gulp won't exit. Instead it watches for changes to the files it bundled and rebundles whenever it detects a change. Watchify is a special watcher built to work with Browserify. Instead of rebundling your whole bundle, it only recompiles what has changed. This cuts down on the processing time significantly.

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

## Testing AngularJS

Let's add AngularJS:

```bash
npm install --save angular angualr-route
```

Update **src/js/main.js** (remove the square.js require statement):

```js
// Our AngularJS app
require('./modules/app.js');
```

**Note:** If I'm going to use Twitter Bootstrap's JS, Semantic UI, etc-- **main.js** is where I include it.

Remove **src/js/modules/general/square.js** and add **src/js/modules/services/square**:

```js
angular.module('square', [])
    .factory('square', function() {
        return function (num) {
            return num * num;
        };
    });
```

Create **src/js/modules/app.js**:

```js
/**
 * Require AngularJS
 */
require('angular');
require('angular-route');
// Modules
require('./controllers.js');
require('./services/square.js');

//  _  _ ____     _      _  _
// | \|_|_ | |\ ||_  /\ |_)|_)
// |_/|_| _|_| \||_ /--\|  |
//
module.exports = angular.module('app', [
    'ngRoute',
    'controllers',
    'square'
]).config(['$routeProvider', require('./routes.js')]);
```

**src/js/modules/controllers.js**:

```js
angular.module('controllers', [])
    /**
     * Home Controller
     */
    .controller('HomeController', ['$scope', function($scope) {
        $scope.greeting = 'Hello, World';
    }]);
```

**src/js/modules/routes.js**:

```js
module.exports = function ($routeProvider) {

    $routeProvider
        // HOME
        .when('/', {
            templateUrl: 'views/home.html',
            controller:  'HomeController'
        })
        // DEFAULT
        .otherwise({
            redirectTo: '/'
        });
};
```

Now remove **test/square.spec.js** and add **test/services.spec.js**:

```js
describe('Services', function() {

    beforeEach(function() {
        // Bring our app module that has all of our services attached to it.
        module('app');
    });

    it('square should return the square of the number it is passed', function() {
        var square;

        inject(function(_square_){
            square = _square_;
        });

        expect(square(0)).toBe(0 * 0);
        expect(square(1)).toBe(1 * 1);
        expect(square(5)).toBe(5 * 5);
        expect(square(279217897291798792)).toBe(279217897291798792 * 279217897291798792);
        expect(square(-7)).toBe(-7 * -7);
    });
});
```

In order for our updated test to work, we need Angular's ngMock:

```bash
npm install --save-dev angular-mocks
```

Now include it in our **karma.conf.js**:

```js
// list of files / patterns to load in the browser
files: [
  'dist/bundle.js',
  'node_modules/angular-mocks/angular-mocks.js',
  'test/**/*.js'
],
```

**Note:** **angular-mocks.js** depends on **angular.js**, so the order here is important. We need to include **angular-mocks.js** after we include **angular.js** which is part of **bundle.js**.

Now test!

```bash
karma start
```

Again, I like to break my test to make sure everything is working and then change it back.

### Filter

We tested a service. Let's test a filter **test/filters.spec.js**:

```js
describe('Filters', function() {

    var $filter;

    beforeEach(function() {
        // Bring our app module that has all of our filters attached to it.
        module('app');
        // This makes filter testing work. :shrug:
        // @link https://docs.angularjs.org/guide/unit-testing
        inject(function(_$filter_){
            $filter = _$filter_;
        });
    });

    it('camelcase filter should transform text', function() {
        var camelcase = $filter('camelcase');
        expect(camelcase('Hello World')).toMatch('helloWorld');
    });
});
```

Check karma to make sure our test failed.

**src/js/modules/filters/camelcase.js**:

```js
angular.module('camelcase', [])
    .filter('camelcase', function() {
        return function (text) {
            return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                if (+match === 0) {
                    return "";
                }
                return index === 0 ? match.toLowerCase() : match.toUpperCase();
            });
        };
    });
```

And update **src/js/modules/app.js**:

```js
/**
 * Require AngularJS
 */
require('angular');
require('angular-route');
// Modules
require('./controllers.js');
require('./filters/camelcase.js');
require('./services/square.js');

//  _  _ ____     _      _  _
// | \|_|_ | |\ ||_  /\ |_)|_)
// |_/|_| _|_| \||_ /--\|  |
//
module.exports = angular.module('app', [
    'ngRoute',
    'controllers',
    // FILTERS
    'camelcase',
    // SERVICES
    'square'
]).config(['$routeProvider', require('./routes.js')]);
```

If you noticed I put our new filter before the service that's already there-- I'm just keeping things alphabetical. Just a preference.

Ok, check Karma and our test should be passing now!

## End to end testing (e2e) with Protractor

Now we'll set up Protractor so we can test things that happen on pages.

### Organization

Let's change our organization a little:

```
|-- test
|   |-- unit
|   |   |-- filters.spec.js
|   |   |-- services.spec.js
|   |-- e2e
```

Now update your **karma.conf.js**. Replace `'test/**/*.js'` with `'test/unit/**/*.js'`.

### Serve up the app

We need a site to serve up, so **dist/index.html**:

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <meta charset="utf-8">
    <title>JS TDD Sample App</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <h1>JS TDD Sample App</h1>
        <div ng-view></div>
    </div>
<script src="bundle.js"></script>
</body>
</html>
```

And we'll need the view we referenced in our routes file, **dist/views/home.html**:

```html
<p>{{greeting}}</p>
```

You can use whatever you want to serve up the app (Nginx, Apache, Node, PHP, etc). I'm using httpster. It's a simple http webserver.

```bash
npm install -g httpster
cd dist/
httpster
```

Now my app is being served up to [http://localhost:3333](http://localhost:3333).

### Install and configure Protractor

Install Protractor globally so we can use the `protrator` command-line utility:

```bash
npm install -g protractor
```

The above command also installs the `webdriver-manager` utility. We need to install the required binaries before it'll work:

```
webdriver-manager update
```

We'll need a config file. We have to create it manually, **protractor.conf.js**:

```js
exports.config = {
    framework: 'jasmine2',
    specs: ['test/e2e/**/*.js'],
    directConnect: true,
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 5
    }
};
```

Using `directConnect` and `chrome` runs the tests locally instead of using Selenium Server. And using `shardTestFiles` and `maxInstances` allows Protractor to run tests asynchronously (for better performance).

### Directive

Create a directive test, **test/e2e/directives.spec.js**:

```js
describe('Directive', function() {

    describe('btn', function() {

        beforeEach(function() {
            browser.get('/#/test/btn');
        });

        it('element should exist', function() {
            expect($('#btn > button').isPresent()).toBeTruthy();
        });

        it('element should have "btn" and "btn-default" classes', function() {
            expect($('#btn > button.btn.btn-default').isPresent()).toBeTruthy();
        });

        it('element text should be the value from the label attribute', function() {
            expect($('#btn[label="Click me"] > button.btn.btn-default').isPresent()).toBeTruthy();
            expect($('#btn[label="Click me"] > button.btn.btn-default').getText()).toMatch(/^Click me$/);
        });
    });
});
```

Run protractor:

```bash
protractor protractor.conf.js
```

Our test should fail. Now create the directive, **src/js/modules/directives/btn.js**:

```js
angular.module('btn', [])
    .directive('btn', function() {
        return {
            scope: {label: '@'},
            template: '<button class="btn btn-default">{{label}}</button>'
        };
    });
```

**Note:** Remember to require the new module in **src/js/modules/app.js** and include it in the app module.

Create a route and a view to test our directive.

**src/js/modules/routes.js**:

```js
module.exports = function ($routeProvider) {

    $routeProvider
        // HOME
        .when('/', {
            templateUrl: 'views/home.html',
            controller:  'HomeController'
        })
        // TESTS
        .when('/test/btn', {
            templateUrl: 'views/test/btn.html'
        })
        // DEFAULT
        .otherwise({
            redirectTo: '/'
        });
};
```

**dist/views/test/btn.html**:

```html
<btn id="btn" label="Click me"></btn>
```

Now our test should pass:

```bash
protractor protractor.conf.js
```
