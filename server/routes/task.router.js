var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

router.post('/', function(req, res, next) {
  console.log('in server posting dem tasks', req.user.id);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }

    var userid = req.user.id;

    client.query("INSERT into TASKS(task, manager_id)VALUES($1, $2) RETURNING id",
      [req.body.input, req.user.id],
        function (err, result) {
          done();
          //client.end();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            console.log('last/returned id of tasks',result.rows[0].id);
            //console.log(result.rows);

            var taskid = result.rows[0].id;

            res.send({taskid: taskid});
          }
        });
  });

});

router.post('/assign', function(req, res, next) {
  console.log('in server posting dem assignments', req.body);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }

    client.query("insert into assigned_tasks(user_id, task_id) values((select id from users where username= $1),(select id from tasks where id=$2));",
      [req.body.usernames, req.body.taskid],
        function (err, result) {
          done();
          //client.end();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            //console.log(result.rows);
            res.sendStatus(202);
          }
        });
  });

});

router.get('/', function(req, res, next) {
  console.log('in server getting dem tasks', req.body, req.user.id);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("select t.id, t.task, t.manager_id, u.username from tasks as t join assigned_tasks as at on t.id = at.task_id join users as u on u.id = at.user_id where t.manager_id = $1;",
      [req.user.id],
        function (err, result) {
          done();
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

router.post('/tasks', function(req, res, next) {
  console.log('in server getting dem managers tasks', req.body.username);
  console.log('logged in user', req.user.id);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("select users.username, tasks.task, assigned_tasks.user_id from users join tasks on users.id = tasks.manager_id join assigned_tasks on tasks.id = assigned_tasks.task_id where users.username ilike $1 and assigned_tasks.user_id = $2;",
      [req.body.username,req.user.id],
        function (err, result) {
          done();
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
