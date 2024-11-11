const log = require("./log.cjs");
const server = require("./server.cjs");
const { sigint, sigterm } = require("./end.cjs");

const s_port = 8080;

process.on("SIGINT", sigint);
process.on("SIGTERM", sigterm);

server.listen(s_port);
log.i(`Find the server here!: http://localhost:${s_port}!`);
