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
    for(i = 0;i<req.body.usernames.length;i++){
      console.log('iterated index', i);
      client.query("insert into assigned_tasks(user_id, task_id) values((select id from users where username= $1),(select id from tasks where id=$2));",
        [req.body.usernames[i], req.body.taskid],
          function (err, result) {
            done();
            //client.end();
            if(err) {
              console.log("Error inserting data: ", err);
              next(err);
            } else {
              //console.log(result.rows);

            }
          });
      }
      res.sendStatus(202);
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
    client.query("select tasks.id, users.username, tasks.task, assigned_tasks.user_id from users join tasks on users.id = tasks.manager_id join assigned_tasks on tasks.id = assigned_tasks.task_id where users.username = $1 and assigned_tasks.user_id = $2 or users.username = $1 and assigned_tasks.user_id = 0;",
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

router.delete('/:id/:username', function(req, res, next) {
  console.log('in server id', req.params.id);
  console.log('in server username', req.params.username);
  //console.log("task id", req.params);
  // errorConnecting is bool, db is what we query against,
  // done is a function that we call when we're done

  //delete from the assigned_tasks table first, foreign key constraint
  pool.connect(function(errorConnectingToDatabase, db, done) {
    var id = req.params.id;
    //console.log(id);
    if (errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now we're going to GET things from the db
      var queryText = 'DELETE FROM assigned_tasks WHERE "task_id" = $1 and "user_id" = (select id from users where username = $2);';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [req.params.id, req.params.username], function(errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Attempted to query(assigned_tasks delete) with', queryText, errorMakingQuery);
          console.log('Error making delete assigned_tasks query');
          next();
          //res.sendStatus(500);
        } else {
          console.log(result.rows);
          // Send back the results
          //res.sendStatus(200);
          //continue to delete from the tasks table
          pool.connect(function(errorConnectingToDatabase, db, done) {
            //var id = req.params.id;
            console.log(id);
            if (errorConnectingToDatabase) {
              console.log('Error connecting to the database.');
              res.sendStatus(500);
            } else {
              // We connected to the database!!!
              // Now we're going to GET things from the db
              var queryText = 'DO $do$ begin if not exists (select task_id from assigned_tasks where task_id ='+ req.params.id +') THEN delete from tasks where id = '+ req.params.id +'; end if; end $do$;';
              // errorMakingQuery is a bool, result is an object
              db.query(queryText, function(errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                  console.log('Attempted to query with', queryText, errorMakingQuery);
                  console.log('Error making query');
                  res.sendStatus(500);
                } else {
                  console.log(result.rows);
                  // Send back the results
                  res.sendStatus(200);
                }
              }); // end query
            } // end if
          }); // end pool
          //end of delete from task table
        }
      }); // end query
    } // end if
  }); // end pool
  //end delete assigned_tasks
}); // end of DELETE

router.post('/finished', function(req, res, next) {
  console.log('in server posting dem finished tasks', req.body);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }

    client.query("insert into finished_tasks(task_id, user_id, input) values($1, $2, $3);",
      [req.body.id, req.user.id, req.body.description],
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

router.post('/getCompleted', function(req, res, next) {
  console.log('in server getting dem submitted tasks', req.body);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }

    client.query("select * from finished_tasks join tasks on finished_tasks.task_id = tasks.id where manager_id = $1 and user_id = (select id from users where username = $2);",
      [req.user.id, req.body.username],
        function (err, result) {
          done();
          //client.end();
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

module.exports = router;
