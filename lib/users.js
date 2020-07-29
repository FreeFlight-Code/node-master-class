/**
 * User Handlers
 */
// Dependencies
const _data = require('./data')
const helpers = require('./helpers')
/**
 * @required data.payload = firstName, lastName, phone, password, tosAgreement
 * 
 */
 const users = {
	 get: function (data, callback){
		 const phone = data.queryStringObject.phone;
		 if(phone){
			_data.read('users', phone, function(err, data){
				if(!err && data){
					// convert string from read to obj
					const userObj = helpers.parsedJsonToObject(data)
					// delete password from user object
					delete userObj.password;
					// user found return data
					callback(200, userObj);
				} else {
					callback(404, {error: 'User not found.'})
				}
			})
		} else {
			callback(404, {error: 'Missing a required field'})
		}
	 },
	 post: function (data, callback) {

		const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
		const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
		const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
		const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
		if (firstName && lastName && phone && password && tosAgreement){
			// Make sure user doesn't already exist
			_data.read('users', phone, function(err, data){
				if(!err){
					// user found return err, can't create user if already exists
					callback(400, {'error' : 'A user with that phone number already exists'})
				} else {
					// user not found create user
					const hashedPassword = helpers.hash(password)
					const userObj = {firstName, lastName, phone, tosAgreement, password: hashedPassword}
					// store user information in users folder, file name will be phone number
					if(hashedPassword){
						_data.create("users", phone, userObj, function (err) {
							if (!err) {
								callback(200, {message: `User created with phone ${phone}`});
							} else {
								console.log("Error creating new user");
								callback(400, { 'error': "Could not create new user" });
							}
                      	});
					} else {
						callback(404,{'error': 'Error hashing user\'s password'})
					}
				}
			})
		} else {
			callback(400,{'error': 'Missing required fields'})
		}

	 },
	 put: function (data, callback){
			// Make sure user exists
			_data.read('users', data.payload.phone, function(err, userData){
				if(!err && userData){
					// user found update info
					// create a userObj that replaces any information in the stored user with info in the payload
					//convert string to JSON
					const parsedUserObj = helpers.parsedJsonToObject(userData)
					let {firstName, lastName, password, tosAgreement, phone} = parsedUserObj;

					if(data.payload.firstName) firstName = data.payload.firstName;
					if(data.payload.lastName) lastName = data.payload.lastName;
					// if(data.phone) phone = data.phone;
					/**
					 * @TODO update phone
					 * If you want to update phone you need to create a new file and delete the old
					 */
					if(data.payload.tosAgreement) tosAgreement = data.payload.tosAgreement;
					if(data.payload.password) password = helpers.hash(password);

					const userObj = {firstName, lastName, phone, tosAgreement, password}
					// store user information in users folder, file name will be phone number

					_data.update("users", phone, userObj, function (err) {
						if (!err) {
							callback(200, {success: 'User updated'});
						} else {
							console.log("Error updating user");
							callback(400, { 'error': "Could not update new user" });
						}
					});
				} else {
					// user not found send error
					callback(400, {'error': `User not found, unable to update`})
				}
			})
	 },
	 delete: function (data, callback){
		 console.log(data)
		 const {phone} = data.payload;
		 _data.delete('users', phone, function (err){
			if(!err){
				//successful deletion
				callback(200, {success: `Successfully deleted user with phone # ${phone}`})
			}
		 })

	 }
 }

 module.exports = users;