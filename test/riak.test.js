var riak = require('..')({});

describe('RiakMock', function() {
  var bucket = 'test';
  var key = '1';

  it('should save to db', function(done) {
    var data = {
      test: true
    };

    riak.save(bucket, key, data, done);
  });

  it ('should get from db', function(done) {
    riak.get(bucket, key, function(err, data) {
      data.test.should.be.ok;
      done();
    });
  });

  it('should destroy from db', function(done) {
    riak.remove(bucket, key);
    riak.get(bucket, '1', function(err, data) {
      err.should.be.an.Object;
      done();
    });
  });
});