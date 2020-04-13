const operandExp = /(\d+'\d+\/\d+|\d+\/\d+|\d+)/;
const operatorExp = /[+\-*\/()]/;
const priorityObj = {
	"(" : 0,
	"+" : 1,
	"-" : 1,
	"*" : 2,
	"/" : 2,

};
Object.freeze(priorityObj);
class Stack extends Array{
	getTop() {
		return this[this.length - 1];
	}
	isEmpty() {
		return this.length === 0;
	}
}

/**
 * 中缀转后缀
 * @param {String} string
 */
function transform(string) {
	let expression = "";
	let operatorStack = new Stack();
	while ((string = string.trim()) !== "") {
		let operandTestRes = string.match(operandExp);
		let operatorTestRes = string.match(operatorExp);
		let isOperand = operandTestRes && (operandTestRes.index === 0);
		let isOperator = operatorTestRes && (operatorTestRes.index === 0);
		if (isOperand) {
			let matchStr = operandTestRes[0];
			expression += matchStr + " ";
			string = string.slice(operandTestRes.index + matchStr.length);
		} else if (isOperator) {
			let operator = string[0];
			let topOperator = null;
			switch (operator) {
				case "+":
				case "-":
				case "*":
				case "/":
					topOperator = operatorStack.getTop();
					if (topOperator) {
						while (!operatorStack.isEmpty() && !comparePriority((topOperator = operatorStack.getTop()), operator)) {
							expression += operatorStack.pop() + " ";
						}
						operatorStack.push(operator);
					} else {
						operatorStack.push(operator);
					}
					break;
				case "(":
					operatorStack.push(operator);
					break;
				case ")":
					while ((topOperator = operatorStack.getTop()) !== "(") {
						expression += operatorStack.pop() + " ";
					}
					operatorStack.pop();
					break;

			}
			string = string.slice(1);
		}
	}
	while (!operatorStack.isEmpty()) {
		expression += operatorStack.pop() + " ";
	}
	expression = expression.trim();
	return expression;
}


/**
 * 返回1代表可以入栈
 * @param a
 * @param b
 * @returns {boolean}
 */
function comparePriority(a, b) {
	a = priorityObj[a];
	b = priorityObj[b];
	return a < b;
}

/**
 * 计算带分数的中缀表达式
 * @param eval {String} 表达式
 * @returns {{val: string, hasNegativeNumber: boolean}}
 */
function calEval(eval) {
	let expression = transform(eval);
	let operandStack = new Stack();
	let array = expression.split(" ");
	let hasNegativeNumber = false;
	while (array.length) {
		let o = array.shift();
		if (operandExp.test(o)) {
			operandStack.push(o);
		} else {
			let a = operandStack.pop();
			let b = operandStack.pop();
			if (a != null && b != null) {
				let res = Fraction.calculate(b, a, o);
				if (res.value < 0 || res.value === Infinity) {
					hasNegativeNumber = true;
					return {
						val: res.value === Infinity ? Infinity : "-99.99",
						hasNegativeNumber
					}
				}
				operandStack.push(res);
			} else {
				return {
					val : o === "-" ? - a : a,
					hasNegativeNumber: o === "-"
				}
			}
		}
	}
	let val = operandStack.pop();
	return {
		val : val instanceof Fraction ? val.toMixedString() : val,
		hasNegativeNumber
	}
}
