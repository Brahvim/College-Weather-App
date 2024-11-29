import fs from "fs"
import frontfs from "./frontfs.mjs"

const configData = fs.readFileSync("./server.json");
let configJson;

if (configData) {

	configJson = JSON.parse(configData);

} else {

	console.error("`server.json` not found.");

}

console.info("Caching files from `server.json`...");

// #region Caching files.
if (frontfs.load(configJson["/"])) {

	console.info("Page for `/` loaded.");

} else {

	console.info("Page for `/` not found!");
	configJson["/"] = "(Application main page goes here. Please configure `server.json`!)";

}

if (frontfs.load(configJson["500"])) {

	console.info("Page for `500` loaded.");

} else {

	console.info("Page for `500` not found!");
	configJson["500"] = "(Application `500` page goes here. Please configure `server.json`!)";

}

if (frontfs.load(configJson["404"])) {

	console.info("Page for `404` loaded.");

} else {

	console.info("Page for `404` not found!");
	configJson["404"] = "(Application `404` page goes here. Please configure `server.json`!)";

}
//#endregion

console.info("Done caching files from `server.json`...");

if (configJson.port) {

	console.info("Port loaded.");

} else {

	console.info("Port not found in `server.json`! Defaulting to `8000`...");
	configJson.port = 8000;

}

export default configJson;
