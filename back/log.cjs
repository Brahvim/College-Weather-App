module.exports.d = (p_message, ...p_extras) => {

	console.log("[DEBUG] " + p_message, p_extras);

}

module.exports.e = (p_message, ...p_extras) => {

	console.log("[ERROR] " + p_message, p_extras);

}

module.exports.i = (p_message, ...p_extras) => {

	console.log("[INFO] " + p_message, p_extras);

}
