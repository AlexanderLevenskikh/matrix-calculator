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
            this.addCellToRow(row);
        }
    }
};

/**
 * Adds one cell to end of the row
 * @param row {HTMLElement} Current row
 */

Matrix.prototype.addCellToRow = function(row) {
    var cell = document.createElement('td'),
        inputField = document.createElement('input');
    row.appendChild(cell);
    cell.appendChild(inputField);
    inputField.setAttribute('type', "text");
    if (this.cellPreprocessing) {
        this.cellPreprocessing.call(inputField);
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
 * @param {HTMLElement} container
 */

Matrix.prototype.appendTo = function(container) {
    if (container !== null && typeof container == "object" && container.nodeType) {
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
 * @param matrix {Matrix} Factor
 * @param result {Matrix} Result matrix
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