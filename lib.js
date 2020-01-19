var http = require('http');
var fs = require('fs');
var path = require('path');

var argTypes = {
  '-p': 'port',
  '-f': 'path'
};

function parseArgs(args) {
  var parsed = {};
  var keys = Object.keys(argTypes);
  for (var i = 0; i < args.length; ++i) {
     if (keys.includes(args[i]) && i < args.length - 1) {
        parsed[argTypes[args[i]]] =  args[i + 1];
     };
  }
  return parsed;
}

var options = Object.assign(
  {
    port: 8080,
    path: './public'
  },
  parseArgs(process.argv.slice(2))
);


http.createServer(function (request, response) {
    var filePath;
    if (request.url === '/') {
      filePath = path.resolve(process.cwd(), './dist', './index.html');
    } else {
      filePath = path.resolve(process.cwd(), './dist', '.' + request.url);
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('', 'utf-8');
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(options.port);
console.log(`Server running at http://127.0.0.1:${options.port}/`);