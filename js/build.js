(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./Matrix.js":2}],2:[function(require,module,exports){
/**
 * Creates the Matrix instance.
 *
 * @param {Object} matrixProperties Matrix properties
 * @param {string} matrixProperties.linesNumber Number of the matrix lines
 * @param {string} matrixProperties.columnsNumber Number of the matrix columns
 * @param {function} [matrixProperties.cellPreprocessing] Pre-processing function for each matrix cell
 * @this {Matrix}
 * @constructor
 */

var Matrix = function (matrixProperties) {
    if (typeof matrixProperties == 'undefined') {
        return new Error("matrixProperties object is undefined");
    }

    this.linesNumber = matrixProperties.linesNumber || 2;
    this.columnsNumber = matrixProperties.columnsNumber || 2;

    if (typeof matrixProperties.cellPreprocessing == 'function') {
        this.cellPreprocessing = matrixProperties.cellPreprocessing;
    } else {
        this.cellPreprocessing = false;
    }
    this.initBrowserTable();
};

/**
 * Method initializes the DOM table with text fields in table cells. Applies the callback to the cell fields
 */

Matrix.prototype.initBrowserTable = function() {
    this.table = document.createElement('table');
    for (var rowIndex = 0; rowIndex < this.linesNumber; rowIndex++) {
        var row = document.createElement('tr');
        this.table.appendChild(row);
        for (var columnIndex = 0; columnIndex < this.columnsNumber; columnIndex++) {
            this.addCellToRow(row, rowIndex, columnIndex);
        }
    }
};

/**
 * Adds one cell to end of the row
 * @param row {Element} Current row
 */

Matrix.prototype.addCellToRow = function(row, rowIndex, columnIndex) {
    var cell = document.createElement('td'),
        inputField = document.createElement('input');
    row.appendChild(cell);
    cell.appendChild(inputField);
    inputField.setAttribute('type', "text");
    if (this.cellPreprocessing) {
        this.cellPreprocessing.call(inputField, rowIndex, columnIndex);
    }
}

/**
 * Goes through every Matrix cell and applies callback to each cell.
 *
 * @param {function} callback Processes input element of cell
 *
 */

Matrix.prototype.forEach = function(callback) {

  if (typeof callback != 'function') {
      return new Error("forEach: argument is not a function");
  }

  var lines = this.table.childNodes;
  Array.prototype.forEach.call(lines, function(currentLine, currentLineNumber) {
     var cells = currentLine.childNodes;
     Array.prototype.forEach.call(cells, function(currentCell, currentColumnNumber) {
        var inputField = currentCell.firstChild;
        callback.call(inputField, currentLineNumber, currentColumnNumber);
     });
  });
};

/**
 * Gets the value from (line, column)
 * @param {Number} line
 * @param {Number} column
 * @returns {*} value
 */

Matrix.prototype.getValue = function(line, column) {
    if (line >= 0 && line < this.linesNumber && column >= 0 && column < this.columnsNumber) {
        var cell = this.table.childNodes[line].childNodes[column];
        return cell.firstChild.value;
    } else {
        return new Error("getValue: cell with coordinates (" + line + "," + column + ") doesn't exist")
    }
};

/**
 * Sets the value to (line, column)
 * @param {Number} line
 * @param {Number} column
 * @param {*} value
 */

Matrix.prototype.setValue = function(line, column, value) {
    if (line >= 0 && line < this.linesNumber && column >= 0 && column < this.columnsNumber) {
        var cell = this.table.childNodes[line].childNodes[column];
        cell.firstChild.value = value;
    } else {
        return new Error("setValue: cell with coordinates (" + line + "," + column + ") doesn't exist")
    }
};

/**
 * Append matrix table to some DOM container
 * @param {Element} container
 */

Matrix.prototype.appendTo = function(container) {
    if (container !== null && typeof container == "object" && container.nodeType == 1) {
        container.appendChild(this.table);
    }
    else {
        return new Error("appendTo: container is not a DOM element");
    }
};

/**
 * adds one line to matrix
 * @returns {this}
 */

Matrix.prototype.addLine = function() {
    var row = document.createElement('tr');

    this.table.appendChild(row);
    this.linesNumber++;

    for (var i = 0; i < this.columnsNumber; i++) {
        this.addCellToRow(row, this.linesNumber-1, i);
    }

    return this;
};

/**
 * adds one column to matrix
 * @returns {this}
 */

Matrix.prototype.addColumn = function() {
    var lines = this.table.childNodes;
    this.columnsNumber++;

    for (var i = 0; i < this.linesNumber; i++) {
        this.addCellToRow(lines[i], i, this.columnsNumber-1);
    }

    return this;
};

/**
 * Deletes one line from matrix
 * @returns {this}
 */

Matrix.prototype.deleteLine = function() {
    if (this.linesNumber < 2) {
        return new Error("deleteLine: you can't delete the last line");
    }

    this.table.removeChild(this.table.lastChild);

    this.linesNumber--;

    return this;
};

/**
 * Deletes one column from matrix
 * @returns {this}
 */

Matrix.prototype.deleteColumn = function() {
    if (this.columnsNumber < 2) {
        return new Error("deleteColumn: you can't delete the last column");
    }

    var lines = this.table.childNodes;
    this.columnsNumber--;

    for (var i = 0; i < this.linesNumber; i++) {
        lines[i].removeChild(lines[i].lastChild);
    }

    return this;
};

/**
 * Multiplies by matrix and puts the result to 'result' argument
 * @param {Matrix} matrix  Factor
 * @param {Matrix} result  Result matrix
 * @returns {this}
 */

Matrix.prototype.multiply = function(matrix, result) {
    if (this.columnsNumber != matrix.linesNumber)
        return new Error("multiply: vector length in first matrix isn't equal to vector length in second matrix");

    var linesNumber = this.linesNumber,
        columnsNumber = matrix.columnsNumber,
        vectorLength = this.columnsNumber;
    for (var i = 0; i < linesNumber; i++)
        for (var j = 0; j < columnsNumber; j++) {
            var currentValue = 0;
            for (var k = 0; k < vectorLength; k++) {
                currentValue += this.getValue(i, k) * matrix.getValue(k, j);
            }
            result.setValue(i, j, currentValue);
        }
    return this;
};

module.exports = Matrix;
},{}],3:[function(require,module,exports){
var Calculator = require("./Calculator.js"),
    calc = new Calculator();

calc.appendTo(document.getElementById("right-column"));

var swapButton = document.getElementById("swap");
swapButton.addEventListener("click", function() {
    calc.swapTheFactors();
    var letterElement1 = document.querySelector(".letter-1");
    document.querySelector(".letter-2").className = "letter letter-1";
    letterElement1.className = "letter letter-2";
});

var multiplyButton = document.getElementById("multiply");
multiplyButton.addEventListener("click", function() {
    calc.multiply();
});

var cleanButton = document.getElementById("clean");
cleanButton.addEventListener("click", function() {
    calc.forEachCells(function() {this.value = "";});
});

var radioButton_A = document.getElementById("matrixA-radio");
var radioButton_B = document.getElementById("matrixB-radio");

var addLineButton = document.getElementById("add-line");
addLineButton.addEventListener("click", function() {
    if (radioButton_A.checked)
        calc.addLine_in_A();
    else if(radioButton_B.checked)
        calc.addLine_in_B(f);
});

var deleteLineButton = document.getElementById("delete-line");
deleteLineButton.addEventListener("click", function() {
    if (radioButton_A.checked)
        calc.deleteLine_from_A();
    else if(radioButton_B.checked)
        calc.deleteLine_from_B(f);
});

var addColumnButton = document.getElementById("add-column");
addColumnButton.addEventListener("click", function() {
    if (radioButton_A.checked)
        calc.addColumn_in_A(f);
    else if(radioButton_B.checked)
        calc.addColumn_in_B();
});

var deleteColumnButton = document.getElementById("delete-column");
deleteColumnButton.addEventListener("click", function() {
    if (radioButton_A.checked)
        calc.deleteColumn_from_A(f);
    else if(radioButton_B.checked)
        calc.deleteColumn_from_B();
});


function f(isItPossibleToMultiply) {
    var leftPanel = document.querySelector(".left-column"),
        messageBlock = document.querySelector(".error-message");

    if (isItPossibleToMultiply) {
        leftPanel.style.backgroundColor = "#bcbcbc";
        messageBlock.innerHTML = "";
    } else {
        leftPanel.style.backgroundColor = "#f6c1c0";
        messageBlock.innerHTML = "Такие матрицы нельзя перемножить, так как количество столбцов" +
            " матрицы А не равно количеству строк матрицы В.";
    }
}

},{"./Calculator.js":1}]},{},[3]);
