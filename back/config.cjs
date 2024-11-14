const fs = require("fs");

const configData = fs.readFileSync("./server.json");
const configJson = JSON.parse(configData);

module.exports = configJson;
