const http = require("http");

const front = require("./front.cjs");

const s_requestListener = async (p_request, p_response) => {

	p_request.url = p_request.url === "/" ? "/index.html" : p_request.url;

	const endpoint = p_request.url.split("?")[0];

	try {

		const path = `${__dirname}/endpoints${endpoint}.cjs`;
		const requestType = p_request.method.toLowerCase();

		const module = require(path);
		module[requestType](p_response, p_request);

	} catch (e) {

		const fileName = `${process.cwd()}/front${p_request.url}`;
		front.send(p_response, fileName);

	}

}

// http.createServer((p_request, p_response) => {  });

module.exports = http.createServer(s_requestListener);
