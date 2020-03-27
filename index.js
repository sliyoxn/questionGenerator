let vm = new Vue({
	el : "#app",
	data : {
		from : 1,
		to : 2,
		topic : "",
		standardAnswer : "",
		studentAnswer : "",
		count : 1,
		fileInputKey : 0,
		tableData : [],
		tableVisibility : false,
		loading : false
	},
	methods : {
		downloadTopic() {
			downloadFile("题目.txt", this.topic);
		},
		downloadStandardAnswer() {
			downloadFile("答案.txt", this.standardAnswer.replace(/,/gm,"\n"));
		},
		loadStudentAnswer() {
			this.$refs.fileInput.click();
		},
		generateTopic() {
			let data = generateTopic(this.from, this.to, this.count);
			this.topic = data.text;
			this.standardAnswer = data.answer.join(",");
		},
		async handleFileChange(event) {
			let file = event.target.files[0];
			// 重新渲染input
			this.fileInputKey = Math.random();
			let data = await readFile({file});
			this.studentAnswer = data.replace(/\s/gm, ",");
		},
		judge() {
			let {topic, studentAnswer, standardAnswer} = this;
			studentAnswer = studentAnswer.split(",");
			standardAnswer = standardAnswer.split(",");
			topic = topic.split("\n");
			this.tableVisibility = true;
			this.loading = true;
			let tableData = [];
			for (let i = 0; i < standardAnswer.length; i++) {
				let obj = {};
				if (Math.abs(math.eval(standardAnswer[i]) - math.eval(studentAnswer[i])) <= Number.EPSILON) {
					obj.right = "正确";
				} else {
					obj.right = "错误";
				}
				obj.studentAnswer = studentAnswer[i];
				obj.standardAnswer = standardAnswer[i];
				obj.topic = topic[i];
				tableData.push(obj);
			}
			this.tableData = tableData;
			this.loading = false;
		}

	},
	computed :{

	}
});
