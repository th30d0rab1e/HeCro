myApp.controller('PCAController', function($http,UserService) {

  console.log('PCAController created');
  var vm = this;
  vm.userService = UserService;

  getManagers();

  vm.styleObj = {
      "text-decoration": "line-through"
  }

  function booleanStrike(x){
    if(x){
      vm.styleObj = {
          "text-decoration": "line-through"
      }
    } else {
      vm.styleObj = {
        "text-decoration": "none"
      }
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
    });
  };

  vm.submitTask = function(task){
    console.log(task);
    if(task.hasOwnProperty('description')){
      $http.post('/tasks/finished', task).then(function(response){
        vm.message = "Task is completed, good job " + vm.userService.userObject.userName + ".";
        //booleanStrike(true);
        console.log(response);
      });
    } else {
      console.log('empty');
      //booleanStrike(false);
      vm.message = "Cmon " + vm.userService.userObject.userName + ", at least type 'DONE'.";
    }

  }
});
