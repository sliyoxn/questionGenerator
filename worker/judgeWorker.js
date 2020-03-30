importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.0/math.min.js");
importScripts("../bean/Fraction.js");
importScripts("../util/Constants.js");
this.onmessage = function ({data}) {
	let {topic, studentAnswer, standardAnswer} = data;
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
