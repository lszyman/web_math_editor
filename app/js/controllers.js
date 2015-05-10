'use strict';

/* Controllers */

var webMathEditorControllers = angular.module('webMathEditorControllers', []);

webMathEditorControllers.controller('MathEditor', ['$scope', function($scope) {
    $scope.latexValue = function(latexVal) {
        setLatexExpression(latexVal)
    }
}]);
