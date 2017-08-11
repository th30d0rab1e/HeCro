var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/', function(req, res) {
  console.log('in server getting dem assistants');

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT username FROM users WHERE role = 2",
        function (err, result) {
          done();
          //client.end();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            console.log(result.rows);
            res.send(result.rows);
          }
      });
  });

});

router.get('/managers', function(req, res){
  console.log('in server getting dem managers');

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT username FROM users WHERE role = 1",
        function (err, result) {
          done();
          //client.end();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            console.log(result.rows);
            res.send(result.rows);
          }
        });
  });
});

module.exports = router;
