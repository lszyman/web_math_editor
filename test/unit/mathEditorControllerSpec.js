'use strict';

describe('MathEditor controller', function() {

    beforeEach(module('webMathEditor'));
    beforeEach(module('webMathEditorControllers'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    it('checks if math expression is equals 10', function() {
        var $scope = {};
        var controller = $controller('MathEditor', { $scope: $scope });
        var expression = '(( 1 + 3 ) * 4 + 4) / 2';
        var res = $scope.mathExpression(expression);
        expect(res).toEqual(10);
    });
});
