const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	var uri = url.parse(req.url).pathname
		, filename = path.join(process.cwd(), "client/" + uri);

	fs.exists(filename, function(exists) {
		if (!exists) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("file not found");
			res.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {        
				res.writeHead(500, {"Content-Type": "text/plain"});
				res.write(err + "\n");
				res.end();
				return;
			}

			res.writeHead(200);
			res.write(file, "binary");
			res.end();

			// console.log(`requested ${filename}`);
		});
	});
});

server.listen(port, hostname, () => {
	console.log(`listening at http://${hostname}:${port}/`);
});
