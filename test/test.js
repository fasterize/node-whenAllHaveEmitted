var should = require('should'),
    EventEmitter = require('events').EventEmitter,
    index = require('../lib/index.js');

describe('Misc test', function() {
  describe('#whenAllHaveEmitted', function() {

    it('should call given callback when all element of an array have emitted the event', function(done) {
      var emitted = 0,
          eventEmitter1 = new EventEmitter(),
          eventEmitter2 = new EventEmitter(),
          eventEmitter3 = new EventEmitter(),
          array = [eventEmitter1, eventEmitter2, eventEmitter3];

      array.whenAllHaveEmitted('testEvent', function(errors) {
        emitted.should.equal(3);
        should.not.exists(errors);
        done();
      });

      emitted++;
      eventEmitter2.emit('testEvent');
      emitted++;
      eventEmitter1.emit('testEvent');
      emitted++;
      eventEmitter3.emit('testEvent');
    });

    it('should call given callback when the array is empty', function(done) {
      var array = [];

      array.whenAllHaveEmitted('testEvent', function(errors) {
        should.not.exists(errors);
        done();
      });
    });

    it('should call given callback with reported errors when all element of an array have emitted the event', function(done) {
      var emitted = 0,
          eventEmitter1 = new EventEmitter(),
          eventEmitter2 = new EventEmitter(),
          eventEmitter3 = new EventEmitter(),
          array = [eventEmitter1, eventEmitter2, eventEmitter3];

      array.whenAllHaveEmitted('testEvent', function(errors) {
        emitted.should.equal(3);
        errors.should.eql(['error1', 'error2', 'error3']);
        done();
      });

      emitted++;
      eventEmitter2.emit('testEvent', 'error1');
      emitted++;
      eventEmitter1.emit('testEvent', 'error2');
      emitted++;
      eventEmitter3.emit('testEvent', 'error3');
    });

  });
});
