function init(data){
	//vue实例
	setZoom();
	setAjaxDate(data);
	window.bigPci_vm  = new Vue({
		el:"#bigPic",
		data:glob_data.bigPic,
		 replace: false,
		template:$("#bigPic_script").html()
	})
	window.tj_vm  = new Vue({
		el:".sy_list",
		data:glob_data.tj,
		 replace: false,
		template:$("#list_script").html()
	})
	init_house();
	init_room();
	setTimeout(function(){
		setSllider();
		listMore();

	})
	
}
function initCan(){
	var now = new Date();
	window.cander= new Calendar({
                display: 4,
                type: 'multiple',
                el: $('#calendar'),
                currentDate: now,
                firstFloatMsg: ['请选择入住日期'],
                secondFloatMsg: ['请选择离店日期'],
                dateArea: 7,
                callback: function() {
                    var dates = this.getSelectedDate();
                    if (dates.length < 2) {
                        return false;
                    }
                    // checkinDate = new Date(dates[0]);
                    // checkoutDate = new Date(dates[1]);
                    // checkinInput.val(dates[0]);
                    // checkoutInput.val(dates[1]);
                    // self._setCheckin(checkinDate);
                    // self._setCheckout(checkoutDate);
                    // self.setNight();
                    // history.back();
                },
                bottom_center: function() {
                    if (this.settings.type == 'multiple') {
                        if (this._getSelectedDate().length == 1) {
                            return '入住';
                        } else {
                            return '离店';
                        }
                    } else {
                        return '';
                    }
                }
        });
	 // $("#getCalender").tap(function(){
		// var data = window.cander._getSelectedDate();
		// set_data("",getCalender)
	 // })
}
function setZoom(){
	function reZoom(){
		var html = $("html");
		var pW = html.width();
		var fZ =pW/320*20;
		html.css("font-size",fZ);
    }
    reZoom();
}
//slider
function setSllider(){

    /* fz 即 FrozenJS 的意思 */

    var slider = new fz.Scroll('.ui-slider', {
        role: 'slider',
        indicator: true,
        autoplay: true,
        interval: 3000
    });
    window.slider1=slider;

    /* 滑动开始前 */
    slider.on('beforeScrollStart', function(from, to) {
        // from 为当前页，to 为下一页
    })

    /* 滑动结束 */
    slider.on('scrollEnd', function(cruPage) {
        // curPage 当前页
    });

}
function load_list(data){
	for(var i=0;i<data.shop_list.length;i++){
		glob_data.tj.list.push(data.shop_list[i]);
	}
}
function listMore(){
	//加载更多
	$('.scroll_content').dropload({
        scrollArea : window,
        loadDownFn : function(me){
			$.ajax({
			 	url:'http://ljdf.dotalk.cn/api-cgi-index/index',
			 	dataType:'jsonp',
			 	data:{
			 		"_from":"pc",
	 				page:curPage
			 	},
			 	timeout:1000,
			 	success:function(data){
			 		if(data.code!==0){
			 			alert("网络异常")
			 		}else{
			 			load_list(data.data);
			 			me.resetload();
			 		}
			 	}
			})
		}
        
    });	
}
function getAjaxDate(){
	 var ajaxInfo={
	 	url:"http://ljdf.dotalk.cn/api-cgi-index/index",
	 	ajaxPra:{
	 		"_from":"pc",
	 		page:curPage
	 	},
	 	curPage:curPage  //控制是第几次取数据
	 }
	 $.ajax({
	 	url:ajaxInfo.url,
	 	dataType:'jsonp',
	 	data:ajaxInfo.ajaxPra,
	 	timeout:1000,
	 	success:function(data){
	 		console.log(data);
	 		if(data.code!==0){
	 			alert("网络异常")
	 		}else{
	 			if(curPage==0){
	 				init(data.data);
		 		}
		 		curPage++;
	 		}
	 		
	 		
	 	}
	 })
}
function setAjaxDate(data){
	//只需要修改全局数据即可
	var banner =data.banner;
	var shoplist =data.shop_list;
	for(var i = 0;i<banner.length;i++){
		glob_data.bigPic.list.push(banner[i]);
	}
	for(var j = 0;j<shoplist.length;j++){
		glob_data.tj.list.push(banner[j]);
	}
}
function init_event_house(){
	$("#dialog_btn1").tap(function(){
		var _this =$(this);
		// var offsetY =$(this).offset().top;
		// window.scrollTo(0,offsetY-10);
	 //   	window.scrollTo(0,offsetY-10);
	   	dia1 = $("#ui-city").dialog("show");
	   
	})
	//小区实时过滤
	var list = $(".city_list_fist li");
	var valueText = $(".city_input input");
	var lastModify = Date.now();
	valueText.on("input propertychange",function(){
			if(Date.now()-lastModify <50){
				return;
			}
			var isTrue =false;
			var value = $(this).val();
			var curText ="";
			list.each(function(index){
			   curText =$(this).text();
			   
			   if(curText.indexOf(value)!=-1){
			   	  isTrue  =  true;
			   	  $(this).addClass("choose");
			   }else{
			   	  $(this).removeClass("choose");
			   }
			})
			
			if(!isTrue) return;
			list.parent().addClass("choose_praent");
			lastModify = Date.now();
	})	
	$(".city_list_fist dl dd").tap(function(){
		 var jq = $(this).html();
		 var city = $(this).parent().parent().find("p").html();
		 $(".se_1 .select_span").hide();
		 $(".se_1 .city_data").show();
		 $(".se_1 .city_data").html(city+"</br>"+jq);
		 $(".se_4").attr("house_area_id",$(this).attr("village_id"));
	})
	$(".city_input input").tap(function(){
		if($(this).val() =="请输入城市或小区" ){
			$(this).val("");
		}
	})
	$(".city_qx").tap(function(){
		$(".city_input input").val("");
	})
}
function init_house(){
	$.ajax({
	 	url:'http://ljdf.dotalk.cn/api-cgi-product/areahouse',
	 	dataType:'jsonp',
	 	data:{
	 		"_from":"pc",
	 	},
	 	timeout:1000,
	 	success:function(data){
	 		console.log(data);
	 		if(data.code===0){
	 			window.house_vm  = new Vue({
					el:"#house_name",
					data:data,
					replace: false,
					template:$("#house_script").html()
				})
				setTimeout(function(){
					init_event_house();
					//end
				},200)
	 		}
	 	}
	})
	
}
function init_room(){
	$.ajax({
	 	url:'http://ljdf.dotalk.cn/api-cgi-product/housetype',
	 	dataType:'jsonp',
	 	data:{
	 		"_from":"pc",
	 	},
	 	timeout:1000,
	 	success:function(data){
	 		console.log(data);
	 		if(data.code===0){
	 			window.house_vm  = new Vue({
					el:"#room_name",
					data:data,
					replace: false,
					template:$("#room_script").html()
				})
				setTimeout(function(){
					init_event_room();
					//end
				},200)
	 		}
	 	}
	})
	
}

