importScripts("../util/calEval.js");
importScripts("../util/clone.js");
importScripts("../util/Constants.js");
importScripts("../util/generateTopic.js");
importScripts("../util/randomUtil.js");
importScripts("../bean/Fraction.js");
this.onmessage = function ({data}) {
	let {from, to, count, warnFn} = data;
	let topicData = generateTopic(from, to, count, warnFn);
	this.postMessage(topicData);
};
