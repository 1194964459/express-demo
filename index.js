var express = require('express');
var http = require("http");
var app = express();

// 1. 指定静态文件目录
// app.use(express.static(__dirname + '/public'));

// 2. 动态网页 
// app.get 是路由，用于指定不同的访问路径所对应的回调函数
// app.get('/', function (req, res) {
//     res.send('Hello world!');
// });

// 3. 路由
// var routes = require('./routes')(app);

// 4. 中间件
// app.use("/home", function (request, response, next) {
//     // 操作
// });
// http.createServer(app).listen(8080);


app.listen(8080);