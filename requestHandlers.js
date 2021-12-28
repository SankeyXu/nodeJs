var fs = require('fs');
var url = require('url');
var path=require('path');
var CATHE_TIME=60;
var indexPage='';
//--------------------------------------------------------------------
//访问项目html/css/js/img入口
function publicFile(pathname,response, request,mimeType) {
	var pathname = path.resolve(__dirname,"./" + pathname);
	var fileInfo=fs.statSync(pathname);
    var lastModified=fileInfo.mtime.toUTCString();//最新修改时间
    var ifModifiedSince = "If-Modified-Since".toLowerCase();
    response.setHeader('Last-Modified',lastModified);//文件的最后一次修改时间
//  可以设置有效期
//  var date=new Date();
//  date.setTime(date.getTime()+CATHE_TIME*1000);
//  response.setHeader('Expires',date.toUTCString());
//  response.setHeader('Cathe-Control','max-age='+CATHE_TIME);
//  over有效期（有效期内将不会访问服务器，直接提取浏览器缓存）
    if(request.headers[ifModifiedSince] && lastModified==request.headers[ifModifiedSince]){//根据文件的最新修改时间，判断文件是否变化
        response.writeHead(304,"没有修改");
        response.end();
    }else{//发生了修改或无缓存时从服务器读取文件
    	fs.readFile(pathname, function(error, file) {
		    if (error) {
		      console.log(error);
		      response.writeHead(500, { "Content-Type":"text/plain"});
		      response.write(error + "\n");
		      response.end();
		    } else {
		      response.writeHead(200, { "Content-Type": mimeType });
		      response.write(file);
		      response.end();
		    }
	    })
    }
}
//--------------------------------------------------------------------
//一级菜单ajax请求路径入口
function viewFile(pathname,response, request,mimeType) {
	if(pathname=='/getFile'){
		getFile(pathname,response, request,mimeType);
	}else{
		var pathname ="index.html";
		var fileInfo=fs.statSync(pathname);
	    var lastModified=fileInfo.mtime.toUTCString();//最新修改时间
	    var ifModifiedSince = "If-Modified-Since".toLowerCase();
	    response.setHeader('Last-Modified',lastModified);//文件的最后一次修改时间
	    
		if(!indexPage || (request.headers[ifModifiedSince] && lastModified!=request.headers[ifModifiedSince])){//判断页面是否已经存在左部菜单
			fs.readFile("./index.html", function(error, file) {
			 	response.writeHead(200, { "Content-Type": "text/html" });
			 	indexPage=file;
				response.end(indexPage);
			 })
		}else{
			response.end(indexPage);//抛回左部的固定菜单。
		}
	}
}
//--------------------------------------------------------------------
//根据路径解析文件并返回给客户端
function getFile(pathname,response, request,mimeType) {
	var postData='';
	request.on('data',function(chunk){
		postData+=chunk;
	});
	request.on('end',function(){
		postData =  postData.replace("/","");
		var url=pageUrl(postData)
		response.end(url);
	})
}
//--------------------------------------------------------------------
//路径匹配文件解析
function pageUrl(url){
	var plain = fs.readFileSync("./pathUrl.json",'utf-8')
	return JSON.parse(plain)[url];
}
//--------------------------------------------------------------------
exports.publicFile = publicFile;
exports.viewFile = viewFile;
