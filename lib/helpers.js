/**
 * Helper functions
 */
// Dependencies
const crypto = require('crypto');
const config = require('./config')

const helpers = {
	// accepts password and returns hashed password using SHA256
	hash: function (password){
		return crypto.createHmac('sha256', config.hashingSecret).update(password).digest('hex');
	},
	// takes string and return JSON object or false
	parsedJsonToObject: function(str){
		try{
			var obj = JSON.parse(str);
			return obj;
		} catch(e) {
			return {}
		}
	}
}


module.exports = helpers;