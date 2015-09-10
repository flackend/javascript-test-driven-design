angular.module('square', [])
    .factory('square', function() {
        return function (num) {
            return num * num;
        };
    });