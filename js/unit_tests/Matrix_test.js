var Matrix = require('../Matrix.js');

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
