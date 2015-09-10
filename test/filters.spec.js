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