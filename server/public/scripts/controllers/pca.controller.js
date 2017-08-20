myApp.controller('PCAController', function($http,UserService) {

  console.log('PCAController created');
  var vm = this;
  vm.userService = UserService;

  getManagers();


  function booleanStrike(x){
    if(x){
      vm.condition = true;
    } else {
      vm.condition = false;
    }
  }

  function getManagers(){
    $http.get('/assistants/managers').then(function(response){
      console.log('managers GOT EM!', response.data);
      vm.managersArray = response.data;
    });
  }

  vm.displayTable = function(managerName){
    console.log('manager name:', managerName.username);
    //getting the tasks from a specific manager dependant on whos logged in

    $http.post('/tasks/tasks', managerName).then(function(response){ //not an actual POST, its GET. but I have to carry a value over
      vm.taskArray = response.data;
      console.log('GOT dem tasks!', response);
      console.log('length of response.rows:', response.data.length);
      if(response.data.length === 0){
        vm.message="No tasks from this manager has been assigned for today.";
      } else {
        vm.message="";
      }
    });
  };

  vm.submitTask = function(task, index){
    console.log('index',index);
    console.log('task is',task);
    if(task.hasOwnProperty('description')){
      $http.post('/tasks/finished', task).then(function(response){
        vm.message = "Task is completed, good job " + vm.userService.userObject.userName + ".";
        //booleanStrike(true);
        console.log(response);
        vm.taskArray.splice(index, 1);

      });
    } else {
      console.log('empty');
      //booleanStrike(false);
      vm.message = "Cmon " + vm.userService.userObject.userName + ", at least type 'DONE'.";
    }

  };


});
