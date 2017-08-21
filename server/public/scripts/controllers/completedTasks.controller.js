myApp.controller('CompletedTasksController', function($http, UserService) {
  console.log('CompletedTasksController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.sendObject = {};

  getAssistants();

  function getAssistants() {

    $http.get('/assistants').then(function(response){ //GET in disguise
      vm.assistantsArray = response.data;
      console.log(response);
    });
  }

  vm.getTable = function(assistant){
    vm.message="";
    console.log('selected assistant', assistant.username);
    $http.post('/tasks/getCompleted', assistant).then(function(response){
      console.log('GOT DEM SUBMITTED TASKS', response);
      vm.subTaskArray = response.data;
      if(vm.subTaskArray.length === 0){
        vm.message = "This assistant hasn't submitted anything for you.";
      }
    });
  };
});
