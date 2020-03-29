let fs = require("fs");
module.exports = function (fileName, content = "", callback = (e) => {}) {
	fs.writeFile(fileName, content, callback);

};
