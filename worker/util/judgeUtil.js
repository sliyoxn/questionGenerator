function getTableData({topic, studentAnswer, standardAnswer}) {
	let tableData = [];
	for (let i = 0; i < standardAnswer.length; i++) {
		let obj = {};
		if (studentAnswer == null) {
			obj.right = "错误";
		}else {
			if (Math.abs(math.eval(standardAnswer[i]) - math.eval(studentAnswer[i])) <= Number.EPSILON) {
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
