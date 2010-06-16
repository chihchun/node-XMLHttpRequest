require('./common');

// Test all supported methods
var methods = ["GET", "POST", "HEAD", "PUT", "DELETE"];
var curMethod = 0;

// Test server
var server = http.createServer(function (req, res) {
	assert.equal(methods[curMethod], req.method);
	assert.equal("/" + methods[curMethod], req.url);
	var body = "Hello World";
	res.writeHead(200, {
		"Content-Type": "text/plain",
		"Content-Length": body.length
	});
	if (req.method !== 'HEAD') res.write("Hello World");
	res.end();
	
	if (curMethod == methods.length - 1) {
		this.close();
		sys.puts("done");
	}
}).listen(8000);

// give the server some time to get ready so we don't race it
setTimeout(function() {
    function start(method) {
        sys.puts("Testing " + method);

        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (method !== 'HEAD') {
                    assert.equal("Hello World", this.responseText);
                }
                curMethod++;
            
                if (curMethod < methods.length) {
                    start(methods[curMethod]);
                }
            }
        };
        
        xhr.open(method, "http://localhost:8000/" + method);
        xhr.send();
    }

    start(methods[curMethod]);
},100);
