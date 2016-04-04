 var numToStr = function(n,num) {
    numStr = num.toString();
    var l = numStr.length;
    for (var i=1; i<= n - l;++i) {
        numStr = '0'+numStr;
    }
    return numStr;
}
function scrollPage(obj)
{
    var windowHeight = $(window).height();
    var offsetTop = parseInt(obj.offset().top);
    var scrollTop = $(document).scrollTop();
    var suggestionHeight = obj.height();
    if( (windowHeight - (offsetTop - scrollTop)) - suggestionHeight < 0 ) {
        var newTopHeight = scrollTop + (suggestionHeight + 10 ) - (windowHeight - (offsetTop - scrollTop)); 
        $('html,body').animate({ scrollTop: newTopHeight }, 300);
    }
}
    var calendarV2 = function(e, options) {
        options = options || {};
        this.maxDate = options.maxDate || 7;
        this.classWeek   = options.classWeek || 'calendar-week';
        this.classTitle   = options.classTitle || 'calendar-title';
        this.classMonth   = options.classMonth || 'calendar-month';
        this.classDay   = options.classDay || 'calendar-day';
        this.classDayBase   = options.classDayBase || 'line2';
        this.classDayShow   = options.classDayShow || 'show-date';
        this.classDaySelect = options.classDaySelect || 'cal_select';
        this.classDayPass = options.classDayPass || 'old';
        this.classDayUnSelectAble = options.classDayUnSelectAble || 'unselectable';
        this.classPink = options.classPink || 'pink';
        this.prependHtml   = options.prependHtml || '';
        this.today   = options.today || new Date();

        this.fillDayInfo = options.fillDayInfo || null;
        this.getDayInfo  = options.getDayInfo || null;

        this.checkState = 0;
        this.doColor = false;

        this.checkIn      = options.checkIn || null;
        this.checkOut     = options.checkOut || null;
        this.checkDayChange = options.checkDayChange || function(){};
        this.setDay = new Date();

        this.dateArray      = [];
        this.monthArray     = [];
        this.calenderHTML   = '';
        this.clearDateHtml   = '';
        this.preMonthHtml   = '';
        this.nextMonthHtml   = '';
        this.totalMohth     = 2;
        this.firstGray = false;

        this.e = typeof(e) == 'object' ? e : $(e);

        this.init();

        return(this);
    }
    calendarV2.prototype.init = function() {
        this.dateArray      = [];
        this.monthArray     = [];
        this.calenderHTML   = '';
        this.checkState = 0;
        this.gengerateCalArray().gengerateCalHtml().fillCalender();
        this.bindEvent();
        return(this);
    }
    calendarV2.prototype.preMonth = function() {
        if((this.today.getMonth() == this.firstDate.m) && (this.today.getFullYear() == this.firstDate.y) ){
            return false;
        }
        else {
            this.setDay.setDate(1);
            (this.firstDate.m == 0) ? (this.setDay.setMonth(11)) : this.setDay.setMonth(this.firstDate.m-1);
            (this.firstDate.m == 0) ? (this.setDay.setFullYear(this.firstDate.y-1)) : this.setDay.setFullYear(this.firstDate.y);
            this.dateArray      = [];
            this.monthArray     = [];
            this.calenderHTML   = '';
            this.checkState = 0;
            this.gengerateCalArray().gengerateCalHtml().fillCalender();
            this.bindEvent();
            return(this);
        }
    }
    calendarV2.prototype.nextMonth = function() {
        this.setDay.setDate(1);
        (this.lastDate.m == 0) ? this.setDay.setMonth(11) : (this.setDay.setMonth(this.lastDate.m-1));
        (this.lastDate.m == 0) ? this.setDay.setFullYear(this.lastDate.y-1) :this.setDay.setFullYear(this.lastDate.y);
        this.dateArray      = [];
        this.monthArray     = [];
        this.calenderHTML   = '';
        this.checkState = 0;
        this.gengerateCalArray().gengerateCalHtml().fillCalender();
        this.bindEvent();
        return(this);
    }
    calendarV2.prototype.setYmd = function(y,m,d, isDisplay) {
        var cdate = new Date();
        this.setDay = new Date();
        m = isDisplay ? m - 1 : m;
        cdate.setDate(1);
        cdate.setMonth(m);
        cdate.setFullYear(y);
        cdate.setDate(d);
        return cdate;
    }
    calendarV2.prototype.getYmd = function(s) {
        //return s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate();// + '  ' + s.getDay();
        return s.getFullYear() + '-' + numToStr(2,s.getMonth() + 1) + '-' + numToStr(2,s.getDate());// + '  ' + s.getDay();
    }

    calendarV2.prototype.gengerateCalArray = function() {
        //this.dateArray = [];
        for (var i = 0; i <= this.totalMohth; i++) {
            var toMonth = this.setDay.getMonth();
            for (var j = 1; j <= 37; j++) {
                this.setDay.setDate(j);
                if (this.setDay.getMonth() != toMonth){
                    break;
                }
                this.dateArray.push({y:this.setDay.getFullYear(),m:this.setDay.getMonth(),d:this.setDay.getDate(),w:this.setDay.getDay()});
            };
        };
        this.firstDate = this.dateArray[0];
        this.lastDate  = this.dateArray[this.dateArray.length -1];
        return(this);
    }

    calendarV2.prototype.gengerateCalHtml = function() {
        this.calenderHTML = '';
        this.monthArray = [];
        var m = -1;
        var len = this.dateArray.length - 1;
        for (var i = 0; i <= len; i++) {
            var day = this.dateArray[i];
            var cc = this.setYmd(day.y,day.m,day.d,false);
            if (m == -1) m = day.m;
            if (m != day.m) {
                this.calenderHTML += this.genMonth();
                this.monthArray = [];
                m = day.m;
            }
            this.monthArray.push(day);
        };
        return(this);
    }

    calendarV2.prototype.genDate = function(day) {
        var writeDay = this.setYmd(day.y,day.m,day.d,false);
        var old = '';
        var unselectable = '';
        var checkDay = '';
        var isToday = this.getYmd(writeDay) == this.getYmd(this.today) ? 1 : 0;
        var dayText = isToday ? '今天' : day.d;

        if (writeDay < this.today) old = this.classDayPass;
        if (writeDay>=this.today && writeDay < this.checkIn && this.checkOut == null) unselectable = this.classDayUnSelectAble;
        if (    (this.checkIn && writeDay <= this.checkOut && writeDay > this.checkIn) || 
                (this.checkOut && this.getYmd(writeDay) == this.getYmd(this.checkOut)) ||  
                (this.checkIn && this.getYmd(writeDay) == this.getYmd(this.checkIn))
           ) {
               checkDay = this.classDaySelect;
           } 
        if (this.checkIn && this.getYmd(writeDay) == this.getYmd(this.checkIn)) dayText = '入住';
        if (this.checkOut && this.getYmd(writeDay) == this.getYmd(this.checkOut)) dayText = '离开';
        if(old) {
            var li_classes = [this.classDayBase, old, checkDay];
        }
        else if(unselectable) {
            var li_classes = [this.classDayBase, unselectable];
        }
        else {
            var li_classes = [this.classDayBase, this.classDayShow, checkDay];
        }
        var li_html =  '<li class="'+ li_classes.join(' ') +'" d="'+day.d+'" m="'+day.m+'" y="'+day.y+'" w="'+day.w+'" today="'+isToday+'" ymd="'+this.getYmd(writeDay)+'" ><span>'+ dayText +'</span>';
        var new_html = '';
        if ( this.fillDayInfo) new_html = this.fillDayInfo(li_html);
        return new_html == '' ? li_html : new_html;
    }

    calendarV2.prototype.genMonth = function() {
        var dayHtml = '';
        var len = this.monthArray.length - 1;
        for (var i = 0; i <= len ; i++) {
            var day = this.monthArray[i];
            if (i==0) dayHtml+=this.genEmptyDay(day.w);
            var dayHtml = dayHtml + this.genDate(day);
        };
        dayHtml+=this.genEmptyDay(6 - day.w);
        var preHtml = 
            '<div class="'+this.classMonth+'">'+
            '<div class="'+this.classTitle+'">'+
            '<h2 cury="'+day.y+'" curm="'+(day.m + 1)+'">'+day.y+'-'+(day.m + 1)+'</h2>'+
            '</div>'+
            '<ul class="'+this.classWeek+'">'+
            '<li class="pink">日</li>' +
            '<li>一</li>' +
            '<li>二</li>' +
            '<li>三</li>' +
            '<li>四</li>' +
            '<li>五</li>' +
            '<li class="pink">六</li>' +
            '</ul>';
        var afterHtml = '</div>';
        return preHtml + '<ul class="'+this.classDay+'">'+dayHtml+'</ul>' + afterHtml;
    }

    calendarV2.prototype.genEmptyDay = function(num) {
        var emptyday = '';
        for (var i = 1; i<= num; i++) {
            emptyday+='<li class="'+this.classDayPass+' '+this.classDayBase+'"></li>';
        }
        return emptyday;
    }

    calendarV2.prototype.fillCalender = function() {
        this.e.html(this.prependHtml + this.calenderHTML + this.closeHTML() + this.clearDateHTML() + this.preMonthHTML() + this.nextMonthHTML());
        this.e.find('.' + this.classMonth).first().addClass('paddingR10');
        this.e.find('.' + this.classMonth).first().children('.' + this.classTitle).addClass('width_274');
        return(this);
    }
    calendarV2.prototype.clearSelect = function() {
        var _this = this;
        this.e.find('.checkedday,' + '.' + this.classDaySelect).each(function(){
            if ($(this).attr('today') == '1') {
                $(this).find('span').html('今天');
            } else {
                $(this).find('span').html($(this).attr('d'));
            }
            if (_this.fillDayInfo) _this.fillDayInfo($(this));

        })
        .removeClass('checkedday');
        this.e.find('.' + this.classDaySelect).removeClass(this.classDaySelect);
        this.e.find('.' + this.classDayUnSelectAble).addClass(this.classDayShow).removeClass(this.classDayUnSelectAble);
        $("#clearSelect").removeClass(_this.classPink);
        if(this.checkIn && this.checkOut) {

            // this.e.hide();
        }
        this.checkOut = null;
        this.checkIn  = null;
        this.firstGray = false;
        return(this);
    }
    calendarV2.prototype.disable = function(num){
        var max = this.maxDate;
        this.e.find('.' + this.classDayBase).each(function(index){
            if ( index >=(num+max)){
                 $(this).removeClass("show-date").addClass('unselectable');
            }
           
        })
    }
    calendarV2.prototype.ableAll = function(num){
         $(".unselectable").each(function(){
            $(this).removeClass("unselectable").addClass('show-date');
         })
         
    }
    
    calendarV2.prototype.bindEvent = function() {
        var _this = this;
        this.e.find("#close_can").on("click",function(){
             _this.e.hide();
        })
        this.e.find('.' + this.classDayBase).on('click', function(){
            if ($(this).hasClass(_this.classDayPass) || $(this).hasClass(_this.classDayUnSelectAble)) return false;
            if ($(this).hasClass('cal_noRoom')) return false;
            if ($(this).hasClass(_this.classDaySelect) && $('.checkedday').index(this) == 0) return false;
            var thisday = $(this).find('span');
            if (!_this.checkIn && !_this.checkOut) {
                $('.checkedday').removeClass('checkedday');
                $(this).addClass('checkedday');
                var index = $(this).index();
                _this.disable(index);
            } else if (_this.checkIn && !_this.checkOut) {
                $(this).addClass('checkedday');
            } else if (_this.checkIn && _this.checkOut) {
                _this.clearSelect();
                _this.e.show();
                 var index = $(this).index();
                _this.disable(index);
                $(this).addClass('checkedday');
            } else if (!_this.checkIn && _this.checkOut) {
                _this.clearSelect();
            }
            $("#clearSelect").addClass(_this.classPink);
            $(this).toggleClass(_this.classDaySelect);
            _this.refreshCheckState();
             console.log("refreshCheckState");
        })
        return(this);
    }
    calendarV2.prototype.refreshCheckState = function() {
        
        _this = this;
        var checkedday = this.e.find('.checkedday');
        var checkLast = checkedday.last();
        checkLast.find('span').html('离开');

        if(!_this.checkIn) {
            var checkFirst = checkedday.first();
            checkFirst.find('span').html('入住');
            var enterday = checkFirst.attr('ymd');
        }

        if (_this.fillDayInfo) {
            this.fillDayInfo(checkLast);
            if(!_this.checkIn) {
                this.fillDayInfo(checkFirst);
            }
        }

        var leaveday = checkLast.attr('ymd');
        this.doColor = leaveday == enterday ? false : true;

        doColorState = false;

        if (!_this.checkIn && checkFirst.length) {
            console.log("first");
            this.checkIn = this.setYmd(checkFirst.attr('y'),checkFirst.attr('m'),checkFirst.attr('d'));
            //add 
        }
        if(leaveday != enterday) {
            this.checkOut = this.setYmd(checkLast.attr('y'),checkLast.attr('m'),checkLast.attr('d'));
        }
        
        this.e.find('.' + this.classDayBase).not('.old').each(function(){
            var liYmd = $(this).attr('ymd');
           
            liYmd = new Date(liYmd.replace(/-/g, "/"));
            if (_this.doColor) {
                if(!_this.checkIn) {
                    if ($(this).hasClass(_this.classDaySelect)) doColorState = !doColorState;
                    if (doColorState){
                        $(this).addClass(_this.classDaySelect);
                        $(this).addClass('checkedday');
                        if (_this.getDayInfo) _this.getDayInfo($(this));
                    } 
                }
                else {
                    if( (_this.getYmd(liYmd) >= _this.getYmd(_this.checkIn))  && ( _this.getYmd(liYmd) <= _this.getYmd(_this.checkOut)) ) {
                        //时间在选择的范围内
                        $(this).addClass(_this.classDaySelect);
                        $(this).addClass('checkedday');
                        if (_this.getDayInfo) _this.getDayInfo($(this));
                    }
                }
            }
            if(_this.getYmd(liYmd) < _this.getYmd(_this.checkIn) ) {
                $(this).addClass(_this.classDayUnSelectAble);
                $(this).removeClass(_this.classDayShow);
            }
            if (_this.fillDayInfo) _this.fillDayInfo($(this));
        })
        if(_this.checkIn && _this.checkOut){
            _this.resetBeforeCheckInState(); 
        };
        this.checkDayChange();
        return(this);
    }
    calendarV2.prototype.resetBeforeCheckInState = function() {
        this.e.find('.' + this.classDayUnSelectAble).addClass(this.classDayShow).removeClass(this.classDayUnSelectAble);
    }
    calendarV2.prototype.clearDateHTML = function() {
        if(this.checkIn){
            var clearHtml = '<div class="clear_date ' + this.classPink + '" id="clearSelect">清空日期 </div>';
        }
        else {
            var clearHtml = '<div class="clear_date" id="clearSelect">清空日期 </div>';
        }
        return clearHtml;
    }
    calendarV2.prototype.closeHTML = function() {
        var clearHtml = '<div class = "close_can" id="close_can" >确认并关闭</div>'
        return clearHtml;
    }
    calendarV2.prototype.preMonthHTML = function() {
        if((this.today.getMonth() == this.firstDate.m) && (this.today.getFullYear() == this.firstDate.y)) {
            return '';
        }
        else {
            var preMonth = '<span class="cal_pre" id="preMonth"></span>';
            return preMonth;
        }
    }
    calendarV2.prototype.nextMonthHTML = function() {
        var nextMonth = '<span class="cal_next" id="nextMonth"></span>';
        return nextMonth;
    }


