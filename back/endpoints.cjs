//#region Module-static variables.
const s_emptyMethodImplementation = (p_response, p_request) => { };

const s_methodsPost = [s_emptyMethodImplementation];
const s_methodsGet = [s_emptyMethodImplementation];

const s_endpointDeleteIds = [0];
const s_endpointPostIds = [0];
const s_endpointGetIds = [0];
const s_endpointPutIds = [0];

const s_endpointNames = new Map();
s_endpointNames.set("", 0);
//#endregion

//#region Getters.
module.exports.endpointGetMethodPost = (p_id) => s_methodsPost[s_endpointPostIds[p_id]];
module.exports.endpointGetMethodGet = (p_id) => s_methodsGet[s_endpointGetIds[p_id]];
module.exports.endpointGetId = (p_name) => s_endpointNames.get(p_name) ?? 0;

module.exports.endpointDestroy = (p_name) => {
	const id = module.exports.endpointGetId(p_name);

	s_endpointNames.set(p_name, 0);
	s_endpointPostIds[id] = 0;
	s_endpointGetIds[id] = 0;
}

module.exports.endpointCreate = (p_name) => {
	const id = s_endpointNames.size;

	s_endpointNames.set(p_name, id);
	s_endpointPostIds[id] = 0;
	s_endpointGetIds[id] = 0;

	return id;
}

module.exports.endpointGetName = (p_id) => {
	for (const [k, v] of s_endpointNames) {

		if (v === p_id)
			return k;

	}

	return "";
}
//#endregion

//#region Setters.
module.exports.endpointSetMethodPost = (p_id, p_methodImpl) => {
	s_endpointPostIds[p_id] = s_methodsPost.push(p_methodImpl) - 1;
}

module.exports.endpointSetMethodGet = (p_id, p_methodImpl) => {
	s_endpointGetIds[p_id] = s_methodsGet.push(p_methodImpl) - 1;
}
//#endregion
