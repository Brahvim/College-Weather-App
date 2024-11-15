import http from "node:http"
import url from "node:url"

import mime from "mime"

import log from "./log.mjs"
import files from "./files.mjs"
import config from "./config.mjs"
import endpoints from "./endpoints.mjs"

const s_port = 8080;

const s_server = http.createServer(async (p_request, p_response) => {

	const queryUrl = p_request.url;
	const queryMethod = p_request.method;
	const queryUrlPath = queryUrl.split("?")[0];

	let queryEndpointName = "/index.html";

	if (queryUrlPath !== "/") {
		queryEndpointName = queryUrlPath;
	}

	const queryEndpointId = endpoints.getId(queryEndpointName);

	if (queryMethod === "GET") {

		if (queryEndpointName.indexOf(".") !== -1) {

			const cache = files.fromCache(queryEndpointName);

			if (!cache) {

				const data = files.load(`./front/${queryEndpointName}`);

				if (data) {

					const httpParamContentTypeValue = mime.getType(queryEndpointName);

					p_response.writeHead(200, "OK", "Content-Type", httpParamContentTypeValue);
					p_response.end(data);

				} else {

					files.fromCache(config["404"]);

				}

			}

		};

		endpoints.getMethodGet(queryEndpointId)(p_response, p_request);

	} else if (queryMethod === "POST") {

		endpoints.getMethodPost(queryEndpointId)(p_response, p_request);

	} else if (queryMethod === "PUT") {

		endpoints.getMethodPut(queryEndpointId)(p_response, p_request);

	} else if (queryMethod === "DELETE") {

		endpoints.getMethodDelete(queryEndpointId)(p_response, p_request);

	}

});

s_server.listen(s_port);
console.log(`Server active on [ https://localhost:${s_port} ].`);
