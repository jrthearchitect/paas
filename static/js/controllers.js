var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: '/partials/Byzip.html',
      controller: 'wcontroller',
      controllerAs: 'wcontroller'
    });
  }
]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
  function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.zip1City = "";
    $scope.zip1Weather = "";
    $scope.inputHistory = [];
    $scope.clientId = "ye@metlife.co.jp";

    var cleanDisplay = function(){
      //$scope.zip = "";
      $scope.zipCity = "";
      $scope.zipWeather = "";
      $scope.zipTime = "";
      $scope.colorStyle = "";
    };

    $scope.zipUpdate = function() {
      var value = $scope.zip || "";
      if (value.length === 5) {
        $http({
          method: "GET",
          url: '/api/v1/getWeather?zip=' + value
        }).then(function(response) {
          $scope.zipCity = response.data.city;
          $scope.zipWeather = response.data.weather;
          $scope.zipTime = response.data.time;
          $scope.colorStyle = response.data.colorStyle;
          if ($scope.colorStyle === '') {
            $scope.inputHistory.push({
              'zip': value,
              'zipCity': $scope.zipCity,
              'zipWeather': $scope.zipWeather,
              'zipTime': $scope.zipTime
            });
            console.log($scope.inputHistory);
          }
        });
      } else {
        cleanDisplay();
      }
    };

    $scope.clientChange = function() {
      console.log('New Client is '+$scope.clientId);
      if ($scope.clientId === ""){
        console.error('Invalid Client ID');
        $scope.clientId = 'ye@metlife.co.jp';
        return;
      }
      cleanDisplay();
      $scope.zip = "";
      $scope.reloadHistory();
    };

    $scope.isHistoryEmpty = function() {
      return $scope.inputHistory.length == 0;
    };

    $scope.reloadHistory = function() {
      $http({
        method: "GET",
        url: '/api/v1/getHistory?clientId=' + $scope.clientId
      }).then(function(response) {
        $scope.inputHistory = response.data || [];
      });
    };

  }
]);
