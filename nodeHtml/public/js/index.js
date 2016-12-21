$(function(){
	var nowUrl = window.location.pathname;
	if(nowUrl == "" || nowUrl == "/"){
		nowUrl = "/index";
	}
	nowUrl = nowUrl.replace("/","");
	console.log(nowUrl)
	if(nowUrl.indexOf(".") != -1){
		nowUrl=nowUrl.split(".")[0]
	}else if(nowUrl == 'index'){
		$(".indexNav li").eq(0).addClass("active").siblings().removeClass("active");
	}else if(nowUrl == 'user'){
		$(".indexNav li").eq(1).addClass("active").siblings().removeClass("active");
	}else if(nowUrl == 'seeting'){
		$(".indexNav li").eq(2).addClass("active").siblings().removeClass("active");
	}
	ajaxRequest(nowUrl);
	history.replaceState({url:nowUrl,liIndex:0},document.title,nowUrl);
	
	
})
function pjax(obj,e){
	e.preventDefault();
	var url = $(obj).attr("href");
	var liIndex = $(obj).parent().index();
	ajaxRequest(url,liIndex);
	statePush(url,liIndex);
}
function ajaxRequest(url,liIndex){
	$(".indexNav li").eq(liIndex).addClass("active").siblings().removeClass("active");
	$.ajax({
		url: '/getFile',
		type:'post',
		data:url,
		success:function(data){
			if(data){
				$(".indexBody").load(data);
			}
		},
		error:function(){
			console.log("请求错误");
		}
	})
}
function statePush(url,liIndex){
	var state = {
		url: url,
		liIndex: liIndex
	};
	console.log(state.url)
	history.pushState(state,document.title,url);
	history.replaceState(state,document.title,url);
}

window.addEventListener('popstate',function(e){
	console.log(e)
	ajaxRequest(e.state.url,e.state.liIndex);
})