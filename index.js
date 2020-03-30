let vm = new Vue({
	el : "#app",
	data : {
		from : 1,
		to : 2,
		topic : "",
		standardAnswer : "",
		studentAnswer : "",
		count : 1000,
		fileInputKey : 0,
		tableData : [],
		tableVisibility : false,
		loading : false,
		isGenerating : false,
		loadType : -1
	},
	methods : {
		downloadTopic() {
			this._downloadFile(this.topic)
		},
		downloadStandardAnswer() {
			this._downloadFile(this.standardAnswer.replace(/,/gm,"\n"));
		},
		generateTopic() {
			this.isGenerating = true;
			this.topic = "";
			this.standardAnswer = "";
			if (window.Worker) {
				let worker = new Worker("./worker/generateTopicWorker.js");
				worker.postMessage({
					from : this.from,
					to : this.to,
					count : this.count,
				});
				worker.onmessage =  (e) => {
					let data = e.data;
					this._handleData(data);
				}
			}
			else {
				let data = generateTopic(this.from, this.to, this.count);
				this._handleData(data);
			}
		},
		_handleData(data) {
			this.topic = data.text;
			this.standardAnswer = data.answer.join(",");
			if (data.warnMsg) {
				this.$message.warning(data.warnMsg);
			}
			this.isGenerating = false;
		},

		async handleFileChange(event) {
			let file = event.target.files[0];
			// 重新渲染input
			this.fileInputKey = Math.random();
			let data = await readFile({file});
			switch (this.loadType) {
				case 1:
					this.topic = data;
					break;
				case 2:
					this.standardAnswer = data.replace(/\s/gm, ",");
					break;
				case 3:
					this.studentAnswer = data.replace(/\s/gm, ",");
					break;
				default :
					break;
			}
		},
		async judge() {
			this.tableVisibility = true;
			this.loading = true;
			this.tableData = [];
			let {topic, studentAnswer, standardAnswer} = this;
			studentAnswer = studentAnswer.split(",");
			standardAnswer = standardAnswer.split(",");
			topic = topic.split("\n");
			let singleHandleCount = 500;
			try {
				if (window.Worker) {
					setTimeout(async () => {
						let worker = new Worker("./worker/judgeWorker.js");
						let loopCount = standardAnswer.length / singleHandleCount + 1;
						for (let i = 0; i < loopCount; i++) {
							let sliceSA = standardAnswer.slice(i * singleHandleCount, (i + 1) * singleHandleCount);
							let sliceTA = studentAnswer.slice(i * singleHandleCount, (i + 1) * singleHandleCount);
							let sliceTopic = topic.slice(i * singleHandleCount, (i + 1) * singleHandleCount);
							let data = await this._loadTableData({topic : sliceTopic, studentAnswer : sliceTA, standardAnswer : sliceSA});
							if (i === 0) {
								this.tableData = data;
								this.loading = false;
							} else {
								this.tableData.push(...data);
							}
							await this._sleepToNextTick();
						}
					}, 500);
				} else {
					let tableData = getTableData({topic, studentAnswer, standardAnswer});
					this.tableData = tableData;
					this.loading = false;
				}
			}catch (e) {
				this.$msssage.error(e);
				this.loading = false;
			}
		},
		loadTopic() {
			this.loadType = 1;
			this.$refs.fileInput.click();
		},
		loadStandardAnswer() {
			this.loadType = 2;
			this.$refs.fileInput.click();
		},
		loadStudentAnswer() {
			this.loadType = 3;
			this.$refs.fileInput.click();
		},
		downloadStudentAnswer() {
			this._downloadFile(this.studentAnswer.replace(/,/gm,"\n"));
		},
		_downloadFile(content) {
			this.$prompt('请输入文件名', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(({ value }) => {
				downloadFile(value, content);
			}).catch(() => {});
		},
		_loadFile(filename, propName) {

		},
		_loadTableData({topic, studentAnswer, standardAnswer}) {
			return new Promise((resolve, reject) => {
				let worker = new Worker("./worker/judgeWorker.js");
				worker.postMessage({topic, studentAnswer, standardAnswer});
				worker.onmessage =  ({data}) => {
					resolve(data);
					worker.terminate();
				}
			})
		},
		_sleep(time) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve();
				}, time)
			})
		},
		_sleepToNextTick() {
			return new Promise((resolve, reject) => {
				this.$nextTick(() => {
					resolve();
				});
			})
		}


	},
	computed :{

	}
});
