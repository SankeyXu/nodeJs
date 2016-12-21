var foo = require("http");
var url = require('url');
var fs= require('fs');
//--------------------------------------------------------------------
//启动服务器模块
function start(route,handle){
	var mime =  contentType();
	function onRequest(request,response){
		var postdata="";
		var pathname = url.parse(request.url).pathname;
		response.setHeader("Server","Node/V8");
		request.setEncoding('utf-8');
		console.log("00" + pathname)
		var i = request.url.lastIndexOf(".");
		var urlType = request.url.substr(i,request.url.length);
		var mimeType =  mime[urlType]?mime[urlType]:false;//判断是文件请求还是路径请求
		route(handle,pathname,response,request,mimeType);
	}
	foo.createServer(onRequest).listen(9090);
}
//--------------------------------------------------------------------
//连接文件的属性
function contentType(){
	var plain = fs.readFileSync("./contentType.json",'utf-8')
	return JSON.parse(plain);
}
//--------------------------------------------------------------------
exports.start = start;