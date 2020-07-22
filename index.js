/**
 * Primary File for API
 * 
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const stringDecoded = require('string_decoder').StringDecoder;

const server = http.createServer((req, res)=>{
	
	// parse url
	const parsedUrl = url.parse(req.url, true);
	
	// get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// get the request method
	const method = req.method.toLowerCase();

	// get the query string as an object
	const queryStringObject = parsedUrl.query;

	// get headers
	const headers = req.headers;

	// get and parse payload if available
	const decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', function () {
		buffer += decoder.write(data);
	});
	req.on('end', function () {
		buffer += decoder.end();

		// choose the handler this request should go to, if not found use notFound handler
		const chosenHandler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;
		const data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': buffer
		}
		// Route the request to handler
		chosenHandler(data, function(statusCode, payload){
			// default status code
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};



			// use payload from handler or default to default payload
			let payloadString = JSON.stringify(payload)
			res.setHeader('Content-Type', 'application/json')
			res.writeHead(statusCode);
			res.end(payloadString);
			
			console.log(`Returning this STATUSCODE: ${statusCode}...PAYLOAD: ${payloadString}`)
		})
	});
})

// start the server and have it listen on port 3000
server.listen(3000, ()=>{
	console.log('listening on port 3000')
})

// Define the handlers
const handlers = {
	sample: (data, callback)=>{
		callback(406, {'name': 'sample handler'})
	},
	notFound: (data, callback)=>{
		callback(404)
	}
}

// Define a request router
const router = {
	'sample' : handlers.sample
}