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