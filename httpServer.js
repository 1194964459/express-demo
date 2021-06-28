// Express框架建立在node.js内置的http模块上。http模块生成服务器的原始代码如下。

var http = require("http");

var app = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello world!");
});

app.listen(8080, "localhost");

// Express框架等于在http模块之上，加了一个中间层。