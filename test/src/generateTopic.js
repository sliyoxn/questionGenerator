const Fraction = require("./Fraction");
const calEval = require("./calEval");
function getRandom(from, to, isInt = true) {
	let val = Math.random() * (to - from + 1) + from;
	return isInt ? Math.floor(val) : val;
}
let Constants = {
	operatorCount : {
		ONE : 1,
		TWO : 2
	},
	operator : {
		"PLUS" : 1,
		"MINUS" : 2,
		"MULTI" : 3,
		"DIVISION" : 4
	}
};

module.exports = function generateTopic(from, to, count) {
	let str = "";
	let answerArr = [];
	let simpleExpressionSet = new Set();
	let simpleExpression = "";
	let maxLoopCount = count * 5;
	for (let i = 0; i < count; i++) {
		let expressionObj = getExpression(from, to);
		let expression = expressionObj.expression;
		let hasNegativeNumber = expressionObj.hasNegativeNumber;
		simpleExpression = expressionObj.simpleExpression;
		let curLoopCount = 0;
		let calRes = calEval(expression);
		while ((hasNegativeNumber === true || calRes.hasNegativeNumber || simpleExpressionSet.has(simpleExpression)) && curLoopCount < maxLoopCount) {
			expressionObj = getExpression(from, to);
			expression = expressionObj.expression;
			simpleExpression = expressionObj.simpleExpression;
			hasNegativeNumber = expressionObj.hasNegativeNumber;
			calRes = calEval(expression);
			curLoopCount ++;
		}
		if (maxLoopCount <= curLoopCount) {
			return {
				text : str.slice(0, str.length - 1),
				answer : answerArr,
				warnMsg : "重试次数已达最大, 生成停止, 共计生成" + i + "题",
				count : i
			}
		}
		str += expression;
		answerArr.push(calRes.val);
		if (simpleExpression !== "") {
			simpleExpressionSet.add(simpleExpression);
		}
		str += "\n";
	}
	return {
		text : str.slice(0, str.length - 1),
		answer : answerArr
	}
};


function getExpression(from, to) {
	let expression = '';
	let leftVal = getRandomOperand(from, to);
	let operator = getRandomOperator();
	let operatorCount = getRandomOperatorCount();
	let useFirstIndexBracket = !!getRandom(0,1) && operatorCount >= 1;
	let firstIndexBracketIndex = getRandom(1,operatorCount - 1);
	let operandArr = [leftVal];
	let operatorArr = [operator];
	let hasNegativeNumberObj = {
		hasNegativeNumber : false
	};
	if (useFirstIndexBracket && operatorCount >= 2) {
		expression += `(${leftVal} ${operator} `;
		operator = getRandomOperator();
		operatorArr.push(operator);
		expression += `${randomExpression(from, to, firstIndexBracketIndex - 1, operandArr, operatorArr, hasNegativeNumberObj)}) ${operator} `;
		expression += `${randomExpression(from, to, operatorCount - firstIndexBracketIndex - 1, operandArr, operatorArr,hasNegativeNumberObj)}`
	} else {
		expression += `${leftVal} ${operator} `;
		expression += `${randomExpression(from, to, operatorCount - 1, operandArr, operatorArr, hasNegativeNumberObj)}`
	}

	let simpleExpression = getSimpleExpression(operandArr, operatorArr);
	return {
		expression,
		simpleExpression,
		hasNegativeNumber : hasNegativeNumberObj.hasNegativeNumber,
	}
}


// 获取操作符的个数
function getRandomOperatorCount() {
	return getRandom(1,3);
}
function getRandomOperator() {
	let type = getRandom(1,4);
	let operator = "";
	switch (type) {
		case Constants.operator.PLUS :
			operator = "+";
			break;
		case Constants.operator.MINUS :
			operator = "-";
			break;
		case Constants.operator.MULTI :
			operator = "*";
			break;
		case Constants.operator.DIVISION :
			operator = "/";
			break;
		default :
			operator = "+";
			break;
	}
	return operator;
}

function getRandomOperand(from, to) {
	let isFraction = !!getRandom(0,1);
	if (isFraction) {
		let denominator = getRandom(from, to);
		let mixed = to + 1;
		while (Fraction.calculate(to, mixed, "-").toString() < 0) {
			mixed = Fraction.getMixedFraction(
				getRandom(from, to),
				getRandom(from, denominator),
				denominator).toMixedString();
		}
		return mixed;
	} else {
		return getRandom(from, to);
	}
}

/**
 *
 * @param {Number} from
 * @param {Number} to
 * @param {Number} remain
 * @param {Array} operandArr
 * @param {Array} operatorArr
 * @param {Object} hasNegativeNumberObj 一个含有hasNegativeNumber标识的对象
 */
function randomExpression(from, to, remain, operandArr, operatorArr, hasNegativeNumberObj) {

	let leftVal = getRandomOperand(from, to);
	let useBracket = !!getRandom(0,1);
	operandArr.push(leftVal);
	if (remain) {
		let operator = getRandomOperator();
		operatorArr.push(operator);
		let rightExpress = randomExpression(from, to, remain - 1, operandArr, operatorArr, hasNegativeNumberObj);
		if (calEval(`${leftVal} ${operator} ${rightExpress}`).hasNegativeNumber) {
			hasNegativeNumberObj.hasNegativeNumber = true;
		}
		if (useBracket) {
			return `(${leftVal} ${operator} ${rightExpress})`;
		} else {
			return  `${leftVal} ${operator} ${rightExpress}`
		}
	} else {
		return leftVal;
	}

}


function getSimpleExpression(operandArr, operatorArr) {
	let simpleExpression = "";
	let standardOperator = operatorArr[0];
	let allEqual = true;
	for (let i = 0; i < operatorArr.length; i++) {
		if (operatorArr[i] !== standardOperator) {
			allEqual = false;
			break;
		}
	}
	if (allEqual) {
		switch (standardOperator) {
			case "+":
			case "*":
				simpleExpression = operandArr.sort().join("|") + operatorArr.join("");
				break;
			case "-":
			case "/":
				let [num, ...remain] = operandArr;
				simpleExpression = num + "|" +  remain.sort().join("|")  + operatorArr.join("");
		}
	} else {
		simpleExpression = operandArr.join("|") + operatorArr.join("");
	}
	return simpleExpression;
}
