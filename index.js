/**
 * Primary File for API
 * 
 * 
 */

// Dependencies
const http = require('http');
const https = require('https')
const url = require('url');
const { StringDecoder } = require('string_decoder');
const stringDecoded = require('string_decoder').StringDecoder;
const config = require('./lib/config.js');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers.js');

// start the server and have it listen on port 3000
const httpServer = http.createServer((req, res)=>{
	unifiedServer(req, res)
})
httpServer.listen(config.httpPort, ()=>{
	console.log('listening on port ' + config.httpPort + ' in ' + config.envName + ' mode.')
})

// https server setup and start
const httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'certificate': fs.readFileSync('./https/certificate.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
	unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, () => {
  console.log(
    "listening on port " + config.httpsPort + " in " + config.envName + " mode."
  );
});


// All the server logic
var unifiedServer = function (req, res) {
		
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
	req.on('data', function (data) {
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
			'payload': helpers.parsedJsonToObject(buffer)
		}
		// Route the request to handler
		chosenHandler(data, function(statusCode, payload){
			// default status code
			statusCode = typeof statusCode == 'number' ? statusCode : 999;
			// payload = typeof payload == 'object' ? payload : {};

			// use payload from handler or default to empty object
			let payloadString = JSON.stringify(payload)
			res.setHeader('Content-Type', 'application/json')
			res.writeHead(statusCode);
			res.end(payloadString);
			
			// console.log(`Returning this STATUSCODE: ${statusCode}...PAYLOAD: ${payloadString}`)
		})
	});
}

// Define a request router
const router = {
	'checks' : handlers.checks,
	'tokens' : handlers.tokens,
	'ping' : handlers.ping,
	'users': handlers.users
}