var Calculator = require('../../js/Calculator.js');

var calculator = new Calculator();

QUnit.test('Calculator constructor', function(assert) {
    var firstMatrix_cell = calculator.A.table.firstChild.firstChild,
        thirdMatrix_cell = calculator.C.table.firstChild.firstChild;

    assert.equal(firstMatrix_cell.firstChild.getAttribute('placeholder'), 'a1,1', 'Placeholder sets correctly (callback was called)');
    assert.equal(thirdMatrix_cell.firstChild.getAttribute('disabled'), 'disabled', '"Disabled" property sets correctly (callback was called)');
    assert.equal(calculator.container.tagName.toLowerCase(), 'div', 'Container is block (div)');
});

QUnit.test('Calculator.appendTo', function(assert){
    var block = document.createElement('div');
    calculator.appendTo(block);
    assert.equal(calculator.container.parentNode, block, 'appendTo method.');
});

QUnit.test('Calculator.swapTheFactors', function(assert) {
    calculator.swapTheFactors();
    assert.equal(calculator.container.childNodes[0].childNodes.length, 1, "Matrix C wasn't moved");
    assert.equal(calculator.container.childNodes[1].lastChild.innerHTML, 'B', 'Matrix B was moved');
    assert.equal(calculator.container.childNodes[2].lastChild.innerHTML, 'A', 'Matrix A was moved');
})