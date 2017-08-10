myApp.controller('PCAController', function($http,UserService) {

  console.log('PCAController created');
  var vm = this;
  vm.userService = UserService;
  
  getTasks();

  function getTasks(){
    $http.get('/assistants/managers').then(function(response){
      console.log('managers GOT EM!', response.data);
      vm.managersArray = response.data;
    });
  }

});
