import fs from "fs"

const configData = fs.readFileSync("./server.json");
const configJson = JSON.parse(configData);

export default configJson;
