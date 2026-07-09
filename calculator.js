function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function inputFormula() {
    return prompt("계산식을 입력하세요. 예: 1 + 2 * 3 - 4 / 2");
}

function isOperator(token) {
    return token === "+" || token === "-" || token === "*" || token === "/";
}

function tokenize(formula) {
    const tokens = [];
    let i = 0;

    while (i < formula.length) {
        const current = formula[i];

        if (/\s/.test(current)) {
            i++;
            continue;
        }

        const isSignedNumber =
            (current === "+" || current === "-") &&
            (tokens.length === 0 || isOperator(tokens[tokens.length - 1]));

        if (/\d|\./.test(current) || isSignedNumber) {
            let numberText = "";
            let dotCount = 0;

            if (isSignedNumber) {
                numberText += current;
                i++;

                while (i < formula.length && /\s/.test(formula[i])) {
                    i++;
                }
            }

            while (i < formula.length && /[\d.]/.test(formula[i])) {
                if (formula[i] === ".") {
                    dotCount++;
                }

                if (dotCount > 1) {
                    return "잘못된 숫자가 입력되었습니다.";
                }

                numberText += formula[i];
                i++;
            }

            const number = Number(numberText);
            if (numberText === "+" || numberText === "-" || Number.isNaN(number)) {
                return "잘못된 숫자가 입력되었습니다.";
            }

            tokens.push(number);
            continue;
        }

        if (isOperator(current)) {
            if (tokens.length === 0 || isOperator(tokens[tokens.length - 1])) {
                return "잘못된 계산식이 입력되었습니다.";
            }

            tokens.push(current);
            i++;
            continue;
        }

        return `사용할 수 없는 문자가 포함되어 있습니다: ${current}`;
    }

    if (tokens.length === 0 || isOperator(tokens[tokens.length - 1])) {
        return "잘못된 계산식이 입력되었습니다.";
    }

    return tokens;
}

function calculate(formula) {
    if (typeof formula !== "string" || formula.trim() === "") {
        return "계산식을 입력해주세요.";
    }

    const tokens = tokenize(formula);
    if (typeof tokens === "string") {
        return tokens;
    }

    const intermediateTokens = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "*" || token === "/") {
            const left = intermediateTokens.pop();
            const right = tokens[i + 1];

            if (typeof left !== "number" || typeof right !== "number") {
                return "잘못된 계산식이 입력되었습니다.";
            }

            if (token === "/" && right === 0) {
                return "0으로 나눌 수 없습니다.";
            }

            const result = token === "*" ? multiply(left, right) : divide(left, right);
            intermediateTokens.push(result);
            i += 2;
            continue;
        }

        intermediateTokens.push(token);
        i++;
    }

    let result = intermediateTokens[0];

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = intermediateTokens[j + 1];

        if (typeof nextValue !== "number") {
            return "잘못된 계산식이 입력되었습니다.";
        }

        if (operator === "+") {
            result = add(result, nextValue);
        } else if (operator === "-") {
            result = subtract(result, nextValue);
        } else {
            return `예외 발생: ${operator}`;
        }
    }

    return result;
}

function start(formula) {
    let input = formula;

    if (input === undefined) {
        input = inputFormula();
    }

    if (input === null || String(input).trim() === "") {
        console.log("계산식을 입력해주세요.");
        return;
    }

    const result = calculate(String(input));

    if (typeof result === "string") {
        console.log(`에러 발생: ${result}`);
    } else {
        console.log(`결과: ${result}`);
    }

    return result;
}

let currentFormula = "";
let isPowerOn = true;
let isCalculated = false;

function getCalculatorElements() {
    if (typeof document === "undefined") {
        return null;
    }

    const calculator = document.querySelector(".calculator");
    const display = document.querySelector("#display");

    if (!calculator || !display) {
        return null;
    }

    return {
        calculator,
        display,
        onOffButton: document.querySelector(".on-off"),
        actionButtons: document.querySelectorAll(".calculator button:not(.on-off)"),
        buttons: document.querySelectorAll(".calculator button"),
    };
}

