myApp.controller('InfoController', function(UserService) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  vm.newTask = function(){
    var task = {
      input: '',
      assignedTo: ''
    };
  }
});
