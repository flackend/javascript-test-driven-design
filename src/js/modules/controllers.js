angular.module('controllers', [])
    /**
     * Home Controller
     */
    .controller('HomeController', ['$scope', function($scope) {
        $scope.greeting = 'Hello, World';
    }]);