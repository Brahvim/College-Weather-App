async function fetchCity(p_city) {
	return (await fetch(`/weather?q=${p_city}`)).json();
}

function displayError() {
	document.getElementById("weather-result").innerHTML = `<p style="color: red;">Please enter a valid city name.</p>`;
}

function clearFields() {
	document.getElementById("temp").innerText = "--";
	document.getElementById("humidity").innerText = "--";
	document.getElementById("wind_speed").innerText = "--";
}

function displayWeatherData(p_data) {
	// *Do we have the fields (not their subs) that we care about?:*
	if (p_data.main && p_data.wind) {

		document.getElementById("temp").innerText = `${p_data.main.temp} °C`;
		document.getElementById("humidity").innerText = `${p_data.main.humidity} %`;
		document.getElementById("wind_speed").innerText = `${p_data.wind.speed} km/h`;

	} else {

		displayError();

	}
}

document.addEventListener("DOMContentLoaded", () => {

	const eltBarSearch = document.getElementById("city");

	document.addEventListener("keypress", (p_event) => {

		const key = p_event.key;

		if (key === "f" || key === "F")
			eltBarSearch.focus();

	});

	document.getElementById("submit").addEventListener("click", (p_event) => {
		p_event.preventDefault(); // Prevent `<form>` from reloading the page. This STILL doesn't work.
		// Backend *still has to* serve a file.

		const city = document.getElementById("city").value.trim()

		if (city) {

			fetchCity(city)
				.then((p_data) => displayWeatherData(p_data))
				.catch(() => displayError());

		} else {

			displayError();

		}
	});

	// Dark mode toggle:
	document.getElementById("dark-mode-toggle").addEventListener("click", () => {

		document.body.classList.toggle("dark-mode");

	});

});
