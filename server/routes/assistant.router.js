var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/', function(req, res, next) {
  console.log('in server getting dem assistants');
  console.log('user role: ', req.user.id);


//role =2; //?
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);

      next(err);
    }
    client.query("SELECT users.username, userid, phone_number, email, address, description FROM users left outer join about_me on users.id = about_me.userid WHERE users.role =" + req.user.id + ";",
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

router.get('/managers', function(req, res, next){
  console.log('in server getting dem managers');
  console.log('user role', req.user.role);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT users.username, userid, phone_number, email, address, description FROM users left outer join about_me on users.id = about_me.userid WHERE users.role = 1",
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
