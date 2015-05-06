var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function($scope, $http) {
  // Initialize entry data
  $scope.firstName = '';
  $scope.lastName = '';

  $scope.insert = function() {
    var reqData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName
    }
    $http.post('/insert', reqData).success(function(res) {
      //$scope.contactsNames = res.contactsNames;
      var contacts = res.contactsNames;
      $scope.contactsNames = contacts;

      $scope.contactsNum = contacts.length;
      $scope.contactsNum = count;
    })
  }

  $scope.show = function() {
    $http.post('/show').success(function(res) {
      var contacts = res.contactsNames;
      console.log('contact');
      console.dir(contacts);
      $scope.contactsNames = contacts;
      $scope.contactsNum = contacts.length;
      console.log('<Post REMOVE from html>');
    })
  }//show

  $scope.find = function() {
      // Check if the fields are empty. Show a message to a user.
      var reqData = {
        firstName: $scope.firstName,
        lastName: $scope.lastName
      }
      $http.post('/find', reqData).success(function(res) {
        $scope.contactsNames = res.contactsNames;
      })
    }// find

  $scope.remove = function() {
      // Check if the fields are empty. Show a message to a user.
      var reqData = {
        firstName: $scope.firstName,
        lastName: $scope.lastName
      }
      $http.post('/remove', reqData).success(function(res) {
        $scope.contactsNames = res.contactsNames;
      })
    }// remove
}]);// app.controller
