'use strict';

describe('Math Editor', function() {

    describe('Mathjax graphical representation', function() {

        beforeEach(function() {
            browser.ignoreSynchronization = true;
            browser.get('#/index');
        });

        it('should have correct title', function() {
            expect(browser.getTitle()).toMatch("Web Math Editor");
        });

        it('should correctly show formula in input textarea', function() {
            browser.driver.sleep(2500);
            var mathInputArea = element(by.id('mathExpression'));
            mathInputArea.clear();

            expect(element.all(by.css("#MathPreview .mrow span")).count()).toEqual(0);

            mathInputArea.sendKeys('2*2');

            expect(mathInputArea.getAttribute('value')).toEqual("2*2");


        });

        it('should correctly evaluate simple formulas', function() {
            browser.driver.sleep(2500);
            var inputToEvalutedFormula = [
                ["7", "7"],
                ["2^3*2", "16"],
                ["2+2*2", "6"],
                ["2*\\sqrt{9}*2^2", "24"],
                ["\\sqrt{7-\\sqrt{9}}^2", "4"],
                ["\\sqrt{2a+\\sqrt{9-5} ^ 2}", "\\sqrt{2a+4}"]
            ];

            var mathInputTextArea = element(by.id('mathExpression'));
            var mathEvaluatedTextArea = element(by.id('MathResultPreview'));
            for (var i = 0; i < inputToEvalutedFormula.length; i++) {
                browser.driver.sleep(200);

                mathInputTextArea.clear();
                mathInputTextArea.sendKeys(inputToEvalutedFormula[i][0]);
                expect(mathEvaluatedTextArea.getAttribute('value')).toEqual(inputToEvalutedFormula[i][1]);
            }
        });

        it('should not evaluate complicated formulas', function() {
            browser.driver.sleep(2500);
            var inputToEvalutedFormula = [
                "2a+2a",
                "7a+2b",
                "\\sqrt{2a+3b}"
            ];

            var mathInputTextArea = element(by.id('mathExpression'));
            var mathEvaluatedTextArea = element(by.id('MathResultPreview'));
            for (var i = 0; i < inputToEvalutedFormula.length; i++) {
                browser.driver.sleep(200);

                mathInputTextArea.clear();
                mathInputTextArea.sendKeys(inputToEvalutedFormula[i]);
                expect(mathEvaluatedTextArea.getAttribute('value')).toEqual(inputToEvalutedFormula[i]);
                // should remain unchanged
            }
        });



    });
});