// require modules
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

// Array of Mime Types
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

// Create Server
http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), unescape(uri));

  // If it's a directory, default to index.html
  if (fs.existsSync(filename) && fs.lstatSync(filename).isDirectory()) {
    filename = path.join(filename, 'index.html');
  }

  // Check existence again
  fs.exists(filename, function(exists) {
    if (!exists) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404 Not Found\n');
      res.end();
      return;
    }

    // Path exists, get mime type
    var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
    if (!mimeType) {
      mimeType = 'application/octet-stream';
    }

    res.writeHead(200, {'Content-Type': mimeType});

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
  });

}).listen(3000, () => {
  console.log('Server running on port 3000');
});
