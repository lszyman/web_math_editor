var Preview = {
    delay: 150,        // delay after keystroke before updating
    preview: null,     // filled in by Init below
    buffer: null,      // filled in by Init below
    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing
    oldText: null,     // used to check if an update is needed
    //
    //  Get the preview and buffer DIV's
    //
    Init: function () {
        this.preview = document.getElementById("MathPreview");
        this.buffer = document.getElementById("MathBuffer");
    },
    //
    //  Switch the buffer and preview, and display the right one.
    //  (We use visibility:hidden rather than display:none since
    //  the results of running MathJax are more accurate that way.)
    //
    SwapBuffers: function () {
        var buffer = this.preview, preview = this.buffer;
        this.buffer = buffer; this.preview = preview;
        buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
        preview.style.position = ""; preview.style.visibility = "";
    },
    //
    //  This gets called when a key is pressed in the textarea.
    //  We check if there is already a pending update and clear it if so.
    //  Then set up an update to occur after a small delay (so if more keys
    //    are pressed, the update won't occur until after there has been
    //    a pause in the typing).
    //  The callback function is set up below, after the Preview object is set up.
    //
    Update: function () {
        if (this.timeout) {clearTimeout(this.timeout)}
        this.timeout = setTimeout(this.callback,this.delay);
    },
    //
    //  Creates the preview and runs MathJax on it.
    //  If MathJax is already trying to render the code, return
    //  If the text hasn't changed, return
    //  Otherwise, indicate that MathJax is running, and start the
    //    typesetting.  After it is done, call PreviewDone.
    //
    CreatePreview: function () {
        Preview.timeout = null;
        if (this.mjRunning) return;

        if($("#checkBoxEvaluateExpression").prop('checked')) {
            var text = "$$" + document.getElementById("MathResultPreview").value + "$$";
        } else {
            var text = "$$" + document.getElementById("mathExpression").value + "$$";
        }

        if (text === this.oldtext) return;
        this.buffer.innerHTML = this.oldtext = text;
        this.mjRunning = true;
        MathJax.Hub.Queue(
            ["Typeset",MathJax.Hub,this.buffer],
            ["PreviewDone",this]
        );
    },
    //
    //  Indicate that MathJax is no longer running,
    //  and swap the buffers to show the results.
    //
    PreviewDone: function () {
        this.mjRunning = false;
        this.SwapBuffers();
    }
};

function setLatexValue(latexExpression) {
    $(document).ready(function(){
        var latexTextArea = $('#mathExpression');
        if (selectedExpression != '') {
            latexTextArea.val(latexTextArea.val().replace(selectedExpression, latexExpression));
            selectedElements = [];
            selectedExpression = '';
        } else {
            var cursorPos = latexTextArea.prop('selectionStart');
            var latexTextVal = latexTextArea.val();
            latexTextArea.val(latexTextVal.substring(0, cursorPos) + latexExpression + latexTextVal.substring(cursorPos));
        }
            
        updateEvaluatedExpression(latexTextArea);
    });
}

function updateImageExpression() {
    $('#mathExpression').livequery(function () {
        Preview.Update();
    });
}

function updateEvaluatedExpression(latexTextArea) {
    var latexResultTextArea = $('#MathResultPreview');
    var latexResultTextVal = evaluateLatexExpression(latexTextArea.val());
    latexResultTextArea.val(latexResultTextVal);
}

function setLatexExpression(latexVal) {
    setLatexValue(latexVal);
    updateImageExpression();
}

function onInputLatexExpr() {
    var latexTextArea = $('#mathExpression');
    updateEvaluatedExpression(latexTextArea);
    updateImageExpression();
}

function evaluateLatexExpression(latexExpr) {
    var parser = math.parser();
    var result = latexExpr;
    if(latexExpr != null) {
        beforeResult = "";
        while (beforeResult != result) {
            beforeResult = result;
            result = removeParenthesis(result, parser);
            result = evaluateOneTypeExpr(result, /\s*(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)\s*/, "^", /\s*\\sqrt\s*\{\s*(\d+(\.\d+)?)\s*}\s*/, "sqrt", parser);
            if(beforeResult != result) {continue;}
            result = evaluateOneTypeExpr(result, /\s*(\d+(\.\d+)?)\s*\*\s*(\d+(\.\d+)?)\s*/, "*", /\s*\\frac\s*\{\s*(\d+(\.\d+)?)\s*}\s*\{\s*(\d+(\.\d+)?)\s*}\s*/, "/", parser);
            if(beforeResult != result) {continue;}
            result = evaluateOneTypeExpr(result, /\s*\{\s*(\d+(\.\d+)?)\s*\\over\s*(\d+(\.\d+)?)\s*}\s*/, "/", /\s*\{\s*(\d+(\.\d+)?)\s*\\over\s*(\d+(\.\d+)?)\s*}\s*/, "/", parser);
            if(beforeResult != result) {continue;}
            result = evaluateOneTypeExpr(result, /([^a-z-\+\^])\s*(\d+(\.\d+)?)\s*\+\s*(\d+(\.\d+)?)\s*([^a-z\^\*]|$)/i, "+", /([^a-z-\+\^])\s*(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)\s*([^a-z\^\*]|$)/i, "-", parser);
        }
    } else {
        return "0";
    }

    return result;
}

function evaluateOneTypeExpr(input, regex1, operation1, regex2, operation2, parser) {
    var match;
    var operation;
    var regex;
    var index1 = input.search(regex1);
    var index2 = input.search(regex2);
    while (index1 >= 0 || index2 >=0) {
        if (index1 == -1 || (index2 != -1 && index2 < index1)) {
            operation = operation2;
            regex = regex2;
        } else if(index2 == -1 || (index1 != -1 && index1 <= index2)) {
            operation = operation1;
            regex = regex1;
        }

        match = regex.exec(input);

        if (operation == "sqrt") {
            input = input.replace(regex, parser.eval(operation + "(" + match[1] + ")"));
        } else if (operation == "()") {
            input = input.replace(regex, parser.eval(match[1]));
        } else if (operation == "+" || operation == "-") {
            input = input.replace(regex, match[1] + parser.eval(match[2] + operation + match[4]) + match[6]);
        } else {
            input = input.replace(regex, parser.eval(match[1] + operation + match[3]));
        }

        index1 = input.search(regex1);
        index2 = input.search(regex2);
    }
    return input;
}

function removeParenthesis(input, parser) {
    var match;
    var regex = /\s*\(\s*(\d+(\.\d+)?)\s*\)\s*/;
    while (match = regex.exec(input)) {
        input = input.replace(regex, parser.eval(match[1]));
    }
    return input;
}