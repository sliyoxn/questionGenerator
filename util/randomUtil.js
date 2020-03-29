function getRandom(from, to, isInt = true) {
	let val = Math.random() * (to - from + 1) + from;
	return isInt ? Math.floor(val) : val;
}


