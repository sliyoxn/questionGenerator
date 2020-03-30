const calEval = require("./src/calEval");
const generateTopic = require("./src/generateTopic");
const readFile = require("./util/readFile");
const writeFile = require("./util/writeFile");

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



console.log("---------------准备生成题目-----------------------");
let res = generateTopic(1,20,20);

writeFile("../file/题目.txt", res.text);
writeFile("../file/答案.txt", res.answer.join("\n"));
writeFile("../file/学生答案.txt", res.answer.join("\n"));

console.log("生成完毕, 请去file文件夹查看");




