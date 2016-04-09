var Matrix = require("./Matrix.js");

/**
 * Calculator class
 * @constructor
 */

var Calculator = function() {
    this.A = new Matrix({'linesNumber': 2, 'columnsNumber' : 2, 'cellPreprocessing' : firstCallback});
    this.B = new Matrix({'linesNumber': 2, 'columnsNumber' : 2, 'cellPreprocessing' : secondCallback});
    this.C = new Matrix({'linesNumber': 2, 'columnsNumber' : 2, 'cellPreprocessing' : thirdCallback});
    this.container = createContainer([this.C, this.A, this.B]);
};

/**
 *
 * @param {Element} element Block, that will contain matrices container.
 */

Calculator.prototype.appendTo = function(element) {
    if (element !== null && typeof element == "object" && element.nodeType == 1) {
        element.appendChild(this.container);
    }
    else {
        return new Error("appendTo: parameter is not a DOM element");
    }
};

/**
 * Swaps the first and second matrices.
 */

Calculator.prototype.swapTheFactors = function() {
    this.container.insertBefore(this.container.removeChild(this.container.lastChild), this.container.lastChild);
};

/**
 * Multiplies the first and second matrices and puts result in third matrix.
 */

Calculator.prototype.multiply = function() {
    try {
        this.A.multiply(this.B, this.C);
    } catch(e) {
        console.error(e);
    }
};

/**
 * iterates all cells from all matrices.
 * @param {function} callback Acts to matrix cells
 */

Calculator.prototype.forEachCells = function(callback) {
    this.A.forEach(callback);
    this.B.forEach(callback);
    this.C.forEach(callback);
};

/**
 * Adds an empty line to first and result matrix. Considering the matrix multiplication rule.
 */

Calculator.prototype.addLine_in_A = function() {
    this.A.addLine();
    this.C.addLine();
};

/**
 * Adds an empty column to first matrix and changes the state (put/delete warning msg, e.g.)
 * @param {function} callback
 */

Calculator.prototype.addColumn_in_A = function(callback) {
    this.A.addColumn();
    if (typeof(callback) == 'function') changeState.call(this, callback);
};

/**
 * Deletes line from first and third matrix. If A and C are not contain a rows - catch the exception from Matrix class method.
 */

Calculator.prototype.deleteLine_from_A = function() {
    try {
        this.A.deleteLine();
        this.C.deleteLine();
    } catch(e) {
        console.error(e);
    }
};

/**
 * Deletes column from first matrix and changes the state.
 * @param {function} callback
 */

Calculator.prototype.deleteColumn_from_A = function(callback) {
    try {
        this.A.deleteColumn();
        if (typeof(callback) == 'function') changeState.call(this, callback);
    } catch(e) {
        console.error(e);
    }
};

/**
 * Adds an empty line to second matrix and changes the state.
 */

Calculator.prototype.addLine_in_B = function(f) {
    this.B.addLine();
    if (typeof(f) == 'function') changeState.call(this, f);
};

/**
 * Adds an empty column to second matrix.
 */

Calculator.prototype.addColumn_in_B = function() {
    this.B.addColumn();
    this.C.addColumn();
};

/**
 * Deletes line from second matrix and changes the state.
 */

Calculator.prototype.deleteLine_from_B = function(f) {
    try {
        this.B.deleteLine();
        if (typeof(f) == 'function') changeState.call(this, f);
    } catch(e) {
        console.error(e);
    }
};

/**
 * Deletes an empty column from second matrix.
 */

Calculator.prototype.deleteColumn_from_B = function() {
    try {
        this.B.deleteColumn();
        this.C.deleteColumn();
    } catch(e) {
        console.error(e);
    }
};

/*
    Private functions. They aren't included in API and therefore they aren't documented by JSDoc.
 */

function createContainer(matrices) {
    var container = document.createElement("div");
    for (var i = 1; i <= 3; i++) {
        var matrixContainer = document.createElement("div");
        matrixContainer.setAttribute("class", "matrix-container");
        matrices[i-1].appendTo(matrixContainer);
        matrixContainer.id = "matrixContainer" + i;
        container.appendChild(matrixContainer);
        if (i == 2) {
            var A_letter = document.createElement("div");
            A_letter.innerHTML = "A";
            A_letter.setAttribute("class", "letter letter-1");
            matrixContainer.appendChild(A_letter);
        }
        if (i == 3) {
            var B_letter = document.createElement("div");
            B_letter.innerHTML = "B";
            B_letter.setAttribute("class", "letter letter-2");
            matrixContainer.appendChild(B_letter);
        }
    }
    return container;
}

function firstCallback(row, column) {
    this.placeholder = 'a' + ++row + ',' + ++column;
    callback_commonPart.call(this);
}

function secondCallback(row, column) {
    this.placeholder = 'b' + ++row + ',' + ++column;
    callback_commonPart.call(this);
}

function thirdCallback(row, column) {
    this.placeholder = 'c' + ++row + ',' + ++column;
    this.setAttribute("disabled", "disabled");
    callback_commonPart.call(this);
}

function callback_commonPart() {
    this.addEventListener("focus", function() {
        var element = document.querySelector(".left-column");
        if (element.style.backgroundColor != "rgb(246, 193, 192)") {
            element.style.backgroundColor = "#5199db";
        }
    });
    this.addEventListener("blur", function() {
        var element = document.querySelector(".left-column");
        if (element.style.backgroundColor != "rgb(246, 193, 192)") {
            element.style.backgroundColor = "#bcbcbc";
        }
    });
}

function changeState(f) {
    if (typeof f == 'function') {
        var isItPossibleToMultiply = (this.A.columnsNumber == this.B.linesNumber) ? 1 : 0;
        f(isItPossibleToMultiply);
    }
}

module.exports = Calculator;