// library for storing and editing data

// Dependencies
var fs = require('fs');
var path = require('path');

// container for the module
const lib = {};

// Basedirectory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');

lib.create = function(dir, file, data, callback){
	// open the file for writing

	fs.open(lib.baseDir+'/'+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
		if(!err && fileDescriptor){
			// convert data to string
			var stringData = JSON.stringify(data)
			// write data to file and close
			fs.writeFile(fileDescriptor, stringData, function (err) {
				if(!err){
					fs.close(fileDescriptor, function(err){
						if(!err){
							callback(false)
						} else {
							callback("Error closing file");
						}
					})
				} else {
					callback('Error writing to file')
				}
			})
		} else {
			callback('Could not create new file, it may already exist')
		}
	})
}

// read from a file
lib.read = function (dir, file, callback){
	fs.readFile(lib.baseDir+'/'+dir+'/'+file+'.json', 'utf8', function (err, data){
		callback(err, data)
	}) 
}

// update file with new data
lib.update = function (dir, file, data, callback) {
  // open the file for writing
  fs.open(lib.baseDir + '/' + dir + "/" + file + ".json", "r+", function (err, fileDescriptor) {
    if (!err && fileDescriptor) {
	  // convert data to string
	  console.log('open')
      var stringData = JSON.stringify(data);
      // write data to file and close
      fs.ftruncate(fileDescriptor, function (err) {
		  console.log('trunc')
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function (err) {
			  console.log('write')
            if (!err) {
				fs.close(fileDescriptor, function (err) {
					console.log('close')
            		if (!err) {
              			callback(false);
            		} else {
              			callback("Error closing existing file");
            		}
          		});
            } else {
              callback("Error writing to file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Could not open file to update it may not exist");
    }
  });
};
lib.delete = function (dir, file, callback){
	//unlink the file
	fs.unlink(lib.baseDir+'/'+dir+'/'+file+'.json', function(err){
		if(!err){
			callback(false)
		} else {
			callback('Error deleting file, possibly file did not exist')
		}
	})
}



// export the module
module.exports = lib;