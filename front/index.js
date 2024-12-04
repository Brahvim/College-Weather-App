//#region Static definitions.
async function fetchCity(p_city) {
	const response = fetch(`/weather?q=${p_city}`);
	return response;
}

function displayError() {
	document.getElementById("weather-result").innerHTML = `<p style="color: red;"> Please enter a city name. </p>`;
}

function displayClearCity() {
	document.getElementById("temp").innerText = "";
	document.getElementById("temp2").innerText = "";
	document.getElementById("sunset").innerText = "";
	document.getElementById("sunrise").innerText = "";
	document.getElementById("cityName").innerText = "";
	document.getElementById("humidity").innerText = "";
	document.getElementById("max_temp").innerText = "";
	document.getElementById("min_temp").innerText = "";
	document.getElementById("humidity2").innerText = "";
	document.getElementById("feels_like").innerText = "";
	document.getElementById("wind_speed").innerText = "";
	document.getElementById("wind_speed2").innerText = "";
	document.getElementById("wind_degrees").innerText = "";
}

function displayClearError() {
	document.getElementById("weather-result").innerHTML = "";
}

function displayCurrentCity(p_data) {
	document.getElementById("cityName").innerText = p_data.name;
	document.getElementById("temp").innerText = p_data.main.temp;
	document.getElementById("temp2").innerText = p_data.main.temp;
	document.getElementById("wind_degrees").innerText = p_data.wind.deg;
	document.getElementById("wind_speed").innerText = p_data.wind.speed;
	document.getElementById("humidity").innerText = p_data.main.humidity;
	document.getElementById("max_temp").innerText = p_data.main.temp_max;
	document.getElementById("min_temp").innerText = p_data.main.temp_min;
	document.getElementById("wind_speed2").innerText = p_data.wind.speed;
	document.getElementById("humidity2").innerText = p_data.main.humidity;
	document.getElementById("feels_like").innerText = p_data.main.feels_like;
	document.getElementById("sunset").innerText = new Date(p_data.sys.sunset * 1000).toLocaleTimeString();
	document.getElementById("sunrise").innerText = new Date(p_data.sys.sunrise * 1000).toLocaleTimeString();
}

function displayAddTableEntry(p_data) {
	const tableBody = document.querySelector(".table-responsive tbody");

	// <tr id="table-entry-${p_data.name.replaceAll(" ", "-")}">
	const newRow = `
		<tr>
			<th scope="row" class="text-start">${p_data.name}</th>
			<td>${p_data.clouds.all}%</td>
			<td>${p_data.main.feels_like}°C</td>
			<td>${p_data.main.humidity}%</td>
			<td>${p_data.main.temp_max}°C</td>
			<td>${p_data.main.temp_min}°C</td>
			<td>${new Date(p_data.sys.sunrise * 1000).toLocaleTimeString()}</td>
			<td>${new Date(p_data.sys.sunset * 1000).toLocaleTimeString()}</td>
			<td>${p_data.main.temp}°C</td>
			<td>${p_data.wind.deg}°</td>
			<td>${p_data.wind.speed} km/h</td>
		</tr>
		`;

	tableBody.innerHTML += newRow;
}

function displayFetchedCityAsEntry(p_city) {
	fetchCity(p_city)
		.then(async (p_response) => {

			const data = await p_response.json();
			displayAddTableEntry(data);

		})
		.catch(async (p_error) => {

			displayError();

		});
}

function displayFetchedCityAsCurrent(p_city) {
	fetchCity(p_city)
		.then(async (p_response) => {

			const data = await p_response.json();
			displayCurrentCity(data);

		})
		.catch(async (p_error) => {

			displayError();

		});
}
//#endregion

/* // Default cities display (table):

for (const c of [

	"Dehradun",
	"Kolkata",
	"Punjab",
	"Goa",

]) {
	s_setCityEntries.add(c);
	displayFetchedCityAsEntry(c);
}

*/

document.addEventListener("DOMContentLoaded", () => {

	// Event listener for search button:
	document.getElementById("submit").addEventListener("click", (p_event) => {

		p_event.preventDefault();

		const city = document.getElementById("city").value.trim();

		if (city) {

			// Clear previous error text, if any:
			document.getElementById("weather-result").innerHTML = "";

			displayFetchedCityAsEntry(city);
			displayFetchedCityAsCurrent(city);

		} else {

			// Haha, nope!:
			displayError();

		}

	});

	// We assume it's actually present. SIMPLE SOFTWARE!:
	const elementSearchBar = document.getElementById("city");

	// Event listener for search bar:
	document.addEventListener("keypress", (p_event) => {

		const key = p_event.key;

		// ...**Not** using a guard clause here, just in case...:
		if (key === "f" || key === "F") {

			elementSearchBar.focus();

		}

	});

});
