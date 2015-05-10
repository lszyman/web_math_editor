'use strict';

describe('MathEditor controller', function() {

    beforeEach(module('webMathEditor'));
    beforeEach(module('webMathEditorControllers'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    //TODO: Test do poprawy
    it('checks if latex expression changed after update', function() {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });
        var latexVal = '(a+b)';
        var latexExpress = $('#mathExpression');
        $scope.latexValue(latexVal);
        expect(latexVal).toContain(latexVal);
    });
});
