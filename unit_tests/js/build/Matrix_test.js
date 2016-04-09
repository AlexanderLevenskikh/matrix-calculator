(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    var row = document.createElement('tr'),
        i = this.columnsNumber;
    this.table.appendChild(row);
    this.linesNumber++;

    while (i--) {
        this.addCellToRow(row);
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
        this.addCellToRow(lines[i]);
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
},{}],2:[function(require,module,exports){
var Matrix = require('../../js/Matrix.js');

try {
    var firstMatrix = new Matrix({
            'linesNumber': 2,
            'columnsNumber': 2
        }),
        secondMatrix = new Matrix({
            'cellPreprocessing': function () {
                this.setAttribute('placeholder', 'test');
            }
        });
} catch(e) {
    console.error(e.msg);
}


QUnit.test('Matrix constructor', function(assert) {
    assert.equal(firstMatrix.linesNumber, 2, 'Number of lines correctly sets in args.');
    assert.equal(firstMatrix.columnsNumber, 2, 'Number of columns correctly sets in args.');
    assert.equal(firstMatrix.cellPreprocessing, false, 'Cell pre-processing function is false.');
});

QUnit.test('Matrix constructor and Matrix.initBrowserTable method', function(assert) {
    assert.equal(secondMatrix.linesNumber, 2, 'Number of lines sets by default.');
    assert.equal(secondMatrix.columnsNumber, 2, 'Number of columns sets by default.');
    assert.equal(typeof secondMatrix.cellPreprocessing, 'function', 'Cell pre-processing function sets in args.');
    var cell = secondMatrix.table.childNodes[0].childNodes[0];
    assert.equal(cell.firstChild.getAttribute('placeholder'), 'test', 'pre-processing function.')
});

QUnit.test('Matrix.forEach method', function(assert) {
    var cell = firstMatrix.table.childNodes[0].childNodes[1],
        callback = function(lineNumber, columnNumber) {
            this.setAttribute('placeholder', 'test' + lineNumber + columnNumber);
        };

    try {
        firstMatrix.forEach(callback);
    } catch (e) {
        console.error(e.msg);
    }

    assert.equal(cell.firstChild.getAttribute('placeholder'), 'test01', 'forEach method.');
});

QUnit.test('Matrix.setValue method', function(assert) {
    var cell = firstMatrix.table.childNodes[0].childNodes[0],
        field = cell.firstChild;
    try {
        firstMatrix.setValue(0, 0, 'testValue');
    } catch(e) {
        console.error(e.msg);
    }

    assert.equal(field.value, 'testValue', 'setValue method.');
});

QUnit.test('Matrix.getValue method', function(assert) {
    var cell = firstMatrix.table.childNodes[0].childNodes[0],
        field = cell.firstChild,
        value;
    try {
        value = firstMatrix.getValue(0, 0);
    } catch(e) {
        console.error(e.msg);
    }

    assert.equal(value, field.value, 'getValue method.')
});

QUnit.test('Matrix.appendTo method. Append to randomize div block', function(assert) {
    var block = document.createElement('div');
    firstMatrix.appendTo(block);
    assert.equal(block, firstMatrix.table.parentNode, 'appendTo method.');
});

var storedTable = secondMatrix.table;

QUnit.test('Matrix.addLine method.', function(assert) {
    secondMatrix.addLine();
    var element = secondMatrix.table.childNodes[2];

    assert.equal(typeof element, 'object', 'Whether added element the object?');
    assert.equal(element.nodeType, 1, 'Whether added element the ElementNode?');
    assert.equal(secondMatrix.linesNumber, 3, 'Was counter increased?');
    assert.equal(secondMatrix.table.childNodes.length, 3, 'Does it have 3 lines?');
    assert.equal(element.childNodes.length, 2, 'Does the line have 2 cells?');
    var inputField = element.firstChild.firstChild;
    assert.equal(inputField.getAttribute('placeholder'), 'test', 'Was the cell pre-processing applied?')
});

QUnit.test('Matrix.deleteLine method.', function(assert) {
    secondMatrix.deleteLine();

    assert.equal(secondMatrix.linesNumber, 2, 'Was counter decreased?');
    assert.equal(secondMatrix.table.childNodes.length, 2, 'Does it have 2 lines?');
    assert.equal(secondMatrix.table.innerHTML, storedTable.innerHTML, 'Are table inner HTML and stored table inner HTML equal?')
});

QUnit.test('Matrix.addColumn method.', function(assert) {
    secondMatrix.addColumn();

    assert.equal(secondMatrix.columnsNumber, 3, 'Was counter increased?');
    assert.equal(secondMatrix.table.firstChild.childNodes.length, 3, 'Does the first line have 3 columns?');
    assert.equal(secondMatrix.table.childNodes[1].childNodes.length, 3, 'Does the second line have 3 columns?');
    assert.equal(secondMatrix.table.firstChild.childNodes[2].nodeType, 1, 'Does the first added cell ElementNode type?');
    assert.equal(secondMatrix.table.childNodes[1].childNodes[2].nodeType, 1, 'Does the second added cell ElementNode type?');
    assert.equal(secondMatrix.table.firstChild.childNodes[2].childNodes[0].tagName.toLowerCase(), "input", 'Does the first added cell contains input field?');
    assert.equal(secondMatrix.table.childNodes[1].childNodes[2].childNodes[0].tagName.toLowerCase(), "input", 'Does the second added cell contains input field?');
});

QUnit.test('Matrix.deleteColumn method.', function(assert) {
    try {
        secondMatrix.deleteColumn();
    } catch(e) {
        console.error(e.msg)
    }

    assert.equal(secondMatrix.columnsNumber, 2, 'Was counter decreased?');
    assert.equal(secondMatrix.table.firstChild.childNodes.length, 2, 'Does the first line have 2 columns?');
    assert.equal(secondMatrix.table.childNodes[1].childNodes.length, 2, 'Does the second line have 2 columns?');
    assert.equal(secondMatrix.table.innerHTML, storedTable.innerHTML, 'Are table inner HTML and stored table inner HTML equal?')
});

/**
  [[1, 0], [1, 1]] * [[1, 1], [0, 1]] = [[1, 1], [1, 2]]
 */

QUnit.test('Matrix.multiply method.', function(assert) {
    try {
        var thirdMatrix = new Matrix({
            'linesNumber': 2,
            'columnsNumber': 2
        });

        /**
         sorry, I haven't API to assign values in matrix cells.
         */

        firstMatrix.table.childNodes[0].childNodes[0].firstChild.value = 1;
        firstMatrix.table.childNodes[0].childNodes[1].firstChild.value = 0;
        firstMatrix.table.childNodes[1].childNodes[0].firstChild.value = 1;
        firstMatrix.table.childNodes[1].childNodes[1].firstChild.value = 1;

        secondMatrix.table.childNodes[0].childNodes[0].firstChild.value = 1;
        secondMatrix.table.childNodes[0].childNodes[1].firstChild.value = 1;
        secondMatrix.table.childNodes[1].childNodes[0].firstChild.value = 0;
        secondMatrix.table.childNodes[1].childNodes[1].firstChild.value = 1;

        firstMatrix.multiply(secondMatrix, thirdMatrix);
    } catch(e) {
        console.error(e.msg);
    }

    var checking = function(matrix) {
        if (matrix.table.childNodes[0].childNodes[0].firstChild.value != 1)
            return false;
        if (matrix.table.childNodes[0].childNodes[1].firstChild.value != 1)
            return false;
        if (matrix.table.childNodes[1].childNodes[0].firstChild.value != 1)
            return false;
        if (matrix.table.childNodes[1].childNodes[1].firstChild.value != 2)
            return false;
        return true;
    };

    assert.ok(checking(thirdMatrix), 'Matrix multiplication works correctly');
});

},{"../../js/Matrix.js":1}]},{},[2]);
