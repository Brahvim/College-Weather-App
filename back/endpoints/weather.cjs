const env = require("dotenv");

const s_keyApiOpenWeatherMap = env.parse("secrets.keys.OpenWeatherMap") || "";

async function fetchWeather(p_city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${p_city}&appid=${s_keyApiOpenWeatherMap}&units=metric`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error();
	}

	return response.json();
}

function sendEmptyData(p_response) {
	p_response.end(JSON.stringify({
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
	}));
}

module.exports.get = async (p_response, p_request) => {

	const querySplit = p_request.url.split("?");

	if (querySplit.length === 1) {
		p_response.writeHead(404, "Content-Type", "application/json");
		sendEmptyData(p_response);
		return;
	}

	const query = querySplit[1];
	const paramQPair = query.split("&")[0];
	const paramQValue = paramQPair.split("=")[1];

	fetchWeather(paramQValue)
		.then((p_result) => {
			p_response.writeHead(200, "Content-Type", "application/json");
			p_response.end(p_result);
		})
		.catch((p_error) => {
			p_response.writeHead(200, "Content-Type", "application/json");
			sendEmptyData(p_response);
		});
}
