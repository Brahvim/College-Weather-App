document.addEventListener("DOMContentLoaded", () => {

	const elementFormFeedback = document.getElementById("feedbackForm");
	const elementMessageFeedback = document.getElementById("feedbackMessage");

	elementFormFeedback.addEventListener("submit", (p_event) => {

		p_event.preventDefault(); // The form RELOADS the page!!!

		const strName = document.getElementById("name").value.trim();
		const strEmail = document.getElementById("email").value.trim();
		const strMessage = document.getElementById("message").value.trim();

		elementMessageFeedback.classList.remove("hidden");

		// Do they even exist? FAIL!:
		if (!(strName && strEmail && strMessage)) {

			elementMessageFeedback.textContent = "Please fill out all fields.";
			elementMessageFeedback.style.color = "red";
			return;

		}

		// Success thingy:
		elementMessageFeedback.textContent = "Thank you for your feedback!";
		elementMessageFeedback.style.color = "green";

		// Clear all fields in form:
		elementFormFeedback.reset();

	});

});
