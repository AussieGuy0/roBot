const assert = require('assert');
const utils = require('../libs/utils.js')

describe('Utils', function() {
  describe('Generate Random Numbers', function() {
    it('should generate unique numbers', function() {
      const numbers = utils.generateUniqueNumbers(1, 10, 5);
      const check = [];
      numbers.forEach(function(number) {
        if (check.indexOf(number) > -1) {
          assert.fail();
        }
        check.push(number)
      }, this);
    });
    it('generates correct amount of numbers', function() {
      const length = 5;
      const numbers = utils.generateUniqueNumbers(1, 10, length);
      assert.equal(numbers.length, length)
    });
    it('throws exception if length is less than range', function() {
      assert.throws(() => utils.generateUniqueNumbers(9, 10, 5));
    });
  });
});

