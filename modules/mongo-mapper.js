var db = require('mongoose');

var MongoMapper = function() {

}

MongoMapper.prototype.sequenceGenerator = function(name) {
    var SequenceSchema, Sequence;

    SequenceSchema = new db.Schema({
        nextSeqNumber: { type: Number, default: 1 }
    });

    Sequence = db.model(name + 'Seq', SequenceSchema);

    return {
        next: function(callback) {
            Sequence.find(function(err, data) {
                if (err) {
                    throw (err);
                }

                if (data.length < 1) {
                    // create if doesn't exist create and return first
                    Sequence.create({}, function(err, seq) {
                        if (err) {
                            throw (err);
                        }
                        callback(seq.nextSeqNumber);
                    });
                } else {
                    // update sequence and return next
                    Sequence.findByIdAndUpdate(data[0]._id, { $inc: { nextSeqNumber: 1 } }, function(err, seq) {
                        if (err) {
                            throw (err);
                        }
                        callback(seq.nextSeqNumber);
                    });
                }
            });
        }
    };
}


module.exports = new MongoMapper();
