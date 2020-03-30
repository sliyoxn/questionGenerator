importScripts("../util/calEval.js");
importScripts("../util/clone.js");
importScripts("../util/Constants.js");
importScripts("../util/generateTopic.js");
importScripts("../util/randomUtil.js");
importScripts("../bean/Fraction.js");
importScripts("../public/global.js");
this.onmessage = function ({data}) {
	let {from, to, count, simpleExpressionSet} = data;
	let topicData = generateTopic({from, to, count, simpleExpressionSet});
	this.postMessage(topicData);
};
