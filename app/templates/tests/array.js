var expect = require('chai').expect;

describe('Array', function() {
  context('#push', function() {
    it('should push a new element in an array', function() {
      var array = [1, 2];

      expect(array).to.have.length(2);

      array.push(3);

      expect(array).to.have.length(3);
    });

    it('should contain the pushed element', function() {
      var array = [1, 2];

      array.push(3);

      expect(array).to.include(3);
    });
  });
});