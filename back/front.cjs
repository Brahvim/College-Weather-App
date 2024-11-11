const path = require("path");
const fs = require("fs");

let mime;
import("mime").then((p_module) => mime = p_module.default);

const s_fileCache = {};

module.exports.send = (p_response, p_fileName) => {

	// Could've let HTML files be extension-less, but here we are:
	const mimeType = mime.getType(path.extname(p_fileName) || ".html");
	const cache = s_fileCache[p_fileName];

	if (cache) {

		p_response.writeHead(200, "Content-Type", mimeType);
		p_response.end(cache);
		return;

	}

	fs.readFile(p_fileName, (p_error, p_data) => {

		p_response.setHeader("Content-Type", mimeType);

		if (p_error) {
			p_response.statusCode = 404;

			if (mimeType === ".html") {

				const page404 = s_fileCache["404.html"];

				if (page404) {
					p_response.end(page404);
				}

				return;

			}

			p_response.setHeader("Content-Type", "text/plain");
			p_response.end("404: Resource Not Found!...");

			return;

		}

		s_fileCache[p_fileName] = p_data;

		p_response.statusCode = 200;
		p_response.end(p_data);

		return;

	});

}
