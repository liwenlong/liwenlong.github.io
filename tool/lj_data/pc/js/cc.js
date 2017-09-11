// 橱窗切换js
window.DetailImageBox = {
    //{{{
    init : function(preBtn)
    {
        //{{{
        var that = this;
        this.curImgIndex = 1;
        this.curBigImg = $('#curBigImage');
        this.mouseCursor = $('#imgMouseCusor');
        this.initThumbNav();
        this.thumbNav.find('.pho_layer,.pho_cur').click(function(){
            that.thumbNavClick.call(that,$(this));
        });
        $('#detailImageBox').on('click','.cursor_up,.cursor_left,.detail-image-prev',function(e){
            that.prevImg.call(that);
        }).on('click','.cursor_right,.cursor_down,.detail-image-next',function(e){
            that.nextImg.call(that); 
        });

        this.checkScreenWidth();
        this.mouseCursor.bind('mousemove',this.cursorMouseMove);
        //}}}
    },
    initThumbNav : function()
    {
        //{{{
        this.thumbNav = $('.detail-thumb-nav li');
        //this.thumbNav.first().before(this.thumbNav.last());
        $('.detail-thumb-nav li').eq(1).find('.pho_cur').removeClass('pho_cur').addClass('pho_layer');
        $('.detail-thumb-nav li').eq(1).find('.pho_layer').removeClass('pho_layer').addClass('pho_cur');
        //}}}
    },
    cursorMouseMove : function(e){
        if(DetailImageBox.imgWidth == 800){
            if(e.offsetY <= DetailImageBox.imgHeight/2){
                DetailImageBox.mouseCursor.removeClass('cursor_up cursor_down cursor_left cursor_right').addClass('cursor_up');
            } else {
                DetailImageBox.mouseCursor.removeClass('cursor_up cursor_down cursor_left cursor_right').addClass('cursor_down');
            }
        } else {
            if(e.offsetX <= DetailImageBox.imgWidth/2){
                DetailImageBox.mouseCursor.removeClass('cursor_up cursor_down cursor_left cursor_right').addClass('cursor_left');
            } else {
                DetailImageBox.mouseCursor.removeClass('cursor_up cursor_down cursor_left cursor_right').addClass('cursor_right');
            }
        }
    },
    updateThumbNav : function(){
       //{{{
       if(this.thumbNav.length > 5){
            if(this.curImgIndex > this.medimIndex && this.curImgIndex<this.thumbNav.length - this.medimIndex-3){
                this.thumbNav.show();
                $('.detail-thumb-nav li:lt('+(this.curImgIndex - this.medimIndex)+')').hide();
            }else if(this.curImgIndex >= this.thumbNav.length - this.medimIndex-3){
                this.thumbNav.show();
                $('.detail-thumb-nav li:lt('+(this.thumbNav.length - this.navShowLength)+')').hide();
            }else{
                this.thumbNav.show();
            }
       }
       this.thumbNav.find('.pho_cur').removeClass('pho_cur').addClass('pho_layer');
       this.thumbNav.eq(this.curImgIndex).find('.pho_layer').removeClass('pho_layer').addClass('pho_cur');
       this.preLoadThumb();
       //}}}
    },
    thumbNavClick : function(element){
        //{{{
        this.curImgIndex = this.thumbNav.index(element.closest('li'));  
        this.changeImg();
        //}}}
    },
    prevImg : function () 
    {
        //{{{
        /*this.thumbNav = $('.detail-thumb-nav li');
        this.thumbNav.first().before(this.thumbNav.last());
        this.curImgIndex = 0;
        this.changeImg();*/
        this.curImgIndex --; 
        this.curImgIndex = this.curImgIndex < 0 ? this.thumbNav.length-1 : this.curImgIndex;
        this.changeImg();
        //}}}
    },
    nextImg : function()
    {
        //{{{
        /*this.thumbNav = $('.detail-thumb-nav li');
        this.thumbNav.last().after(this.thumbNav.first());
        this.curImgIndex = 2;
        this.changeImg();*/
        this.curImgIndex ++;
        this.curImgIndex = this.curImgIndex > this.thumbNav.length-1 ? 0 : this.curImgIndex;
        this.changeImg();
        //}}}
    },
    changeImg : function()
    {
        //{{{
        var that = this;
        var curNavImg = this.thumbNav.eq(this.curImgIndex).find('img');
        var curBigImg = this.curBigImg.get(0);
        curBigImg.onload = function(){
            var imgRate = curNavImg.attr('data-width')/curNavImg.attr('data-height');
            if(imgRate > 1 && imgRate <= 1.5){
                var imgWidth = that.imgWidth;
                var imgHeight = that.imgWidth/imgRate;
            } else {
                var imgHeight = that.imgHeight;
                var imgWidth = that.imgHeight*imgRate;
            }
            that.curBigImg.attr({'width':imgWidth,'height':imgHeight});
            //that.curBigImg.show();
            curBigImg.onload = null;
        };
        this.curBigImg.attr('src',curNavImg.attr('data-bigimg'));
        //this.curBigImg.hide();
        if(curNavImg.attr('data-intro') == ''){
            $('#curImgIntro').hide();
        } else {
            $('#curImgIntro').show();
        }
        $('#curImgIntro span').html(curNavImg.attr('data-intro'));
        $('.detail-thumb-nav li').find('.pho_cur').removeClass('pho_cur').addClass('pho_layer');
        $('.detail-thumb-nav li').eq(1).find('.pho_layer').removeClass('pho_layer').addClass('pho_cur');
        this.updateThumbNav();
        this.preLoadImg();
        //}}}
    },
    checkScreenWidth : function(){
        //{{{
        this.medimIndex = 1;
        if($('#detailImageBox').width() == 920){
            this.navShowLength = 6;
            this.imgWidth = 800;
            this.imgHeight = 533; 
            this.mouseCursor.width(800);
            this.mouseCursor.height(533);
        } else {
            this.navShowLength = 5;
            this.imgWidth = 620;
            this.imgHeight = 413;
            this.mouseCursor.width(620);
            this.mouseCursor.height(413);
        }
        this.changeImg();
        //}}}
    },
    preLoadImg : function(){
        //{{{
        var prevImgIndex = this.curImgIndex-1 < 0 ? this.thumbNav.length-1 : this.curImgIndex-1;
        var prevNavImg = this.thumbNav.eq(prevImgIndex).find('img');
        var prevImgElement = new Image();
        prevImgElement.src = prevNavImg.attr('data-bigimg');
        for(var i=1;i<3;i++){
            var nextImgIndex = this.curImgIndex+i > this.thumbNav.length-1 ? 0 : this.curImgIndex+i;
            var nextNavImg = this.thumbNav.eq(nextImgIndex).find('img');
            if(nextNavImg.attr('hasload') != '1'){
                var nextImgElement = new Image();
                nextImgElement.src = nextNavImg.attr('data-bigimg');
                nextNavImg.attr('hasload',1);
            }
        }
        //}}}
    },
    preLoadThumb : function(){
        var startIndex = this.curImgIndex - 6;
        startIndex = startIndex < 0 ? 0 : startIndex;
        var endIndex = this.curImgIndex + 6;
       $('.detail-thumb-nav li').slice(startIndex,endIndex).each(function(){
           var img = $(this).find('img');
           if(img.attr('hasload') != '1'){
               img.attr({'src':img.attr('data-src'),'hasload':1});
           }
       });
    }
    //}}}
}
