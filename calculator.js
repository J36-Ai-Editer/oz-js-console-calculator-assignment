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

if (typeof window !== "undefined") {
    window.start = start;
    window.calculate = calculate;
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
