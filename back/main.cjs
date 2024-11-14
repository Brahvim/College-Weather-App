const fs = require("fs");
const url = require("url");
const http = require("http");
const path = require("path");

const log = require("./log.cjs");

const {

	endpointCreate,
	endpointDestroy,
	endpointGetId,
	endpointGetName,
	endpointGetMethodGet,
	endpointGetMethodPut,
	endpointGetMethodPost,
	endpointGetMethodDelete,
	endpointSetMethodGet,
	endpointSetMethodPut,
	endpointSetMethodPost,
	endpointSetMethodDelete,

} = require("./endpoints.cjs");

const s_port = 8080;

const s_server = http.createServer((p_request, p_response) => {

	const endpointNameUnresolved = p_request.url.split("?")[0];
	let endpointName = "/index";

	if (endpointNameUnresolved !== "/") {
		endpointName = endpointNameUnresolved;
	}

	const endpointId = endpointGetId(endpointName);
	const method = p_request.method;

	if (method === "GET") {

		endpointGetMethodGet(endpointId)(p_response, p_request);

	} else if (method === "POST") {

		endpointGetMethodPost(endpointId)(p_response, p_request);

	} else if (method === "PUT") {

		endpointGetMethodPut(endpointId)(p_response, p_request);

	} else if (method === "DELETE") {

		endpointGetMethodDelete(endpointId)(p_response, p_request);

	}

});

s_server.listen(s_port);
