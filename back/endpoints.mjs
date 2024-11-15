import fs from "fs"
import path from "path"

import log from "./log.mjs";

//#region Module-static variables.
const s_emptyMethodImplementation = (p_response, p_request) => { };

const s_methodsDelete = [s_emptyMethodImplementation];
const s_methodsPost = [s_emptyMethodImplementation];
const s_methodsPut = [s_emptyMethodImplementation];
const s_methodsGet = [s_emptyMethodImplementation];

const s_endpointDeleteIds = [0];
const s_endpointPostIds = [0];
const s_endpointGetIds = [0];
const s_endpointPutIds = [0];

const s_endpointNames = new Map();
s_endpointNames.set("", 0);
//#endregion

export default {
	createHtmlEndpoints: (p_dir) => {
		const files = fs.readdirSync("./front");
		// const filesHtml = files.filter((p_file) => p_file.endsWith(".html"));

		const filesNoExt = files.map((p_file) => {

			let idDot = p_file.lastIndexOf(".");

			if (idDot === -1) {
				idDot = p_file.length();
			}

			const strNameNoExt = p_file.substring(0, idDot);
			return strNameNoExt;

		});

		for (const f of files) {
			log.i(f);
		}
	},

	// Getters.
	getMethodDelete: (p_id) => s_methodsDelete[s_endpointDeleteIds[p_id]],
	getMethodPost: (p_id) => s_methodsPost[s_endpointPostIds[p_id]],
	getMethodPut: (p_id) => s_methodsPut[s_endpointPutIds[p_id]],
	getMethodGet: (p_id) => s_methodsGet[s_endpointGetIds[p_id]],
	getId: (p_name) => s_endpointNames.get(p_name) ?? 0,

	destroy: (p_name) => {
		const id = module.exports.getId(p_name);

		s_endpointNames.set(p_name, 0);
		s_endpointPostIds[id] = 0;
		s_endpointGetIds[id] = 0;
	},

	create: (p_name) => {
		const id = s_endpointNames.size;

		s_endpointNames.set(p_name, id);
		s_endpointPostIds[id] = 0;
		s_endpointGetIds[id] = 0;

		return id;
	},

	getName: (p_id) => {
		for (const [k, v] of s_endpointNames) {

			if (v === p_id)
				return k;

		}

		return "";
	},

	// Setters.
	setMethodDelete: (p_id, p_methodImpl) => s_endpointDeleteIds[p_id] = s_methodsDelete.push(p_methodImpl) - 1,
	setMethodPost: (p_id, p_methodImpl) => s_endpointPostIds[p_id] = s_methodsPost.push(p_methodImpl) - 1,
	setMethodPut: (p_id, p_methodImpl) => s_endpointPutIds[p_id] = s_methodsPut.push(p_methodImpl) - 1,
	setMethodGet: (p_id, p_methodImpl) => s_endpointGetIds[p_id] = s_methodsGet.push(p_methodImpl) - 1,
};