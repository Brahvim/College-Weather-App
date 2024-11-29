import fs from "fs"

const s_fileCache = { "": "" };
const s_fileLocks = new Set("");

export default {

	cache: (p_fileName, p_data) => s_fileCache[p_fileName] = p_data,
	isLoading: (p_fileName) => !!s_fileLocks.has(p_fileName),
	fromCache: (p_fileName) => s_fileCache[p_fileName],
	canLoad: (p_fileName) => fs.existsSync(`./front/${p_fileName}`),
	has: (p_fileName) => !!s_fileCache[p_fileName],
	load: (p_fileName) => {
		if (s_fileLocks.has(p_fileName))
			return null;

		s_fileLocks.add(p_fileName);

		try {

			return s_fileCache[p_fileName] = fs.readFileSync(`./front/${p_fileName}`);

		} catch (e) {

			console.error(`Call \`node:fs::readFileSync(\"./front/${p_fileName}\")\` failed!`);

		}

		s_fileLocks.delete(p_fileName);
		return null;
	},

};
