import mime from "mime"
import fs from "node:fs"
import http from "node:http"
import frontfs from "./frontfs.mjs"
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

		++s_countFailures;
		console.warn(`Request #${p_requestId} failed.`);
		console.error(`Exception calling HTTP method implementation for request #${p_requestId}: `, e);

	}
}

const s_server = http.createServer(async (p_request, p_response) => {
	const requestId = ++s_countRequests;
	console.info(`Received request #${requestId}`);

	const queryUrl = p_request.url;
	const queryMethod = p_request.method;
	const queryUrlPath = queryUrl.split("?")[0];
	const queryEndpointId = endpoints.getId(queryUrlPath);

	const urlRedirection = `<meta charset="utf-8" lang="en" http-equiv='refresh' content='2; URL=html/home.html' />`;

	if (queryMethod === "GET") {

		if (frontfs.canLoad(queryUrlPath)) {

			const cache = frontfs.fromCache(`./front/${queryUrlPath}`);

			if (cache) {

				const httpParamContentTypeValue = mime.getType(queryUrlPath);

				p_response
					.writeHead(200, { "Content-Type": httpParamContentTypeValue })
					.end(cache);

				++s_countSuccesses;
				console.info(`Request #${requestId} succeeded.`);

			} else {

				const data = frontfs.load(`./front/${queryUrlPath}`);

				if (data) {

					const httpParamContentTypeValue = mime.getType(queryUrlPath);

					p_response
						.writeHead(200, { "Content-Type": httpParamContentTypeValue })
						.end(data);

					++s_countSuccesses;
					console.info(`Request #${requestId} succeeded.`);

				} else {

					++s_countFailures;
					console.warn(`Request #${requestId} failed.`);

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

endpoints.createEndpointForFile(`./front/index.html`, "/");
endpoints.createEndpointsFromEndpointsDir();
s_server.listen(s_port);

console.log(`Server active on [ http://localhost:${s_port} ].`);
