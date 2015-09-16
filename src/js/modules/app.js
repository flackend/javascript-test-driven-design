/**
 * Require AngularJS
 */
require('angular');
require('angular-route');
// Modules
require('./controllers.js');
require('./filters/camelcase.js');
require('./services/square.js');
require('./directives/btn.js');

//  _  _ ____     _      _  _
// | \|_|_ | |\ ||_  /\ |_)|_)
// |_/|_| _|_| \||_ /--\|  |
//
module.exports = angular.module('app', [
    'ngRoute',
    'controllers',
    // DIRECTIVES
    'btn',
    // FILTERS
    'camelcase',
    // SERVICES
    'square'
]).config(['$routeProvider', require('./routes.js')]);