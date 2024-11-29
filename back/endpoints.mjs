import mime from "mime"
import fs from "node:fs"
import frontfs from "./frontfs.mjs";

// #region Module-static variables.
const s_names = new Map([{ "": 0 }]);

const s_methodsDelete = [() => { }];
const s_methodsPost = [() => { }];
const s_methodsPut = [() => { }];
const s_methodsGet = [() => { }];

const s_idsDelete = [0];
const s_idsPost = [0];
const s_idsGet = [0];
const s_idsPut = [0];
//#endregion

const endpoints = {

	// #region Getters.
	getMethodDelete: (p_id) => s_methodsDelete[s_idsDelete[p_id]],
	getMethodPost: (p_id) => s_methodsPost[s_idsPost[p_id]],
	getMethodPut: (p_id) => s_methodsPut[s_idsPut[p_id]],
	getMethodGet: (p_id) => s_methodsGet[s_idsGet[p_id]],
	getId: (p_name) => s_names.get(p_name) ?? 0,
	getName: (p_id) => {
		for (const [k, v] of s_names) {

			if (v === p_id)
				return k;

		}

		return "";
	},
	// #endregion

	// #region Setters.
	setMethodDelete: (p_id, p_methodImpl) => s_idsDelete[p_id] = s_methodsDelete.push(p_methodImpl) - 1,
	setMethodPost: (p_id, p_methodImpl) => s_idsPost[p_id] = s_methodsPost.push(p_methodImpl) - 1,
	setMethodPut: (p_id, p_methodImpl) => s_idsPut[p_id] = s_methodsPut.push(p_methodImpl) - 1,
	setMethodGet: (p_id, p_methodImpl) => s_idsGet[p_id] = s_methodsGet.push(p_methodImpl) - 1,
	// #endregion

	// #region Management.
	destroy: (p_name) => {
		const id = module.exports.getId(p_name);

		s_names.set(p_name, 0);
		s_idsPost[id] = 0;
		s_idsGet[id] = 0;
	},

	create: (p_name, p_get, p_put, p_post, p_delete) => {
		const id = s_names.size;

		s_names.set(p_name, id);
		s_idsDelete[id] = 0;
		s_idsPost[id] = 0;
		s_idsPut[id] = 0;
		s_idsGet[id] = 0;

		return id;
	},
	// #endregion

	createEndpointsFromEndpointsDir: async () => {
		const filesFrontend = fs
			.readdirSync(`./back/endpoints`)
			.filter((p_fileName) => p_fileName.endsWith(".mjs"))
			.map((p_fileName) => `./endpoints/${p_fileName}`);

		for (const f of filesFrontend) {

			// Leads VSCode into type-checking, hehe!:
			// if (typeof f !== 'string')
			// 	continue;

			const module = await import(f);
			const point = endpoints.create(f);

			endpoints.setMethodGet(module.get);
			endpoints.setMethodPut(module.put);
			endpoints.setMethodPost(module.post);
			endpoints.setMethodDelete(module.delete);
		}
	},

	createEndpointForFile: async (p_nameFile, p_nameEndpoint) => {
		const mimeType = mime.getType(p_nameFile);
		const point = endpoints.create(p_nameEndpoint);
		const data = frontfs.fromCache(p_nameFile) ?? frontfs.load(p_nameFile);

		endpoints.setMethodGet(point, async (p_response) => {
			p_response.writeHead(200, { "Content-Type": mimeType });
			p_response.end(data);
		});
	},

};

export default endpoints;
