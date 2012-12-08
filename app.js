var http = require('http');
var fs = require('fs');
var url = require('url');

var server = http.createServer(function(req, res) {
  // your normal server code
  var path = url.parse(req.url).pathname;
  if (/\.(js|html)$/.test(path)){
    try {
    	fs.readFile(path.substr(1), function(err, html) {
				res.writeHead(200, {'Content-Type': 'text/' + (path.substr(-3) === '.js' ? 'javascript' : 'html')});
	      res.write(html);
	      res.end();
    	});
    } catch(e) {
      // send404(res);
	  }               
  } else if (/\.(css)$/.test(path)) {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end();
  } else {
  	console.log('neither');
  }

  // send404(res);
});


server.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');