/**
 * 日历插件，可正常按月显示日历，可设置可选择日期范围，特殊处理单选和出发、到达日期
 * @author bianwangyang
 * @editor 2015-10-24
 */


    /**
     * 默认配置
     * @type {Object}
     */
    var config = {
        display: 1, // 展示多少个月的日历
        canBeSelected: '', // 设置可选择日期范围
        type: 'single', // 日历类型
        callback: function() {}, // 选择日期后的回调函数
        el: document.body, // 渲染节点
        splitStr: '~', // 日历分割符
        bottom_center: function() {
            if(this.settings.type == 'multiple') {
                if(this._getSelectedDate().length == 1) {
                    return '出发';
                } else {
                    return '离开';
                }
            } else {
                return '';
            }
        }, // 往返日历时的特殊处理
        dateArea: 29, // 往返日历最多可选天数
        currentDate: '', // 当前日期
        holiday: {  //节假日
            "2015.9":{3:"抗战胜利日",4:"休",5:"休",6:"班",26:"休",27:"中秋节"}
        },
        firstFloatMsg: [],  //浮层1的信息提示，各元素是字符串
        secondFloatMsg: [] //浮层2的信息提示，各元素是字符串
    };

    /**
     * 日期工具类
     * @type {{add: Function, format: Function, compare: Function}}
     */
    var dateExtend = {
        /**
         * 增加或减少多少天
         * @param int day 负数表示－多少天，正数表示＋多少天
         */
        add: function(date, day) {
            return new Date(+new Date(date) + (parseInt(day, 10) || 0)*24*60*60*1000);
        },

        /**
         * 格式化日期
         * @param  {[type]} format  YYYY-MM-DD hh:mm:ss
         * @return {[type]}        [description]
         */
        format: function(date, fmt) {
            date = new Date(date);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "D+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(Y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }

            return fmt;
        },

        /**
         * 比较两个日期的大小
         * @param  {[type]} odate 被比较的日期
         * @return {[type]}       相差的豪秒数
         */
        compare: function(date, odate) {
            return +new Date(date) - (+new Date(odate) || 0);
        }
    };

    function Calendar(options) {
        this._init(options);
    }

    Calendar.prototype = {
        /**
         * 页面初始化
         * @return {[type]} [description]
         */
        _init: function(options) {
            //debugger;
            // 初始化
            this._initSettings(options);
            // 初始化信息提示浮层
            this._initFloatMsg();
            // 可选择日期范围
            this._initCanBeSelected();
            // 确定display
            this._setDisplay();
            // 生成日历
            this._showCalendar();
            // 绑定事件
            this._bindEvent();
        },

        /**
         * 初始化设置
         * @private
         */
        _initSettings: function(options) {
            this.settings = $.extend({}, config, options);
        },

        /**
         * 初始显示浮层提示信息
         */
        _initFloatMsg: function() {
            var msg1 = this.settings.firstFloatMsg,
                msg2 = this.settings.secondFloatMsg,
                html = '';
            if(!msg1||!msg1.length) return;

            html += '<div id="calendarTipIn" class="calendar-tip-in">';
            for(var i=0; i<msg1.length; i++){
                html += '<div>'+msg1[i]+'</div>';
            }
            html += '</div>';   //calendarTipIn

            if(!msg2||!msg2.length) return;
            html += '<div id="calendarTipOut" class="calendar-tip-out hide">';
            for(var i=0; i<msg1.length; i++){
                html += '<div>'+msg2[i]+'</div>';
            }
            html += '</div>';   //calendarTipIn

            this.settings.el.after(html);
        },
        /**
         * 生成日历
         * @return {[type]} [description]
         */
        _showCalendar: function() {
            var render = [];
            // 计算当前年月日
            var curDate = this.curDate = (this.settings.currentDate && new Date(this.settings.currentDate)) || new Date();
            // 循环生成日历
            for(var i = 0; i < this.settings.display; i ++) {
               render.push(this._render(curDate.getFullYear(), curDate.getMonth() + i));
            }

            $(this.settings.el).append('<div class="tn-container">'+render.join('')+'</div>');
        },

        _setDisplay: function() {
            var self = this,
                settings = self.settings,
                canBeSelected = self.canBeSelected;

            if(canBeSelected.length) {
                var sortArr = canBeSelected.sort(function(a, b) {
                    return dateExtend.compare(a, b) > 0 ? 1 : -1;
                });

                var endDate = new Date(sortArr[sortArr.length - 1]);
                var startDate = new Date(sortArr[0]);

                var months = endDate.getMonth() - startDate.getMonth() + 1 + (endDate.getFullYear() - startDate.getFullYear()) * 12;

                if(!settings.display) {
                    settings.display = months;
                }
            }
        },

        /**
         * 日历的主体函数
         * @param  {[type]} y [description]
         * @param  {[type]} m [description]
         * @return {[type]}   [description]
         */
        _render: function(y, m) {
            // 日历头部
            var thead = ['<div class="tn-item-container"><div class="tn-c-header"><span class="tn-c-title">', '', '</span></div>'];
            var ths = ['<div class="tn-c-body"><table>', '<tr class="tn-c-week">', '<th>日</th>', '<th>一</th>', '<th>二</th>', '<th>三</th>', '<th>四</th>', '<th>五</th>', '<th>六</th>', '</tr>'];

            // 日历头部
            var cbody = this._getTds(y ,m);
            thead[1] = cbody.thead;
            ths = ths.concat(cbody.trs);

            // 闭合标签
            ths.push('</table></div></div>');
            
            return thead.concat(ths).join('');
        },

        /**
         * 日历主体函数
         * @param  {[type]} y [description]
         * @param  {[type]} m [description]
         * @return {[type]}   [description]
         */
        _getTds: function(y, m) {
            //日历的节假日配置
            var holiday=this.settings.holiday[y+"."+(m+1)],holidayDes="";
            // 日历主体部分
            var date = new Date(y, m, 1);
            // 获取当月第一天星期几
            var fday = date.getDay();
            date = new Date(y, m + 1, 0);
            // 获取当月的天数
            var aday = date.getDate(),
                ayear = date.getFullYear(),
                amonth = date.getMonth();

            var tds = ['<tr>'],
                trs = [];
            // 计算当前多少日
            var iday, curday,
                curDate = this.curDate,
                dateArea = this.canBeSelected,
                stop = false;
            for(var i = 1; i <= 42; i++) {
                iday = i - fday;
                curday = ayear + '-' + (amonth < 9 ? '0' : '') + ( amonth + 1 ) + '-' + (iday <= 9 ? '0' : '') + iday;
                if(holiday&&holiday.hasOwnProperty(iday)){
                    if(holiday[iday]=="休"||holiday[iday]=="班") {
                        iday=iday+'<br>'+'<span style="color:red">'+holiday[iday]+'</span>';
                    }else {
                        iday=holiday[iday];
                        iday='<span style="color:red;">'+iday+'</span>';
                    }
                }
                if(i > fday && i <= (aday + fday)) {
                    // 当前日期
                    if(iday === new Date().getDate() && ayear === new Date().getFullYear() && amonth == new Date().getMonth()) {
                        // 是否在可选择范围内
                        if(dateArea.length && dateArea.indexOf(curday) == -1) {
                            tds.push('<td class="today disabled" data-date="'+curday +'">今天</td>');
                        } else {
                            tds.push('<td class="today" data-date="'+curday +'">今天</td>');
                        }
                    // 过去的日期
                    } else if(dateExtend.compare(curDate, curday) > 0 || (dateArea.length && dateArea.indexOf(curday) == -1)) {
                        tds.push('<td class="disabled" data-date="'+curday +'">'+ iday +'</td>');
                    } else {
                        // 是否设置了可选日期                       
                        tds.push('<td data-date="'+curday+'">'+ iday +'</td>');
                    }
                } else if(!stop){
                    tds.push('<td></td>');
                }

                if( i % 7 === 0 && !stop) {
                    tds.push('</tr>');
                    trs = trs.concat(tds);

                    // 大于的日期不再换行
                    if(i >= (aday + fday)) {
                        stop = true;
                    }
                    !stop && (tds = ['<tr>']);
                }
            }

            // 设置头部
            var months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
            var thead = months[amonth] + '月&nbsp;&nbsp;&nbsp;&nbsp;' + ayear;

            return {
                trs: trs,
                thead: thead
            };
        },

        /**
         * 获取可选择日期，‘，’分割表示单个日期，‘~’分割表示日期段
         * @return {[type]} [description]
         */
        _initCanBeSelected: function() {
            var canSelsArr = [],
                canBeSels = this.settings.canBeSelected;

            if(!canBeSels) {
                this.canBeSelected = canSelsArr;
                return;
            }

            canSelsArr = canBeSels.split(',');
            // 分割符
            var splitStr = this.settings.splitStr;
            canSelsArr.forEach(function(item, i) {
                var area = item.split(splitStr);
                if(area.length == 1) {
                    return;
                }
                var min = area[0],
                    max = area[1];

                // 交换最大日期和最小日期
                if(dateExtend.compare(min, max) > 0) {
                    min = area[1];
                    max = area[0];
                }

                var tem = new Date(min);
                while(dateExtend.compare(tem, max) <= 0) {
                    var fmtDate = dateExtend.format(tem, 'YYYY-MM-DD');
                    canSelsArr.indexOf(fmtDate) === -1 && canSelsArr.push(fmtDate);
                    tem = dateExtend.add(tem, 1);
                }

                // 删除当前值
                canSelsArr.splice(i, 1);
            });

            this.canBeSelected = canSelsArr;
        },
        /**
         * 动态显示或隐藏非dateArea区域
         * @param beSelected
         * @param dateArea
         * @private
         */
        _handleCanBeSelectedAfter: function(beSelected,dateArea) {
            //debugger;
            var el = $(this.settings.el),
                firstDay = beSelected[0],
                lastDay = dateExtend.format(dateExtend.add(firstDay, dateArea), 'YYYY-MM-DD'),
                firstDayTmp = firstDay,
                firstDayTmpFmt,
                dateAreaArr = [];
            //find the last day of dateArea
            while(dateExtend.compare(firstDayTmp,lastDay) < 0) {
                firstDayTmp = dateExtend.add(firstDayTmp, 1);
                firstDayTmpFmt = dateExtend.format(firstDayTmp, 'YYYY-MM-DD');
                dateAreaArr.push(firstDayTmpFmt);
            }
            //var $disableStart = dateExtend.format(dateExtend.add(dateAreaArr[dateAreaArr.length-1],1), 'YYYY-MM-DD'),
            var $disableStart = dateExtend.format(dateAreaArr[dateAreaArr.length-1], 'YYYY-MM-DD'),
                $nextTmp,
                $disableContainer = [];
            $disableStart = el.find('[data-date="'+$disableStart+'"]');
            //$disableContainer = $disableStart.get();  //初始化disable元素的容器
            //获取同一行的后续结点
            $nextTmp=$disableStart.next();
            while($nextTmp&&$nextTmp.length!=0) {
                //$disableContainer.concat($nextTmp.get());
                $nextTmp.forEach(function(v){
                    if($(v).html())
                        $disableContainer.push(v);
                });
                $nextTmp = $nextTmp.next();
            }
            //获取同一个月的后续星期的结点
            $disableStart = el.find('[data-date="'+dateAreaArr[dateAreaArr.length-1]+'"]').closest('tr').next();
            while($disableStart&&$disableStart.length!=0) {
                //$disableStart.find('td').addClass('disabled');
                $nextTmp = $disableStart.find('td');
                //$disableContainer.concat($nextTmp);
                //$disableContainer.concat($nextTmp.get());
                $nextTmp.forEach(function(v){
                    if($(v).html())
                        $disableContainer.push(v);
                });
                $disableStart = $disableStart.next();
            }

            $disableStart = el.find('[data-date="'+dateAreaArr[dateAreaArr.length-1]+'"]').closest('.tn-item-container').next();
            while($disableStart&&$disableStart.length!=0) {
                $nextTmp = $disableStart.find('td');
                $nextTmp.forEach(function(v){
                    if($(v).html())
                        $disableContainer.push(v);
                });
                $disableStart = $disableStart.next();
            }
            if(beSelected.length==1) {
                $($disableContainer).addClass('disabled');
                return $($disableContainer);
            }
            //} else if(beSelected.length==2) {
            //    this.setFloatDisplay(false,true);   //隐藏第一个，显示第二个
            //}

        },
        /**
         * 绑定选择事件
         * @return {[type]} [description]
         */
        _bindEvent: function() {
            var _this = this;
            var el = $(this.settings.el),
                type = this.settings.type,
                dateArea = parseInt(this.settings.dateArea, 10);

            var tds = el.find('td');
            tds.off('click').on('click', function(e, flag) {
                var node = $(this),
                    date = node.attr('data-date');
                //结点为disable或者结点为空时，都不允许点击
                if(node.hasClass('disabled') || !node.html()) {
                    return;
                }
                //debugger;
                // 去除selected属性
                // 单个日历选择
                if(type == 'single') {
                    // 去掉提示语
                    el.find('.selected').find('p').remove();
                    el.find('.selected').removeClass('selected');
                // 选择往返日历
                } else if(type == 'multiple') {
                    // 比较两个选中的日期
                    var selected = _this._getSelectedDate();
                    var days = dateExtend.compare(date, selected)/24/60/60/1000;
                    // 最多可选择多少天
                    if(selected.length >= 2 || (selected.length == 1 && (days > dateArea || days <= 0))) {
                        // 去掉提示语
                        el.find('.selected').find('p').remove();

                        el.find('.selected').removeClass('selected');
                        // 恢复显示第一个信息，隐藏第二个信息
                        $("#calendarTipIn").removeClass('hide');
                        $("#calendarTipOut").addClass('hide');
                    }

                    el.find('.beselected').removeClass('beselected');
                }
                
                // 增加selected属性
                $(this).addClass('selected');
               
                // 特殊滴，往返日历的中间日期样式
                var beSelected = _this._getSelectedDate();
                if(beSelected.length==1&&!flag) {
                    //选好入店时间之后，入店时间dateArea天之后的日期变灰不可选，包含入住当天
                    _this.afterSelected = _this._handleCanBeSelectedAfter(beSelected,dateArea);
                    //浮层显示控制---隐藏第一个，显示第二个
                    _this.setFloatDisplay(false,true);
                    //var firstDay = beSelected[0],
                    //    lastDay = dateExtend.format(dateExtend.add(beSelected[0], dateArea), 'YYYY-MM-DD'),
                    //    lastFmtDate = dateExtend.format(lastDay, 'YYYY-MM-DD'),
                    //    tmparr = [],
                    //    tmpday = firstDay;
                    //while(dateExtend.compare(tmpday,lastDay) < 0) {
                    //    tmpday = dateExtend.add(tmpday, 1);
                    //    lastFmtDate = dateExtend.format(tmpday, 'YYYY-MM-DD');
                    //    tmparr.push(lastFmtDate);
                    //}
                    //
                    //var $dis_start=el.find('[data-date="'+tmparr[tmparr.length-1]+'"]');
                    //$dis_start=$dis_start.next();
                    //while($dis_start&&$dis_start.length!=0) {
                    //    $dis_start.addClass('disabled');
                    //    $dis_start=$dis_start.next();
                    //}
                    //$dis_start=el.find('[data-date="'+tmparr[tmparr.length-1]+'"]');
                    //$dis_start = $dis_start.closest('tr').next();
                    //while($dis_start&&$dis_start.length!=0) {
                    //    $dis_start.find('td').addClass('disabled');
                    //    $dis_start = $dis_start.next();
                    //}
                    //$dis_start=el.find('[data-date="'+tmparr[tmparr.length-1]+'"]');
                    //$dis_start = $dis_start.closest('.tn-item-container').next();
                    //while($dis_start&&$dis_start.length!=0) {
                    //    $dis_start.find('td').addClass('disabled');
                    //    $dis_start = $dis_start.next();
                    //}
                } else if(beSelected.length==2&&!flag) {
                    _this.afterSelected.removeClass('disabled');
                }
                if(type == 'multiple' && beSelected.length == 2) {
                    var arr = [];
                    var min = beSelected[0],
                        max = beSelected[1];

                    var tem = new Date(min);
                    while(dateExtend.compare(tem, max) < 0) {
                        tem = dateExtend.add(tem, 1);
                        var fmtDate = dateExtend.format(tem, 'YYYY-MM-DD');
                        arr.push(fmtDate);
                    }

                    arr.forEach(function(item) {
                        el.find('[data-date="'+item+'"]').not('.disabled').not('.selected').addClass('beselected');
                    });
                }

                // 选择后对该节点的底部居中显示内容
                var bc = _this.settings.bottom_center;
                 
                if(bc && typeof bc == 'function') {
                    bc = bc.call(_this, e);
                }

                $(node).append(bc ? '<p>'+bc+'</p>' : '');

                // 回调函数
                if(!flag) {
                    var callback = _this.settings.callback;
                    if(callback && typeof callback == 'function') {
                        if(type == 'multiple' && beSelected.length == 2) {
                            setTimeout(function(){callback.call(_this, e)},500);
                        }
                    }
                }
            });
        },
        /**
         * 获取被选中的日期
         * @return {[type]} [description]
         */
        _getSelectedDate: function() {
            // 获取被选中的节点
            var el = $(this.settings.el),
                selNodes = el.find('.selected');

            var arr = [];
            selNodes.each(function(i, item) {
                arr.push($(item).attr('data-date'));
            });

            return arr;
        },
        /**
         * 外部方法，获取已选中的日期
         * @return {[type]} [description]
         */
        getSelectedDate: function() {
            var type = this.settings.type,
                dates = this._getSelectedDate();

            if(type == 'single') {
                return dates[0];
            } else {
                return dates;
            }
        },
        /**
         * 外部方法，设置已选中日期，以','分割
         */
        setSelectedDate: function(dates) {
            var type = this.settings.type,
                el = $(this.settings.el);

            var datesArr = dates.split(',');
            datesArr.forEach(function(item, i) {
                el.find('[data-date="'+item+'"]').trigger('click', 'set');
            });

            return this;
        },
        /**
         * 外部方法，设置哪个浮层显示
         */
        setFloatDisplay: function(f1,f2) {
            if(f1) {    //显示浮层1
                $("#calendarTipIn").removeClass('hide');
                $("#calendarTipOut").addClass('hide');
            } else if(f2) { //显示浮层2
                $("#calendarTipIn").addClass('hide');
                $("#calendarTipOut").removeClass('hide');
            }

        },
        /**
         * 价格日历
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        load: function(data) {
            var el = $(this.settings.el);
            if(!data) {
                return;
            }

            data.forEach(function(item, i) {
                if(!$('td[data-date="'+item.date+'"]', el).hasClass('disabled')) {
                    $('td[data-date="'+item.date+'"]', el).append('<p class="price">'+item.price+'</p>');
                }
            });
        }
    };

   
    
