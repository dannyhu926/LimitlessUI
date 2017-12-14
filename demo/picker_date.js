//datepicker
$(".datepicker").each(function(){
    var obj = $(this);
    var dateFormat = obj.attr('data-dateFormat') ? obj.attr('data-dateFormat') : 'yy-mm-dd';
    var maxDate = obj.attr('data-maxDate');
    var minDate = obj.attr('data-minDate');
    var defaultDate = obj.attr('data-defaultDate');
    obj.datepicker({
        monthNames: ['һ��', '����', '����', '����', '����', '����', '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����'],
        monthNamesMin: ['һ��', '����', '����', '����', '����', '����', '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����'],
        monthNamesShort: ['һ��', '����', '����', '����', '����', '����', '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����'],
        dayNames: ['������', '����һ', '���ڶ�', '������', '������', '������', '������'],
        dayNamesMin: ['��', 'һ', '��', '��', '��', '��', '��'],
        dayNamesShort: ['��', 'һ', '��', '��', '��', '��', '��'],
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
        labelTitle: "ѡ������",
        monthNames: ['һ��', '����', '����', '����', '����', '����', '����', '����', '����', 'ʮ��', 'ʮһ', 'ʮ��'],
        monthAbbreviations: ['һ��', '����', '����', '����', '����', '����', '����', '����', '����', 'ʮ��', 'ʮһ', 'ʮ��'],
        dayAbbreviations: ['��', 'һ', '��', '��', '��', '��', '��'],
        labelYear: '��',
        labelMonth: '��',
        labelDayOfMonth: '��',
        labelHour: "Сʱ",
        labelMinute: "��",
        labelSecond: "��"
    });
});