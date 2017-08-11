myApp.controller('PCAController', function($http,UserService) {

  console.log('PCAController created');
  var vm = this;
  vm.userService = UserService;

  getManagers();

  function getManagers(){
    $http.get('/assistants/managers').then(function(response){
      console.log('managers GOT EM!', response.data);
      vm.managersArray = response.data;
    });
  }

  vm.displayTable = function(managerName){
    console.log('manager name:', managerName.username);
    //getting the tasks from a specific manager dependant on whos logged in

    $http.post('/tasks/tasks', managerName).then(function(response){
      console.log('GOT EM!', response);
    });
  };
});
