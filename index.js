/**
 * Primary File for API
 * 
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');

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
	
	// log the request path
	console.log(`REQUEST: ${trimmedPath} with METHOD: ${method} with these QUERY_PARAMS: ${JSON.stringify(queryStringObject)}`)
	
	// send the response
	res.end('Hello World\n');
	
	
})

// start the server and have it listen on port 3000
server.listen(3000, ()=>{
	console.log('listening on port 3000')
})
