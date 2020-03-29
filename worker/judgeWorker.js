importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.0/math.min.js");
importScripts("../bean/Fraction.js");
this.onmessage = function ({data}) {
	let {topic, studentAnswer, standardAnswer} = data;
	console.log(data);
	let tableData = getTableData({topic, studentAnswer, standardAnswer});
	this.postMessage(tableData);
};


function getTableData({topic, studentAnswer, standardAnswer}) {
	let tableData = [];
	for (let i = 0; i < standardAnswer.length; i++) {
		let obj = {};
		if (studentAnswer[i] == null) {
			obj.right = "错误";
		} else {
			// console.log(standardAnswer[i]);
			// console.log(standardAnswer[i], studentAnswer[i], Fraction.fromString(standardAnswer[i]).value, Fraction.fromString(studentAnswer[i]).value);
			// if (Math.abs(Fraction.fromString(standardAnswer[i]).value - Fraction.fromString(studentAnswer[i]).value) <= Number.EPSILON) {
			// 	obj.right = "正确";
			// } else {
			// 	obj.right = "错误";
			// }
			if (standardAnswer[i] === studentAnswer[i]) {
				obj.right = "正确";
			} else {
				obj.right = "错误";
			}
		}
		obj.studentAnswer = studentAnswer[i];
		obj.standardAnswer = standardAnswer[i];
		obj.topic = topic[i];
		tableData.push(obj);
	}
	return tableData;
}
