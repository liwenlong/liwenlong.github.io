(function(){
	function setZoom(){
		function reZoom(){
			var html = $("html");
			var pW = html.width();
			console.log(pW);
			var fZ =pW/10.8;
				html.css("font-size",fZ);
		    }
		    reZoom();
		    $(window).resize(function(){
				reZoom();
			})
	}
	setZoom();
})();

