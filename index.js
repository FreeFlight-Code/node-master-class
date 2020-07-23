/**
 * Primary File for API
 * 
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');


// start the server and have it listen on port 3000
const server = http.createServer((req, res)=>{
		
	// parse url
	const parsedUrl = url.parse(req.url, true);
	
	// get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const chosenHandler = router.hasOwnProperty(trimmedPath)
        ? router[trimmedPath]
        : handlers.notFound;

	chosenHandler(function (payloadJson) {

		res.setHeader("Content-Type", "application/json");

		res.end(JSON.stringify(payloadJson));

		console.log(`REQUEST route: ${trimmedPath}`);
    });
})
server.listen(3000, ()=>{
	console.log('listening on port 3000')
})

// Define the handlers
const handlers = {
	hello: (callback)=>{
		callback({"message": "Welcome to my simple api"})
	},
	notFound: (callback)=>{
		callback(404)
	}
}

// Define a request router
const router = {
	'hello' : handlers.hello
}