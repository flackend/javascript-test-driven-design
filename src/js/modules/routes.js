module.exports = function ($routeProvider) {

    $routeProvider
        // HOME
        .when('/', {
            templateUrl: 'views/home.html',
            controller:  'HomeController'
        })
        // DEFAULT
        .otherwise({
            redirectTo: '/'
        });
};