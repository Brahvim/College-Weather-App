export default {

	v: (p_message, ...p_extras) => console.log("[VERBOSE] " + p_message, p_extras.toString()),
	e: (p_message, ...p_extras) => console.log("[ERROR] " + p_message, p_extras.toString()),
	d: (p_message, ...p_extras) => console.log("[DEBUG] " + p_message, p_extras.toString()),
	w: (p_message, ...p_extras) => console.log("[WARN] " + p_message, p_extras.toString()),
	i: (p_message, ...p_extras) => console.log("[INFO] " + p_message, p_extras.toString()),

};
