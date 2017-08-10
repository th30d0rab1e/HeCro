myApp.controller('InfoController', function($http,UserService) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  getPCAs();
  getTasks();

  vm.task = {
    input: 'clean me',
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

  vm.newTask = function(){
    console.log(vm.task);
    $http.post('/tasks', vm.task).then(function(response){
      console.log(response.data);

      getTasks();

      var obj = {
        taskid: response.data.taskid,
        usernames: vm.task.assignedTo
      };

      $http.post('/tasks/assign', obj).then(function(response){
        console.log(response);
      });
    });
  };
});
