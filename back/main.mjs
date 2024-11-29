import path from "node:path";

import express from "express";

import config from "../server.json";

const s_app = express();
const s_port = config.port;

const s_pathFront = path.join(process.cwd(), "front/");

s_app.use(express.static(s_pathFront));

s_app.get("/", (p_request, p_response) => {

	p_response.sendFile(path.join(s_pathFront, "index.html"));

});

s_app.get("/weather", (p_request, p_response) => {


});

s_app.listen(s_port, () => {

	console.log(`Server is running at [ http://localhost:${s_port} ].`);

});
