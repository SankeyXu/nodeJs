function route(handle,pathname,response,request,mimeType){
    if(mimeType){
		console.log(mimeType + "66666")
		return  handle["/publicFile"](pathname,response,request,mimeType);
	}else{
		return handle["/viewFile"](pathname,response,request,mimeType);
	}
}
//--------------------------------------------------------------------
exports.route = route;