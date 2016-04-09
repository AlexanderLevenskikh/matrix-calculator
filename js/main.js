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
