/**
 * User Handlers
 */
// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require('./config');
const verifyToken = require('./tokens').verifyToken;
/**
 * @required data.payload = firstName, lastName, phone, password, tosAgreement
 *
 */
const checks = {
  get: function (data, callback) {
    const id = data.queryStringObject.id;
    if (id) {
      _data.read("checks", id, function (err, checkData) {
        if (!err) {
          // convert string from read to obj
		  const checkObj = helpers.parsedJsonToObject(checkData);
		  // get token
		  const tokenId = data.headers.token;
		  // verify token belongs to user requesting info
		  verifyToken(tokenId, checkData.userPhone, function(tokenIsValid){
			  if (tokenIsValid){
				// token approved return token data
				callback(200, checkObj);
			  } else {
				  callback(403, {error: "Check id does not belong to this user"})
			  }
		  })
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
			_data.read('tokens', token, function(err, tokenData){
				if(!err){
					// convert to object
					tokenData = JSON.parse(tokenData);
					const { phone } = tokenData;
					_data.read('users', phone, function(err, userData){
						if(!err){
							userData = JSON.parse(userData);
							// if userData has checks prop use otherwise start array
							const checks = userData.hasOwnProperty("checks") ? userData.checks : [];
							if(checks.length < config.maxChecks){
								// create a random id for check
								const checkId = helpers.randomString(20);
								const checkObj = {
									id: checkId,
									userPhone: phone,
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
							} else {
								callback(400, {error: "Unable to create new check, user has reached max number of checks"})
							}
						} else {
							callback(403, {error: "Unauthorized"})
						}
					})
				} else {
					callback(403, {error: "Token invalid or not found"})
				}
			})
		} else {
			callback(404, {Error: 'Token required'})
		}
	} else {
		callback(404, { Error: "Missing fields or Incorrect data" });
	}
  },
  put: function (data, callback) {
    const id =
      typeof data.payload.id == "string" &&
      data.payload.id.length
        ? data.payload.id
        : false;
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
		// id is required the other fields are optional
    if (id && (protocol || url || method || successCodes || timeoutSeconds)) {
		_data.read('checks', id, function(err, checkData){
			let checkObj = JSON.parse(checkData);
			verifyToken(id, checkObj.userPhone, function(isvalid){
				if(isValid){
					if (protocol) checkObj.protocol = protocol;
					if (url) checkObj.url = url;
					if (method) checkObj.method = method;
					if (successCodes) checkObj.successCodes = successCodes;
					if (timeoutSeconds) checkObj.timeoutSeconds = timeoutSeconds;
					_data.update('checks', id, checkObj, function (err){
						if (!err){
							callback(200)
						} else {
							callback(400)
						}
					})
				} else {
					callback(403)
				}
			})
		})
	} else {
		callback(404, { Error: "Missing fields or Incorrect data" });
	}
  },
  delete: function (data, callback) {
    const { id } = data.payload;
    _data.delete("checks", id, function (err) {
      if (!err) {
        //successful deletion
        callback(200, {
          success: `Successfully deleted check with id # ${id}`,
        });
      } else {
		  callback(400)
	  }
    });
  },
};

module.exports = checks;
