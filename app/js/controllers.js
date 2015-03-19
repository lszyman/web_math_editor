'use strict';

/* Controllers */

var webMathEditorControllers = angular.module('webMathEditorControllers', []);

webMathEditorControllers.controller('MathEditor', ['$scope', function($scope) {
    $scope.mathExpression = function(expression) {
        var parser = math.parser();
        if(expression != null)
            return parser.eval(expression);
        return ""
    }
}]);
