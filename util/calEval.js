function calEval(str = '') {

	let hasBracket = /\([\w\W]+\)/.test(str);
	if (hasBracket) {
		let startIndex = str.indexOf("(");
		let endIndex = str.indexOf(")");
		let arr = str.slice(startIndex + 1, endIndex).split(" ");
		// console.log(arr);
		let num1 = arr[0];
		let operator = arr[1];
		let num2 = arr[2];
		let sum = Fraction.calculate(num1, num2, operator);
		str = str.slice(0,startIndex) + " " + sum;
		console.log(str);
	}




}

calEval("5 * (2'2/9 - 10'2/3)");
