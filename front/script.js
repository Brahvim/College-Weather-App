// Define your API key
const apiKey = '';

// Function to fetch weather data for the main city
async function fetchWeather(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("City not found");
		}
		console.log("Fetching weather data...");
		const data = await response.json();
		displayWeather(data);
	} catch (error) {
		document.getElementById('weather-result').innerHTML = `<p> style="color: red;">${error.message}</p>`;
	}
}

// Function to display weather data on the main cards
function displayWeather(data) {
	document.getElementById("cityName").innerText = data.name;
	document.getElementById("temp2").innerText = data.main.temp;
	document.getElementById("temp").innerText = data.main.temp;
	document.getElementById("min_temp").innerText = data.main.temp_min;
	document.getElementById("max_temp").innerText = data.main.temp_max;
	document.getElementById("humidity2").innerText = data.main.humidity;
	document.getElementById("humidity").innerText = data.main.humidity;
	document.getElementById("feels_like").innerText = data.main.feels_like;
	document.getElementById("wind_degrees").innerText = data.wind.deg;
	document.getElementById("wind_speed2").innerText = data.wind.speed;
	document.getElementById("wind_speed").innerText = data.wind.speed;
	document.getElementById("sunrise").innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
	document.getElementById("sunset").innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();
}

// Function to fetch weather data for common places and display in the table
async function fetchCommonPlaceWeather(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("City not found");
		}
		console.log("Fetching weather data...");
		const data = await response.json();
		displayCommonPlaceWeather(city, data);
	} catch (error) {
		console.error(`Error fetching data for ${city}: ${error.message}`);
	}
}

// Function to dynamically display weather for common places in the table
function displayCommonPlaceWeather(city, data) {
	const tableBody = document.querySelector(".table-responsive tbody");
	const newRow = `
		<tr>
			<th scope="row" class="text-start">${city}</th>
			<td>${data.clouds.all}%</td>
			<td>${data.main.feels_like}°C</td>
			<td>${data.main.humidity}%</td>
			<td>${data.main.temp_max}°C</td>
			<td>${data.main.temp_min}°C</td>
			<td>${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</td>
			<td>${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</td>
			<td>${data.main.temp}°C</td>
			<td>${data.wind.deg}°</td>
			<td>${data.wind.speed} km/h</td>
		</tr>`;
	tableBody.innerHTML += newRow;
}

// Event listener for the search button to fetch data for the entered city
document.getElementById("submit").addEventListener("click", (event) => {
	event.preventDefault();
	const city = document.getElementById("city").value.trim();
	if (city) {
		// Clear any previous error message
		document.getElementById('weather-result').innerHTML = '';

		// Fetch data for the main weather display and common places table
		fetchWeather(city);
		fetchCommonPlaceWeather(city);
	} else {
		// Display a message if the input is empty
		document.getElementById('weather-result').innerHTML = '<p style="color: red;">Please enter a city name.</p>';
	}
});
