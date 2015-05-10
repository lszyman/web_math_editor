'use strict';

describe('MathEditor controller', function() {

    beforeEach(module('webMathEditor'));
    beforeEach(module('webMathEditorControllers'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    it('checks if latex expression changed after update', function() {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });
        var latexVal = '\\frac{a}{b}';
        var beforeLatexExpress = $('#mathExpression').val();
        $scope.latexValue(latexVal);
        var afterLatexExpress = $('#mathExpression').val();
        expect(beforeLatexExpress).toEqual(afterLatexExpress);
    });
});
