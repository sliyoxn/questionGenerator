function getRandom(from, to, isInt = true) {
	let val = Math.random() * (to - from + 1) + from;
	return isInt ? Math.floor(val) : val;
}

// for (let i = 0; i < 100; i++) {
// 	console.log(getRandom(1,2));
// }
