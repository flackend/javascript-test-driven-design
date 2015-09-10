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