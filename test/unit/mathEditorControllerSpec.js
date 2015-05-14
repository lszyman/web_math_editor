'use strict';

describe('MathEditor controller', function() {

    beforeEach(module('webMathEditor'));

    it('checks if latex expression changed after calling update function', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });
        var latexVal = '(a+b)';
        var latexExpress = $('#mathExpression');
        $scope.latexValue(latexVal);
        expect(latexExpress.text()).toBe(latexVal);
    });
});
