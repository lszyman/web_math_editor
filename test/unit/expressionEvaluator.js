'use strict';

describe('Expression evaluator', function() {

    beforeEach(module('webMathEditor'));

    it('checks if complicated latex expression is fully evaluated', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = { \\frac{\\sqrt{3^2*(4+6)-3*2-3}}{2} \\over 2}';
        var latexRes = 'x =2.25';

        $scope.latexValue(latexVal);

        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks if only basic latex operation is evaluated', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = {-b \\pm \\sqrt{3^2-4ac} \\over 2a}';
        var latexRes = 'x = {-b \\pm \\sqrt{9-4ac} \\over 2a}';

        $scope.latexValue(latexVal);

        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks basic sum/subtraction operation', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = 2+3.56';
        var latexRes = 'x =5.56';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);

        latexVal = 'x = 2-3.56';
        latexRes = 'x =-1.56';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks basic multiplication/division operation', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = 3*1.5';
        var latexRes = 'x =4.5';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);

        latexVal = 'x = \\frac{3}{5}';
        latexRes = 'x =0.6';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks basic power/sqrt operation', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = 3^4';
        var latexRes = 'x =81';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);

        latexVal = 'x = \\sqrt{81}';
        latexRes = 'x =9';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });

    it('checks if unnecessary parenthesis are evaluated', function($controller) {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });

        var latexTextArea = $('#mathExpression');
        var latexResultTextArea = $('#MathResultPreview');

        var latexVal = 'x = (10)';
        var latexRes = 'x =10';

        $scope.latexValue(latexVal);
        expect(latexTextArea.val()).toEqual(latexVal);
        expect(latexResultTextArea.val()).toEqual(latexRes);
    });
});