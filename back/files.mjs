import fs from "fs"

const s_fileCache = {

	"": ""

};

const s_fileLocks = new Set("");

export default {

	fromCache: (p_fileName) => s_fileCache[p_fileName],

	load: (p_fileName) => {
		if (s_fileLocks.has(p_fileName))
			return;

		s_fileLocks.add(p_fileName);

		const data = fs.readFileSync(p_fileName);

		s_fileLocks.delete(p_fileName);
		s_fileCache[p_fileName] = data;

		return data;
	},

};
