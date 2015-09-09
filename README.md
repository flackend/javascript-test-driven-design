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
