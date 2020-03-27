/**
 * 分数类
 */
class Fraction {
	/**
	 * 可以接受数值和分式
	 * @param {Number|Fraction} numerator
	 * @param {Number|Fraction} denominator
	 * @return {Fraction}
	 */
	constructor(numerator, denominator = 1) {
		if (Number.isInteger(numerator) && Number.isInteger(denominator)) {
			this.numerator = numerator;
			this.denominator = denominator;
		} else if (numerator instanceof Fraction || denominator instanceof Fraction) {
			// 处理传入的分子或分母是分数的情况
			numerator = numerator instanceof Fraction ? numerator : new Fraction(numerator, 1);
			denominator = denominator instanceof Fraction ? denominator : new Fraction(denominator, 1);
			return numerator.clone().divide(denominator);
		} else {
			throw new TypeError('prams must be Number or Fraction');
		}
		this.simplify();
	}

	/**
	 * 辗转相除法求最大公约数
	 * @param num1
	 * @param num2
	 * @return {number}
	 */
	static greatestCommonDivisor(num1, num2) {
		let lesser = Math.abs(num1);
		let greater = Math.abs(num2);
		while (lesser !== 0) {
			let t = lesser;
			lesser = greater % lesser;
			greater = t;
		}
		return greater;
	}

	clone() {
		return new Fraction(this.numerator, this.denominator);
	}

	/**
	 * 化简分数
	 * @return {Fraction}
	 */
	simplify() {
		const gcd = Fraction.greatestCommonDivisor(this.numerator, this.denominator);
		this.numerator = this.numerator / gcd;
		this.denominator = this.denominator / gcd;
		return this;
	}

	/**
	 * 导出格式  a/b
	 * @return {string}
	 */
	toString() {
		return `${this.numerator}/${this.denominator}`;
	}


	get value() {
		return this.numerator / this.denominator;
	}

	// 两个分数相加
	static add(frac1, frac2) {
		frac1 = frac1 instanceof Fraction ? frac1.clone() : new Fraction(frac1);
		frac2 = frac2 instanceof Fraction ? frac2.clone() : new Fraction(frac2);

		//  a / b + c / d = (a * d+ b * c) / b * d
		frac1.numerator = frac1.numerator * frac2.denominator + frac1.denominator * frac2.numerator;
		frac1.denominator = frac1.denominator * frac2.denominator;
		return frac1.simplify();
	}

	// 当前分数加其他值
	add(frac) {
		return Fraction.add(this, frac);
	}

	// 分数相减
	static subtract(frac1, frac2) {
		frac1 = frac1 instanceof Fraction ? frac1.clone() : new Fraction(frac1);
		frac2 = frac2 instanceof Fraction ? frac2.clone() : new Fraction(frac2);

		//  a/b + c/d = (a*d-b*c) / b*d
		frac1.numerator = frac1.numerator * frac2.denominator - frac1.denominator * frac2.numerator;
		frac1.denominator = frac1.denominator * frac2.denominator;
		return frac1.simplify();
	}

	// 当前分数减另外一个分数
	subtract(frac) {
		return Fraction.subtract(this, frac);
	}

	// 两分数相乘
	static multiply(frac1, frac2) {
		frac1 = frac1 instanceof Fraction ? frac1.clone() : new Fraction(frac1);
		frac2 = frac2 instanceof Fraction ? frac2.clone() : new Fraction(frac2);

		// (a / b) * (c / d) = (a * b) / (c * d)
		frac1.numerator = frac1.numerator * frac2.numerator;
		frac1.denominator = frac1.denominator * frac2.denominator;
		return frac1.simplify();
	}

	// 当前分数乘另一个分数
	multiply(frac) {
		return Fraction.multiply(this, frac);
	}

	// 两分数相除
	static divide(frac1, frac2) {
		frac1 = frac1 instanceof Fraction ? frac1.clone() : new Fraction(frac1);
		frac2 = frac2 instanceof Fraction ? frac2.clone() : new Fraction(frac2);

		//  (a/b) / (c/d) = (a*d) / (b*c)
		frac1.numerator = frac1.numerator * frac2.denominator;
		frac1.denominator = frac1.denominator * frac2.numerator;
		return frac1.simplify();
	}

	// 当前分数乘另一个分数
	divide(frac) {
		return Fraction.divide(this, frac);
	}

	/**
	 * 从字符串解析出分数, 支持1, 1/2, 1'1/2的形式
	 * @param str
	 * @return {Fraction}
	 */
	static fromString(str = '') {
		let int = 1;
		if (str.indexOf("'") !== -1) {
			int = str.split("'")[0];
			str = str.split("'")[1];
		}
		let arr = str.split('/').map(Number).filter(Number.isInteger);
		if (arr.length === 1) arr.push(1);
		if (arr.length !== 2) throw TypeError('params must be 2 Integer spread by "/"');
		return new Fraction(arr[0] * int, arr[1]);
	}

}
