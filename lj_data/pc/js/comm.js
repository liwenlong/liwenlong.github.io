$(function(){
		
			//login 内容
			$(".login_xl").on("click",function(){
				 if($(this).hasClass("hover")){
				 	$(this).removeClass("hover");
				 	$(this).find(".login_info").hide();
				 }else{
				 	$(this).addClass("hover");
				 	$(this).find(".login_info").show();
				 }
			})
			
})