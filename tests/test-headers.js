require('./common');

// Test server
var server = http.createServer(function (req, res) {
    // HTTP specifies header fields to be case-insensitive,
    // (http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html)
    // and node.js lowercases them for ease of access.
    var header = "x-test";
	assert.equal("Foobar", req.headers[header]);
	
	var body = "Hello World";
	res.writeHead(200, {
		"Content-Type": "text/plain",
		"Content-Length": body.length
	});
	res.write("Hello World");
	res.end();
	
	this.close();
}).listen(8000);

// Give the server some time to get set up so we don't race it
setTimeout(function() {
    var XMLHttpRequest = require('../XMLHttpRequest').XMLHttpRequest;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        sys.puts('readystatechanged:'+xhr.readyState);
        if (this.readyState == xhr.DONE) {
            // Test getAllResponseHeaders()
            var headers = "Content-Type: text/plain\r\nContent-Length: 11\r\nConnection: close";
            assert.equal(headers.toLowerCase(), 
                         this.getAllResponseHeaders().toLowerCase());
            
            sys.puts("done");
        }
    };

    xhr.open("GET", "http://localhost:8000/");
    xhr.setRequestHeader("X-Test", "Foobar");
    xhr.send();
}, 100);
