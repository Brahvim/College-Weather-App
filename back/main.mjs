import mime from "mime"
import http from "node:http"
import files from "./files.mjs"
import config from "./config.mjs"
import endpoints from "./endpoints.mjs"

let s_countRequests = 0;
let s_countFailures = 0;
let s_countSuccesses = 0;

const s_port = config.port; // Do the de-ref here.

function callMethodImpl(p_requestId, p_methodImpl, p_response, p_request) {
	try {

		p_methodImpl(p_response, p_request);

	} catch (e) {

		declareRequestFailure(p_requestId);
		console.error(`Error calling HTTP method implementation for request #${p_requestId}: `, e);

	}
}

function declareRequestFailure(p_requestId) {
	++s_countFailures;
	console.warn(`Request #${p_requestId} failed.`);
}

function declareRequestSuccess(p_requestId) {
	++s_countSuccesses;
	console.info(`Request #${p_requestId} succeeded.`);
}

const s_server = http.createServer(async (p_request, p_response) => {
	const requestId = ++s_countRequests;
	console.info(`Received request #${requestId}`);

	const queryUrl = p_request.url;
	const queryMethod = p_request.method;
	const queryUrlPath = queryUrl.split("?")[0];

	// Node probably handles this? (Firefox and `curl` both failed to get `../` in the URL here!)
	// if (queryUrlPath.search("..") != 0) {
	//
	// 	++s_countTotalFailures;
	//
	// 	p_response
	// 		.writeHead(500, { "Content-Type": "text/html" })
	// 		.end(config["500"]);
	//
	// 	return;
	//
	// }

	const queryEndpointId = endpoints.getId(queryUrlPath);

	if (queryMethod === "GET") {

		// if (queryUrlPath.indexOf(".") !== -1) {
		if (files.canLoad(queryUrlPath)) {

			const cache = files.fromCache(queryUrlPath);

			if (cache) {

				const httpParamContentTypeValue = mime.getType(queryUrlPath);

				p_response
					.writeHead(200, { "Content-Type": httpParamContentTypeValue })
					.end(cache);

				declareRequestSuccess(requestId);

			} else {

				const data = files.load(`./front/${queryUrlPath}`);

				if (data) {

					const httpParamContentTypeValue = mime.getType(queryUrlPath);

					p_response
						.writeHead(200, { "Content-Type": httpParamContentTypeValue })
						.end(data);

					declareRequestSuccess(requestId);

				} else {

					declareRequestFailure(requestId);

					p_response
						.writeHead(400, { "Content-Type": "text/html" })
						.end(config["404"]);

				}

			}

		};

		callMethodImpl(requestId, endpoints.getMethodGet(queryEndpointId), p_response, p_request);
		return;

	} else if (queryMethod === "PUT") {

		callMethodImpl(requestId, endpoints.getMethodPut(queryEndpointId), p_response, p_request);
		return;

	} else if (queryMethod === "POST") {

		callMethodImpl(requestId, endpoints.getMethodPost(queryEndpointId), p_response, p_request);
		return;

	} else if (queryMethod === "DELETE") {

		callMethodImpl(requestId, endpoints.getMethodDelete(queryEndpointId), p_response, p_request);
		return;

	}

	p_response.writeHead(400, { "Content-Type": "text/plain" });
	p_response.end();
});

s_server.listen(s_port);
console.log(`Server active on [ http://localhost:${s_port} ].`);
