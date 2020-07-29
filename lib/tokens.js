/**
 * Token Handlers
 */
// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
/**
 * @required data.payload = phone, password
 *
 */
const tokens = {
  get: function (data, callback) {
    const id = data.queryStringObject.id;
    _data.read("tokens", id, function (err, data) {
      if (id) {
        if (!err && data) {
          const tokenObj = JSON.parse(data);
          // delete password from token object
          delete tokenObj.password;
          // token found return data
          callback(200, tokenObj);
        } else {
          callback(404, { error: "Token not found." });
        }
      } else {
        callback(404, { error: "Missing a required field" });
      }
    });
  },
  post: function (data, callback) {
    const phone =
      typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length >= 10
        ? data.payload.phone.trim()
        : false;
    const password =
      typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;
    if (phone && password) {
      // Get user info
      _data.read("users", phone, function (err, data) {
        if (err || !data) {
          // user found check password
          callback(400, {
            "error": "Check credentials, phone or password are incorrect",
          });
        } else {
                 // user found convert data to userObj
                 const userObj = helpers.parsedJsonToObject(data);
                 // create tokenObj
                 const tokenId = helpers.randomString(20);
                 const tokenObj = {
                   id: tokenId,
                   phone,
                   expires: Date.now() + 1000 * 60 * 60, // expires in 1 hour from now
                 };

                 // check if passwords match
                 const passwordsMatch = helpers.hash(password) == userObj.password;

                 // if passwords match store user information in users folder, file name will be phone number
                 if (passwordsMatch) {
                   _data.create("tokens", tokenId, tokenObj, function (err) {
                     if (!err) {
                       callback(200, tokenObj);
                     } else {
                       console.log("Error creating new token");
                       callback(400, { error: "Could not create new token" });
                     }
                   });
                 } else {
                   callback(404, { error: "Password is incorrect" });
                 }
               }
      });
    } else {
      callback(400, { error: "Missing required fields" });
    }
  },
  put: function (data, callback) {
    // Make sure token exists
    _data.read("tokens", data.payload.id, function (err, tokenData) {
      if (!err && tokenData) {
		  const tokenObj = helpers.parsedJsonToObject(tokenData);
		// token found if not expired extend 1 hour
		if (tokenObj.expires > Date.now()){
			tokenObj.expires = Date.now() + 1000 * 60 * 60; // updates token expiration 1 hour from now
			_data.update("tokens", tokenObj.id, tokenObj, function (err) {
			  if (!err) {
				callback(200, {success: 'Updated token successfully'});
			  } else {
				console.log("Error refreshing token");
				callback(400, { error: "Could not update token" });
			  }
			});

		} else {
			callback(404, {error: 'token is expired, log in again'})
		}
      } else {
        // user not found send error
        callback(400, { error: `Token not found, unable to update` });
      }
    });
  },
  delete: function (data, callback) {
	/**
	 * @TODO only allow users to delete their own tokens
	 */
    const { id } = data.payload;
    _data.delete("tokens", id, function (err) {
      if (!err) {
        //successful deletion
        callback(200, {
          success: `Successfully deleted token.`,
        });
      }
    });
  },
};

module.exports = tokens;
