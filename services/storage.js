exports.saveInput = function(db,zipData, clientId, errCallback, okCallback) {
  var data = db.collection('ziphistory').find({
    'clientId': clientId
  }) || {};
  if (data.history !== undefined) {
    data.history.push(zipData);
    db.collection('ziphistory').update( //
      {
        _id: data._id
      }, //
      data,
      function(err, res) {
        if (err) {
          errCallback(err);
        } else {
          okCallback(res);
        }
      });
  } else {
    data = {
      'history': [zipData],
      'clientId': clientId
    };
    db.collection('ziphistory').insertOne( //
      data,
      function(err, res) {
        if (err) {
          errCallback(err);
        } else {
          okCallback(res);
        }
      });
  }
};

exports.getInputHistory = function(db,clientId) {
  db.collection('ziphistory').find({
    'clientId': clientId
  }) || {};
  return data.history || [];
};
