const operandExp = /(\d+'\d+\/\d+|\d+\/\d|\d+)/;
const operatorExp = /[+\-*\/()]/;
const priorityObj = {
	"(" : 0,
	"+" : 1,
	"-" : 1,
	"*" : 2,
	"/" : 2,

};
const Fraction = require("./Fraction");
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

module.exports = function calEval(eval) {
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
			let res = Fraction.calculate(b, a, o);
			if (res.value < 0) {
				hasNegativeNumber = true;
				return {
					val: -1,
					hasNegativeNumber
				}
			}
			operandStack.push(res);
		}
	}
	return {
		val : operandStack.pop().toMixedString(),
		hasNegativeNumber
	}
};


