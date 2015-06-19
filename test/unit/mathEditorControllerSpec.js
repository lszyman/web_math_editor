'use strict';

var gapi = {};

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

    it('inserts a file to a server mock', function() {

        var FILE_ID = "a1i321i932iu19hiw";

        var fileMock = new Blob(["Ala ma kota"], {
                type: "text/plain"
            }
        );
        fileMock.fileId = FILE_ID;

        var executeRequest = function(arg) {
            arg({id: FILE_ID});
        };

        gapi = {};
        gapi.client = {};
        gapi.client.request = function() {
            return {
                execute: executeRequest
            };
        };

        insertFile(fileMock);


    });
});
