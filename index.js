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
	});
	
	// log the request path
	console.log(`
	REQUEST: ${trimmedPath}
	METHOD: ${method}
	QUERY_PARAMS: ${JSON.stringify(queryStringObject)}
	HEADERS: ${JSON.stringify(headers)}
	PAYLOAD: ${buffer}
	`)
	
	// send the response
	res.end('Hello World\n');
	
	
})

// start the server and have it listen on port 3000
server.listen(3000, ()=>{
	console.log('listening on port 3000')
})
