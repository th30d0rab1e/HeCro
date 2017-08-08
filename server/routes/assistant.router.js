var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.get('/', function(req, res) {
  console.log('in server getting dem assistants');

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT username FROM users WHERE role = 2",
        function (err, result) {
          client.end();

          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            res.send();
          }
        });
  });

});

module.exports = router;
