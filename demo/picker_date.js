//datepicker
$(".datepicker").each(function(){
    var obj = $(this);
    var dateFormat = obj.attr('data-dateFormat') ? obj.attr('data-dateFormat') : 'yy-mm-dd';
    var maxDate = obj.attr('data-maxDate');
    var minDate = obj.attr('data-minDate');
    var defaultDate = obj.attr('data-defaultDate');
    obj.datepicker({
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesMin: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesMin: ['天', '一', '二', '三', '四', '五', '六'],
        dayNamesShort: ['天', '一', '二', '三', '四', '五', '六'],
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        dateFormat: dateFormat,
        defaultDate: defaultDate,
        yearRange:'-50:+10',
        maxDate: maxDate,
        minDate: minDate
    });
});

$(".datetimepicker").each(function () {
    var obj = $(this);
    var dateFormat = obj.attr('data-dateFormat') ? obj.attr('data-dateFormat') : '%Y-%m-%d %H:%i:%S';
    obj.AnyTime_picker({
        format: dateFormat,
        labelTitle: "选择日期",
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'],
        monthAbbreviations: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'],
        dayAbbreviations: ['天', '一', '二', '三', '四', '五', '六'],
        labelYear: '年',
        labelMonth: '月',
        labelDayOfMonth: '日',
        labelHour: "小时",
        labelMinute: "分",
        labelSecond: "秒"
    });
});