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
	const trimmedPath = path.replace(/^\/+|\/+$/g, '')
	
	// log the request path
	console.log(`REQUEST: ${trimmedPath}`)
	
	// send the response
	res.end('Hello World\n');
	
	
})

// start the server and have it listen on port 3000
server.listen(3000, ()=>{
	console.log('listening on port 3000')
})