//MAIN
 
    var inputObj =$("#startenddate");    
    var defaultText = '入住离开日期';
    var defaultStartText = '选择入住日期';
    var defaultEndText = '选择离开日期';
    try{
         function startCalendar(input,option){
            var inputObj = $(input);
            var autoSearch = option.autoSearch || null;
            window.calendar = new calendarV2('#calendar-box', {
                checkDayChange:function(){
                    if(this.checkIn){
                        var startMonth = (this.checkIn.getMonth() < 9) ? '0'+ (this.checkIn.getMonth()+1) : (this.checkIn.getMonth()+1);
                        var startDate = (this.checkIn.getDate() < 10) ? '0'+ (this.checkIn.getDate()) : this.checkIn.getDate();
                        $('#startdate').val(this.checkIn.getFullYear() + '-' + startMonth + '-' + startDate);
                        $('#enddate').val('');
                       inputObj.val(defaultEndText); 
                    }
                    if(this.checkOut){
                        var endMonth = (this.checkOut.getMonth() < 9) ? '0'+ (this.checkOut.getMonth()+1) : (this.checkOut.getMonth()+1);
                        var endDate = (this.checkOut.getDate() < 10) ? '0'+ (this.checkOut.getDate()) : this.checkOut.getDate();
                        $('#enddate').val(this.checkOut.getFullYear() + '-' + endMonth + '-' + endDate);
                       inputObj.val(this.checkIn.getFullYear() + '-' + (this.checkIn.getMonth()+1) + '-' + this.checkIn.getDate() + '至' + this.checkOut.getFullYear() + '-' + ( this.checkOut.getMonth()+1) + '-' + this.checkOut.getDate()); 
                       console.log(555);
                        // this.e.hide();
                    $('.icon_searchandremove').show();
                       if(autoSearch) {
                        /*
                           var city = $("#selectcitydomain").val(); 
                           var jumpUrl = "http://" + city + "." + topLevelDomain + "/?startDate=" + $("#startdate").val() + "&endDate=" + $("#enddate").val() ;
                           location.href = jumpUrl;
                        */
                           $('#filter_confirm').click();
                       }
                    }
                    scrollPage($('#calendar-box'));
                },
                checkIn: $('#startdate').val() ? new Date($('#startdate').val().replace(/-/g, "/")) : null,
                checkOut: $('#enddate').val() ? new Date($('#enddate').val().replace(/-/g, "/")) : null
            })
            $('#calendar-box').unbind('click');
            $('#calendar-box').on('click','#clearSelect',function(){
                console.log(1213);
                calendar.clearSelect();
                $('#startdate').val('');
                $('#enddate').val('');
                if(autoSearch&&$('#tmpenddate').val()&&$('#tmpstartdate').val()) {
                    $('#deldatetime').click();
                    $('#filter_confirm').click();
                    return false;
                }
                if($('#calendar-box').is(':visible')) {
                    inputObj.val(defaultStartText); 
                }
                else {
                    inputObj.val(defaultText); 
                }
                console.log("clear");
            })
            $("#calendar-box").on('click','#preMonth',function(){
                calendar.preMonth();
                scrollPage($('#calendar-box'));
            })
            $("#calendar-box").on('click','#nextMonth',function(){
                calendar.nextMonth();
                scrollPage($('#calendar-box'));
            })
            inputObj.bind('click focus',function(){
                if($('#startdate').val() == '' && $('#enddate').val() == ''){
                    inputObj.val(defaultStartText);
                }
                if($('#startdate').val() != '' && $('#enddate').val() != ''){
                    //刷新之前的状态
                    calendar.resetBeforeCheckInState();
                }
                calendar.e.show();
                scrollPage($('#calendar-box'));
            })
            inputObj.bind('blur',function(){
                //calendar.e.hide();
            })
        }
    }catch(e){
        console.log(123);
    }