function setDisplay(value) {
    const elements = getCalculatorElements();

    if (elements) {
        elements.display.value = value;
    }
}

function getLastInputToken() {
    return currentFormula.trim().split(/\s+/).pop() || "";
}

function appendNumber(number) {
    if (!isPowerOn) {
        return;
    }

    const elements = getCalculatorElements();

    if (isCalculated) {
        currentFormula = "";
        isCalculated = false;
    }

    if (number === "." && getLastInputToken().includes(".")) {
        return;
    }

    if (currentFormula !== "" && isOperator(getLastInputToken())) {
        currentFormula += " ";
    }

    if (number === "." && (currentFormula === "" || isOperator(getLastInputToken()))) {
        currentFormula += "0";
    }

    currentFormula += number;
    setDisplay(currentFormula || "0");

    if (elements && (elements.display.value === "Error" || elements.display.value === "DivBy0")) {
        elements.display.value = currentFormula;
    }
}

function appendOperator(operator) {
    if (!isPowerOn) {
        return;
    }

    if (isCalculated) {
        isCalculated = false;
    }

    if (currentFormula === "") {
        currentFormula = "0";
    }

    const tokens = currentFormula.trim().split(/\s+/);
    const lastToken = tokens[tokens.length - 1];

    if (isOperator(lastToken)) {
        tokens[tokens.length - 1] = operator;
        currentFormula = tokens.join(" ");
    } else {
        currentFormula = `${currentFormula.trim()} ${operator}`;
    }

    setDisplay(`${currentFormula} `);
}

function clearDisplay() {
    if (!isPowerOn) {
        return;
    }

    currentFormula = "";
    isCalculated = false;
    setDisplay("0");
}

function togglePower() {
    const elements = getCalculatorElements();

    if (!elements) {
        return;
    }

    isPowerOn = !isPowerOn;
    currentFormula = "";
    isCalculated = false;

    if (isPowerOn) {
        elements.display.value = "0";
        elements.display.style.backgroundColor = "#222";
        elements.onOffButton.classList.add("on");
        elements.actionButtons.forEach((button) => {
            button.disabled = false;
        });
    } else {
        elements.display.value = "";
        elements.display.style.backgroundColor = "#111";
        elements.onOffButton.classList.remove("on");
        elements.actionButtons.forEach((button) => {
            button.disabled = true;
        });
    }
}

function normalizeFormulaForCalculation() {
    const tokens = currentFormula.trim().split(/\s+/);

    if (isOperator(tokens[tokens.length - 1])) {
        tokens.pop();
    }

    return tokens.join(" ");
}

function performCalculate() {
    if (!isPowerOn || currentFormula.trim() === "") {
        return;
    }

    const result = calculate(normalizeFormulaForCalculation());
    isCalculated = true;

    if (typeof result === "string") {
        setDisplay(result === "0으로 나눌 수 없습니다." ? "DivBy0" : "Error");
        currentFormula = "";
        return;
    }

    currentFormula = String(result);
    setDisplay(currentFormula);
}

function handleCalculatorClick(event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const { type, value } = button.dataset;

    if (type === "power") {
        togglePower();
    } else if (type === "clear") {
        clearDisplay();
    } else if (type === "number") {
        appendNumber(value);
    } else if (type === "operator") {
        appendOperator(value);
    } else if (type === "calculate") {
        performCalculate();
    }
}

function setupCalculatorUI() {
    const elements = getCalculatorElements();

    if (!elements) {
        return;
    }

    elements.onOffButton.classList.add("on");
    elements.calculator.addEventListener("click", handleCalculatorClick);
}

if (typeof window !== "undefined") {
    window.start = start;
    window.calculate = calculate;
    window.togglePower = togglePower;
    window.clearDisplay = clearDisplay;
    window.appendNumber = appendNumber;
    window.appendOperator = appendOperator;
    window.performCalculate = performCalculate;
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupCalculatorUI);
    } else {
        setupCalculatorUI();
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        add,
        subtract,
        multiply,
        divide,
        tokenize,
        calculate,
        start,
    };
}
