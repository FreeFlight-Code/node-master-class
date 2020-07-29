/**
 * Helper functions
 */
// Dependencies
const crypto = require('crypto');
const config = require('./config');
const _data = require('./data');

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
	},
	randomString: function (numOfChar){
		//creates a string of random characters of length provided by argument
		if(typeof numOfChar === 'number' && numOfChar > 0){
			const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			let str = '';
			for (let i = 0; i < numOfChar; i++){
				let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
				str += randomChar;
			}
			return str;
		} else {
			return '';
		}
	}
}


module.exports = helpers;