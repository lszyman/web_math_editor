'use strict';

describe('Expression evaluator', function() {

    beforeEach(module('webMathEditor'));

    it('checks if complicated latex expression is fully evaluated', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexVal = 'x = { \\frac{\\sqrt{3^2*(4+6)-3*2-3}}{2} \\over 2}';
        var latexRes = 'x =2.25';

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        $scope.latexValue(latexVal);

        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks if only basic latex operation is evaluated', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexVal = 'x = {-b \\pm \\sqrt{3^2-4ac} \\over 2a}';
        var latexRes = 'x = {-b \\pm \\sqrt{9-4ac} \\over 2a}';

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        $scope.latexValue(latexVal);

        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });
});