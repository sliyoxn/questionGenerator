importScripts("./util/judgeUtil.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.0/math.min.js");
this.onmessage = function ({data}) {
	let {topic, studentAnswer, standardAnswer} = data;
	let tableData = getTableData({topic, studentAnswer, standardAnswer});
	this.postMessage(tableData);
};
