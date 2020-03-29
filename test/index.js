const calEval = require("./src/calEval");
const generateTopic = require("./src/generateTopic");
const readFile = require("./util/readFile");
const writeFile = require("./util/writeFile");

console.log(calEval("1 + 2"));
console.log(calEval("3 * 2"));
console.log(calEval("(1 + 2) * 3 - 2"));
console.log(calEval("1 / (2 + (2 + 2))"));
console.log(calEval("(2 / 1'1/2) + 2'1/2"));
console.log(calEval("(2 / 2) / 1"));
console.log(calEval("1 + 1"));
console.log(calEval("(2 * 1) / 1"));
console.log(calEval("1/2 * 1'2/3"));

let res = generateTopic(1,2,10);
console.log("题目:\n",res.text);
console.log("答案:\n",res.answer);

writeFile("../file/题目.txt", res.text);
writeFile("../file/答案.txt", res.answer.join("\n"));
writeFile("../file/学生答案.txt", res.answer.join("\n"));




