//暴露全局的函数
window.addEventListener("load",function() {
     FastClick.attach( document.body );
}, false );
function GetRequest() {   
   var url = location.search; //获取url中"?"符后的字串   
   var theRequest = new Object();   
   if (url.indexOf("?") != -1) {   
      var str = url.substr(1);   
      strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
      }   
   }   
   return theRequest;   
}  
$(function(){

	//初始化页面的通用脚本
	//1、页面rem计算 
	function setZoom(){
		function reZoom(){
			var html = $("html");
			var pW = html.width();
			var fZ =pW/320*20;
				html.css("font-size",fZ);
		    }
		    reZoom();
		    $(window).resize(function(){
				reZoom();
			})
	}
	setZoom();
	$(".back").on("tap",function(){
		window.history.back()
	})
	//input的值初始化为记忆值
	$("input").one("tap",function(){
		$(this).val("");
	})


})

	 