myApp.controller('InfoController', function($http,UserService) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  getPCAs();
  getTasks();

  vm.task = {
    input: 'do a backflip',
    assignedTo: ''
  };

  // $("input:checkbox[name=type]:checked").each(function(){
  //   vm.task.assignedTo.push($(this).val());
  // });

  function getPCAs(){
    $http.get('/assistants').then(function(response) {
      console.log(response);
      vm.assistants = response.data;
    });
  }

  function getTasks(){
    $http.get('/tasks').then(function(response){
      console.log('tasks GOT EM!', response);
      vm.taskArray = response.data;
    });
  }

  vm.deleteTask = function(taskId){
    console.log('removing taskId', taskId);

    $http.delete('/tasks/' + taskId).then(function(response){
      console.log('delete response', response);
      getTasks();
    });
  }

  vm.newTask = function(){
    console.log(vm.task);
    $http.post('/tasks', vm.task).then(function(response){
      console.log(response.data);

      //assigned To could be no one
      if(vm.task.assignedTo === ''){
        vm.task.assignedTo = 'Anyone';
      }

      var obj = {
        taskid: response.data.taskid,
        usernames: vm.task.assignedTo
      };


      $http.post('/tasks/assign', obj).then(function(response){
        getTasks();
        console.log(response);
      });
    });
  };
});
