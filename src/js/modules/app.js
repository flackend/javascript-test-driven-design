/**
 * Require AngularJS
 */
require('angular');
require('angular-route');
// Modules
require('./controllers.js');
require('./filters/camelcase.js');
require('./services/square.js');

//  _  _ ____     _      _  _
// | \|_|_ | |\ ||_  /\ |_)|_)
// |_/|_| _|_| \||_ /--\|  |
//
module.exports = angular.module('app', [
    'ngRoute',
    'controllers',
    // FILTERS
    'camelcase',
    // SERVICES
    'square'
]).config(['$routeProvider', require('./routes.js')]);