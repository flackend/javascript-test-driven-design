describe('square', function() {
    it('should return the quare of the number it is passed', function() {
        expect(square(0)).toBe(0 * 0);
        expect(square(1)).toBe(1 * 1);
        expect(square(5)).toBe(5 * 5);
        expect(square(279217897291798792)).toBe(279217897291798792 * 279217897291798792);
        expect(square(-7)).toBe(-7 * -7);
    });
});