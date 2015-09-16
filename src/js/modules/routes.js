module.exports = function ($routeProvider) {

    $routeProvider
        // HOME
        .when('/', {
            templateUrl: 'views/home.html',
            controller:  'HomeController'
        })
        // TESTS
        .when('/test/btn', {
            templateUrl: 'views/test/btn.html'
        })
        // DEFAULT
        .otherwise({
            redirectTo: '/'
        });
};