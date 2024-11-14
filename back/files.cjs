const fs = require("fs");

const s_fileLocks = new Set("");
const s_fileCache = {

	"": ""

};

module.exports.fromCache = (p_fileName) => s_fileCache[p_fileName];

module.exports.load = (p_fileName) => {
	if (s_fileLocks.has(p_fileName))
		return;

	s_fileLocks.add(p_fileName);

	const data = fs.readFileSync(p_fileName);

	s_fileLocks.delete(p_fileName);
	s_fileCache[p_fileName] = data;

	return data;
};
