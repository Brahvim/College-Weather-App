export default {

	get: (p_response) => {
		p_response.writeHead(200, { "Content-Type": "text/plain" });
		p_response.end("Yay!... It worked!");
	},
	put: () => { },
	post: () => { },
	delete: () => { },

};
