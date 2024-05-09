(function () {

    const MAX_LEN = 13;

    const MAX_PRECISION = 10;

    let justOp = null;

    function backspaceEntry() {
        let entry = document.querySelector(".entry");
        entry.textContent = entry.textContent.slice(0, -1);
        if (entry.textContent === "") {
            entry.textContent = "0";
        }
    }

    function clearEntry() {
        document.querySelector(".entry").textContent = "0";
    }

    function clearExpression() {
        document.querySelector(".expression").textContent = "";
    }

    function clearAll() {
        clearEntry();
        clearExpression();
        justOp = null;
    }

    function determineEntry(entry, num) {
        if (entry === "0") {
            if (num === ".") {
                return "0.";
            }
            return num;
        }
        if (num === "." && entry.includes(".")) {
            return entry;
        }
        if (entry.length < MAX_LEN) {
            return entry + num;
        }
        return entry;
    }

    function handleNumClick() {
        let entry = document.querySelector(".entry");
        if (justOp !== null) {
            entry.textContent = "0";
        }
        entry.textContent = determineEntry(entry.textContent, this.textContent);
        justOp = null;
    }

    function operate(operator, num1, num2) {
        switch (operator) {
            case "+":
                return num1 + num2;
            case "-":
                return num1 - num2;
            case "×":
                return num1 * num2;
            case "÷":
                return num1 / num2;
            default:
                return num2;
        }
    }

    function limitedResult(result) {
        let formatted = result.toPrecision(MAX_LEN);
        if (/e/i.test(formatted)) {
            formatted = result.toPrecision(MAX_PRECISION);
            let parts = formatted.split('e');
            let base = parseFloat(parts[0]).toString();
            formatted = `${base}e${parts[1]}`;
        } else {
            formatted = formatted.replace(/\.?0+$/, "");
        }
        return formatted;
    }

    function calExpression(expression, entry) {
        if (expression === "") {
            return entry;
        }
        let operator = expression.slice(-1);
        let num1 = parseFloat(expression.slice(0, -1));
        let num2 = parseFloat(entry);
        let result = operate(operator, num1, num2);
        if (Number.isFinite(result)) {
            return limitedResult(result);
        }
        return "NaN";
    }

    function handleOpClick() {
        let entry = document.querySelector(".entry");
        let expression = document.querySelector(".expression");
        let op = this.textContent;
        if (justOp !== null && op !== "=") {
            expression.textContent = expression.textContent.slice(0, -1) + op;
        } else {
            entry.textContent = calExpression(expression.textContent, entry.textContent);
            if (entry.textContent !== "NaN") {
                expression.textContent = entry.textContent + op;
            }
        }
        justOp = op;
    }

    clearAll();
    document.querySelectorAll("button.num-key")
        .forEach(button => button.addEventListener("click", handleNumClick));
    document.querySelector("#clear").addEventListener("click", clearAll);
    document.querySelector("#clear-entry").addEventListener("click", clearEntry);
    document.querySelector("#backspace").addEventListener("click", backspaceEntry);
    document.querySelectorAll("button.op-key")
        .forEach(button => button.addEventListener("click", handleOpClick));
})();