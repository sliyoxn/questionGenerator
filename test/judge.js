const readFile = require("./util/readFile");
(async function () {
	let topic = await readFile("./file/题目.txt");
	let answer = await readFile("./file/答案.txt");
	let stuAnswer = await readFile("./file/学生答案.txt");

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
	}
	console.log(data);
})();
