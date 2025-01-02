// Function to evaluate an expression
const evaluateExp = (expState: string): any => {
    // Placeholder for expression evaluation logic
    // You can implement the logic depending on your needs
  }
  
  // Function to check for the presence of a percentage symbol in the expression
  const checkForPer = (expression: string): number => {
    if (!expression) return -1;
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === '%') return i;
    }
    return -1;
  }
  
  // Function to evaluate percentages in the expression
  const evalPercentage = (index: number, expression: string): string => {
    if (index === -1 || !expression) return expression;
  
    let pos = index;
    while (--pos >= 0 && !"+/*%-".includes(expression[pos]));
  
    let num1 = expression.slice(pos + 1, index);
    let newExp = expression.slice(0, pos + 1);
    pos = index;
    while (++pos < expression.length && !"+/*%-".includes(expression[pos]));
    let num2 = expression.slice(index + 1, pos);
  
    let ans = (parseFloat(num1) * parseFloat(num2)) / 100;
    newExp += ans + expression.slice(pos, expression.length);
  
    return newExp;
  }
  
  // Function to evaluate the expression and return the result
  const equalTo = (expState: string): { status: number; ans: string | number } => {
    if (!expState || expState.length === 0) return { status: 0, ans: 0 };
  
    let ch = lastChar(expState);
    if ("/+-%*".includes(ch)) return { status: 0, ans: 0 };
  
    try {
      let expression = expState;
      let index = checkForPer(expression);
      while (index !== -1) {
        expression = evalPercentage(index, expression);
        index = checkForPer(expression);
      }
  
      let opcnt = 0;
      for (let i = 0; i < expression.length; i++) {
        if ("+-/%*".includes(expression[i])) opcnt++;
      }
  
      if (expression.toString().includes('e') && opcnt === 1) return { status: 2, ans: expression };
  
      let finalAnswer = eval(expression);
      if (finalAnswer === Infinity) return { status: 1, ans: "Cannot be divided by 0" };
      return { status: finalAnswer.toString() ? 2 : 3, ans: finalAnswer.toString() || "Expression Error" };
    } catch (error) {
      return { status: 3, ans: 0 };
    }
  }
  
  // Function to get the last character of the expression
  const lastChar = (expState: string): string => {
    return expState.length > 0 ? expState[expState.length - 1] : '';
  }
  
  // Function to get the second last character of the expression
  const secondLastChar = (expState: string): string => {
    return expState.length > 1 ? expState[expState.length - 2] : '';
  }
  
  // Function to add an operator to the expression
  export const addOperator = (e: string, expState: string, ansState: string): number => {
    if (!expState || expState.length === 0) {
      if (e === '-') return 2;
      return 0;
    }
  
    let ch = lastChar(expState);
    let sch = secondLastChar(expState);
  
    if (ch === e) return 0;
    if (e === '-') {
      if (ch === '+') return 1;
      if ("/*%".includes(sch) && ch === '-') return 0;
      return 2;
    }
    if (e === '+') {
      if ("-/*%".includes(ch) && sch && !"/%*".includes(sch)) return 1;
      if ("/*%".includes(ch)) return 0;
      if (ch === '-') return 0;
      return 2;
    } else {
      if (!sch && ch === '-') return 0;
      if ("/*%".includes(sch) && ch === '-') return 0;
      if ("-+*/%".includes(ch) && "/*%".includes(e)) return 1;
      return 2;
    }
  }
  
  // Function to add a dot to the expression
  export const addDot = (e: string, expState: string, ansState: string): number => {
    let ch = lastChar(expState);
    if (expState.length === 0 || "/-+*%".includes(ch)) return 1;
    for (let i = expState.length - 1; i >= 0; i--) {
      let ch = expState[i];
      if ("+/*%-".includes(ch)) return 2;
      if (ch === '.') return 0;
    }
    return 2;
  }
  
  // Function to add zero to the expression
  export const addZero = (e: string, expState: string, ansState: string): number => {
    if (!expState || expState.length === 0) return 2;
    let ch = lastChar(expState);
    let sch = secondLastChar(expState);
    if ("-+/*%.".includes(ch)) return 2;
    if (ch === '0' && (sch === null || "*/+%-".includes(sch))) return 0;
    return 2;
  }
  
  // Function to add double zero to the expression
  export const addDoubleZero = (e: string, expState: string, ansState: string): number => {
    let ch = lastChar(expState);
    if (!expState || expState.length === 0 || "-+/*%.".includes(ch)) return 1;
    let sch = secondLastChar(expState);
    if (ch === '0' && (sch === null || "*/+%-".includes(sch))) return 0;
    return 2;
  }
  
  // Function to add a number to the expression
  export const addNumber = (e: string, expState: string, ansState: string): number => {
    let ch = lastChar(expState);
    let sch = secondLastChar(expState);
    if (ch === '0' && (sch === null || "-+/%*".includes(sch))) return 1;
    return 2;
  }
  
  export default equalTo;
  