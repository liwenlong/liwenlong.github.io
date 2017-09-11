//暴露全局的函数
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

})

	 