function init_event_room(){
	$("#dialog_btn3").tap(function(){
		var _this =$(this);
		// var offsetY =$(this).offset().top;
		// window.scrollTo(0,offsetY-10);
	 	// window.scrollTo(0,offsetY-10);
	   	var dia3 = $("#ui-house").dialog("show");
	})
	$(".house_chose li").tap(function(){ 
	   		var hoseValue = $(this).html();
	   		$(".se_3 .select_span").hide();
			$(".se_3 .cander_data").show();
			$(".se_3 .cander_data").html(hoseValue);
			$(".se_4").attr("house_type",$(this).attr("house_type"));
	   		
	})
}
$(function(){
	//日历
	initCan();
	// setScroll();
	//弹框
	var dia1,dia2,dia3;
	$("#dialog_btn2").tap(function(){
		// var offsetY =$(this).offset().top;
		// window.scrollTo(0,offsetY-10);
	 //   	window.scrollTo(0,offsetY-10);
	    dia2=$("#ui-calendar").dialog("show");
	   
	})
	
	//选项卡操作
	//1、日历确认
	$("#getCalender").tap(function(){
		 var dataArr = window.cander._getSelectedDate();//[2016-03-03,2016-04-6]
		 $(".se_2 .select_span").hide();
		 $(".se_2 .cander_data").show();
		 $(".se_2 .cander_data").html(dataArr[0]+"</br>"+dataArr[1]);
		 $(".se_4 ").attr("start_day",dataArr[0]);
		 $(".se_4 ").attr("end_day",dataArr[1]);
	})
	$(".se_4").tap(function(){
		var search_url = "http://ljdf.dotalk.cn/api-cgi-product/list"
		//house_area_id=102&start_day=3_12&end_day=3_18 
		//house_type 
		var house_area_id = $(this).attr("house_area_id");
		var start_day = $(this).attr("start_day").slice(5);
		var end_day = $(this).attr("end_day").slice(5);
		var house_type =$(this).attr("house_type");
		var getSearchUrl = search_url+"?house_area_id="+house_area_id+"&"+"start_day="+start_day
		   +"&"+"end_day="+end_day+"&"+"house_type="+house_type;
		 console.log(getSearchUrl);
	})

})
