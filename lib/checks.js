/**
 * User Handlers
 */
// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require('./config');
/**
 * @required data.payload = firstName, lastName, phone, password, tosAgreement
 *
 */
const checks = {
  get: function (data, callback) {
    const id = data.queryStringObject.id;
    if (id) {
      _data.read("checks", id, function (err, data) {
        if (!err && data) {
          // convert string from read to obj
          const checkObj = helpers.parsedJsonToObject(data);
          // delete password from user object
          delete checkObj.password;
          // user found return data
          callback(200, checkObj);
        } else {
          callback(404, { error: "Check not found." });
        }
      });
    } else {
      callback(404, { error: "Missing a required field" });
    }
  },
  post: function (data, callback) {
    const protocol =
      typeof data.payload.protocol == "string" &&
      ['https', 'http'].indexOf(data.payload.protocol) > -1
        ? data.payload.protocol
        : false;
    const url =
      typeof data.payload.url == "string" &&
      data.payload.url.length
        ? data.payload.url
        : false;
    const method = data.method;
    const successCodes =
      typeof data.payload.successCodes == "object" &&
      data.payload.successCodes instanceof Array &&
      data.payload.successCodes.length
        ? data.payload.successCodes
        : false;
    const timeoutSeconds =
      typeof data.payload.timeoutSeconds == "number" &&
      data.payload.timeoutSeconds > 0 &&
      data.payload.timeoutSeconds <= 5 &&
      data.payload.timeoutSeconds % 1 === 0
        ? data.payload.timeoutSeconds
        : false;
    if (protocol && url && method && successCodes && timeoutSeconds) {
		const token = data.headers.token && data.headers.token.length ? data.headers.token : false
		if(token){
			// look up token
			_data.readPromise('tokens', token)
			.then(tokenData=>{
				//   convert to object
				const { phone } = tokenData;
				_data.readPromise('users', phone)
				.then(userData =>{
				//  if userData has checks prop use otherwise start array
					const checks = userData.hasOwnProperty("checks") ? userData.checks : [];
					if(checks.length < config.maxChecks){
						// create a random id for check
						const checkId = helpers.randomString(20);
						const checkObj = {
							id: checkId,
							protocol: protocol,
							url, url,
							method: method,
							successCodes: successCodes,
							timeoutSeconds: timeoutSeconds
						}
						checks.push(checkId)
						_data.create('checks', checkId, checkObj, function(err){
							if(err){
								console.log(err)
								callback(403, {error: "Unable to create Check"})
							} else {
								let newUserObj = {...userData, checks}
								_data.update('users', phone, newUserObj, function(err){
									if(err){
										callback(400, {err: err})
									} else {
										callback(200, checkObj)
									}
								})
							}
						})
					}
				}).catch(err => callback(403, {error: "Unauthorized"}))
			}).catch(err => callback(403, {error: "Missing Fields"}))
		} else {
			callback(403, {error: 'Token required'})
		}
	} else {
		callback(403, { error: "Missing fields or Incorrect data" });
	}
  },
};

module.exports = checks;
