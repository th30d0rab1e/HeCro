myApp.controller('InfoController', function($http, UserService, $uibModal, $log) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  vm.message = "";

  getPCAs();
  getTasks();

  vm.task = {
    input: '',
    assignedTo: []
  };

  // $("input:checkbox[name=type]:checked").each(function(){
  //   vm.task.assignedTo.push($(this).val());
  // });

  function getPCAs(){
    $http.get('/assistants').then(function(response) {
      console.log('got dem assistants', response);
      vm.assistants = response.data;
    });
  }

  function getTasks(){
    $http.get('/tasks').then(function(response){
      console.log('tasks GOT EM!', response);
      vm.taskArray = response.data;
    });
  }

  vm.deleteTask = function(task){
    console.log('removing taskId', task);

    $http.delete('/tasks/' + task.id + '/' + task.username).then(function(response){
      getTasks();
      console.log('delete response', response);
    }).catch(function(e){
      getTasks(); // just in case it doesnt work :)
    });

  }

  vm.newTask = function(){
    console.log('task', vm.task);
    if(vm.task.input === null || vm.task.input === ""){
      vm.message = "Dear human, type a task please.";
    } else {
      $http.post('/tasks', vm.task).then(function(response){
        console.log(response.data);
        //getTasks();
        //assigned To could be no one
        if(vm.task.assignedTo.length === 0){
          vm.task.assignedTo[0] = 'Anyone';
        }

        var obj = {
          taskid: response.data.taskid,
          usernames: vm.task.assignedTo
        };


        $http.post('/tasks/assign', obj).then(function(response){
          getTasks();
          console.log(response);
          vm.task.input = "";
        });
      });
    }
  };
});
