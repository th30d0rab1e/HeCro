myApp.controller('AboutMeController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  // vm.about = {
  //   phone_number: '1112223333',
  //   email: '@gmail.com',
  //   address: '123 Unicorn St. Springfield Illiones 56301',
  //   description: 'The person who made this website is super cool.'
  // };

  getInfo();

  vm.updateMe = function(about){
    $http.post('/user/aboutMe', about).then(function(response){
      vm.message = "Information saved";
      console.log(vm.userObject.userName, 'information updated', response);
    });
  };

  function getInfo(){
    $http.get('/user/aboutMe').then(function(response){
      console.log('got dem info', response);
      vm.about = response.data[0];
    });
  }

  vm.message = "If you would like to, you can update your information for better accessibality from others. People who have the opposite role can view your information. If you are an assistant, only managers can view your information. If you are a manager, only assistants can view your information.";
});
