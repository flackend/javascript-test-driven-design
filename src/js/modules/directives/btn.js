angular.module('btn', [])
    .directive('btn', function() {
        return {
            scope: {label: '@'},
            template: '<button class="btn btn-default">{{label}}</button>'
        };
    });