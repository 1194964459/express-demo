# Express 框架

参考：
* 阮一峰讲解Express：https://javascript.ruanyifeng.com/nodejs/express.html


## 一、中间件
中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。

* 每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件）。
* 每个中间件都可以对HTTP请求（request对象）进行加工，并且决定是否调用next方法，将request对象再传给下一个中间件。
* 中间件没有调用next方法，request对象就不再向后传递了。


```js
// 中间件抛出一个错误
function uselessMiddleware(req, res, next) {
  next('出错了！');
}
```

**注册中间件**：
use是express注册中间件的方法，它返回一个函数。

use 可以对访问路径进行判断，据此就能实现简单的路由，根据不同的请求网址，返回不同的网页内容。
```js
app.use(function(request, response, next) {
    if (request.url == "/about") {
        response.writeHead(200, { "Content-Type": "text/plain" });
    } else {
        next();
    }
});
```

除了在回调函数内部判断请求的网址，use方法也允许将请求网址写在第一个参数。这代表，只有请求路径匹配这个参数，后面的中间件才会生效。无疑，这样写更加清晰和方便。

```js
// 可写成
app.use("/about", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Welcome to the about page!\n");
});
```

## 二、Express的方法

### 2.1 all方法和HTTP动词方法
* (1) all方法表示，所有请求都必须通过该中间件，参数中的“*”表示对所有路径有效。
* (2) get方法则是只有符合路径的GET请求通过该中间件。
* (3) 除了get方法以外，Express还提供post、put、delete方法，即HTTP动词都是Express的方法。

```js
app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});
```

匹配请求的路径时，除了绝对匹配以外，Express也允许模式匹配。
```js
app.get("/hello/:who", function(req, res) {
    res.end("Hello, " + req.params.who + ".");
});
```
上面代码将匹配“/hello/alice”网址，网址中的alice将被捕获，作为req.params.who属性的值。

如果在模式参数后面加上问号，表示该参数可选。
```js
app.get('/hello/:who?',function(req,res) {
    // ...
}    
```


### 2.2 set方法用于内部变量的值。
```js
app.set("views", __dirname + "/views");

app.set("view engine", "jade");
```
上面代码使用set方法，为系统变量“views”和“view engine”指定值。

### 2.3 response对象
<code>response.redirect</code>方法：允许网址的重定向。
<code>response.sendFile</code>方法：用于发送文件。
<code>response.render</code>方法：用于渲染网页模板。
```js
app.get("/", function(request, response) {
  response.render("index", { message: "Hello World" });
});
```
上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。

### 2.4 requst对象
<code>request.ip</code>：获得HTTP请求的IP地址。
<code>request.files</code>：获取上传的文件。

### 2.5 搭建HTTPs服务器
使用Express搭建HTTPs加密服务器，也很简单。
```js
// 秘钥相关
var fs = require('fs');
var options = {
  key: fs.readFileSync('E:/ssl/myserver.key'),
  cert: fs.readFileSync('E:/ssl/myserver.crt'),
  passphrase: '1234'
};

// 同 http 服务器一致
var https = require('https');
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World Expressjs');
});

var server = https.createServer(options, app);
server.listen(8084);
console.log('Server is running on port 8084');
```

## 三、项目开发实例
见：[项目开发实例](./app.js)

## 四、Express.Router用法
从Express 4.0开始，路由器功能成了一个单独的组件Express.Router。它好像小型的express应用程序一样，有自己的use、get、param和route方法。

### 4.1 基本用法
Express.Router是一个构造函数，调用后返回一个路由器实例。然后，使用该实例的HTTP动词方法，为不同的访问路径，指定回调函数；最后，挂载到某个路径。

```js
var router = express.Router();

router.get('/', function(req, res) {
  res.send('首页');
});

router.get('/about', function(req, res) {
  res.send('关于');
});

app.use('/', router);  // 挂载在根目录下
```

如果最后一行改为<code>app.use(‘/app’, router)</code>，则相当于为<code>/app和/app/about</code>这两个路径。

### 4.2 router.route方法
```js
var router = express.Router();

router.route('/api')
	.post(function(req, res) {
		// ...
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) res.send(err);
			res.json(bears);
		});
	});

app.use('/', router);
```
