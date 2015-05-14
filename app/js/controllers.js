'use strict';

/* Controllers */

var webMathEditorControllers = angular.module('webMathEditorControllers', []);

webMathEditorControllers.controller('MathEditor', ['$scope', function($scope) {

    $scope.mathExp = "x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}";

    $scope.latexValue = function(latexVal) {
        setLatexExpression(latexVal);
        Preview.Update();
    };

    $scope.updatePreview = function() {
        Preview.Update();
    };

}]);
