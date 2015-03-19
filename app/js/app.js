'use strict';

/* App module */

var webMathEditorApp = angular.module('webMathEditor', [
    'ngRoute',
    'webMathEditorControllers'
]);

webMathEditorApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/index', {
                templateUrl: '../pages/math-editor.html',
                controller: 'MathEditor'
            }).otherwise({
                redirectTo: '/index'
            });
    }
]);
