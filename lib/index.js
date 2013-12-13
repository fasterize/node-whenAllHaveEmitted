var Bacon = require('baconjs').Bacon;

Array.prototype.whenAllHaveEmitted = function(eventName, callback) {
  var self = this,
      eventStream = new Bacon.EventStream(function(subscriber) {
        var baconCallback = function(error) {
          subscriber(new Bacon.Next(error));
        };

        self.forEach(function(element) {
          element.once(eventName, baconCallback);
        });
        return function() {
          self.forEach(function(element) {
            element.removeListener(eventName, baconCallback);
          });
        };
      });

  var prop = eventStream.scan([], function(acc, value) {
    if (value) {
      acc.push(value);
    }
    return acc;
  });
  prop.take(self.length + 1).onEnd(function() {
    prop.subscribe(function(event) {
      var returnValue = event.value();
      callback(returnValue.length === 0 ? null : returnValue);
    });
  });
};
