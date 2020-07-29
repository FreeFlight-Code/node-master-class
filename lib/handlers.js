// These are the request hanlders
// Dependencies
const _users = require('./users')
const _tokens = require('./tokens')
const _checks = require('./checks')


// Define handlers
const handlers = {
	checks: (data, callback)=>{
		var acceptableMethods = ['post', 'get', 'put', 'delete'];
		if (acceptableMethods.indexOf(data.method) > -1){
			_checks[data.method](data, callback);

		} else {
			callback(405, {Error: `Unauthorized/Unable to use method: ${data.method.toUpperCase()}`})
		}
	},
	users: (data, callback)=>{
		var acceptableMethods = ['post', 'get', 'put', 'delete'];
		if (acceptableMethods.indexOf(data.method) > -1){
			_users[data.method](data, callback);

		} else {
			callback(405, {Error: `Unauthorized/Unable to use method: ${data.method.toUpperCase()}`})
		}
	},
	tokens: (data, callback)=>{
		var acceptableMethods = ["post", "get", "put", "delete"];
		if (acceptableMethods.indexOf(data.method) > -1){
			_tokens[data.method](data, callback);
		} else {
			callback(405, {Error: `Unauthorized/Unable to use method: ${data.method.toUpperCase()}`});
		}
	},
  	ping: (data, callback) => {
    	callback(200);
  	},
  	notFound: (data, callback) => {
    	callback(404);
  	},
};

module.exports = handlers;