// 计算表达式
const calEval = require("./src/calEval");
// 生成题目
const generateTopic = require("./src/generateTopic");
const readFile = require("./util/readFile");
const writeFile = require("./util/writeFile");

console.log("下面是测试用例");
console.log("题目: 1 + 2 答案: ",calEval("1 + 2").val);
console.log("题目: 3 * 2 答案: ",calEval("3 * 2").val);
console.log("题目: (1 + 2) * 3 - 2 答案: ",calEval("(1 + 2) * 3 - 2").val);
console.log("题目: 1 / (2 + (2 + 2)) 答案: ",calEval("1 / (2 + (2 + 2))").val);
console.log("题目: (2 / 1'1/2) + 2'1/2 答案: ",calEval("(2 / 1'1/2) + 2'1/2").val);
console.log("题目: (2 / 2) / 1 答案: ",calEval("(2 / 2) / 1").val);
console.log("题目: 1 + 1 答案: ",calEval("1 + 1").val);
console.log("题目: (2 * 1) / 1 答案: ",calEval("(2 * 1) / 1").val);
console.log("题目: 1/2 * 1'2/3 答案: ",calEval("1/2 * 1'2/3").val);
console.log("题目: 10'1/2 * (18'2/3 + 11'5/6) 答案: ",calEval("10'1/2 * (18'2/3 + 11'5/6)").val);
console.log("题目: (20 * 9'5/14 * 4'1/4) / 4 答案: ",calEval("(20 * 9'5/14 * 4'1/4) / 4").val);
console.log("题目: 15'5/16 / 10'10/11 答案: ",calEval("15'5/16 / 10'10/11").val);
console.log("题目: 3'7/8 / 2'3/11 + 7 答案: ",calEval("3'7/8 / 2'3/11 + 7").val);
console.log("题目: 16'1/2 - 10'5/16 答案: ",calEval("16'1/2 - 10'5/16").val);
console.log("题目: 15 * 2 答案: ",calEval("15 * 2").val);
console.log("题目: (19 / (11 - 11)) - 4'7/20 答案: ",calEval("(19 / (11 - 11)) - 4'7/20").val);
console.log("题目: 13'7/10 + 18'2/11 答案: ",calEval("13'7/10 + 18'2/11").val);
console.log("题目: 3 + (17'6/13 * 3'2/3) 答案: ",calEval("3 + (17'6/13 * 3'2/3)").val);
console.log("题目: 2 / (3 * (6'5/6 + 10'3/7)) 答案: ",calEval("2 / (3 * (6'5/6 + 10'3/7))").val);
console.log("题目: 15'5/16 / 10'10/11 答案: ",calEval("15'5/16 / 10'10/11").val);
console.log("测试用例完毕");

console.log("-------------开始计算运行效率-----------------");
let prevTime = new Date().getTime();
let loopCount = 500;
for (let i = 0; i < loopCount; i++) {
	calEval("8'1/3 - 4");
	calEval("3 / (20 * 14)");
	calEval("(15'1/5 + 17'1/2) + 11");
	calEval("(3 + 5) + 7'9/10");
	calEval("(16'5/9 / 5) / (18 - 16)");
	calEval("15 * 20");
	calEval("5 - 4");
	calEval("11'1/4 / 9 + (9'1/2 - 4)");
	calEval("(18'2/3 / 11'5/6) * 3");
	calEval("(8 * 14'4/5) * 9");
	calEval("16 + (7'7/10 + 3'5/6)");
	calEval("7 + 15'4/9");
	calEval("(16 / 5) / 16");
	calEval("3'1/11 + (11 + (14 + 15))");
	calEval("(7 / 9) + 7");
	calEval("12'7/16 + 18");
	calEval("10'2/19 / 14'12/17");
	calEval("(5 / (3'2/5 * 6)) / 14");
	calEval("4 * (5 / 8'7/8 + 7)");
	calEval("(17'11/20 - 16'1/2) / 12");
}
console.log(`计算${20 * loopCount}条表达式需要的时间为: ${new Date().getTime() - prevTime}ms`);



console.log("---------------准备生成题目-----------------------");
prevTime = new Date().getTime();
let topicCount = 100000;
let res = generateTopic(1,20,topicCount);
console.log(`生成${res.warnMsg ? res.count : topicCount}条题目需要的时间为: ${new Date().getTime() - prevTime}ms`);

writeFile("../file/题目.txt", res.text);
writeFile("../file/答案.txt", res.answer.join("\n"));
writeFile("../file/学生答案.txt", res.answer.join("\n"));

console.log("生成完毕, 请去file文件夹查看");




