function generateTopic(from, to, count) {
	let str = "";
	let answerArr = [];
	let simpleExpressionSet = new Set();
	let simpleExpression = "";
	for (let i = 0; i < count; i++) {
		let expressionObj = getExpression(from, to);
		let expression = expressionObj.expression;
		simpleExpression = expressionObj.simpleExpression;
		let maxLoopCount = count / 2;
		let curLoopCount = 0;
		let calRes = calEval(expression);
		while ((calRes.hasNegativeNumber || simpleExpressionSet.has(simpleExpression)) && curLoopCount < maxLoopCount) {
			expressionObj = getExpression(from, to);
			expression = expressionObj.expression;
			simpleExpression = expressionObj.simpleExpression;
			calRes = calEval(expression);
			curLoopCount ++;
		}
		if (maxLoopCount <= curLoopCount) {
			return {
				text : str.slice(0, str.length - 1),
				answer : answerArr,
				warnMsg : "重试次数已达最大, 生成停止, 共计生成" + (i + 1) + "题"
			}
		}
		str += expression;
		answerArr.push(calRes.val);
		if (simpleExpression !== "") {
			simpleExpressionSet.add(simpleExpression);
		}
		// if (expression === "2 / 2 / 2") {
		// 	console.log(simpleExpressionSet.has("2 / 2 / 2"), simpleExpressionSet);
		// }
		str += "\n";
	}
	return {
		text : str.slice(0, str.length - 1),
		answer : answerArr
	}
}

// 获取操作符的个数
function getRandomOperatorCount() {
	return getRandom(1,2);
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

function getExpression(from, to) {
	let expression = '';
	let leftVal = getRandomOperand(from, to);
	let operatorCount = getRandomOperatorCount();
	let useBracket = false;
	let bracketIndex = getRandom(1,2);
	let operandArr = [];
	let operatorArr = [];
	let simpleExpression = "";
	if (operatorCount === 2) {
		useBracket = !!getRandom(0,1)
	}
	if (useBracket && bracketIndex === 1) {
		expression += "(";
	}
	expression += leftVal;
	operandArr.push(leftVal instanceof Fraction ? leftVal.value : leftVal);
	for (let j = 1; j <= operatorCount; j++) {
		let operator = getRandomOperator();
		operatorArr.push(operator);
		let rightVal = getRandomOperand(from, to);
		operandArr.push(rightVal instanceof Fraction ? rightVal.value : rightVal);
		// if (rightVal instanceof Fraction) {
		// 	console.log(rightVal.value, rightVal);
		// }
		if (useBracket && j === 1 && bracketIndex === 2) {
			expression += ` ${operator} (${rightVal}`
		} else {
			expression += ` ${operator} ${rightVal}`;
		}
		if (useBracket && j === bracketIndex) {
			expression += ")";
		}
	}
	if (operatorCount === 2 && operatorArr[0] === operatorArr[1] && (operatorArr[0] === "+" || operatorArr[0] === "*")) {
		simpleExpression = operandArr.sort().join("|") + " " + operatorArr.join("");
	} else if (operatorCount === 1) {
		simpleExpression = operandArr.sort().join("|") + " " + operatorArr.join("");
	} else if (operatorCount === 2 && operatorArr[0] === operatorArr[1] && operatorArr[0] === "-" && operatorArr[1]) {
		simpleExpression = operatorArr[0] + "|" + [operatorArr[2], operatorArr[3]].join("|") + " " + operatorArr.join("");
	} else {
		simpleExpression = expression;
	}
	// if (expression === "2 / 2 / 2") {
	// 	console.log("2 / 2 / 2" + "出现了");
	// 	console.log(simpleExpression);
	// }
	return {
		expression,
		simpleExpression
	};
}
