function calEval(str = '') {

	let hasBracket = /\([\w\W]+\)/.test(str);
	let operatorCount = str.split(" ").length === 3 ? 1 : 2;
	let sum = -1;
	let hasNegativeNumber = false;
	if (operatorCount === 1) {
		let arr = str.split(" ");
		sum = Fraction.calculate(arr[0], arr[2], arr[1]);
		if (sum < 0) {
			str = arr[2] + " " + arr[1] + " " + arr[0];
			sum = Fraction.calculate(arr[2], arr[0], arr[1]);
		}
	} else {
		if (hasBracket) {
			let startIndex = str.indexOf("(");
			let endIndex = str.indexOf(")");
			let arr = str.slice(startIndex + 1, endIndex).split(" ");
			sum = Fraction.calculate(arr[0], arr[2], arr[1]);
			str = str.replace(/\([\w\W]+\)/, sum);
			arr = str.split(" ");
			sum = Fraction.calculate(arr[0], arr[2], arr[1]);
		} else {
			let flag = /[\d'\/]+\s[*\/]\s[\d'\/]+/.test(str);
			if (flag) {
				let matchStr = str.match(/[\d'\/]+\s[*\/]\s[\d'\/]+/)[0];
				let arr = matchStr.split(" ");
				sum = Fraction.calculate(arr[0], arr[2], arr[1]);
				str = str.replace(matchStr, sum.toString());
				arr = str.split(" ");
				sum = Fraction.calculate(arr[0], arr[2], arr[1]);
			} else {
				let arr = str.split(" ");
				arr = [Fraction.calculate(arr[0], arr[2], arr[1]).toString(), arr[3], arr[4]];
				sum = Fraction.calculate(arr[0], arr[2], arr[1]);
			}


		}
	}

	return {
		val : sum.toString(),
		hasNegativeNumber,
		str : str
	};


}

// calEval("2 * (1'1/2 - 1/2)");
// calEval("(3 + 8) * 9");
// calEval("3 + 8");
// calEval("3 - 14 + 3");
// calEval("1/3 * -3");
// calEval("1/3 * 1'2/5 + 8/15");
// console.log(calEval("7 / 3'5/8 * 6'4/5"));

//   56/29 * 34/5
