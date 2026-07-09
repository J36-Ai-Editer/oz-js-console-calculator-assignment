# JavaScript Calculator Assignments

JavaScript로 만든 사칙연산 계산기 과제 모음입니다.

## Day5: 콘솔 계산기

1. `index.html` 파일을 브라우저에서 엽니다.
2. 개발자 도구의 Console 탭을 엽니다.
3. `start()`를 입력하거나 `start("10 + 2 * 3 - 4 / 2")`처럼 계산식을 전달합니다.

## Day6: DOM 계산기

1. `calculator.html` 파일을 브라우저에서 엽니다.
2. 계산기 버튼을 클릭하여 식을 입력합니다.
3. `Enter` 버튼을 누르면 결과가 표시됩니다.

Day6 계산기는 HTML의 `onclick` 속성을 사용하지 않고, `calculator.js`에서 `querySelector`와 `addEventListener`를 사용해 버튼 이벤트를 연결합니다.

## 지원 기능

- 덧셈, 뺄셈, 곱셈, 나눗셈
- 긴 계산식 처리
- 곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 계산
- 공백이 없는 계산식 처리: `1+2*3`
- 0으로 나누기 오류 처리

## 사용 예시

```javascript
start("1 + 1 * 4"); // 결과: 5
start("10 + 2 * 3 - 4 / 2"); // 결과: 14
start("100 / 5 / 2 + 7 * 3 - 1"); // 결과: 30
```
