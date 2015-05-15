'use strict';

describe('Math Editor', function() {

    describe('Mathjax graphical representation', function() {

        beforeEach(function() {
            browser.ignoreSynchronization = true;
            browser.get('#/index');
            browser.driver.sleep(2500);
        });

        it('should have correct title', function() {
            expect(browser.getTitle()).toMatch("Web Math Editor");
        });

        it('should correctly show empty formula in input textarea', function() {
            var mathInputArea = element(by.id('mathExpression'));
            mathInputArea.clear();

            expect(element.all(by.css("#MathPreview .mrow span")).count()).toEqual(0);
        });

        it('should show correct graphical representation of a simple formula', function() {
            var mathInputArea = element(by.id('mathExpression'));
            mathInputArea.clear();

            mathInputArea.sendKeys('2*2');

            expect(mathInputArea.getAttribute('value')).toEqual("2*2");
            browser.driver.sleep(200);
            var equationNodes = element.all(by.css("#MathPreview .mrow span"));
            // number of nodes
            expect(equationNodes.count()).toEqual(3);

            // class (type) of nodes
            expect(equationNodes.get(0).getAttribute("class")).toEqual("mn");
            expect(equationNodes.get(1).getAttribute("class")).toEqual("mo");
            expect(equationNodes.get(2).getAttribute("class")).toEqual("mn");

            // contents of nodes
            expect(equationNodes.get(0).getText()).toEqual("2");
            expect(equationNodes.get(1).getText()).toEqual("∗");
            expect(equationNodes.get(2).getText()).toEqual("2");
        });

        it('should correctly evaluate simple formulas', function() {
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

        it('should update text area after clicking on element in graphical toolbar', function() {
            var mathInputArea = element(by.id('mathExpression'));
            mathInputArea.clear();

            element(by.id("dropdownTrigonometry")).click();

            element.all(by.css("#trigonometry button")).get(1).click();
            browser.driver.sleep(300);
            expect(mathInputArea.getAttribute('value')).toEqual("\\cos(x)");

            var equationNodes = element.all(by.css("#MathBuffer .mrow span"));
            // number of nodes
            expect(equationNodes.count()).toEqual(5);

            // class (type) of nodes
            expect(equationNodes.get(0).getAttribute("class")).toEqual("mi");
            expect(equationNodes.get(1).getAttribute("class")).toEqual("mo");
            expect(equationNodes.get(2).getAttribute("class")).toEqual("mo");
            expect(equationNodes.get(3).getAttribute("class")).toEqual("mi");
            expect(equationNodes.get(4).getAttribute("class")).toEqual("mo");
        });

    });
});