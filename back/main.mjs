import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

//#region Module-level declarations.
const s_port = 8000;
const s_app = express();

const s_dataWeatherEmpty = {

	"data.name": "",
	"data.main.temp": "",
	"data.main.temp": "",
	"data.main.temp_min": "",
	"data.main.temp_max": "",
	"data.main.humidity": "",
	"data.main.humidity": "",
	"data.main.feels_like": "",
	"data.wind.deg": "",
	"data.wind.speed": "",
	"data.wind.speed": "",
	"data.sys.sunrise": "",
	"data.sys.sunset": "",

};

const s_pathCwd = process.cwd();
const s_pathFront = process.env["dir.front"] || path.join(s_pathCwd, "front");
const s_pathFeedback = process.env["dir.feedback"] || path.join(s_pathCwd, "feedback");

const s_strDataWeatherEmpty = JSON.stringify(s_dataWeatherEmpty);

const s_keyApiOpenWeatherMap = process.env["secrets.keys.OpenWeatherMap"] || "";

async function fetchOpenWeatherMap(p_city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${p_city}&appid=${s_keyApiOpenWeatherMap}&units=metric`;
	const response = await fetch(url);

	if (!response.ok) {

		throw new Error();

	}

	return response.json();
}
//#endregion

s_app.use(express.static(s_pathFront));
s_app.use(bodyParser.urlencoded({ extended: true }));

//#region Files.
s_app.get("/", (p_request, p_response) => {

	p_response.sendFile(path.join(s_pathFront, "index.html"));

});

//#region API.
s_app.post("/feedback", (p_request, p_response) => {

	const { name, email, feedback } = p_request.body;
	const timestamp = Math.floor(Date.now() / 1_000); // Unix timestamp!

	const hash = crypto
		.createHash("sha256")
		.update(`${name}${email}${feedback}${timestamp}`)
		.digest("hex");

	fs.writeFile(
		`${s_pathFeedback}/${hash}.json`,
		JSON.stringify({ name, email, feedback, timestamp }),
		(p_error) => {

			if (p_error) {

				p_response
					.status(500)
					.sendFile(path.join(s_pathFront, "feedback-error.html"));

				return;
			}

			p_response
				.status(200)
				.sendFile(path.join(s_pathFront, "feedback-given.html"));

		}
	);

});

s_app.get("/weather", (p_request, p_response) => {

	const querySplit = p_request.url.split("?");

	if (querySplit.length === 1) {

		p_response.writeHead(400, "Content-Type", "application/json");
		p_response.end();
		return;

	}

	const query = querySplit[1];
	const paramQPair = query.split("&")[0];
	const paramQValue = paramQPair.split("=")[1];

	fetchOpenWeatherMap(paramQValue)
		.then((p_result) => {

			p_response
				.status(200)
				.send(p_result);

		})
		.catch((p_error) => {

			p_response
				.status(400)
				.send(s_strDataWeatherEmpty);

		});

});
//#endregion

s_app.listen(s_port, () => {

	console.log(`Server is running at [ http://localhost:${s_port} ].`);

});
//#endregion
