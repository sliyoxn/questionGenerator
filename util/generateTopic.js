function generateTopic(from, to, count) {
	let str = "";
	for (let i = 0; i < count; i++) {
		let leftVal = getRandom(from, to);
		let operatorCount = getRandomOperatorCount();
		let useBracket = false;
		let bracketIndex = getRandom(1,2);

		if (operatorCount === 2) {
			useBracket = !!getRandom(0,1)
		}
		if (useBracket && bracketIndex === 1) {
			str += "(";
		}
		str += leftVal;
		for (let j = 1; j <= operatorCount; j++) {
			let operator = getRandomOperator();
			let rightVal = getRandomOperand(from, to);
			if (useBracket && j === 1 && bracketIndex === 2) {
				str += ` ${operator} (${rightVal}`
			} else {
				str += ` ${operator} ${rightVal}`;
			}
			if (useBracket && j === bracketIndex) {
				str += ")";
			}
		}
		str += "\n";
	}
	return str.slice(0, str.length - 1)
}
// PS: '='为赋值运算符, 所以"+","-","*","/"最多有两个
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
		let mixed = Fraction.getMixedFraction(
			getRandom(from, to),
			getRandom(from, denominator),
			denominator).toMixedString(true);
		return mixed;
	} else {
		return getRandom(from, to);
	}
}

