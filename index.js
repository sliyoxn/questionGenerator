let vm = new Vue({
	el : "#app",
	data : {
		from : 1,
		to : 10,
		topic : "",
		standardAnswer : "",
		studentAnswer : ""
	},
	methods : {
		downloadTopic() {
			console.log(this.topic)
			// downloadFile("题目.txt", this.topic);
		},
		downloadStandardAnswer() {
			console.log(this.standardAnswer);
		},
		loadStudentAnswer() {
			console.log(this.studentAnswer);
		},

	},
	computed :{

	}
});
