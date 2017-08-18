var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username : req.user.username,
      role: req.user.role
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

router.post('/aboutMe', function(req, res, next){
  console.log('in server updating your information',req.body);
  console.log('login id',req.user.id);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("insert into about_me(userid, phone_number, email, address, description) values ($1, $2, $3, $4, $5) on conflict (userid) do update set phone_number = $2, email = $3, address = $4, description=$5;",
      [req.user.id, req.body.phone_number, req.body.email, req.body.address, req.body.description],
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            console.log(result.rows);
            res.sendStatus(202);
          }
        });
  });

});

router.get('/aboutMe', function(req, res, next){
  console.log('in server getting your information',req.body);
  console.log('login id',req.user.id);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("select * from about_me where userid = $1",
      [req.user.id],
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            //console.log(result.rows);
            res.send(result.rows);
          }
        });
  });

});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});



module.exports = router;
