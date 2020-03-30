const readFile = require("./util/readFile");
const writeFile = require("./util/writeFile");
(async function () {
	let prevTime = new Date().getTime();
	let topic = await readFile("./file/题目.txt");
	let answer = await readFile("./file/答案.txt");
	let stuAnswer = await readFile("./file/学生答案.txt");
	let str = "";
	topic = topic.split("\n");
	answer = answer.split("\n");
	stuAnswer = stuAnswer.split("\n");
	let data = [];
	for (let i = 0; i < answer.length; i++) {
		let o = {};
		o.topic = topic[i];
		o.stuAnswer = stuAnswer[i];
		o.answer = answer[i];
		if (answer[i] !== stuAnswer[i]) {
			o.right = "错误"
		} else {
			o.right = "正确";
		}
		data.push(o);
		str += `题目 : ${o.topic}       标准答案: ${o.answer}     学生答案: ${o.stuAnswer}   正确性: ${o.right}\n`;
	}
	console.log(`判定${answer.length}道题目的用时为: ${new Date().getTime() - prevTime}ms`);
	writeFile("./file/判卷结果.txt", str);
	console.log("判卷结果已经写入文件, 请去判卷结果.txt查看结果");
})();

