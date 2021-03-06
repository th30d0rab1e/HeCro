var myApp = angular.module('myApp', ['ngRoute', 'checklist-model', 'ui.bootstrap']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/pca', {
      templateUrl: '/views/templates/pca.html',
      controller: 'PCAController as pc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController as ic',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/completedTasks', {
      templateUrl: '/views/templates/history.html',
      controller: 'CompletedTasksController as ctc',
      resolve : {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/aboutMe', {
      templateUrl: '/views/templates/aboutMe.html',
      controller: 'AboutMeController as amc',
      resolve : {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
});
