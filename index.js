let vm = new Vue({
	el : "#app",
	data : {
		from : 1,
		to : 2,
		topic : "",
		standardAnswer : "",
		studentAnswer : "",
		count : 10,
		fileInputKey : 0,
		tableData : [],
		tableVisibility : false,
		loading : false,
		isGenerating : false,
		loadType : -1,
		prevTopicWorker : null,
		prevJudgeWorker : null,
		percentage : 0
	},
	methods : {
		downloadTopic() {
			this._downloadFile(this.topic.split("\n").map((content, index) => {
				return `${index + 1}. ${content}`;
			}).join("\n").trim());
			if (this.isGenerating) this.$message.warning("还没有生成完毕, 现在下载会导致不完整");
		},
		downloadStandardAnswer() {
			this._downloadFile(this.standardAnswer.replace(/,/gm,"\n").split("\n").map((content, index) => {
				return `${index + 1}. ${content}`;
			}).join("\n").trim());
			if (this.isGenerating) this.$message.warning("还没有生成完毕, 现在下载会导致不完整");
		},
		handleClose() {
			if (this.prevJudgeWorker) {
				this.prevJudgeWorker.terminate();
				this.prevJudgeWorker = null;
			}
		},
		async generateTopic() {
			this.isGenerating = true;
			this.topic = "";
			this.standardAnswer = "";
			this.percentage = 0;
			if (this.prevTopicWorker) {
				this.prevTopicWorker.terminate();
				this.prevTopicWorker = null;
			}
			const singleHandleCount = 1000;
			let simpleExpressionSet = new Set();
			if (window.Worker) {
				let loopCount = this.count / singleHandleCount + 1;
				let hasHandleCount = 0;
				// let prevTime = new Date().getTime();
				for (let i = 0; i < loopCount; i++) {
					let thisHandleCount = Math.min(singleHandleCount, this.count - hasHandleCount);
					hasHandleCount += thisHandleCount;
					let data = await this._loadTopicData({
						from : this.from,
						to : this.to,
						count : thisHandleCount,
						simpleExpressionSet
					});
					// if (i === 0) {
					// 	console.log("第一版题目数据加载出来用的时间为(10000条题目):" + (new Date().getTime() - prevTime) + "ms");
					// }
					// if (i === loopCount - 1) {
					// 	console.log("全部题目数据加载出来用的时间为(10000条题目):" + (new Date().getTime() - prevTime) + "ms");
					// }
					simpleExpressionSet = data.simpleExpressionSet;
					// console.log(data.simpleExpressionSet === simpleExpressionSet);
					if (!this._handleData(data, i === 0 ? Constants.worker.RELOAD : Constants.worker.ADD)) {
						this.isGenerating = false;
						return ;
					}
					this.percentage = Math.ceil((i + 1) / loopCount * 100);
					await this._sleepToNextTick();
				}
				this.isGenerating = false;
				this.$message.success("生成完毕");
			}
			// 处理不支持Worker的浏览器
			else {
				let data = generateTopic({
					from : this.from,
					to : this.to,
					count : this.count,
					simpleExpressionSet : new Set()
				});
				this._handleData(data);
				this.isGenerating = false;
				this.$message.success("生成完毕");
			}
		},
		_handleData(data, type = Constants.worker.RELOAD) {
			if (data.text === "") {
				return 1;
			}
			if (type === Constants.worker.RELOAD) {
				this.topic = data.text;
				this.standardAnswer = data.answer.join(",");
			} else if (type === Constants.worker.ADD){
				this.topic += "\n" +  data.text;
				this.standardAnswer +=  "," + data.answer.join(",");
			}
			if (data.warnMsg) {
				this.$message.warning(data.warnMsg);
				return 0;
			}
			return 1;
		},

		async handleFileChange(event) {
			let file = event.target.files[0];
			// 重新渲染input
			this.fileInputKey = Math.random();
			let data = await readFile({file});
			switch (this.loadType) {
				case 1:
					this.topic = data.replace(/\d+\.\s?/gm, "");
					break;
				case 2:
					this.standardAnswer = data.replace(/\d+\.\s?/gm, "").replace(/\s/gm, ",");
					break;
				case 3:
					this.studentAnswer = data.replace(/\d+\.\s?/gm, "").replace(/\s/gm, ",");
					break;
				default :
					break;
			}
		},
		async judge() {
			this.tableVisibility = true;
			this.loading = true;
			this.tableData = [];
			if (this.prevJudgeWorker) {
				this.prevJudgeWorker.terminate();
				this.prevJudgeWorker = null;
			}
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
						this.prevJudgeWorker = null;
					}, standardAnswer.length < 1000 ? 0 : 300);
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
			this._downloadFile(this.studentAnswer.replace(/,/gm,"\n").split("\n").map((content, index) => {
				return `${index + 1}. ${content}`;
			}).join("\n").trim());
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
				this.prevJudgeWorker = worker;
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
		},
		_loadTopicData({from, to, count, simpleExpressionSet}) {
			return new Promise((resolve, reject) => {
				let worker = new Worker("./worker/generateTopicWorker.js");
				this.prevTopicWorker = worker;
				worker.postMessage({
					from,
					to,
					count,
					simpleExpressionSet
				});
				worker.onmessage =  ({data}) => {
					resolve(data);
					worker.terminate();
				}
			});
		}


	},
	computed :{

	}
});
